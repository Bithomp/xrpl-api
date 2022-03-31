import * as _ from "lodash";
import { removeUndefined } from "../../v1/common";
import { NFTokenOfferFlagsKeys } from "../account_nfts";

export function parseNonFungibleTokenChanges(tx: object): object {
  return new NonFungibleTokenChanges(tx).call();
}

class NonFungibleTokenChanges {
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
    if (this.isNFTokensCreateNode(affectedNode)) {
      this.parseNFTokensCreateNode(affectedNode);
    } else if (this.isNFTokensModifiedNode(affectedNode)) {
      this.parseNFTokensModifiedNode(affectedNode);
    } else if (this.isNFTokensDeleteNode(affectedNode)) {
      this.parseNFTokensDeleteNode(affectedNode);
    } else if (this.isNFTokensOfferAccept(affectedNode)) {
      this.parseNFTokensOfferAccept(affectedNode);
    }
  }

  private isNFTokensCreateNode(affectedNode: any): boolean {
    const ledgerEntryType: string = affectedNode.CreatedNode?.LedgerEntryType;
    const nonFungibleTokens: any[] = affectedNode.CreatedNode?.NewFields?.NonFungibleTokens;

    return ledgerEntryType === "NFTokenPage" && Array.isArray(nonFungibleTokens);
  }

  private parseNFTokensCreateNode(createdNode: any): void {
    for (const tokenNode of createdNode.CreatedNode?.NewFields?.NonFungibleTokens) {
      this.parseNFTokenCreateNode(tokenNode);
    }
  }

  private parseNFTokenCreateNode(tokenNode: any): void {
    if (!tokenNode.NonFungibleToken) {
      return;
    }

    let status: string | undefined;
    const tokenID: string = tokenNode.NonFungibleToken.TokenID;
    const uri: string = tokenNode.NonFungibleToken.URI;

    if (this.tx.TransactionType === "NFTokenMint") {
      status = "added";
    } else if (this.tx.TransactionType === "NFTokenAcceptOffer") {
      // set status debends by offer
      const offerNode = this.findNFTokenAcceptOfferNode(tokenID);
      if (offerNode) {
        const offerLedgerIndex = offerNode.LedgerIndex;
        if (this.tx.BuyOffer === offerLedgerIndex) {
          status = "removed";
        } else if (this.tx.SellOffer === offerLedgerIndex) {
          status = "added";
        }
      }
    }

    this.addChange(this.tx.Account, { status, tokenID, uri });
  }

  private isNFTokensModifiedNode(affectedNode: any): boolean {
    const ledgerEntryType: string = affectedNode.ModifiedNode?.LedgerEntryType;
    const finalNonFungibleTokens: any[] = affectedNode.ModifiedNode?.FinalFields?.NonFungibleTokens;
    const previousNonFungibleTokens: any[] = affectedNode.ModifiedNode?.PreviousFields?.NonFungibleTokens;

    return (
      ledgerEntryType === "NFTokenPage" &&
      Array.isArray(finalNonFungibleTokens) &&
      Array.isArray(previousNonFungibleTokens)
    );
  }

  private parseNFTokensModifiedNode(tokenNode: any): void {
    if (!tokenNode?.ModifiedNode?.FinalFields || !tokenNode?.ModifiedNode?.PreviousFields) {
      return;
    }

    const finalNonFungibleTokens: any[] = tokenNode.ModifiedNode?.FinalFields?.NonFungibleTokens;
    const previousNonFungibleTokens: any[] = tokenNode.ModifiedNode?.PreviousFields?.NonFungibleTokens;

    let finalTokens: string[] = [];
    if (Array.isArray(finalNonFungibleTokens)) {
      finalTokens = finalNonFungibleTokens.map((nonFungibleToken: any) => nonFungibleToken.NonFungibleToken.TokenID);
    }

    let previousTokens: string[] = [];
    if (Array.isArray(previousNonFungibleTokens)) {
      previousTokens = previousNonFungibleTokens.map(
        (nonFungibleToken: any) => nonFungibleToken.NonFungibleToken.TokenID
      );
    }

    const added: string[] = _.difference(finalTokens, previousTokens);
    const removed: string[] = _.difference(previousTokens, finalTokens);

    if (added.length > 0) {
      for (const nonFungibleToken of finalNonFungibleTokens) {
        if (added.includes(nonFungibleToken.NonFungibleToken.TokenID)) {
          const tokenID = nonFungibleToken.NonFungibleToken.TokenID;
          const uri = nonFungibleToken.NonFungibleToken.URI;

          let account = this.tx.Account;
          let status = "added";
          if (this.tx.TransactionType === "NFTokenAcceptOffer") {
            const offerNode = this.findNFTokenAcceptOfferNode(tokenID);
            if (offerNode) {
              const offerLedgerIndex = offerNode.LedgerIndex;
              if (this.tx.BuyOffer === offerLedgerIndex) {
                status = "removed";
              } else if (this.tx.SellOffer === offerLedgerIndex) {
                account = offerNode.FinalFields.Owner;
                status = "added";
              }
            }
          }
          this.addChange(account, { status, tokenID, uri });
        }
      }
    }

    if (removed.length > 0) {
      for (const nonFungibleToken of previousNonFungibleTokens) {
        if (removed.includes(nonFungibleToken.NonFungibleToken.TokenID)) {
          const tokenID = nonFungibleToken.NonFungibleToken.TokenID;
          const uri = nonFungibleToken.NonFungibleToken.URI;
          let account = this.tx.Account;
          let status = "removed";
          if (this.tx.TransactionType === "NFTokenAcceptOffer") {
            const offerNode = this.findNFTokenAcceptOfferNode(tokenID);
            if (offerNode) {
              const offerLedgerIndex = offerNode.LedgerIndex;
              if (this.tx.BuyOffer === offerLedgerIndex) {
                account = offerNode.FinalFields.Owner;
                status = "added";
              } else if (this.tx.SellOffer === offerLedgerIndex) {
                status = "removed";
              }
            }
          }
          this.addChange(account, { status, tokenID, uri });
        }
      }
    }
  }

  private isNFTokensDeleteNode(affectedNode: any): boolean {
    const ledgerEntryType: string = affectedNode.DeletedNode?.LedgerEntryType;
    const nonFungibleTokens: any[] = affectedNode.DeletedNode?.FinalFields?.NonFungibleTokens;

    return ledgerEntryType === "NFTokenPage" && Array.isArray(nonFungibleTokens);
  }

  private parseNFTokensDeleteNode(deleteNode: any): void {
    for (const tokenNode of deleteNode.DeletedNode?.FinalFields?.NonFungibleTokens) {
      this.parseNFTokenDeleteNode(tokenNode);
    }
  }

  private parseNFTokenDeleteNode(tokenNode: any): void {
    if (!tokenNode.NonFungibleToken) {
      return;
    }

    const status = "removed";
    const tokenID = tokenNode.NonFungibleToken.TokenID;
    const uri = tokenNode.NonFungibleToken.URI;

    this.addChange(this.tx.Account, { status, tokenID, uri });
  }

  private isNFTokensOfferAccept(affectedNode: any): boolean {
    return (
      this.tx.TransactionType === "NFTokenAcceptOffer" && affectedNode.DeletedNode?.LedgerEntryType === "NFTokenOffer"
    );
  }

  private parseNFTokensOfferAccept(offerNode: any): void {
    return;
    if (!offerNode.DeletedNode?.FinalFields) {
      return;
    }

    const owner: string = offerNode.DeletedNode.FinalFields.Owner;
    if (!owner) {
      return;
    }

    // tslint:disable-next-line:no-bitwise
    const status = offerNode.DeletedNode.FinalFields.Flags & NFTokenOfferFlagsKeys.sellToken ? "removed" : "added";
    const tokenID = offerNode.DeletedNode.FinalFields.TokenID;

    this.addChange(owner, { status, tokenID });
  }

  private findNFTokenAcceptOfferNode(tokenID: string): any {
    for (const affectedNode of this.tx.meta.AffectedNodes) {
      const offerLedgerEntryType = affectedNode.DeletedNode?.LedgerEntryType;
      const offerTokenID = affectedNode.DeletedNode?.FinalFields?.TokenID;

      if (offerLedgerEntryType === "NFTokenOffer" && offerTokenID === tokenID) {
        return affectedNode.DeletedNode;
      }
    }

    return null;
  }
}
