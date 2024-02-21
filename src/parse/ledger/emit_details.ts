import { FormattedEmitDetails } from "../../types/objects/emit_details";

// {
//   "EmitDetails": {
//     "EmitBurden": "1",
//     "EmitGeneration": 1,
//     "EmitHookHash": "6DAE1BECB44B1B0F7034A642849AECB73B8E3CF31ED7AF9C0BA16DF8363E3DE7",
//     "EmitNonce": "AE93CC86985824560241B2184DB28EFAE9D36A69A2BE6D07F071BFA3E7380E02",
//     "EmitParentTxnID": "BD3338E3799624DF13EA1CA46CD7305A643B99941F3563FAC35FB3D456153622"
//   }
// }
export function parseEmittedDetails(tx: any): FormattedEmitDetails | undefined {
  if (tx && tx.EmitDetails) {
    return {
      emitBurden: tx.EmitDetails.EmitBurden,
      emitGeneration: tx.EmitDetails.EmitGeneration,
      emitHookHash: tx.EmitDetails.EmitHookHash,
      emitNonce: tx.EmitDetails.EmitNonce,
      emitParentTxnID: tx.EmitDetails.EmitParentTxnID,
    };
  }
}
