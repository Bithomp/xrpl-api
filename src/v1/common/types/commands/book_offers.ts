import { IssuedCurrency, Amount, OfferLedgerEntry } from "../objects";

export interface BookOffersRequest {
  taker?: string;
  taker_gets: IssuedCurrency;
  taker_pays: IssuedCurrency;
  ledger_hash?: string;
  ledger_index?: number | ("validated" | "closed" | "current");
  limit?: number;
  marker?: any;
}

export interface BookOffersResponse {
  offers: BookOffer[];
  ledger_hash?: string;
  ledger_current_index?: number;
  ledger_index?: number;
  marker?: any;
}

export interface BookOffer extends OfferLedgerEntry {
  quality?: string;
  owner_funds?: string;
  taker_gets_funded?: Amount;
  taker_pays_funded?: Amount;
}
