import { Wallet } from "xrpl";

export function generateAddress() {
  const wallet = Wallet.generate();
  const { publicKey, privateKey, classicAddress, seed } = wallet;

  return { publicKey, privateKey, address: classicAddress, seed };
}
