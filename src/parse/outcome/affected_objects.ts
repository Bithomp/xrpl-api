import { parseNFTokenChanges } from "./nftoken_changes";
import { parseNFTokenOfferChanges } from "./nftoken_offer_changes";
import { parseNFTokenID } from "../../models/account_nfts";
import parseNFTokenFlags from "../ledger/nftoken-flags";
import parseNFTOfferFlags from "../ledger/nftoken-offer-flags";
import parseURITokenFlags from "../ledger/uritoken-flags";
import { removeUndefined } from "../../common";

interface AffectedObjectsInterface {
  nftokens?: any;
  nftokenOffers?: any;
  uritokens?: any;
}

function parseAffectedObjects(tx: any): AffectedObjectsInterface | undefined {
  return new AffectedObjects(tx).call();
}

class AffectedObjects {
  public readonly tx: any;
  public readonly affectedObjects: any;
  private nftChanges?: any;
  private nftOfferChanges?: any;
  private nftokenInfoCache = new Map<string, any>();

  public constructor(tx: any) {
    this.tx = tx;
    this.affectedObjects = {};
    this.nftChanges = undefined;
    this.nftOfferChanges = undefined;
  }

  private getAffectedNodes(): any[] {
    return this.tx.meta?.AffectedNodes ?? this.tx.metaData?.AffectedNodes ?? [];
  }

  public call(): AffectedObjectsInterface | undefined {
    this.parseNFTokens();
    this.parseNFTokenOffers();
    this.parseURITokenChanges();

    if (Object.keys(this.affectedObjects).length > 0) {
      return this.affectedObjects;
    }

    return undefined;
  }

  private getNFTokenChanges(): any {
    if (this.nftChanges) {
      return this.nftChanges;
    }

    this.nftChanges = parseNFTokenChanges(this.tx);

    return this.nftChanges;
  }

  private getNFTokenOfferChanges(): any {
    if (this.nftOfferChanges) {
      return this.nftOfferChanges;
    }

    this.nftOfferChanges = parseNFTokenOfferChanges(this.tx);

    return this.nftOfferChanges;
  }

  private getNFTokensMetadata(nftokenID: string): any {
    if (this.nftokenInfoCache.has(nftokenID)) {
      return this.nftokenInfoCache.get(nftokenID);
    }

    const parsed = parseNFTokenID(nftokenID);
    this.nftokenInfoCache.set(nftokenID, parsed);
    return parsed;
  }

  private parseNFTokens(): void {
    const nftokens = {};
    const nftokenChanges = this.getNFTokenChanges();
    for (const account in nftokenChanges) {
      for (const nftsChange of nftokenChanges[account]) {
        if (nftokens[nftsChange.nftokenID]) {
          continue;
        }

        const nftokenIDInfo = this.getNFTokensMetadata(nftsChange.nftokenID);
        if (nftokenIDInfo) {
          nftokens[nftsChange.nftokenID] = {
            nftokenID: nftsChange.nftokenID,
            flags: parseNFTokenFlags(nftokenIDInfo.Flags),
            transferFee: nftokenIDInfo.TransferFee,
            issuer: nftokenIDInfo.Issuer,
            nftokenTaxon: nftokenIDInfo.NFTokenTaxon,
            sequence: nftokenIDInfo.Sequence,
          };
        }
      }
    }

    const nftokenOfferChanges = this.getNFTokenOfferChanges();
    for (const account in nftokenOfferChanges) {
      for (const nftokenOfferChange of nftokenOfferChanges[account]) {
        if (nftokens[nftokenOfferChange.nftokenID]) {
          continue;
        }

        const nftokenIDInfo = this.getNFTokensMetadata(nftokenOfferChange.nftokenID);
        if (nftokenIDInfo) {
          nftokens[nftokenOfferChange.nftokenID] = {
            nftokenID: nftokenOfferChange.nftokenID,
            flags: parseNFTokenFlags(nftokenIDInfo.Flags),
            transferFee: nftokenIDInfo.TransferFee,
            issuer: nftokenIDInfo.Issuer,
            nftokenTaxon: nftokenIDInfo.NFTokenTaxon,
            sequence: nftokenIDInfo.Sequence,
          };
        }
      }
    }

    if (Object.keys(nftokens).length > 0) {
      this.affectedObjects.nftokens = nftokens;
    }
  }

  private parseNFTokenOffers(): void {
    const nftokenOffers = {};

    const nftokenOfferChanges = this.getNFTokenOfferChanges();
    for (const account in nftokenOfferChanges) {
      for (const nftokenOfferChange of nftokenOfferChanges[account]) {
        if (nftokenOffers[nftokenOfferChange.index]) {
          continue;
        }

        nftokenOffers[nftokenOfferChange.index] = {
          index: nftokenOfferChange.index,
          nftokenID: nftokenOfferChange.nftokenID,
          flags: parseNFTOfferFlags(nftokenOfferChange.flags),
          owner: nftokenOfferChange.owner,
        };
      }
    }

    if (Object.keys(nftokenOffers).length > 0) {
      this.affectedObjects.nftokenOffers = nftokenOffers;
    }
  }

  private parseURITokenChanges(): void {
    const uritokens = {};
    const affectedNodes = this.getAffectedNodes();

    for (const affectedNode of affectedNodes) {
      const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
      if (node?.LedgerEntryType !== "URIToken" || !node?.LedgerIndex) {
        continue;
      }

      const uritokenID = node.LedgerIndex;
      const finalFields = node.FinalFields || {};
      const newFields = node.NewFields || {};

      if (affectedNode.CreatedNode) {
        uritokens[uritokenID] = removeUndefined({
          uritokenID,
          flags: parseURITokenFlags(newFields.Flags),
          uri: newFields.URI,
          digest: newFields.Digest,
          issuer: newFields.Issuer,
          owner: newFields.Owner,
          amount: newFields.Amount,
          destination: newFields.Destination,
        });
      }

      if (affectedNode.ModifiedNode || affectedNode.DeletedNode) {
        uritokens[uritokenID] = removeUndefined({
          uritokenID,
          flags: parseURITokenFlags(finalFields.Flags),
          uri: finalFields.URI,
          digest: finalFields.Digest,
          issuer: finalFields.Issuer,
          owner: finalFields.Owner,
          amount: finalFields.Amount,
          destination: finalFields.Destination,
        });
      }
    }

    if (Object.keys(uritokens).length > 0) {
      this.affectedObjects.uritokens = uritokens;
    }
  }
}

export { parseAffectedObjects };
