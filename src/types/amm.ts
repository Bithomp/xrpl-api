import { AMMDepositFlags, AMMWithdrawFlags } from "xrpl";
import { FormattedBaseSpecification } from "./specification";
import { FormattedAmount, FormattedIssuedCurrency } from "./amounts";

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
};

export interface AMMDepositFlagsKeysInterface {
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

export interface AMMWithdrawFlagsKeysInterface {
  lpToken?: boolean;
  withdrawAll?: boolean;
  oneAssetWithdrawAll?: boolean;
  singleAsset?: boolean;
  twoAsset?: boolean;
  oneAssetLPToken?: boolean;
  limitLPToken?: boolean;
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
