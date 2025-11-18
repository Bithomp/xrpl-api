import _ from "lodash";
import { AccountRootFlagsKeysInterface, AccountSetFlags } from "../../models/account_info";

import { XAHAU_NATIVE_CURRENCY } from "../../common";
import { getNativeCurrency } from "../../client";

export function parseAccountSettingsFlags(setFlag?: number, clearFlag?: number): AccountRootFlagsKeysInterface {
  const settings: AccountRootFlagsKeysInterface = {};
  if (setFlag === undefined && clearFlag === undefined) {
    return settings;
  }

  const key = setFlag !== undefined ? setFlag : clearFlag;
  const value = setFlag !== undefined ? true : false;

  switch (key) {
    case AccountSetFlags.requireDestinationTag:
      settings.requireDestTag = value;
      break;
    case AccountSetFlags.requireAuthorization:
      settings.requireAuth = value;
      break;
    case AccountSetFlags.depositAuth:
      settings.depositAuth = value;
      break;
    case AccountSetFlags.disallowIncomingXRP:
      settings.disallowXRP = value;
      break;
    case AccountSetFlags.disableMasterKey:
      settings.disableMaster = value;
      break;
    case AccountSetFlags.enableTransactionIDTracking:
      settings.enableTransactionIDTracking = value;
      break;
    case AccountSetFlags.noFreeze:
      settings.noFreeze = value;
      break;
    case AccountSetFlags.globalFreeze:
      settings.globalFreeze = value;
      break;
    case AccountSetFlags.defaultRipple:
      settings.defaultRipple = value;
      break;
    case AccountSetFlags.disallowIncomingNFTokenOffer:
      settings.disallowIncomingNFTokenOffer = value;
      break;
    case AccountSetFlags.disallowIncomingCheck:
      settings.disallowIncomingCheck = value;
      break;
    case AccountSetFlags.disallowIncomingPayChan:
      settings.disallowIncomingPayChan = value;
      break;
    case AccountSetFlags.disallowIncomingTrustline:
      settings.disallowIncomingTrustline = value;
      break;
  }

  const nativeCurrency = getNativeCurrency();
  if (nativeCurrency === XAHAU_NATIVE_CURRENCY) {
    // Xahau specific
    switch (key) {
      case AccountSetFlags.tshCollect:
        settings.tshCollect = value;
        break;
      case AccountSetFlags.disallowIncomingRemit:
        settings.disallowIncomingRemit = value;
        break;
    }
  } else {
    // XRPL specific
    switch (key) {
      case AccountSetFlags.allowTrustLineClawback:
        settings.allowTrustLineClawback = value;
        break;
      case AccountSetFlags.allowTrustLineLocking:
        settings.allowTrustLineLocking = value;
        break;
    }
  }

  return settings;
}
