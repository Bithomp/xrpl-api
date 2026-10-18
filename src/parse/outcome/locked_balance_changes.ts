import BigNumber from "bignumber.js";
import { TransactionMetadata } from "xrpl";
import { NormalizedNode, normalizeNode } from "../utils";

const RELEVANT_LOCKED_ENTRY_TYPES = new Set(["RippleState", "MPToken"]);

interface LockedBalanceChangeQuantity {
  issuer?: string; // currency issuer
  currency?: string; // currency code
  value: string; // balance change
  counterparty?: string; // address of the counterparty (issuer of the currency or holder of the balance)
  mpt_issuance_id?: string; // MPToken issuance ID
}

export interface AddressLockedBalanceChangeQuantity {
  address: string;
  lockedBalance: LockedBalanceChangeQuantity;
}

export interface LockedBalanceChanges {
  [key: string]: LockedBalanceChangeQuantity[];
}

function pickFields(node: NormalizedNode): any {
  return Object.keys(node.newFields).length > 0 ? (node.newFields as any) : (node.finalFields as any);
}

function parseValue(value: any): BigNumber {
  if (typeof value === "string" || typeof value === "number") {
    return new BigNumber(value);
  }

  return new BigNumber(value?.value ?? 0);
}

type BalanceValueParser = (node: NormalizedNode) => BigNumber | null;

function addLockedBalanceChange(
  grouped: LockedBalanceChanges,
  entry: AddressLockedBalanceChangeQuantity | null
): void {
  if (!entry || !entry.address) {
    return;
  }

  (grouped[entry.address] ??= []).push(entry.lockedBalance);
}

function computeBalanceChange(node: NormalizedNode): BigNumber | null {
  let value: null | BigNumber = null;
  if (node.newFields.LockedBalance !== undefined) {
    value = parseValue(node.newFields.LockedBalance);
  } else if (
    node.previousFields.LockedBalance !== undefined &&
    node.finalFields.LockedBalance !== undefined
  ) {
    value = parseValue(node.finalFields.LockedBalance).minus(parseValue(node.previousFields.LockedBalance));
  } else if (node.previousFields.LockedBalance !== undefined) {
    value = parseValue(node.previousFields.LockedBalance).negated();
  } else if (node.diffType === "DeletedNode" && node.finalFields.LockedBalance !== undefined) {
    value = parseValue(node.finalFields.LockedBalance).negated();
  } else if (node.newFields.LockedAmount !== undefined) {
    value = parseValue(node.newFields.LockedAmount);
  } else if (node.previousFields.LockedAmount !== undefined) {
    value = parseValue(node.finalFields.LockedAmount ?? 0).minus(parseValue(node.previousFields.LockedAmount));
  } else if (node.diffType === "DeletedNode" && node.finalFields.LockedAmount !== undefined) {
    value = parseValue(node.finalFields.LockedAmount).negated();
  }

  return value === null ? null : value.isZero() ? null : value;
}

function parseFinalBalance(node: NormalizedNode): BigNumber | null {
  if (node.newFields.LockedBalance !== undefined) {
    return parseValue(node.newFields.LockedBalance);
  } else if (node.diffType !== "DeletedNode" && node.finalFields.LockedBalance !== undefined) {
    return parseValue(node.finalFields.LockedBalance);
  }
  return null;
}

function parseTrustlineQuantity(
  node: NormalizedNode,
  valueParser: BalanceValueParser
): AddressLockedBalanceChangeQuantity[] | null {
  const value = valueParser(node);

  if (value === null) {
    return null;
  }

  /*
   * A trustline can be created with a non-zero starting lockedBalance
   * If an offer is placed to acquire an asset with no existing trustline,
   * the trustline can be created when the offer is taken.
   */
  const fields = pickFields(node);
  const previousFields = node.previousFields as any;
  const balanceField = fields?.Balance ?? previousFields?.Balance;

  if (!balanceField || typeof balanceField.value === "undefined") {
    return null;
  }

  const balanceValue = typeof balanceField.value === "string" ? balanceField.value : String(balanceField.value);
  let viewLowest = true;

  if (previousFields && previousFields.Balance && previousFields.Balance.value !== "0" && previousFields.Balance.value !== 0) {
    const previousValue = typeof previousFields.Balance.value === "string" ? previousFields.Balance.value : String(previousFields.Balance.value);
    viewLowest = previousValue[0] !== "-";
  } else {
    viewLowest = balanceValue[0] !== "-";
  }

  const sign = viewLowest ? 1 : -1;
  const currency = balanceField.currency;
  const issuer = viewLowest ? fields.HighLimit.issuer : fields.LowLimit.issuer;
  const holder = viewLowest ? fields.LowLimit.issuer : fields.HighLimit.issuer;

  const result = {
    address: holder,
    lockedBalance: {
      issuer,
      currency,
      value: value.times(sign).toString(),
      counterparty: issuer,
    },
  };

  return [result];
}

function parseMPTQuantity(
  node: NormalizedNode,
  valueParser: BalanceValueParser
): AddressLockedBalanceChangeQuantity | null {
  const value = valueParser(node);

  if (value === null) {
    return null;
  }

  const fields = pickFields(node);

  return {
    address: fields.Account,
    lockedBalance: {
      value: value.toString(),
      mpt_issuance_id: fields.MPTokenIssuanceID,
    },
  };
}

function parseQuantities(metadata: TransactionMetadata, valueParser: BalanceValueParser): LockedBalanceChanges {
  const affectedNodes = metadata?.AffectedNodes || [];
  const grouped: LockedBalanceChanges = {};

  for (let i = 0; i < affectedNodes.length; i++) {
    const affectedNode: any = affectedNodes[i];
    const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
    if (!node || !RELEVANT_LOCKED_ENTRY_TYPES.has(node.LedgerEntryType)) {
      continue;
    }

    const normalizedNode = normalizeNode(affectedNode);
    if (node.LedgerEntryType === "RippleState") {
      const parsed = parseTrustlineQuantity(normalizedNode, valueParser);
      if (parsed) addLockedBalanceChange(grouped, parsed[0]);
    } else if (node.LedgerEntryType === "MPToken") {
      addLockedBalanceChange(grouped, parseMPTQuantity(normalizedNode, valueParser));
    }
  }

  return grouped;
}

/**
 *  Computes the complete list of every locked lockedBalance that changed in the ledger
 *  as a result of the given transaction.
 *
 *  @param {Object} metadata Transaction metadata
 *  @returns {Object} parsed lockedBalance changes
 */
function parseLockedBalanceChanges(metadata: TransactionMetadata): LockedBalanceChanges {
  return parseQuantities(metadata, computeBalanceChange);
}

/**
 *  Computes the complete list of every final locked lockedBalance in the ledger
 *  as a result of the given transaction.
 *
 *  @param {Object} metadata Transaction metadata
 *  @returns {Object} parsed balances
 */
function parseFinalLockedBalances(metadata: TransactionMetadata): LockedBalanceChanges {
  return parseQuantities(metadata, parseFinalBalance);
}

export { parseLockedBalanceChanges, parseFinalLockedBalances };
