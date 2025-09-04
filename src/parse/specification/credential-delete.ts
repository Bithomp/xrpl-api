import * as assert from "assert";
import { CredentialDelete } from "xrpl";
import { removeUndefined } from "../../common";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { hexToString } from "../utils";
import { FormattedCredentialDeleteSpecification } from "../../types/credentials";

function parseCredentialDelete(tx: CredentialDelete, nativeCurrency?: string): FormattedCredentialDeleteSpecification {
  assert.ok(tx.TransactionType === "CredentialDelete");

  return removeUndefined({
    source: parseSource(tx),
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    issuer: tx.Issuer,
    subject: tx.Subject,
    credentialType: hexToString(tx.CredentialType),
    flags: parseTxGlobalFlags(tx.Flags as number, { nativeCurrency }),
    memos: parseMemos(tx),
  });
}

export default parseCredentialDelete;
