import * as _ from "lodash";
import { removeUndefined } from "../../v1/common";
import { NFTokenOfferFlagsKeys } from "../account_nfts";

export function parseNonFungibleTokenChanges(tx: object): object {
  return new NonFungibleTokenChanges(tx).call();
}

interface AccountNFTockenChangesInterface {
  status: string;
  tokenID: string;
  uri?: string;
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

  private addChange(account: string, change: AccountNFTockenChangesInterface): void {
    if (!this.changes[account]) {
      this.changes[account] = [];
    }

    // check for dubliation and multyple add remove
    for (const index in this.changes[account]) {
      const info = this.changes[account][index];
      if (info.tokenID === change.tokenID) {
        // the same
        if (info.status === change.status) {
          return;
          // cancel add/remove
        } else {
          this.changes[account].splice(index, 1);
          return;
        }
      }
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

    if (status !== undefined) {
      this.addChange(this.tx.Account, { status, tokenID, uri });
    }
  }

  private isNFTokensModifiedNode(affectedNode: any): boolean {
    const ledgerEntryType: string = affectedNode.ModifiedNode?.LedgerEntryType;
    const finalNFTokens: any[] = affectedNode.ModifiedNode?.FinalFields?.NonFungibleTokens;
    const previousNFTokens: any[] = affectedNode.ModifiedNode?.PreviousFields?.NonFungibleTokens;

    return ledgerEntryType === "NFTokenPage" && Array.isArray(finalNFTokens) && Array.isArray(previousNFTokens);
  }

  private parseNFTokensModifiedNode(tokenNode: any): void {
    if (!tokenNode?.ModifiedNode?.FinalFields || !tokenNode?.ModifiedNode?.PreviousFields) {
      return;
    }

    const ledgerIndex: string = tokenNode.ModifiedNode?.LedgerIndex;
    const previousTxnID: string = tokenNode.ModifiedNode?.PreviousTxnID;
    let finalNFTokens: any[] = tokenNode.ModifiedNode?.FinalFields?.NonFungibleTokens;
    let previousNFTokens: any[] = tokenNode.ModifiedNode?.PreviousFields?.NonFungibleTokens;

    // if there is a deleted page - combine tokens
    const deletedPage = this.findNFTokenPageDeletedNode(ledgerIndex);
    if (deletedPage) {
      const deletedFinalNFTokens: any[] = deletedPage.FinalFields?.NonFungibleTokens;
      const deletedPreviousNFTokens: any[] = deletedPage.PreviousFields?.NonFungibleTokens;

      if (Array.isArray(deletedFinalNFTokens)) {
        finalNFTokens = _.concat(finalNFTokens, deletedFinalNFTokens);
      }

      if (Array.isArray(deletedPreviousNFTokens)) {
        previousNFTokens = _.concat(previousNFTokens, deletedPreviousNFTokens);
      }
    }

    let finalTokens: string[] = [];
    if (Array.isArray(finalNFTokens)) {
      finalTokens = finalNFTokens.map((nonFungibleToken: any) => nonFungibleToken.NonFungibleToken.TokenID);
    }

    let previousTokens: string[] = [];
    if (Array.isArray(previousNFTokens)) {
      previousTokens = previousNFTokens.map((nonFungibleToken: any) => nonFungibleToken.NonFungibleToken.TokenID);
    }

    const added: string[] = _.difference(finalTokens, previousTokens);
    const removed: string[] = _.difference(previousTokens, finalTokens);

    if (added.length > 0) {
      for (const nonFungibleToken of finalNFTokens) {
        if (added.includes(nonFungibleToken.NonFungibleToken.TokenID)) {
          const tokenID = nonFungibleToken.NonFungibleToken.TokenID;
          const uri = nonFungibleToken.NonFungibleToken.URI;

          let account = this.tx.Account;
          const status = "added";
          if (this.tx.TransactionType === "NFTokenAcceptOffer") {
            const offerNode = this.findNFTokenAcceptOfferNode(tokenID);
            if (offerNode) {
              const offerLedgerIndex = offerNode.LedgerIndex;
              if (this.tx.BuyOffer === offerLedgerIndex) {
                account = offerNode.FinalFields.Owner;
              }
              // NFTokenPage is not affected by NFTokenAcceptOffer
            } else {
              const accountRoot = this.findAccountRootModifiedNode(previousTxnID);
              account = accountRoot?.FinalFields?.Account;
              if (!account) {
                const deletedPage = this.findNFTokenPageDeletedNode(ledgerIndex);
                const deletedPreviousTxnID = deletedPage?.FinalFields?.PreviousTxnID;
                if (deletedPreviousTxnID) {
                  const accountRoot = this.findAccountRootModifiedNode(deletedPreviousTxnID);
                  account = accountRoot?.FinalFields?.Account;
                }
              }
            }
          }
          if (account !== undefined) {
            this.addChange(account, { status, tokenID, uri });
          }
        }
      }
    }

    if (removed.length > 0) {
      for (const nonFungibleToken of previousNFTokens) {
        if (removed.includes(nonFungibleToken.NonFungibleToken.TokenID)) {
          const tokenID = nonFungibleToken.NonFungibleToken.TokenID;
          const uri = nonFungibleToken.NonFungibleToken.URI;
          let account = this.tx.Account;
          const status = "removed";
          if (this.tx.TransactionType === "NFTokenAcceptOffer") {
            const offerNode = this.findNFTokenAcceptOfferNode(tokenID);
            if (offerNode) {
              const offerLedgerIndex = offerNode.LedgerIndex;
              if (this.tx.SellOffer === offerLedgerIndex) {
                account = offerNode.FinalFields.Owner;
              }
              // NFTokenPage is not affected by NFTokenAcceptOffer
            } else {
              const accountRoot = this.findAccountRootModifiedNode(previousTxnID);
              account = accountRoot?.FinalFields?.Account;
              if (!account) {
                const deletedPage = this.findNFTokenPageDeletedNode(ledgerIndex);
                const deletedPreviousTxnID = deletedPage?.FinalFields?.PreviousTxnID;
                if (deletedPreviousTxnID) {
                  const accountRoot = this.findAccountRootModifiedNode(deletedPreviousTxnID);
                  account = accountRoot?.FinalFields?.Account;
                }
              }
            }
          }
          if (account !== undefined) {
            this.addChange(account, { status, tokenID, uri });
          }
        }
      }
    }
  }

  private isNFTokensDeleteNode(affectedNode: any): boolean {
    const ledgerEntryType: string = affectedNode.DeletedNode?.LedgerEntryType;
    const nextPageMin: string = affectedNode.DeletedNode?.FinalFields?.NextPageMin;
    const nonFungibleTokens: any[] = affectedNode.DeletedNode?.FinalFields?.NonFungibleTokens;

    return ledgerEntryType === "NFTokenPage" && nextPageMin === undefined && Array.isArray(nonFungibleTokens);
  }

  private parseNFTokensDeleteNode(deleteNode: any): void {
    const previousTxnID: string = deleteNode.DeletedNode?.FinalFields?.PreviousTxnID;
    for (const tokenNode of deleteNode.DeletedNode?.FinalFields?.NonFungibleTokens) {
      this.parseNFTokenDeleteNode(tokenNode, previousTxnID);
    }
  }

  private parseNFTokenDeleteNode(tokenNode: any, previousTxnID: string): void {
    if (!tokenNode.NonFungibleToken) {
      return;
    }

    let account = this.tx.Account;
    let status: string | undefined;
    const tokenID = tokenNode.NonFungibleToken.TokenID;
    const uri = tokenNode.NonFungibleToken.URI;

    if (this.tx.TransactionType === "NFTokenBurn") {
      status = "removed";
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
      } else {
        // NFTokenPage has been deleted and created new one
        status = "removed";
        const accountRoot = this.findAccountRootModifiedNode(previousTxnID);
        account = accountRoot?.FinalFields?.Account;
      }
    }

    if (status !== undefined && account !== undefined) {
      this.addChange(account, { status, tokenID, uri });
    }
  }

