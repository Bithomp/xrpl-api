import _ from "lodash";
import { removeUndefined } from "../../common";

export function parseURITokenSellOfferChanges(tx: object): object {
  return new URITokenSellOfferChanges(tx).call();
}

interface AccountURITokenSellOfferChangesInterface {
  status: string; // "added" | "removed"
  uritokenID: string;
  amount?: string;
  destination?: string;
}

class URITokenSellOfferChanges {
  public readonly tx: any;
  public readonly changes: { [account: string]: AccountURITokenSellOfferChangesInterface[] };

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

  private addChange(account: string, change: AccountURITokenSellOfferChangesInterface): void {
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

        // create a new URIToken entry with or without offer
        if (affectedNode.CreatedNode) {
          if (node.NewFields.Amount || node.NewFields.Destination) {
            this.addChange(node.NewFields.Owner, {
              status: "added",
              uritokenID,
              amount: node.NewFields.Amount,
              destination: node.NewFields.Destination,
            });
          }
        }

        // modify an existing URIToken entry, create an offer, cancel an offer, change an owner, or change an offer
        if (affectedNode.ModifiedNode) {
          if (
            node.PreviousFields.Amount !== node.FinalFields.Amount ||
            node.PreviousFields.Destination !== node.FinalFields.Destination
          ) {
            if (node.PreviousFields.Amount || node.PreviousFields.Destination) {
              this.addChange(node.PreviousFields.Owner, {
                status: "removed",
                uritokenID,
                amount: node.PreviousFields.Amount,
                destination: node.PreviousFields.Amount,
              });
            }

            if (node.FinalFields.Amount || node.FinalFields.Destination) {
              this.addChange(node.FinalFields.Owner, {
                status: "added",
                uritokenID,
                amount: node.FinalFields.Amount,
                destination: node.FinalFields.Destination,
              });
            }
          }
        }

        // delete an existing URIToken entry with or without an offer
        if (affectedNode.DeletedNode) {
          if (node.FinalFields.Amount || node.FinalFields.Destination) {
            this.addChange(node.FinalFields.Owner, {
              status: "removed",
              uritokenID,
              amount: node.FinalFields.Amount,
              destination: node.FinalFields.Destination,
            });
          }
        }
      }
    }
  }
}
