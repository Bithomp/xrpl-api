import _ from "lodash";
import { TransactionMetadata, ModifiedNode } from "xrpl";

import { getAccountRootFlagsKeys, AccountRootFlagsKeysInterface, AccountFields } from "../../models/account_info";
import { parseField } from "../ledger/account-fields";

function summarizeSetting(modifiedNode: any): AccountRootFlagsKeysInterface {
  const settings: AccountRootFlagsKeysInterface = {};

  const oldFlags = _.get(modifiedNode.PreviousFields, "Flags");
  const newFlags = _.get(modifiedNode.FinalFields, "Flags");

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
  const oldAccountTxnIDField = _.get(modifiedNode.PreviousFields, "AccountTxnID");
  const newAccountTxnIDField = _.get(modifiedNode.FinalFields, "AccountTxnID");
  if (newAccountTxnIDField && !oldAccountTxnIDField) {
    settings.enableTransactionIDTracking = true;
  } else if (oldAccountTxnIDField && !newAccountTxnIDField) {
    settings.enableTransactionIDTracking = false;
  }

  // domain, emailHash, messageKey, etc.
  for (const fieldName in AccountFields) {
    const oldFieldValue = _.get(modifiedNode.PreviousFields, fieldName);
    const newFieldValue = _.get(modifiedNode.FinalFields, fieldName);

    if (oldFieldValue !== undefined && newFieldValue !== undefined && oldFieldValue !== newFieldValue) {
      const info = AccountFields[fieldName];
      settings[info.name] = parseField(info, newFieldValue);
    } else if (oldFieldValue !== undefined && newFieldValue === undefined) {
      // field was removed
      const info = AccountFields[fieldName];
      settings[info.name] = null;
    }
  }

  return settings;
}

function parseAccountSettingChanges(metadata: TransactionMetadata): AccountRootFlagsKeysInterface | undefined {
  const affectedNodes = metadata.AffectedNodes.filter((affectedNode: any) => {
    if (!affectedNode.ModifiedNode) {
      return false;
    }

    const node = affectedNode.ModifiedNode;
    return node.LedgerEntryType === "AccountRoot";
  });

  if (affectedNodes.length !== 1) {
    return undefined;
  }

  const modifiedNode = (affectedNodes[0] as ModifiedNode).ModifiedNode;

  const settings = summarizeSetting(modifiedNode);

  if (Object.keys(settings).length === 0) {
    return undefined;
  }

  return settings;
}

export { parseAccountSettingChanges };
