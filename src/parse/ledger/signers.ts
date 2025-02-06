import { FormattedTransactionSigner } from "../../types";

// {
//   "Signers": [
//     {
//         "Signer": {
//             "Account": "rpFtpLAdkkrVzAmsf1gvpRnxs4t6kwb93C",
//             "SigningPubKey": "0397178F8125786CF8CB2BC4B62226D1831FB66C7F6B599959906DA73607951F93",
//             "TxnSignature": "3045022100D3D2A1D7ACB12B072B8FB535A5E249D44AF0F7D2B1C7CB35B9D8F366E325560302200376DFA4397FE3ED801E79B38F0996A469772E0884AAF8CFD1737C5B4B02A47A"
//         }
//     },
//     {
//         "Signer": {
//             "Account": "rpxfwNAyPPrMMySaxAsU94ym7U5SHY6c1D",
//             "SigningPubKey": "03B417CA7D924E83713A753FF9A5EBC72C9AB999A6F93EFD9C51A4AA410F01203D",
//             "TxnSignature": "304402207949E544484DCEA53F25E09165DD4ABA0A4C511BA33B962D750ABCE10BA7569902205727F81F449CE2580F1CCFF3FDB11AC8C32EFA07EB6CDF3CBEA79F4DD669EB3E"
//         }
//     }
//   ],
//   "SigningPubKey": ""
// }
export function parseSigners(tx: any): FormattedTransactionSigner[] | undefined {
  if (tx && tx.Signers) {
    return tx.Signers.map((signer: any) => {
      return {
        address: signer.Signer.Account,
        // signingPubKey: signer.Signer.SigningPubKey,
        // txnSignature: signer.Signer.TxnSignature,
      };
    });
  }
}
