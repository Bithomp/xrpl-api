import _ from "lodash";
import { removeUndefined } from "../../common";

export function parseURITokenChanges(tx: object): object {
  return new URITokenChanges(tx).call();
}

interface AccountURITokenChangesInterface {
  status: string; // "added" | "removed" | "modified"
  uritokenID: string;
  uri?: string;
  digest?: string;
  issuer: string;
  owner: string;
  amount?: string;
  destination?: string;
}

class URITokenChanges {
  public readonly tx: any;
  public readonly changes: { [uritokenID: string]: AccountURITokenChangesInterface };

  public constructor(tx: any) {
    this.tx = tx;
    this.changes = {};
  }

  public call(): any {
    if (this.hasAffectedNodes() === false) {
      return this.changes;
    }

    this.parseAffectedNodes();

    return this.changes;
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
      const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
      if (node?.LedgerEntryType === "URIToken" && node?.LedgerIndex) {
        const uritokenID = node.LedgerIndex;

        // create a new URIToken entry with or without offer
        if (affectedNode.CreatedNode) {
          if (this.changes[uritokenID]) {
            throw new Error("Duplicate URITokenID in AffectedNodes");
          }

          this.changes[uritokenID] = removeUndefined({
            status: "added",
            flags: node.NewFields.Flags,
            uritokenID,
            uri: node.NewFields.URI,
            digest: node.NewFields.Digest,
            issuer: node.NewFields.Issuer,
            owner: node.NewFields.Owner,
            amount: node.NewFields.Amount,
            destination: node.NewFields.Destination,
          })
        }

        // modify an existing URIToken entry, create an offer, cancel an offer, change an owner, or change an offer
        if (affectedNode.ModifiedNode) {
          //
        }

        // delete an existing URIToken entry with or without an offer
        if (affectedNode.DeletedNode) {
          //
        }
      }
    }
  }
}
