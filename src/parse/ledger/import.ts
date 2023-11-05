import { decode } from "ripple-binary-codec";
import { parseVL } from "../../models/vl";

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

    return {
      ledger: decodedBlob.ledger,
      validation: {
        data: data,
        unl: parseVL(decodedBlob.validation.unl),
      },
      transaction: {
        tx: decode(decodedBlob.transaction.blob),
        meta: decode(decodedBlob.transaction.meta),
        proof: decodedBlob.transaction.proof,
      },
    };
  } catch (e) {
    return blob;
  }
}
