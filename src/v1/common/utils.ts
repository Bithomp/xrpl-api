import _ from "lodash";
import { deriveKeypair } from "ripple-keypairs";
import { RippledAmount } from "./types/objects";
import { ValidationError } from "../../common/errors";
import { xrpToDrops } from "../../common";
import { xAddressToClassicAddress } from "ripple-address-codec";

function isValidSecret(secret: string): boolean {
  try {
    deriveKeypair(secret);
    return true;
  } catch (err) {
    return false;
  }
}

function toRippledAmount(amount: RippledAmount): RippledAmount {
  if (typeof amount === "string") return amount;

  if (amount.currency === "XRP") {
    return xrpToDrops(amount.value);
  }
  if (amount.currency === "drops") {
    return amount.value;
  }

  let issuer = amount.counterparty || amount.issuer;
  let tag: number | false = false;

  try {
    ({ classicAddress: issuer, tag } = xAddressToClassicAddress(issuer as string));
  } catch (e) {
    /* not an X-address */
  }

  if (tag !== false) {
    throw new ValidationError("Issuer X-address includes a tag");
  }

  return {
    currency: amount.currency,
    issuer,
    value: amount.value,
  };
}

/**
 * @param {Number} rpepoch (seconds since 1/1/2000 GMT)
 * @return {Number} s since unix epoch
 */
function rippleToUnixTime(rpepoch: number): number {
  return rpepoch + 0x386d4380;
}

/**
 * @param {Number} rpepoch (seconds since 1/1/2000 GMT)
 * @return {Number} ms since unix epoch
 */
function rippleToUnixTimestamp(rpepoch: number): number {
  return rippleToUnixTime(rpepoch) * 1000;
}

/**
 * @param {Number|Date} timestamp (ms since unix epoch)
 * @return {Number} seconds since ripple epoch (1/1/2000 GMT)
 */
function unixToRippleTimestamp(timestamp: number): number {
  return Math.round(timestamp / 1000) - 0x386d4380;
}

function rippleTimeToISO8601(rippleTime: number): string {
  return new Date(rippleToUnixTimestamp(rippleTime)).toISOString();
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

export {
  toRippledAmount,
  rippleToUnixTime,
  rippleToUnixTimestamp,
  rippleTimeToISO8601,
  iso8601ToRippleTime,
  isValidSecret,
  normalizeNodes,
};
