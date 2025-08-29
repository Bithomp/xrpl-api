import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { hexToString } from "../utils";
import { FormattedCredentialDeleteSpecification } from "../../types/credentials";

function parseCredentialDelete(tx: any): FormattedCredentialDeleteSpecification {
  assert.ok(tx.TransactionType === "CredentialDelete");

  return removeUndefined({
    source: parseSource(tx),
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    issuer: tx.issuer,
    subject: tx.Subject,
    credentialType: hexToString(tx.CredentialType),
    memos: parseMemos(tx),
  });
}

export default parseCredentialDelete;
