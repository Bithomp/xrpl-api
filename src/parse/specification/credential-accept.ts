import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { hexToString } from "../utils";
import { FormattedCredentialAcceptSpecification } from "../../types/credentials";

function parseCredentialAccept(tx: any): FormattedCredentialAcceptSpecification {
  assert.ok(tx.TransactionType === "CredentialAccept");

  return removeUndefined({
    source: parseSource(tx),
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    issuer: tx.Issuer,
    credentialType: hexToString(tx.CredentialType),
    memos: parseMemos(tx),
  });
}

export default parseCredentialAccept;
