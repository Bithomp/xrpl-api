import * as assert from "assert";
import { DepositPreauth, AuthorizeCredential } from "xrpl";
import { removeUndefined, emptyObjectToUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { decodeHexData } from "../utils";
import { FormattedDepositPreauthSpecification, FormattedAuthorizeCredentials } from "../../types/deposits";

function parseCredentials(credential: AuthorizeCredential): FormattedAuthorizeCredentials {
  return {
    issuer: credential.Credential.Issuer,
    type: decodeHexData(credential.Credential.CredentialType),
  };
}

function parseDepositPreauth(tx: DepositPreauth, nativeCurrency?: string): FormattedDepositPreauthSpecification {
  assert.ok(tx.TransactionType === "DepositPreauth");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    authorize: tx.Authorize,
    unauthorize: tx.Unauthorize,
    authorizeCredentials: tx.AuthorizeCredentials ? tx.AuthorizeCredentials.map(parseCredentials) : undefined,
    unauthorizeCredentials: tx.UnauthorizeCredentials ? tx.UnauthorizeCredentials.map(parseCredentials) : undefined,
    emittedDetails: parseEmittedDetails(tx),
    flags: emptyObjectToUndefined(parseTxGlobalFlags(tx.Flags as number, { nativeCurrency })),
    memos: parseMemos(tx),
  });
}

export default parseDepositPreauth;
