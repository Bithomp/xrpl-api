const R_B58_DICT = "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz";
import base from "base-x";
const base58 = base(R_B58_DICT);

export function decode(value: string): null | Buffer {
  if (!value) {
    return null;
  }

  try {
    return Buffer.from(base58.decode(value));
  } catch (_err: any) {
    // avoid exception
  }

  return null;
}

export function encode(buffer: Buffer | number[] | Uint8Array): null | string {
  if (!buffer) {
    return null;
  }

  try {
    return base58.encode(buffer);
  } catch (_err: any) {
    // avoid exception
  }

  return null;
}