  private isNFTokensOfferAccept(affectedNode: any): boolean {
    return (
      this.tx.TransactionType === "NFTokenAcceptOffer" && affectedNode.DeletedNode?.LedgerEntryType === "NFTokenOffer"
    );
  }

  private parseNFTokensOfferAccept(offerNode: any): void {
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

    const uri = this.findNFTokenUri(tokenID);
    this.addChange(owner, { status, tokenID, uri });
  }

  private findNFTokenAcceptOfferNode(tokenID: string): any {
    for (const affectedNode of this.tx.meta.AffectedNodes) {
      const offerLedgerEntryType = affectedNode.DeletedNode?.LedgerEntryType;
      const offerTokenID = affectedNode.DeletedNode?.FinalFields?.TokenID;

      if (offerLedgerEntryType === "NFTokenOffer" && offerTokenID === tokenID) {
        return affectedNode.DeletedNode;
      }
    }

    return undefined;
  }

  private findAccountRootModifiedNode(previousTxnID: string): any {
    for (const affectedNode of this.tx.meta.AffectedNodes) {
      const ledgerEntryType = affectedNode.ModifiedNode?.LedgerEntryType;
      const accountPreviousTxnID = affectedNode.ModifiedNode?.PreviousTxnID;

      if (ledgerEntryType === "AccountRoot" && accountPreviousTxnID === previousTxnID) {
        return affectedNode.ModifiedNode;
      }
    }

    return undefined;
  }

