import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { parseTimestamp, decodeHexData } from "../utils";
import { FormattedCredentialCreateSpecification } from "../../types/credentials";

function parseCredentialCreate(tx: any): FormattedCredentialCreateSpecification {
  assert.ok(tx.TransactionType === "CredentialCreate");

  return removeUndefined({
    source: parseSource(tx),
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    subject: tx.Subject,
    credentialType: decodeHexData(tx.CredentialType),
    expiration: tx.Expiration && parseTimestamp(tx.Expiration),
    uri: tx.URI,
    memos: parseMemos(tx),
  });
}

export default parseCredentialCreate;
