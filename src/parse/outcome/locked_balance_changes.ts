import _ from "lodash";
import BigNumber from "bignumber.js";
import { TransactionMetadata } from "xrpl";
import { normalizeNodes } from "../utils";

interface LockedBalanceChangeQuantity {
  counterparty: string;
  currency: string;
  value: string;
}

export interface AddressLockedBalanceChangeQuantity {
  address: string;
  lockedBalance: LockedBalanceChangeQuantity;
}

export interface LockedBalanceChanges {
  [key: string]: LockedBalanceChangeQuantity[];
}

function groupByAddress(lockedBalanceChanges: AddressLockedBalanceChangeQuantity[]) {
  const grouped = _.groupBy(lockedBalanceChanges, function (node) {
    return node.address;
  });
  return _.mapValues(grouped, function (group) {
    return _.map(group, function (node) {
      return node.lockedBalance;
    });
  });
}

function parseValue(value): BigNumber {
  return new BigNumber(value.value ?? value);
}

function computeBalanceChange(node: any) {
  let value: null | BigNumber = null;
  if (node.newFields.LockedBalance) {
    value = parseValue(node.newFields.LockedBalance);
  } else if (node.previousFields.LockedBalance && node.finalFields.LockedBalance) {
    value = parseValue(node.finalFields.LockedBalance).minus(parseValue(node.previousFields.LockedBalance));
  } else if (node.previousFields.LockedBalance) {
    value = parseValue(node.previousFields.LockedBalance).negated();
  }
  return value === null ? null : value.isZero() ? null : value;
}

function parseFinalBalance(node) {
  if (node.newFields.LockedBalance) {
    return parseValue(node.newFields.LockedBalance);
  } else if (node.finalFields.LockedBalance) {
    return parseValue(node.finalFields.LockedBalance);
  }
  return null;
}

function parseTrustlineQuantity(node, valueParser): AddressLockedBalanceChangeQuantity[] | null {
  const value = valueParser(node);

  if (value === null) {
    return null;
  }

  /*
   * A trustline can be created with a non-zero starting lockedBalance
   * If an offer is placed to acquire an asset with no existing trustline,
   * the trustline can be created when the offer is taken.
   */
  const fields = _.isEmpty(node.newFields) ? node.finalFields : node.newFields;
  // prettier-ignore
  const LockedBalanceFields = _.isEmpty(node.newFields?.LockedBalance) ? _.isEmpty(node.finalFields?.LockedBalance) ? node.previousFields : node.finalFields : node.newFields;

  const result = {
    address: fields.LowLimit.issuer,
    lockedBalance: {
      counterparty: LockedBalanceFields.LockedBalance.issuer,
      currency: LockedBalanceFields.LockedBalance.currency,
      value: value.toString(),
    },
  };
  return [result];
}

function parseQuantities(metadata: TransactionMetadata, valueParser) {
  const values = normalizeNodes(metadata).map(function (node) {
    if (node.entryType === "RippleState") {
      return parseTrustlineQuantity(node, valueParser);
    }
    return [];
  });

  return groupByAddress(_.compact(_.flatten(values)));
}

/**
 *  Computes the complete list of every locked lockedBalance that changed in the ledger
 *  as a result of the given transaction.
 *
 *  @param {Object} metadata Transaction metadata
 *  @returns {Object} parsed lockedBalance changes
 */
function parseLockedBalanceChanges(metadata: TransactionMetadata) {
  return parseQuantities(metadata, computeBalanceChange);
}

/**
 *  Computes the complete list of every final locked lockedBalance in the ledger
 *  as a result of the given transaction.
 *
 *  @param {Object} metadata Transaction metadata
 *  @returns {Object} parsed balances
 */
function parseFinalLockedBalances(metadata: TransactionMetadata) {
  return parseQuantities(metadata, parseFinalBalance);
}

export { parseLockedBalanceChanges, parseFinalLockedBalances };
