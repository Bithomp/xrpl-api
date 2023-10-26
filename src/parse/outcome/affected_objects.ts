import { parseNFTokenChanges } from "./nftoken_changes";
import { parseNFTokenOfferChanges } from "./nftoken_offer_changes";
import { parseNFTokenID } from "../../models/account_nfts";
import { parseURITokenChanges } from "./uritoken_changes";
import parseNFTokenFlags from "../ledger/nftoken-flags";
import parseNFTOfferFlags from "../ledger/nftoken-offer-flags";
import parseURITokenFlags from "../ledger/uri-token-flags";
import { removeUndefined } from "../../common";

interface AffectedObjectsInterface {
  nftokens?: any;
  nftokenOffers?: any;
}

function parseAffectedObjects(tx: any): AffectedObjectsInterface | undefined {
  return new AffectedObjects(tx).call();
}

class AffectedObjects {
  public readonly tx: any;
  public readonly affectedObjects: any;
  private nftChanges?: any;
  private nftOfferChanges?: any;
  private uritokenChanges?: any;

  public constructor(tx: any) {
    this.tx = tx;
    this.affectedObjects = {};
    this.nftChanges = undefined;
    this.nftOfferChanges = undefined;
    this.uritokenChanges = undefined;
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

  private getURITokenChanges(): any {
    if (this.uritokenChanges) {
      return this.uritokenChanges;
    }

    this.uritokenChanges = parseURITokenChanges(this.tx);

    return this.uritokenChanges;
  }

  private parseNFTokens(): void {
    const nftokens = {};
    const nftokenChanges = this.getNFTokenChanges();
    // tslint:disable-next-line:forin
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
    // tslint:disable-next-line:forin
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
    // tslint:disable-next-line:forin
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
    const uritokenChanges = this.getURITokenChanges();

    for (const uritokenID in uritokenChanges) {
      const uritokenChange = uritokenChanges[uritokenID];
      uritokens[uritokenChange.uritokenID] = removeUndefined({
        uritokenID: uritokenChange.uritokenID,
        flags: parseURITokenFlags(uritokenChange.flags),
        uri: uritokenChange.uri,
        digest: uritokenChange.digest,
        issuer: uritokenChange.issuer,
        owner: uritokenChange.owner,
        amount: uritokenChange.amount,
        destination: uritokenChange.destination,
      });
    }

    if (Object.keys(uritokens).length > 0) {
      this.affectedObjects.uritokens = uritokens;
    }
  }
}

export { parseAffectedObjects };
