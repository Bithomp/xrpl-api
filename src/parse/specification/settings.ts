import _ from "lodash";
import * as assert from "assert";
import { AccountRootFlagsKeys } from "../../models/account_info";
import { removeUndefined } from "../../common";
import parseFields from "../ledger/fields";
import parseMemos from "../ledger/memos";

function getAccountRootModifiedNode(tx: any) {
  const modifiedNodes = tx.meta.AffectedNodes.filter((node) => node.ModifiedNode?.LedgerEntryType === "AccountRoot");
  assert.ok(modifiedNodes.length === 1);
  return modifiedNodes[0].ModifiedNode;
}

function parseSettingsFlags(tx: any): any {
  const settings: any = {};
  if (tx.TransactionType !== "AccountSet") {
    return settings;
  }

  const node = getAccountRootModifiedNode(tx);
  const oldFlags = _.get(node.PreviousFields, "Flags");
  const newFlags = _.get(node.FinalFields, "Flags");

  if (oldFlags != null && newFlags != null) {
    // tslint:disable-next-line:no-bitwise
    const changedFlags = oldFlags ^ newFlags;
    // tslint:disable-next-line:no-bitwise
    const setFlags = newFlags & changedFlags;
    // tslint:disable-next-line:no-bitwise
    const clearedFlags = oldFlags & changedFlags;
    Object.entries(AccountRootFlagsKeys).forEach((entry) => {
      const [flagName, flagValue] = entry;
      // tslint:disable-next-line:no-bitwise
      if (setFlags & flagValue) {
        settings[flagName] = true;
        // tslint:disable-next-line:no-bitwise
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

function parseSettings(tx: any) {
  const txType = tx.TransactionType;
  assert.ok(txType === "AccountSet" || txType === "SetRegularKey" || txType === "SignerListSet");

  const baseSettings = removeUndefined({
    memos: parseMemos(tx),
  });

  return Object.assign(baseSettings, parseSettingsFlags(tx), parseFields(tx));
}

export default parseSettings;
