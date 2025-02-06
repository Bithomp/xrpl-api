import { deriveAddress } from "ripple-keypairs";

import { FormattedSignerRegularKey } from "../../types";

// {
//   SigningPubKey: '03AA9130F4BAB351583FDDCE06CEC016C35E7F4B008FAF09DC532406E12D732D9C',
//   TxnSignature: '3045022100953DEF1B48EBE17FDBF2E56AB4E58229F7AB3C5EA1583646E704F6A6B546294902205657341FE7A5AB42A7A985526D485CDEEF84352B6FD16E303C3367603BC490D5',
// }
export function parseSignerRegularKey(tx: any): FormattedSignerRegularKey | undefined {
  // should be a single signer
  if (tx && tx.SigningPubKey && !tx.Signers) {
    const signedBy = deriveAddress(tx.SigningPubKey);
    if (signedBy !== tx.Account) {
      return {
        address: signedBy,
      };
    }
  }
}
