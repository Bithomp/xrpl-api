import { LedgerEntry } from "xrpl";
const { RippleStateFlags } = LedgerEntry;
import { FormattedBaseSpecification } from "./specification";

export const TrustlineFlagsKeys = {
  lowReserve: RippleStateFlags.lsfLowReserve,
  highReserve: RippleStateFlags.lsfHighReserve,
  lowAuth: RippleStateFlags.lsfLowAuth,
  highAuth: RippleStateFlags.lsfHighAuth,
  lowNoRipple: RippleStateFlags.lsfLowNoRipple,
  highNoRipple: RippleStateFlags.lsfHighNoRipple,
  lowFreeze: RippleStateFlags.lsfLowFreeze,
  highFreeze: RippleStateFlags.lsfHighFreeze,
  ammNode: RippleStateFlags.lsfAMMNode,
  lowDeepFreeze: RippleStateFlags.lsfLowDeepFreeze,
  highDeepFreeze: RippleStateFlags.lsfHighDeepFreeze,
};

export interface TrustlineFlagsKeysInterface {
  lowReserve: boolean;
  highReserve: boolean;
  lowAuth: boolean;
  highAuth: boolean;
  lowNoRipple: boolean;
  highNoRipple: boolean;
  lowFreeze: boolean;
  highFreeze: boolean;
  ammNode: boolean;
  lowDeepFreeze: boolean;
  highDeepFreeze: boolean;
}

export interface Trustline {
  account: string;
  balance: string;
  currency: string;
  limit: string;
  limit_peer: string;
  quality_in: number;
  quality_out: number;
  no_ripple?: boolean;
  no_ripple_peer?: boolean;
  freeze?: boolean;
  freeze_peer?: boolean;
  authorized?: boolean;
  peer_authorized?: boolean;
}

export type FormattedTrustlineSpecification = {
  currency: string;
  counterparty: string;
  limit: string;
  qualityIn?: number;
  qualityOut?: number;
  ripplingDisabled?: boolean;
  authorized?: boolean;
  frozen?: boolean;
} & FormattedBaseSpecification;

export type FormattedTrustline = {
  specification: FormattedTrustlineSpecification;
  counterparty: {
    limit: string;
    ripplingDisabled?: boolean;
    frozen?: boolean;
    authorized?: boolean;
  };
  state: {
    balance: string;
  };
};
