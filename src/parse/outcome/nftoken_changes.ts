import _ from "lodash";
import * as AddressCodec from "ripple-address-codec";
import { removeUndefined } from "../../common";

export function parseNFTokenChanges(tx: object): object {
  return new NFTokenChanges(tx).call();
}

interface AccountNFTokenChangesInterface {
  status: "added" | "removed" | "modified";
  nftokenID: string;
  uri?: string;
  previousURI?: string; // for modify
}

class NFTokenChanges {
  public readonly tx: any;
  public readonly changes: any;
  private readonly affectedAccounts: string[];
  private readonly finalNFTokens: any;
  private readonly previousNFTokens: any;

  public constructor(tx: any) {
    this.tx = tx;
    this.changes = {};
    this.affectedAccounts = [];
    this.finalNFTokens = {};
    this.previousNFTokens = {};
  }

  public call(): any {
    if (this.hasAffectedNodes() === false) {
      return this.changes;
    }

    if (this.tx.TransactionType === "NFTokenModify") {
      this.parseNFTokensURIChanges();
    } else {
      this.parseAffectedNodes();
      this.parseNFTokensChanges();
    }

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

  private addChange(account: string, change: AccountNFTokenChangesInterface): void {
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
          this.parseFinalNFTokens(account, node.NewFields?.NFTokens);
        }

        if ((affectedNode.ModifiedNode || affectedNode.DeletedNode) && Array.isArray(node.PreviousFields?.NFTokens)) {
          this.parseFinalNFTokens(account, node.FinalFields?.NFTokens);
          this.parsePreviousNFTokens(account, node.PreviousFields?.NFTokens);
        }

        if (affectedNode.DeletedNode && node.PreviousFields === undefined) {
          this.parsePreviousNFTokens(account, node.FinalFields?.NFTokens);
        }
      }
    }
  }

  private parseFinalNFTokens(account: string, NFTokens: any): void {
    if (this.finalNFTokens[account] === undefined) {
      this.finalNFTokens[account] = [];
    }

    if (Array.isArray(NFTokens)) {
      this.finalNFTokens[account] = _.concat(this.finalNFTokens[account], NFTokens);
    }
  }

  private parsePreviousNFTokens(account: string, NFTokens: any): void {
    if (this.previousNFTokens[account] === undefined) {
      this.previousNFTokens[account] = [];
    }

    if (Array.isArray(NFTokens)) {
      this.previousNFTokens[account] = _.concat(this.previousNFTokens[account], NFTokens);
    }
  }

  private parseNFTokensChanges(): void {
    for (const account of this.affectedAccounts) {
      let finalTokens: string[] = [];
      if (Array.isArray(this.finalNFTokens[account])) {
        finalTokens = this.finalNFTokens[account].map((NFToken: any) => NFToken.NFToken.NFTokenID);
        finalTokens = [...new Set(finalTokens)];
      }

      let previousTokens: string[] = [];
      if (Array.isArray(this.previousNFTokens[account])) {
        previousTokens = this.previousNFTokens[account].map((NFToken: any) => NFToken.NFToken.NFTokenID);
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

  private parseNFTokensURIChanges(): void {
    // const account = this.tx.Owner;
    const nftokenID = this.tx.NFTokenID;

    const nftokenChanges = this.findNFTokenChangedNode(nftokenID);
    if (!nftokenChanges) {
      return;
    }

    const [currentTokenNode, previousTokenNode] = nftokenChanges;
    const uri = currentTokenNode?.URI;
    const previousURI = previousTokenNode?.URI;
    if (uri === previousURI) {
      return;
    }

    this.addChange(currentTokenNode.account, {
      status: "modified",
      nftokenID,
      uri,
      previousURI,
    });
  }

  private findNFTokenChangedNode(nftokenID: string): any {
    let currentTokenNode: any;
    let previousTokenNode: any;

    for (const affectedNode of this.tx.meta.AffectedNodes) {
      const node = affectedNode.ModifiedNode;
      if (node?.LedgerEntryType === "NFTokenPage") {
        if (Array.isArray(node.FinalFields?.NFTokens)) {
          for (const tokenNode of node.FinalFields?.NFTokens) {
            if (tokenNode.NFToken.NFTokenID === nftokenID) {
              currentTokenNode = tokenNode.NFToken;

              const account = AddressCodec.encodeAccountID(Buffer.from(node?.LedgerIndex.slice(0, 40), "hex"));
              currentTokenNode.account = account;

              // early return if we have both current and previous token nodes
              if (currentTokenNode && previousTokenNode) {
                return [currentTokenNode, previousTokenNode];
              }
            }
          }
        }

        if (Array.isArray(node.PreviousFields?.NFTokens)) {
          for (const tokenNode of node.PreviousFields?.NFTokens) {
            if (tokenNode.NFToken.NFTokenID === nftokenID) {
              previousTokenNode = tokenNode.NFToken;

              // early return if we have both current and previous token nodes
              if (currentTokenNode && previousTokenNode) {
                return [currentTokenNode, previousTokenNode];
              }
            }
          }
        }
      }
    }

    if (!currentTokenNode || !previousTokenNode) {
      // If we don't find both current and previous token nodes, return undefined
      return undefined;
    }

    // return both current and previous token nodes
    return [currentTokenNode, previousTokenNode];
  }
}
