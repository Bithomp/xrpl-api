export function parseUint32(buf: Buffer, cur: number): string {
  return (
    (BigInt(buf[cur]) << 24n) + (BigInt(buf[cur + 1]) << 16n) + (BigInt(buf[cur + 2]) << 8n) + BigInt(buf[cur + 3]) + ""
  );
}

export function parseUint64(buf: Buffer, cur: number): string {
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
}
