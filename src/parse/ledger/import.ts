import { decode } from "ripple-binary-codec";
import { hashSignedTx } from "../../wallet";
import { parseVL } from "../../models/vl";
import { getAccountTxDetails } from "../../models/transaction";
import { FormattedImportBlobSpecification } from "../../types";

const MAINNET_NATIVE_CURRENCY = "XRP";

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
    const parsedTX = getAccountTxDetails(
      { tx: tx as any, meta: meta as any, validated: true },
      false,
      MAINNET_NATIVE_CURRENCY
    );
    return {
      ledger: decodedBlob.ledger,
      validation: {
        data,
        unl: parseVL(decodedBlob.validation.unl),
      },
      transaction: {
        id: hashSignedTx(decodedBlob.transaction.blob),
        tx: decode(decodedBlob.transaction.blob),
        meta: decode(decodedBlob.transaction.meta),
        proof: decodedBlob.transaction.proof,
        specification: parsedTX.specification,
        outcome: parsedTX.outcome,
      },
    };
  } catch (_err: any) {
    return blob;
  }
}
