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

  public constructor(tx: any) {
    this.tx = tx;
    this.affectedObjects = {};
    this.nftChanges = undefined;
    this.nftOfferChanges = undefined;
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

  private parseNFTokens(): void {
    const nftokens = {};
    const nftokenChanges = this.getNFTokenChanges();
    for (const account in nftokenChanges) {
      for (const nftsChange of nftokenChanges[account]) {
        if (nftokens[nftsChange.nftokenID]) {
          continue;
        }

        const nftokenIDInfo = parseNFTokenID(nftsChange.nftokenID);
        if (nftokenIDInfo) {
          nftokens[nftsChange.nftokenID] = {
            nftokenID: nftsChange.nftokenID,
            // uri: nftsChange.uri,
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

        const nftokenIDInfo = parseNFTokenID(nftokenOfferChange.nftokenID);
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

    for (const affectedNode of this.tx.meta.AffectedNodes) {
      const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
      if (node?.LedgerEntryType === "URIToken" && node?.LedgerIndex) {
        const uritokenID = node.LedgerIndex;

        if (affectedNode.CreatedNode) {
          uritokens[uritokenID] = removeUndefined({
            uritokenID,
            flags: parseURITokenFlags(node.NewFields.Flags),
            uri: node.NewFields.URI,
            digest: node.NewFields.Digest,
            issuer: node.NewFields.Issuer,
            owner: node.NewFields.Owner,
            amount: node.NewFields.Amount,
            destination: node.NewFields.Destination,
          });
        }

        if (affectedNode.ModifiedNode || affectedNode.DeletedNode) {
          uritokens[uritokenID] = removeUndefined({
            uritokenID,
            flags: parseURITokenFlags(node.FinalFields.Flags),
            uri: node.FinalFields.URI,
            digest: node.FinalFields.Digest,
            issuer: node.FinalFields.Issuer,
            owner: node.FinalFields.Owner,
            amount: node.FinalFields.Amount,
            destination: node.FinalFields.Destination,
          });
        }
      }
    }

    if (Object.keys(uritokens).length > 0) {
      this.affectedObjects.uritokens = uritokens;
    }
  }
}

export { parseAffectedObjects };
