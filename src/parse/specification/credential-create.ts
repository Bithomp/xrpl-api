import * as assert from "assert";
import { CredentialCreate } from "xrpl";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { parseTimestamp, decodeHexData } from "../utils";
import { FormattedCredentialCreateSpecification } from "../../types/credentials";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";

function parseCredentialCreate(tx: CredentialCreate, nativeCurrency?: string): FormattedCredentialCreateSpecification {
  assert.ok(tx.TransactionType === "CredentialCreate");

  return removeUndefined({
    source: parseSource(tx),
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    subject: tx.Subject,
    credentialType: decodeHexData(tx.CredentialType),
    expiration: tx.Expiration && parseTimestamp(tx.Expiration),
    uri: tx.URI,
    flags: parseTxGlobalFlags(tx.Flags as number, { nativeCurrency }),
    memos: parseMemos(tx),
  });
}

export default parseCredentialCreate;
