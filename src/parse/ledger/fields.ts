import BigNumber from "bignumber.js";
import { AccountSet, SetRegularKey, SignerListSet } from "xrpl";
import { AccountFieldParametersInterface, AccountSetFlags, AccountFields } from "../../models/account_info";

function parseField(info: AccountFieldParametersInterface, value: any) {
  if (info.encoding === "hex" && !info.length) {
    // e.g. "domain"
    return Buffer.from(value, "hex").toString("ascii");
  }
  if (info.shift) {
    return new BigNumber(value).shiftedBy(-info.shift).toNumber();
  }
  return value;
}

function parseFields(tx: AccountSet | SetRegularKey | SignerListSet): object {
  const settings: any = {};
  for (const fieldName in AccountFields) {
    const fieldValue = tx[fieldName];

    // eslint-disable-next-line eqeqeq
    if (fieldValue != null) {
      const info = AccountFields[fieldName];
      settings[info.name] = parseField(info, fieldValue);
    }
  }

  // add extra handling for NFTokenMinter reset by ClearFlag
  if (tx.ClearFlag === AccountSetFlags.authorizedMinter && !settings.nftokenMinter) {
    settings.nftokenMinter = "";
  }

  // Since an account can own at most one SignerList,
  // this array must have exactly one member if it is present.
  if (tx.SignerEntries && Array.isArray(tx.SignerEntries) && tx.SignerEntries.length > 0) {
    settings.signerEntries = tx.SignerEntries.map((entry: any) => {
      return {
        account: entry.SignerEntry.Account,
        signerWeight: entry.SignerEntry.SignerWeight,
      };
    });
  }

  if (tx.SignerQuorum) {
    settings.signerQuorum = tx.SignerQuorum;
  }

  return settings;
}

export default parseFields;
