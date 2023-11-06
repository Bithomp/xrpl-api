import { decode } from "ripple-binary-codec";;
import { computeBinaryTransactionHash } from "ripple-hashes"
import { parseVL } from "../../models/vl";
import { getAccountTxDetails } from "../../models/transaction";
import { FormattedImportBlobSpecification } from "../../v1/common/types/objects";

export function parseImportBlob(blob: string): FormattedImportBlobSpecification | string {
  try {
    // hex -> utf8 -> json
    const decodedBlob = JSON.parse(Buffer.from(blob, "hex").toString("utf8"));

    // decode all fields in validation data
    const data = decodedBlob.validation.data;
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        data[key] = decode(data[key]);
      }
    }

    // tx.Fee - burn
    // tx.OperationLimit - networkID

    const tx = decode(decodedBlob.transaction.blob);
    const meta = decode(decodedBlob.transaction.meta);
    const parsedTX = getAccountTxDetails({ tx: tx as any, meta: meta as any, validated: true }, false);
    return {
      ledger: decodedBlob.ledger,
      validation: {
        data,
        unl: parseVL(decodedBlob.validation.unl),
      },
      transaction: {
        id: computeBinaryTransactionHash(decodedBlob.transaction.blob),
        tx: decode(decodedBlob.transaction.blob),
        meta: decode(decodedBlob.transaction.meta),
        proof: decodedBlob.transaction.proof,
        specification: parsedTX.specification,
        outcome: parsedTX.outcome,
      },
    };
  } catch (e) {
    return blob;
  }
}
