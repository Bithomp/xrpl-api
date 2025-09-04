import { AMMDepositFlags, AMMWithdrawFlags, AMMClawbackFlags } from "xrpl";
import { FormattedBaseSpecification } from "./specification";
import { FormattedAmount, FormattedIssuedCurrency } from "./amounts";
import { TxGlobalFlagsKeysInterface, getTxGlobalFlagsKeys } from "./global";
import { MAINNET_NATIVE_CURRENCY } from "../common";

export interface VoteSlotInterface {
  VoteEntry: {
    Account: string;
    TradingFee: number;
    VoteWeight: number;
  };
}

export const AMMDepositFlagsKeys = {
  lpToken: AMMDepositFlags.tfLPToken,
  singleAsset: AMMDepositFlags.tfSingleAsset,
  twoAsset: AMMDepositFlags.tfTwoAsset,
  oneAssetLPToken: AMMDepositFlags.tfOneAssetLPToken,
  limitLPToken: AMMDepositFlags.tfLimitLPToken,
  twoAssetIfEmpty: AMMDepositFlags.tfTwoAssetIfEmpty,
};

const nativeCurrencyAMMDepositFlags = {};

export function getAMMDepositFlagsKeys(nativeCurrency?: string): Record<string, number> {
  if (!nativeCurrency) {
    nativeCurrency = MAINNET_NATIVE_CURRENCY; // eslint-disable-line no-param-reassign
  }

  if (!nativeCurrencyAMMDepositFlags[nativeCurrency]) {
    nativeCurrencyAMMDepositFlags[nativeCurrency] = {
      ...getTxGlobalFlagsKeys(nativeCurrency),
      ...AMMDepositFlagsKeys,
    };
  }

  return nativeCurrencyAMMDepositFlags[nativeCurrency];
}

export interface AMMDepositFlagsKeysInterface extends TxGlobalFlagsKeysInterface {
  lpToken?: boolean;
  singleAsset?: boolean;
  twoAsset?: boolean;
  oneAssetLPToken?: boolean;
  limitLPToken?: boolean;
}

export const AMMWithdrawFlagsKeys = {
  lpToken: AMMWithdrawFlags.tfLPToken,
  withdrawAll: AMMWithdrawFlags.tfWithdrawAll,
  oneAssetWithdrawAll: AMMWithdrawFlags.tfOneAssetWithdrawAll,
  singleAsset: AMMWithdrawFlags.tfSingleAsset,
  twoAsset: AMMWithdrawFlags.tfTwoAsset,
  oneAssetLPToken: AMMWithdrawFlags.tfOneAssetLPToken,
  limitLPToken: AMMWithdrawFlags.tfLimitLPToken,
};

const nativeCurrencyAMMWithdrawFlags = {};

export function getAMMWithdrawFlagsKeys(nativeCurrency?: string): Record<string, number> {
  if (!nativeCurrency) {
    nativeCurrency = MAINNET_NATIVE_CURRENCY; // eslint-disable-line no-param-reassign
  }

  if (!nativeCurrencyAMMWithdrawFlags[nativeCurrency]) {
    nativeCurrencyAMMWithdrawFlags[nativeCurrency] = {
      ...getTxGlobalFlagsKeys(nativeCurrency),
      ...AMMWithdrawFlagsKeys,
    };
  }

  return nativeCurrencyAMMWithdrawFlags[nativeCurrency];
}

export interface AMMWithdrawFlagsKeysInterface extends TxGlobalFlagsKeysInterface {
  lpToken?: boolean;
  withdrawAll?: boolean;
  oneAssetWithdrawAll?: boolean;
  singleAsset?: boolean;
  twoAsset?: boolean;
  oneAssetLPToken?: boolean;
  limitLPToken?: boolean;
}

export const AMMClawbackFlagsKeys = {
  clawTwoAssets: AMMClawbackFlags.tfClawTwoAssets,
};

const nativeCurrencyAMMClawbackFlags = {};

export function getAMMClawbackFlagsKeys(nativeCurrency?: string): Record<string, number> {
  if (!nativeCurrency) {
    nativeCurrency = MAINNET_NATIVE_CURRENCY; // eslint-disable-line no-param-reassign
  }

  if (!nativeCurrencyAMMClawbackFlags[nativeCurrency]) {
    nativeCurrencyAMMClawbackFlags[nativeCurrency] = {
      ...getTxGlobalFlagsKeys(nativeCurrency),
      ...AMMClawbackFlagsKeys,
    };
  }

  return nativeCurrencyAMMClawbackFlags[nativeCurrency];
}


export interface AMMClawbackFlagsKeysInterface extends TxGlobalFlagsKeysInterface {
  clawTwoAssets?: boolean;
}

export type FormattedAmmBidSpecification = {
  asset?: FormattedIssuedCurrency;
  asset2?: FormattedIssuedCurrency;
  bidMin?: FormattedAmount;
  bidMax?: FormattedAmount;
  authorizedAccounts?: string[];
} & FormattedBaseSpecification;

export type FormattedAmmCreateSpecification = {
  amount: FormattedAmount;
  amount2: FormattedAmount;
  tradingFee: Number;
} & FormattedBaseSpecification;

export type FormattedAmmDeleteSpecification = {
  asset?: FormattedIssuedCurrency;
  asset2?: FormattedIssuedCurrency;
} & FormattedBaseSpecification;

export type FormattedAmmDepositSpecification = {
  asset?: FormattedIssuedCurrency;
  asset2?: FormattedIssuedCurrency;
  amount?: FormattedAmount;
  amount2?: FormattedAmount;
  ePrice?: FormattedAmount;
  lpTokenOut?: FormattedAmount;
  flags?: AMMDepositFlagsKeysInterface;
} & FormattedBaseSpecification;

export type FormattedAmmWithdrawSpecification = {
  asset?: FormattedIssuedCurrency;
  asset2?: FormattedIssuedCurrency;
  amount?: FormattedAmount;
  amount2?: FormattedAmount;
  ePrice?: FormattedAmount;
  lpTokenIn?: FormattedAmount;
  flags?: AMMWithdrawFlagsKeysInterface;
} & FormattedBaseSpecification;

export type FormattedAmmVoteSpecification = {
  asset?: FormattedIssuedCurrency;
  asset2?: FormattedIssuedCurrency;
  tradingFee: Number;
} & FormattedBaseSpecification;

export type FormattedAmmClawbackSpecification = {
  asset?: FormattedIssuedCurrency;
  asset2?: FormattedIssuedCurrency;
  amount?: FormattedAmount;
  holder?: string;
} & FormattedBaseSpecification;
