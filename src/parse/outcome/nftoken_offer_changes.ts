import { ledgerTimeToUnixTime } from "../../models/ledger";
import { removeUndefined } from "../../common";
import { Amount } from "../../types";

function parseNFTokenOfferChanges(tx: object): object {
  return new NFTokenOfferChanges(tx).call();
}

class NFTokenOfferChanges {
  public readonly tx: any;
  public readonly changes: any;

  public constructor(tx: any) {
    this.tx = tx;
    this.changes = {};
  }

  public call(): any {
    if (this.hasAffectedNodes() === false) {
      return this.changes;
    }

    for (const affectedNode of this.tx.meta.AffectedNodes) {
      this.parseAffectedNode(affectedNode);
    }

    return this.changes;
  }

  private addChange(account: string, change: any): void {
    if (!this.changes[account]) {
      this.changes[account] = [];
    }

    this.changes[account].push(removeUndefined(change));
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

  private parseAffectedNode(affectedNode: any): void {
    if (this.isNFTokensCreateOfferNode(affectedNode)) {
      this.parseNFTokensCreateOfferNode(affectedNode);
    } else if (this.isNFTokensDeleteOfferNode(affectedNode)) {
      this.parseNFTokensDeleteOfferNode(affectedNode);
    }
  }

  private isNFTokensCreateOfferNode(affectedNode: any): boolean {
    return affectedNode.CreatedNode?.LedgerEntryType === "NFTokenOffer" && affectedNode.CreatedNode?.NewFields;
  }

  private parseNFTokensCreateOfferNode(affectedNode: any): void {
    const status: string = "created";
    const amount: Amount = affectedNode.CreatedNode.NewFields.Amount;
    const flags: string = affectedNode.CreatedNode.NewFields.Flags;
    const nftokenID: string = affectedNode.CreatedNode.NewFields.NFTokenID;
    const owner: string = affectedNode.CreatedNode.NewFields.Owner;
    const index: string = affectedNode.CreatedNode.LedgerIndex;
    const destination: string = affectedNode.CreatedNode.NewFields.Destination;
    const previousTxnID: string = affectedNode.CreatedNode.NewFields.PreviousTxnID;
    const previousTxnLgrSeq: string = affectedNode.CreatedNode.NewFields.PreviousTxnLgrSeq;
    let expiration: number = affectedNode.CreatedNode.NewFields.Expiration;
    if (typeof expiration === "number") {
      expiration = ledgerTimeToUnixTime(expiration);
    }

    this.addChange(this.tx.Account, {
      status,
      amount,
      flags,
      nftokenID,
      owner,
      destination,
      expiration,
      index,
      previousTxnID,
      previousTxnLgrSeq,
    });
  }

  private isNFTokensDeleteOfferNode(affectedNode: any): boolean {
    return affectedNode.DeletedNode?.LedgerEntryType === "NFTokenOffer" && affectedNode.DeletedNode?.FinalFields;
  }

  private parseNFTokensDeleteOfferNode(affectedNode: any): void {
    const status: string = "deleted";
    const amount: Amount = affectedNode.DeletedNode.FinalFields.Amount;
    const flags: string = affectedNode.DeletedNode.FinalFields.Flags;
    const nftokenID: string = affectedNode.DeletedNode.FinalFields.NFTokenID;
    const owner: string = affectedNode.DeletedNode.FinalFields.Owner;
    const index: string = affectedNode.DeletedNode.LedgerIndex;
    const destination: string = affectedNode.DeletedNode.FinalFields.Destination;
    const previousTxnID: string = affectedNode.DeletedNode.FinalFields.PreviousTxnID;
    const previousTxnLgrSeq: string = affectedNode.DeletedNode.FinalFields.PreviousTxnLgrSeq;
    let expiration: number = affectedNode.DeletedNode.FinalFields.Expiration;
    if (typeof expiration === "number") {
      expiration = ledgerTimeToUnixTime(expiration);
    }

    this.addChange(owner, {
      status,
      amount,
      flags,
      nftokenID,
      owner,
      destination,
      expiration,
      index,
      previousTxnID,
      previousTxnLgrSeq,
    });
  }
}

export { parseNFTokenOfferChanges };
