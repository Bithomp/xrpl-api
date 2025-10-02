import _ from "lodash";
import BigNumber from "bignumber.js";
import { TransactionMetadata } from "xrpl"; // Node, CreatedNode, ModifiedNode, DeletedNode,
import { dropsToXrp } from "../../common";
import { getNativeCurrency } from "../../client";
import { NormalizedNode, normalizeNode } from "../utils";
import { buildMPTokenIssuanceID } from "../../models/mptoken";

interface BalanceChangeQuantity {
  issuer?: string; // currency issuer
  currency?: string; // currency code
  value: string; // balance change
  counterparty?: string; // address of the counterparty (issuer of the currency or holder of the balance)
  mpt_issuance_id?: string; // MPToken issuance ID
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

function parseValue(value: any): BigNumber {
  // MPToken has array for previous fields if it is created/empty
  if (Array.isArray(value)) {
    return new BigNumber(0);
  }

  if (typeof value === "string" || typeof value === "number") {
    return new BigNumber(value);
  }

  return new BigNumber(value.value ?? 0);
}

function computeBalanceChange(node: NormalizedNode): BigNumber | null {
  let value: null | BigNumber = null;
  if (node.newFields.Balance) {
    value = parseValue(node.newFields.Balance);
  } else if (node.newFields.MPTAmount) {
    value = parseValue(node.newFields);
  } else if (node.previousFields.Balance && node.finalFields.Balance) {
    value = parseValue(node.finalFields.Balance).minus(parseValue(node.previousFields.Balance));
  } else if (node.previousFields.MPTAmount || node.finalFields.MPTAmount) {
    value = parseValue(node.finalFields.MPTAmount ?? 0).minus(parseValue(node.previousFields.MPTAmount ?? 0));
  } else if (node.previousFields.OutstandingAmount) {
    value = parseValue(node.previousFields.OutstandingAmount ?? 0).minus(
      parseValue(node.finalFields.OutstandingAmount ?? 0)
    );
  }

  return value === null ? null : value.isZero() ? null : value;
}

function parseFinalBalance(node: NormalizedNode): BigNumber | null {
  if (node.newFields.Balance) {
    return parseValue(node.newFields.Balance);
  } else if (node.finalFields.Balance) {
    return parseValue(node.finalFields.Balance);
  } else if (node.finalFields.MPTAmount) {
    return parseValue(node.finalFields);
  } else if (node.finalFields.MPTAmount) {
    return parseValue(node.finalFields.MaximumAmount).minus(parseValue(node.finalFields.OutstandingAmount));
  }

  return null;
}

function parseXRPQuantity(
  node: NormalizedNode,
  valueParser: any,
  nativeCurrency?: string
): AddressBalanceChangeQuantity | null {
  const value = valueParser(node);

  if (value === null) {
    return null;
  }

  return {
    address: (node.finalFields.Account || node.newFields.Account) as string,
    balance: {
      currency: nativeCurrency || getNativeCurrency(),
      value: dropsToXrp(value).toString(),
    },
  };
}

function flipTrustlinePerspective(quantity: any): AddressBalanceChangeQuantity {
  const negatedBalance = new BigNumber(quantity.balance.value).negated();
  return {
    address: quantity.balance.issuer,
    balance: {
      issuer: quantity.balance.issuer,
      currency: quantity.balance.currency,
      value: negatedBalance.toString(),
      counterparty: quantity.address,
    },
  };
}

function parseTrustlineQuantity(node: NormalizedNode, valueParser: any): AddressBalanceChangeQuantity[] | null {
  const value = valueParser(node);

  if (value === null) {
    return null;
  }

  /*
   * A trustline can be created with a non-zero starting balance
   * If an offer is placed to acquire an asset with no existing trustline,
   * the trustline can be created when the offer is taken.
   */
  const fields = _.isEmpty(node.newFields) ? node.finalFields : (node.newFields as any);
  const previousFields = node.previousFields as any;
  let viewLowest = true;

  if (previousFields && previousFields.Balance && previousFields.Balance.value !== "0") {
    viewLowest = previousFields.Balance.value[0] !== "-"; // if positive, viewLowest is true, else false
  } else {
    viewLowest = fields.Balance.value[0] !== "-"; // if positive, viewLowest is true, else false
  }

  const sign = viewLowest ? 1 : -1;
  const currency = fields.Balance.currency;
  const issuer = viewLowest ? fields.HighLimit.issuer : fields.LowLimit.issuer;
  const holder = viewLowest ? fields.LowLimit.issuer : fields.HighLimit.issuer;

  // the balance is always from low node's perspective
  const result = {
    address: holder,
    balance: {
      issuer,
      currency,
      value: value.times(sign).toString(),
      counterparty: issuer,
    },
  };
  return [result, flipTrustlinePerspective(result)];
}

function parseMPTQuantity(node: NormalizedNode, valueParser: any): AddressBalanceChangeQuantity | null {
  const value = valueParser(node);

  if (value === null) {
    return null;
  }

  const fields = _.isEmpty(node.newFields) ? node.finalFields : (node.newFields as any);

  return {
    address: fields.Account,
    balance: {
      value: value.toString(),
      mpt_issuance_id: fields.MPTokenIssuanceID,
    },
  };
}

function parseMPTokenIssuanceQuantity(node: NormalizedNode, valueParser: any): AddressBalanceChangeQuantity | null {
  const value = valueParser(node);

  if (value === null) {
    return null;
  }

  const fields = _.isEmpty(node.newFields) ? node.finalFields : (node.newFields as any);

  return {
    address: fields.Issuer,
    balance: {
      value: value.toString(),
      mpt_issuance_id: buildMPTokenIssuanceID(fields.Sequence, fields.Issuer),
    },
  };
}

function parseQuantities(metadata: TransactionMetadata, valueParser: any, nativeCurrency?: string) {
  const values = metadata.AffectedNodes.map(function (affectedNode: any) {
    const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
    if (!["AccountRoot", "RippleState", "MPToken", "MPTokenIssuance"].includes(node.LedgerEntryType)) {
      return [];
    }

    const normalizedNode = normalizeNode(affectedNode);
    if (node.LedgerEntryType === "AccountRoot") {
      return [parseXRPQuantity(normalizedNode, valueParser, nativeCurrency)];
    } else if (node.LedgerEntryType === "RippleState") {
      return parseTrustlineQuantity(normalizedNode, valueParser);
    } else if (node.LedgerEntryType === "MPToken") {
      return [parseMPTQuantity(normalizedNode, valueParser)];
    } else if (node.LedgerEntryType === "MPTokenIssuance") {
      return [parseMPTokenIssuanceQuantity(normalizedNode, valueParser)];
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
function parseBalanceChanges(metadata: TransactionMetadata, nativeCurrency?: string): BalanceChanges {
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
