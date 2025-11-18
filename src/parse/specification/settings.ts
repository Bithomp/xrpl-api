import _ from "lodash";
import { AccountSet, SetRegularKey, SignerListSet } from "xrpl";
import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseAccountFields from "../ledger/account-fields";
import { parseEmittedDetails } from "../ledger/emit_details";
import parseTxAccountSetFlags from "../ledger/tx-account-set-flags";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { parseAccountSettingsFlags } from "../ledger/account-settings-flags";
import { FormattedSettingsSpecification } from "../../types/settings";

function parseSettings(
  tx: AccountSet | SetRegularKey | SignerListSet,
  nativeCurrency?: string
): FormattedSettingsSpecification {
  const txType = tx.TransactionType;
  assert.ok(txType === "AccountSet" || txType === "SetRegularKey" || txType === "SignerListSet");

  const baseSettings: FormattedSettingsSpecification = removeUndefined({
    source: parseSource(tx),
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    emittedDetails: parseEmittedDetails(tx),
    flags: parseTxAccountSetFlags(tx.Flags as number, { nativeCurrency }),
    memos: parseMemos(tx),
  });

  return Object.assign(
    baseSettings,
    parseAccountFields(tx),
    parseAccountSettingsFlags(tx.SetFlag as number, tx.ClearFlag as number)
  );
}

export default parseSettings;
