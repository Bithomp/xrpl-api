import { deriveKeypair } from "ripple-keypairs";
import { Amount, IssuedCurrencyAmount, FormattedIssuedCurrencyAmount } from "./types/objects";
import { xrpToDrops } from "../../common";

import { getNativeCurrency } from "../../client";

function isValidSecret(secret: string): boolean {
  try {
    deriveKeypair(secret);
    return true;
  } catch (err) {
    return false;
  }
}

function toRippledAmount(amount: Amount | FormattedIssuedCurrencyAmount): Amount {
  if (typeof amount === "string") return amount;

  if (amount.currency === getNativeCurrency()) {
    return xrpToDrops(amount.value);
  }
  if (amount.currency === "drops") {
    return amount.value;
  }

  // if amount is IssuedCurrencyAmount use issuer, else if FormattedIssuedCurrencyAmount use counterparty
  const issuer = (amount as FormattedIssuedCurrencyAmount).counterparty || (amount as IssuedCurrencyAmount).issuer;

  return {
    currency: amount.currency,
    issuer,
    value: amount.value,
  };
}

/**
 * @param {Number|Date} timestamp (ms since unix epoch)
 * @return {Number} seconds since ripple epoch (1/1/2000 GMT)
 */
function unixToRippleTimestamp(timestamp: number): number {
  return Math.round(timestamp / 1000) - 0x386d4380;
}

/**
 * @param {string} iso8601 international standard date format
 * @return {number} seconds since ripple epoch (1/1/2000 GMT)
 */
function iso8601ToRippleTime(iso8601: string): number {
  return unixToRippleTimestamp(Date.parse(iso8601));
}

function normalizeNode(affectedNode) {
  const diffType = Object.keys(affectedNode)[0];
  const node = affectedNode[diffType];
  return Object.assign({}, node, {
    diffType,
    entryType: node.LedgerEntryType,
    ledgerIndex: node.LedgerIndex,
    newFields: node.NewFields || {},
    finalFields: node.FinalFields || {},
    previousFields: node.PreviousFields || {},
  });
}

function normalizeNodes(metadata) {
  if (!metadata.AffectedNodes) {
    return [];
  }
  return metadata.AffectedNodes.map(normalizeNode);
}

export { toRippledAmount, iso8601ToRippleTime, isValidSecret, normalizeNodes };
