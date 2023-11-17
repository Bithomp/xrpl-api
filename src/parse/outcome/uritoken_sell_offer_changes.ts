import _ from "lodash";
import { removeUndefined } from "../../common";
import { Amount } from "../../v1/common/types/objects";

export function parseURITokenSellOfferChanges(tx: object): object {
  return new URITokenSellOfferChanges(tx).call();
}

interface AccountURITokenSellOfferChangesInterface {
  status: "created" | "deleted";
  uritokenID: string;
  amount?: Amount;
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
              status: "created",
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
            // NOTE: if URIToken went from public sale to private, without amount modification, it will ne be seen as a change,
            // since the previous fields will be empty the same as it looks like then it was created new sell offer
            if (node.PreviousFields.Amount || node.PreviousFields.Destination) {
              let owner: string;
              if (node.PreviousFields.hasOwnProperty("Owner")) {
                owner = node.PreviousFields.Owner;
              } else {
                owner = node.FinalFields.Owner;
              }

              let destination: string;
              if (node.PreviousFields.hasOwnProperty("Destination")) {
                destination = node.PreviousFields.Destination;
              } else {
                destination = node.FinalFields.Destination;
              }

              let amount: Amount;
              // check if amount was changed
              if (node.PreviousFields.hasOwnProperty("Amount")) {
                amount = node.PreviousFields.Amount;
              } else {
                amount = node.FinalFields.Amount;
              }
              this.addChange(owner, {
                status: "deleted",
                uritokenID,
                amount: amount,
                destination,
              });
            }

            if (node.FinalFields.Amount || node.FinalFields.Destination) {
              this.addChange(node.FinalFields.Owner, {
                status: "created",
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
              status: "deleted",
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
