import * as assert from "assert";
import { PermissionedDomainSet } from "xrpl";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { FormattedPermissionedDomainSetSpecification } from "../../types/credentials";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";
import { parseCredentials } from "../ledger/credential";


function parsePermissionedDomainSet(
  tx: PermissionedDomainSet,
  nativeCurrency?: string
): FormattedPermissionedDomainSetSpecification {
  assert.ok(tx.TransactionType === "PermissionedDomainSet");

  return removeUndefined({
    source: parseSource(tx),
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    acceptedCredentials: tx.AcceptedCredentials ? tx.AcceptedCredentials.map(parseCredentials) : undefined,
    flags: parseTxGlobalFlags(tx.Flags as number, { nativeCurrency }),
    memos: parseMemos(tx),
  });
}

export default parsePermissionedDomainSet;
