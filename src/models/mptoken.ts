import BigNumber from "bignumber.js";
import * as AddressCodec from "ripple-address-codec";

import { bytesToHex } from "../parse/utils";

export interface MPTokenInterface {
  MPTokenIssuanceID: string;
  Issuer: string;
  Sequence: number;
}

export function buildMPTokenIssuanceID(sequence: number, issuer: string): string {
  return (
    // @ts-ignore
    new BigNumber(sequence).toString(16).padStart(8, "0").toUpperCase() +
    bytesToHex(AddressCodec.decodeAccountID(issuer).buffer)
  );
}

export function parseMPTokenIssuanceID(mptIssuanceID: string): MPTokenInterface | null {
  if (typeof mptIssuanceID !== "string" || mptIssuanceID.length !== 48) {
    return null;
  }

  const sequence = new BigNumber(mptIssuanceID.slice(0, 8), 16).toNumber();
  const issuer = AddressCodec.encodeAccountID(Buffer.from(mptIssuanceID.slice(8, 48), "hex"));

  return {
    MPTokenIssuanceID: mptIssuanceID,
    Sequence: sequence,
    Issuer: issuer,
  };
}
