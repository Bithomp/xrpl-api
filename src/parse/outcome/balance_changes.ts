import _ from "lodash";
import BigNumber from "bignumber.js";
import { TransactionMetadata } from "xrpl";
import { dropsToXrp } from "../../common";
import { normalizeNodes } from "../../v1/common/utils";

import { getNativeCurrency } from "../../client";

function groupByAddress(balanceChanges) {
  const grouped = _.groupBy(balanceChanges, function (node) {
    return node.address;
  });
  return _.mapValues(grouped, function (group) {
    return _.map(group, function (node) {
      return node.balance;
    });
  });
}

function parseValue(value) {
  return new BigNumber(value.value || value);
}

function computeBalanceChange(node) {
  let value: null | BigNumber = null;
  if (node.newFields.Balance) {
    value = parseValue(node.newFields.Balance);
  } else if (node.previousFields.Balance && node.finalFields.Balance) {
    value = parseValue(node.finalFields.Balance).minus(parseValue(node.previousFields.Balance));
  }
  return value === null ? null : value.isZero() ? null : value;
}

function parseFinalBalance(node) {
  if (node.newFields.Balance) {
    return parseValue(node.newFields.Balance);
  } else if (node.finalFields.Balance) {
    return parseValue(node.finalFields.Balance);
  }
  return null;
}

function parseXRPQuantity(node: any, valueParser: any, nativeCurrency?: string) {
  const value = valueParser(node);

  if (value === null) {
    return null;
  }

  return {
    address: node.finalFields.Account || node.newFields.Account,
    balance: {
      counterparty: "",
      currency: nativeCurrency || getNativeCurrency(),
      value: dropsToXrp(value).toString(),
    },
  };
}

function flipTrustlinePerspective(quantity) {
  const negatedBalance = new BigNumber(quantity.balance.value).negated();
  return {
    address: quantity.balance.counterparty,
    balance: {
      counterparty: quantity.address,
      currency: quantity.balance.currency,
      value: negatedBalance.toString(),
    },
  };
}

function parseTrustlineQuantity(node, valueParser) {
  const value = valueParser(node);

  if (value === null) {
    return null;
  }

  /*
   * A trustline can be created with a non-zero starting balance
   * If an offer is placed to acquire an asset with no existing trustline,
   * the trustline can be created when the offer is taken.
   */
  const fields = _.isEmpty(node.newFields) ? node.finalFields : node.newFields;

  // the balance is always from low node's perspective
  const result = {
    address: fields.LowLimit.issuer,
    balance: {
      counterparty: fields.HighLimit.issuer,
      currency: fields.Balance.currency,
      value: value.toString(),
    },
  };
  return [result, flipTrustlinePerspective(result)];
}

function parseQuantities(metadata: TransactionMetadata, valueParser: any, nativeCurrency?: string) {
  const values = normalizeNodes(metadata).map(function (node) {
    if (node.entryType === "AccountRoot") {
      return [parseXRPQuantity(node, valueParser, nativeCurrency)];
    } else if (node.entryType === "RippleState") {
      return parseTrustlineQuantity(node, valueParser);
    }
    return [];
  });
  return groupByAddress(_.compact(_.flatten(values)));
}

/**
 *  Computes the complete list of every balance that changed in the ledger
 *  as a result of the given transaction.
 *
 *  @param {Object} metadata Transaction metadata
 *  @returns {Object} parsed balance changes
 */
function parseBalanceChanges(metadata: TransactionMetadata, nativeCurrency?: string) {
  return parseQuantities(metadata, computeBalanceChange, nativeCurrency);
}

/**
 *  Computes the complete list of every final balance in the ledger
 *  as a result of the given transaction.
 *
 *  @param {Object} metadata Transaction metadata
 *  @returns {Object} parsed balances
 */
function parseFinalBalances(metadata: TransactionMetadata) {
  return parseQuantities(metadata, parseFinalBalance);
}

export { parseBalanceChanges, parseFinalBalances };
