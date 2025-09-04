import { PaymentFlags } from "xrpl";
import { FormattedBaseSpecification } from "./specification";
import { FormattedSourceAddress, FormattedDestinationAddress } from "./account";
import { TxGlobalFlagsKeysInterface, getTxGlobalFlagsKeys } from "./global";
import { MAINNET_NATIVE_CURRENCY } from "../common";

export const PaymentFlagsKeys = {
  noRippleDirect: PaymentFlags.tfNoRippleDirect,
  partialPayment: PaymentFlags.tfPartialPayment,
  limitQuality: PaymentFlags.tfLimitQuality,
};

const nativeCurrencyPaymentFlags = {};

export function getPaymentFlagsKeys(nativeCurrency?: string): Record<string, number> {
  if (!nativeCurrency) {
    nativeCurrency = MAINNET_NATIVE_CURRENCY; // eslint-disable-line no-param-reassign
  }

  if (!nativeCurrencyPaymentFlags[nativeCurrency]) {
    nativeCurrencyPaymentFlags[nativeCurrency] = {
      ...getTxGlobalFlagsKeys(nativeCurrency),
      ...PaymentFlagsKeys,
    };
  }

  return nativeCurrencyPaymentFlags[nativeCurrency];
}

export interface PaymentKeysInterface extends TxGlobalFlagsKeysInterface {
  noRippleDirect?: boolean;
  partialPayment?: boolean;
  limitQuality?: boolean;
}

export type FormattedPaymentSpecification = {
  source?: FormattedSourceAddress;
  destination?: FormattedDestinationAddress;
  invoiceID?: string;
  paths?: string;
  allowPartialPayment?: boolean;
  noDirectRipple?: boolean;
  limitQuality?: boolean;
} & FormattedBaseSpecification;
