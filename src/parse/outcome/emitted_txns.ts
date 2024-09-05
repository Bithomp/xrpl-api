import { XrplDefinitionsBase } from "ripple-binary-codec";
import { removeUndefined } from "../../common";
import { hashSignedTx } from "../../wallet";
import { parseTransaction, FormattedSpecification } from "../../parse/transaction";
interface FormattedEmittedTxnInterface {
  id?: string | undefined;
  specification: FormattedSpecification;
  tx: any;
}

// "CreatedNode": {
//   "LedgerEntryType": "EmittedTxn",
//   "LedgerIndex": "F07EAB5A81007B332F74410A4E4FA60EBEEEB48DC4483127A28E18DC93A8A0E3",
//   "NewFields": {
//     "EmittedTxn": {
//       "Account": "r3Q5KufJdkQyaLvHD22fJFVSZCqq4GczyU",
//       "Destination": "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
//       "EmitDetails": {
//         "EmitBurden": "1",
//         "EmitGeneration": 1,
//         "EmitHookHash": "6DAE1BECB44B1B0F7034A642849AECB73B8E3CF31ED7AF9C0BA16DF8363E3DE7",
//         "EmitNonce": "AE93CC86985824560241B2184DB28EFAE9D36A69A2BE6D07F071BFA3E7380E02",
//         "EmitParentTxnID": "BD3338E3799624DF13EA1CA46CD7305A643B99941F3563FAC35FB3D456153622"
//       },
//       "Fee": "10",
//       "FirstLedgerSequence": 4722790,
//       "Flags": 2147483648,
//       "LastLedgerSequence": 4722794,
//       "Sequence": 0,
//       "SigningPubKey": "",
//       "TransactionType": "URITokenMint",
//       "URI": "68747470733A2F2F692E6B796D2D63646E2E636F6D2F656E74726965732F69636F6E732F6F726967696E616C2F3030302F3032372F3437352F53637265656E5F53686F745F323031382D31302D32355F61745F31312E30322E31355F414D2E706E67"
//     }
//   }
// }
// create specification for each type of emitted txn
// calculate hash(id) of tx
export function parseEmittedTxns(
  tx: any,
  definitions?: XrplDefinitionsBase
): FormattedEmittedTxnInterface[] | undefined {
  return new EmittedTxns(tx, definitions).call();
}

class EmittedTxns {
  tx: any;
  emittedTxns: FormattedEmittedTxnInterface[];
  definitions?: XrplDefinitionsBase;

  constructor(tx: any, definitions?: XrplDefinitionsBase) {
    this.tx = tx;
    this.emittedTxns = [];
    this.definitions = definitions;
  }

  call(): FormattedEmittedTxnInterface[] | undefined {
    if (this.hasAffectedNodes() === false) {
      return undefined;
    }

    this.parseAffectedNodes();

    if (this.emittedTxns.length === 0) {
      return undefined;
    }

    return this.emittedTxns;
  }

  private hasAffectedNodes(): boolean {
    if (this.tx.meta?.AffectedNodes === undefined) {
      return false;
    }

    if (this.tx.meta?.AffectedNodes?.length === 0) {
      return false;
    }

    return true;
  }

  private parseAffectedNodes(): void {
    for (const affectedNode of this.tx.meta.AffectedNodes) {
      const node = affectedNode.CreatedNode;
      if (node?.LedgerEntryType === "EmittedTxn" && node?.LedgerIndex) {
        if (affectedNode.CreatedNode) {
          const tx = node.NewFields.EmittedTxn;

          let id: string | undefined;
          try {
            id = hashSignedTx(tx, this.definitions, false);
          } catch (_err: any) {
            // ignore
          }

          this.emittedTxns.push(
            removeUndefined({
              id,
              specification: parseTransaction(tx, false).specification,
              tx,
            })
          );
        }
      }
    }
  }
}