  private findNFTokenPageDeletedNode(nextPageMin: string): any {
    for (const affectedNode of this.tx.meta.AffectedNodes) {
      const ledgerEntryType = affectedNode.DeletedNode?.LedgerEntryType;
      const pageNextPageMin = affectedNode.DeletedNode?.FinalFields?.NextPageMin;

      if (ledgerEntryType === "NFTokenPage" && pageNextPageMin === nextPageMin) {
        return affectedNode.DeletedNode;
      }
    }

    return undefined;
  }

  private findNFTokenUri(tokenID: string): string | undefined {
    for (const affectedNode of this.tx.meta.AffectedNodes) {
      if (affectedNode.CreatedNode?.LedgerEntryType === "NFTokenPage") {
        for (const tokenNode of affectedNode.CreatedNode.NewFields?.NonFungibleTokens) {
          if (tokenNode.NonFungibleToken.TokenID === tokenID) {
            return tokenNode.NonFungibleToken.URI;
          }
        }
      } else if (affectedNode.ModifiedNode?.LedgerEntryType === "NFTokenPage") {
        if (affectedNode?.ModifiedNode?.FinalFields) {
          for (const tokenNode of affectedNode?.ModifiedNode?.FinalFields.NonFungibleTokens) {
            if (tokenNode.NonFungibleToken.TokenID === tokenID) {
              return tokenNode.NonFungibleToken.URI;
            }
          }
        }

        if (affectedNode?.ModifiedNode?.PreviousFields) {
          for (const tokenNode of affectedNode?.ModifiedNode?.PreviousFields.NonFungibleTokens) {
            if (tokenNode.NonFungibleToken.TokenID === tokenID) {
              return tokenNode.NonFungibleToken.URI;
            }
          }
        }
      } else if (affectedNode.DeletedNode?.LedgerEntryType === "NFTokenPage") {
        for (const tokenNode of affectedNode.DeletedNode.FinalFields?.NonFungibleTokens) {
          if (tokenNode.NonFungibleToken.TokenID === tokenID) {
            return tokenNode.NonFungibleToken.URI;
          }
        }
      }
    }

    return undefined;
  }
}
