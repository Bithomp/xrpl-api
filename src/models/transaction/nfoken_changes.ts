import * as _ from "lodash";
import AddressCodec = require("ripple-address-codec");
import { removeUndefined } from "../../v1/common";

export function parseNonFungibleTokenChanges(tx: object): object {
  return new NonFungibleTokenChanges(tx).call();
}

interface AccountNFTockenChangesInterface {
  status: string;
  nftokenID: string;
  uri?: string;
}

class NonFungibleTokenChanges {
  public readonly tx: any;
  public readonly changes: any;
  private readonly affectedAccounts: string[];
  private readonly finalNonFungibleTokens: any;
  private readonly previousNonFungibleTokens: any;

  public constructor(tx: any) {
    this.tx = tx;
    this.changes = {};
    this.affectedAccounts = [];
    this.finalNonFungibleTokens = {};
    this.previousNonFungibleTokens = {};
  }

  public call(): any {
    if (this.hasAffectedNodes() === false) {
      return this.changes;
    }

    this.parseAffectedNodes();
    this.parseNonFungibleTokensChanges();

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

  private addChange(account: string, change: AccountNFTockenChangesInterface): void {
    if (!this.changes[account]) {
      this.changes[account] = [];
    }

    this.changes[account].push(removeUndefined(change));
  }

  private parseAffectedNodes(): void {
    for (const affectedNode of this.tx.meta.AffectedNodes) {
      const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
      if (node?.LedgerEntryType === "NFTokenPage" && node?.LedgerIndex) {
        const account = AddressCodec.encodeAccountID(Buffer.from(node?.LedgerIndex.slice(0, 40), "hex"));

        if (this.affectedAccounts.includes(account) === false) {
          this.affectedAccounts.push(account);
        }

        if (affectedNode.CreatedNode) {
          this.parseFinalNonFungibleTokens(account, node.NewFields?.NFTokens);
        }

        if (
          (affectedNode.ModifiedNode || affectedNode.DeletedNode) &&
          Array.isArray(node.PreviousFields?.NFTokens)
        ) {
          this.parseFinalNonFungibleTokens(account, node.FinalFields?.NFTokens);
          this.parsePreviousNonFungibleTokens(account, node.PreviousFields?.NFTokens);
        }

        if (affectedNode.DeletedNode && node.PreviousFields === undefined) {
          this.parsePreviousNonFungibleTokens(account, node.FinalFields?.NFTokens);
        }
      }
    }
  }

  private parseFinalNonFungibleTokens(account: string, nonFungibleTokens: any): void {
    if (this.finalNonFungibleTokens[account] === undefined) {
      this.finalNonFungibleTokens[account] = [];
    }

    if (Array.isArray(nonFungibleTokens)) {
      this.finalNonFungibleTokens[account] = _.concat(this.finalNonFungibleTokens[account], nonFungibleTokens);
    }
  }

  private parsePreviousNonFungibleTokens(account: string, nonFungibleTokens: any): void {
    if (this.previousNonFungibleTokens[account] === undefined) {
      this.previousNonFungibleTokens[account] = [];
    }

    if (Array.isArray(nonFungibleTokens)) {
      this.previousNonFungibleTokens[account] = _.concat(this.previousNonFungibleTokens[account], nonFungibleTokens);
    }
  }

  private parseNonFungibleTokensChanges(): void {
    for (const account of this.affectedAccounts) {
      let finalTokens: string[] = [];
      if (Array.isArray(this.finalNonFungibleTokens[account])) {
        finalTokens = this.finalNonFungibleTokens[account].map(
          (nonFungibleToken: any) => nonFungibleToken.NFToken.NFTokenID
        );
        finalTokens = [...new Set(finalTokens)];
      }

      let previousTokens: string[] = [];
      if (Array.isArray(this.previousNonFungibleTokens[account])) {
        previousTokens = this.previousNonFungibleTokens[account].map(
          (nonFungibleToken: any) => nonFungibleToken.NFToken.NFTokenID
        );
        previousTokens = [...new Set(previousTokens)];
      }

      const added: string[] = _.difference(finalTokens, previousTokens);
      const removed: string[] = _.difference(previousTokens, finalTokens);

      for (const nftokenID of added) {
        const uri = this.findNFTokenUri(nftokenID);
        this.addChange(account, {
          status: "added",
          nftokenID,
          uri,
        });
      }

      for (const nftokenID of removed) {
        const uri = this.findNFTokenUri(nftokenID);
        this.addChange(account, {
          status: "removed",
          nftokenID,
          uri,
        });
      }
    }
  }

  private findNFTokenUri(nftokenID: string): string | undefined {
    for (const affectedNode of this.tx.meta.AffectedNodes) {
      const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
      if (node?.LedgerEntryType === "NFTokenPage") {
        if (Array.isArray(node.NewFields?.NFTokens)) {
          for (const tokenNode of node.NewFields?.NFTokens) {
            if (tokenNode.NFToken.NFTokenID === nftokenID) {
              return tokenNode.NFToken.URI;
            }
          }
        }

        if (Array.isArray(node.FinalFields?.NFTokens)) {
          for (const tokenNode of node.FinalFields?.NFTokens) {
            if (tokenNode.NFToken.NFTokenID === nftokenID) {
              return tokenNode.NFToken.URI;
            }
          }
        }

        if (Array.isArray(node.PreviousFields?.NFTokens)) {
          for (const tokenNode of node.PreviousFields?.NFTokens) {
            if (tokenNode.NFToken.NFTokenID === nftokenID) {
              return tokenNode.NFToken.URI;
            }
          }
        }
      }
    }

    return undefined;
  }
}
