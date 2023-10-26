import _ from "lodash";
import { removeUndefined } from "../../common";

export function parseURITokenChanges(tx: object): object {
  return new URITokenChanges(tx).call();
}

interface AccountURITokenChangesInterface {
  status: string; // "added" | "removed"
  flags?: number;
  uritokenID: string;
  uri?: string;
  digest?: string;
  issuer: string;
}

class URITokenChanges {
  public readonly tx: any;
  public readonly changes: { [account: string]: AccountURITokenChangesInterface[] };

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

  private addChange(account: string, change: AccountURITokenChangesInterface): void {
    if (!this.changes[account]) {
      this.changes[account] = [];
    }

    this.changes[account].push(removeUndefined(change));
  }

  private parseAffectedNodes(): void {
    for (const affectedNode of this.tx.meta.AffectedNodes) {
      const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
      if (node?.LedgerEntryType === "URIToken" && node?.LedgerIndex) {
        const uritokenID = node.LedgerIndex;

        // console.log("node", node);

        // create a new URIToken entry with or without offer
        if (affectedNode.CreatedNode) {
          this.addChange(node.NewFields.Owner, {
            status: "added",
            flags: node.NewFields.Flags,
            uritokenID,
            uri: node.NewFields.URI,
            digest: node.NewFields.Digest,
            issuer: node.NewFields.Issuer,
          });
        }

        // modify an existing URIToken entry, create an offer, cancel an offer, change an owner, or change an offer
        if (affectedNode.ModifiedNode) {
          if (node.PreviousFields.Owner && node.PreviousFields.Owner !== node.FinalFields.Owner) {
            this.addChange(node.PreviousFields.Owner, {
              status: "removed",
              flags: node.FinalFields.Flags,
              uritokenID,
              uri: node.FinalFields.URI,
              digest: node.FinalFields.Digest,
              issuer: node.FinalFields.Issuer,
            });

            this.addChange(node.FinalFields.Owner, {
              status: "added",
              flags: node.FinalFields.Flags,
              uritokenID,
              uri: node.FinalFields.URI,
              digest: node.FinalFields.Digest,
              issuer: node.FinalFields.Issuer,
            });
          }
        }

        // delete an existing URIToken entry with or without an offer
        if (affectedNode.DeletedNode) {
          this.addChange(node.FinalFields.Owner, {
            status: "removed",
            flags: node.FinalFields.Flags,
            uritokenID,
            uri: node.FinalFields.URI,
            digest: node.FinalFields.Digest,
            issuer: node.FinalFields.Issuer,
          });
        }
      }
    }
  }
}
