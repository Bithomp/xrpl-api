import _ from "lodash";
import BigNumber from "bignumber.js";
import { TransactionMetadata } from "xrpl";
import { dropsToXrp } from "../../common";
import { normalizeNodes } from "../utils";
import { getNativeCurrency } from "../../client";

interface BalanceChangeQuantity {
  counterparty?: string;
  currency?: string;
  value: string;
  mpt_issuance_id?: string;
}

export interface AddressBalanceChangeQuantity {
  address: string;
  balance: BalanceChangeQuantity;
}

export interface BalanceChanges {
  [key: string]: BalanceChangeQuantity[];
}

function groupByAddress(balanceChanges: AddressBalanceChangeQuantity[]) {
  const grouped = _.groupBy(balanceChanges, function (node) {
    return node.address;
  });
  return _.mapValues(grouped, function (group) {
    return _.map(group, function (node) {
      return node.balance;
    });
  });
}

function parseValue(value): BigNumber {
  // MPToken has array for previous fields if it is created/empty
  if (Array.isArray(value)) {
    return new BigNumber(0);
  }

  if (typeof value === "string" || typeof value === "number") {
    return new BigNumber(value);
  }

  return new BigNumber(value.value ?? value.MPTAmount ?? 0);
}

function computeBalanceChange(node) {
  let value: null | BigNumber = null;
  if (node.newFields.Balance) {
    value = parseValue(node.newFields.Balance);
  } else if (node.newFields.MPTAmount) {
    value = parseValue(node.newFields);
  } else if (node.previousFields.Balance && node.finalFields.Balance) {
    value = parseValue(node.finalFields.Balance).minus(parseValue(node.previousFields.Balance));
  } else if (node.previousFields.MPTAmount || node.finalFields.MPTAmount) {
    value = parseValue(node.finalFields).minus(parseValue(node.previousFields));
  }

  return value === null ? null : value.isZero() ? null : value;
}

function parseFinalBalance(node) {
  if (node.newFields.Balance) {
    return parseValue(node.newFields.Balance);
  } else if (node.finalFields.Balance) {
    return parseValue(node.finalFields.Balance);
  } else if (node.finalFields.MPTAmount) {
    return parseValue(node.finalFields);
  }

  return null;
}

function parseXRPQuantity(node: any, valueParser: any, nativeCurrency?: string): AddressBalanceChangeQuantity | null {
  const value = valueParser(node);

  if (value === null) {
    return null;
  }

  return {
    address: node.finalFields.Account || node.newFields.Account,
    balance: {
      currency: nativeCurrency || getNativeCurrency(),
      value: dropsToXrp(value).toString(),
    },
  };
}

function flipTrustlinePerspective(quantity): AddressBalanceChangeQuantity {
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

function parseTrustlineQuantity(node, valueParser): AddressBalanceChangeQuantity[] | null {
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

function parseMPTQuantity(node: any, valueParser: any): AddressBalanceChangeQuantity | null {
  const value = valueParser(node);

  if (value === null) {
    return null;
  }

  const fields = _.isEmpty(node.newFields) ? node.finalFields : node.newFields;

  return {
    address: fields.Account,
    balance: {
      value: value.toString(),
      mpt_issuance_id: fields.MPTokenIssuanceID,
    },
  };
}

function parseQuantities(metadata: TransactionMetadata, valueParser: any, nativeCurrency?: string) {
  const values = normalizeNodes(metadata).map(function (node) {
    if (node.entryType === "AccountRoot") {
      return [parseXRPQuantity(node, valueParser, nativeCurrency)];
    } else if (node.entryType === "RippleState") {
      return parseTrustlineQuantity(node, valueParser);
    } else if (node.entryType === "MPToken") {
      return [parseMPTQuantity(node, valueParser)];
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
function parseFinalBalances(metadata: TransactionMetadata, nativeCurrency?: string) {
  return parseQuantities(metadata, parseFinalBalance, nativeCurrency);
}

export { parseBalanceChanges, parseFinalBalances };
