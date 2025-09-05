import _ from "lodash";
import { AccountSet, SetRegularKey, SignerListSet } from "xrpl";
import * as assert from "assert";
import { getAccountRootFlagsKeys } from "../../models/account_info";
import { removeUndefined } from "../../common";
import parseFields from "../ledger/fields";
import { parseEmittedDetails } from "../ledger/emit_details";
import parseTxAccountSetFlags from "../ledger/tx-account-set-flags";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";

function getAccountRootModifiedNode(tx: any) {
  const modifiedNodes = tx.meta.AffectedNodes.filter((node) => node.ModifiedNode?.LedgerEntryType === "AccountRoot");
  assert.ok(modifiedNodes.length === 1);
  return modifiedNodes[0].ModifiedNode;
}

function parseSettingsFlags(tx: AccountSet): any {
  const settings: any = {};
  if (tx.TransactionType !== "AccountSet") {
    return settings;
  }

  const node = getAccountRootModifiedNode(tx);
  const oldFlags = _.get(node.PreviousFields, "Flags");
  const newFlags = _.get(node.FinalFields, "Flags");

  // eslint-disable-next-line eqeqeq
  if (oldFlags != null && newFlags != null) {
    // eslint-disable-next-line no-bitwise
    const changedFlags = oldFlags ^ newFlags;
    // eslint-disable-next-line no-bitwise
    const setFlags = newFlags & changedFlags;
    // eslint-disable-next-line no-bitwise
    const clearedFlags = oldFlags & changedFlags;

    Object.entries(getAccountRootFlagsKeys()).forEach((entry) => {
      const [flagName, flagValue] = entry;
      // eslint-disable-next-line no-bitwise
      if (setFlags & flagValue) {
        settings[flagName] = true;
        // eslint-disable-next-line no-bitwise
      } else if (clearedFlags & flagValue) {
        settings[flagName] = false;
      }
    });
  }

  // enableTransactionIDTracking requires a special case because it
  // does not affect the Flags field; instead it adds/removes a field called
  // "AccountTxnID" to/from the account root.

  const oldField = _.get(node.PreviousFields, "AccountTxnID");
  const newField = _.get(node.FinalFields, "AccountTxnID");
  if (newField && !oldField) {
    settings.enableTransactionIDTracking = true;
  } else if (oldField && !newField) {
    settings.enableTransactionIDTracking = false;
  }

  return settings;
}

function parseSettings(tx: AccountSet | SetRegularKey | SignerListSet, nativeCurrency?: string) {
  const txType = tx.TransactionType;
  assert.ok(txType === "AccountSet" || txType === "SetRegularKey" || txType === "SignerListSet");

  const baseSettings = removeUndefined({
    source: parseSource(tx),
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    emittedDetails: parseEmittedDetails(tx),
    flags: parseTxAccountSetFlags(tx.Flags as number, { nativeCurrency }),
    memos: parseMemos(tx),
  });

  return Object.assign(baseSettings, parseSettingsFlags(tx as AccountSet), parseFields(tx));
}

export default parseSettings;
