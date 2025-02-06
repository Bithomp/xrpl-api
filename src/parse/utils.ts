import _ from "lodash";
import BigNumber from "bignumber.js";
import { Node, PaymentFlags, TransactionMetadata } from "xrpl";
import { ledgerTimeToISO8601 } from "../models";
import { IssuedCurrencyAmount, FormattedIssuedCurrencyAmount, FormattedIssuedMPTAmount } from "../types";
import { getNativeCurrency } from "../client";

function adjustQualityForXRP(quality: string, takerGetsCurrency: string, takerPaysCurrency: string) {
  // quality = takerPays.value/takerGets.value
  // using drops (1e-6 XRP) for XRP values
  const numeratorShift = takerPaysCurrency === getNativeCurrency() ? -6 : 0;
  const denominatorShift = takerGetsCurrency === getNativeCurrency() ? -6 : 0;
  const shift = numeratorShift - denominatorShift;
  return shift === 0 ? quality : new BigNumber(quality).shiftedBy(shift).toString();
}

function parseQuality(quality?: number | null): number | undefined {
  if (typeof quality !== "number") {
    return undefined;
  }
  return new BigNumber(quality).shiftedBy(-9).toNumber();
}

function parseTimestamp(rippleTime?: number | null): string | undefined {
  if (typeof rippleTime !== "number") {
    return undefined;
  }
  return ledgerTimeToISO8601(rippleTime);
}

function isPartialPayment(tx: any) {
  // eslint-disable-next-line no-bitwise
  return (tx.Flags & PaymentFlags.tfPartialPayment) !== 0;
}

function removeGenericCounterparty(
  amount: IssuedCurrencyAmount | FormattedIssuedCurrencyAmount | FormattedIssuedMPTAmount,
  address: string
): FormattedIssuedCurrencyAmount | FormattedIssuedMPTAmount {
  // @deprecated, use issuer
  if ("counterparty" in amount) {
    return amount.counterparty === address ? _.omit(amount, "counterparty") : amount;
  }
  if ("issuer" in amount) {
    return amount.issuer === address ? _.omit(amount, "issuer") : amount;
  }

  return amount;
}

function normalizeNode(affectedNode: Node) {
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

function normalizeNodes(metadata: TransactionMetadata) {
  if (!metadata.AffectedNodes) {
    return [];
  }
  return metadata.AffectedNodes.map(normalizeNode);
}

function hexToString(hex: string | undefined): string | undefined {
  return hex ? Buffer.from(hex, "hex").toString("utf-8") : undefined;
}

function stringToHex(value: string | undefined): string | undefined {
  return value ? Buffer.from(value, "utf8").toString("hex").toUpperCase() : undefined;
}

function bytesToHex(value: Uint8Array | ArrayBufferLike): string {
  return Buffer.from(value).toString("hex").toUpperCase();
}

function hexToBytes(value: string): Uint8Array {
  if (value.length % 2 !== 0) {
    throw new Error("Invalid hex string length");
  }

  if (!/^[0-9a-fA-F]*$/.test(value)) {
    throw new Error("Invalid hex string");
  }

  if (value.length === 0) {
    return new Uint8Array(0);
  }

  return Uint8Array.from(Buffer.from(value, "hex"));
}

function parseUint32(buf: Buffer, cur: number): string {
  return (
    // eslint-disable-next-line prefer-template, no-bitwise
    (BigInt(buf[cur]) << 24n) + (BigInt(buf[cur + 1]) << 16n) + (BigInt(buf[cur + 2]) << 8n) + BigInt(buf[cur + 3]) + ""
  );
}

function parseUint64(buf: Buffer, cur: number): string {
  /* eslint-disable prefer-template, no-bitwise */
  return (
    (BigInt(buf[cur]) << 56n) +
    (BigInt(buf[cur + 1]) << 48n) +
    (BigInt(buf[cur + 2]) << 40n) +
    (BigInt(buf[cur + 3]) << 32n) +
    (BigInt(buf[cur + 4]) << 24n) +
    (BigInt(buf[cur + 5]) << 16n) +
    (BigInt(buf[cur + 6]) << 8n) +
    BigInt(buf[cur + 7]) +
    ""
  );
  /* eslint-enable prefer-template, no-bitwise */
}

export {
  parseQuality,
  parseTimestamp,
  adjustQualityForXRP,
  isPartialPayment,
  removeGenericCounterparty,
  normalizeNodes,
  hexToString,
  stringToHex,
  bytesToHex,
  hexToBytes,
  parseUint32,
  parseUint64,
};
