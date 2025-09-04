import { BatchFlags } from "xrpl/dist/npm/models/transactions/batch";
import { FormattedBaseSpecification } from "./specification";
import { FormattedTransaction } from "../parse/transaction";
import { TxGlobalFlagsKeysInterface, getTxGlobalFlagsKeys } from "./global";
import { MAINNET_NATIVE_CURRENCY } from "../common";

const nativeCurrencyBatchFlags = {};

export const BatchFlagsKeys = {
  allOrNothing: BatchFlags.tfAllOrNothing,
  onlyOne: BatchFlags.tfOnlyOne,
  untilFailure: BatchFlags.tfUntilFailure,
  independent: BatchFlags.tfIndependent,
};

export function getBatchFlagsKeys(nativeCurrency?: string): Record<string, number> {
  if (!nativeCurrency) {
    nativeCurrency = MAINNET_NATIVE_CURRENCY; // eslint-disable-line no-param-reassign
  }

  if (!nativeCurrencyBatchFlags[nativeCurrency]) {
    nativeCurrencyBatchFlags[nativeCurrency] = {
      ...getTxGlobalFlagsKeys(nativeCurrency),
      ...BatchFlagsKeys,
    };
  }

  return nativeCurrencyBatchFlags[nativeCurrency];
}

export interface BatchFlagsKeysInterface extends TxGlobalFlagsKeysInterface {
  allOrNothing?: boolean;
  onlyOne?: boolean;
  untilFailure?: boolean;
  independent?: boolean;
}

export type FormattedBatchSpecification = {
  transactions: FormattedTransaction[];
  flags?: BatchFlagsKeysInterface;
} & FormattedBaseSpecification;
