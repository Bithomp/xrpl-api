import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { parseDestination } from "../ledger/destination";
import parseURITokenFlags from "../ledger/uritoken-flags";
import { Amount } from "../../types";
import { URITokenFlagsKeysInterface } from "../../types/uritokens";
import { FormattedRemitsSpecification } from "../../types/remits";

// [
//   {
//      "AmountEntry" : {
//         "Amount" : "123"
//      }
//   },
//   {
//      "AmountEntry" : {
//         "Amount" : {
//            "currency" : "USD",
//            "issuer" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
//            "value" : "10"
//         }
//      }
//   },
//   {
//      "AmountEntry" : {
//         "Amount" : {
//            "currency" : "ABC",
//            "issuer" : "rpfZurEGaJvpioTaxYpjh1EAtMXFN1HdtB",
//            "value" : "12"
//         }
//      }
//   }
// ],
function parseAmounts(amounts?: { AmountEntry: { Amount: Amount } }[]): Amount[] | undefined {
  if (!amounts) {
    return undefined;
  }

  const result: Amount[] = [];
  for (const amount of amounts) {
    if (amount.AmountEntry.Amount) {
      result.push(amount.AmountEntry.Amount);
    }
  }

  if (result.length === 0) {
    return undefined;
  }

  return result;
}

function parseMintURIToken(mintURIToken?: {
  URI: string;
  Flags?: number;
  Digest?: string;
}): { uri: string; flags?: URITokenFlagsKeysInterface; digest?: string } | undefined {
  if (!mintURIToken) {
    return undefined;
  }

  return removeUndefined({
    uri: mintURIToken.URI,
    flags: parseURITokenFlags(mintURIToken.Flags ?? 0),
    digest: mintURIToken.Digest,
  });
}

function parseRemit(tx: any): FormattedRemitsSpecification {
  assert.ok(tx.TransactionType === "Remit");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    source: parseSource(tx),
    destination: parseDestination(tx),
    amounts: parseAmounts(tx.Amounts),
    uritokenIDs: tx.URITokenIDs,
    uritokenMint: parseMintURIToken(tx.MintURIToken),
    blob: tx.Blob,
    inform: tx.Inform,
    invoiceID: tx.InvoiceID,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseRemit;
