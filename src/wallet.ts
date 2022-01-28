import { Wallet } from "xrpl";
export { Wallet } from "xrpl";

import * as Base58 from "./base58";
import * as Crypto from "crypto";

export function generateAddress() {
  const wallet = Wallet.generate();
  const { publicKey, privateKey, classicAddress, seed } = wallet;

  return { publicKey, privateKey, address: classicAddress, seed };
}

export function isValidClassicAddress(address: string): boolean {
  if (!address || address.length === 0) {
    return false;
  }

  const buffer = Base58.decode(address, 25);
  if (buffer === null) {
    return false;
  }

  const checksum: Buffer = checksumClassicAddress(buffer);
  if (
    checksum[0] !== buffer[21] ||
    checksum[1] !== buffer[22] ||
    checksum[2] !== buffer[23] ||
    checksum[3] !== buffer[24]
  ) {
    return false;
  }

  return true;
}

export function checksumClassicAddress(buffer: Buffer): Buffer {
  const hash: Buffer = buffer.slice(0, 21);
  const checksumPrepare: Buffer = Crypto.createHash("sha256").update(Buffer.from(hash)).digest();
  const checksum: Buffer = Crypto.createHash("sha256").update(checksumPrepare).digest();

  return checksum;
}
