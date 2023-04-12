import {Memo} from './memos'

export type WeightedSigner = {
  address: string
  weight: number
}

export type Signers = {
  threshold?: number
  weights: WeightedSigner[]
}

export type FormattedSettings = {
  defaultRipple?: boolean
  depositAuth?: boolean
  disableMasterKey?: boolean
  disallowIncomingXRP?: boolean
  disallowIncomingNFTokenOffer?: boolean
  disallowIncomingCheck?: boolean
  disallowIncomingPayChan?: boolean
  disallowIncomingTrustline?: boolean
  domain?: string
  emailHash?: string | null
  walletLocator?: string | null
  enableTransactionIDTracking?: boolean
  globalFreeze?: boolean
  memos?: Memo[]
  messageKey?: string
  noFreeze?: boolean
  passwordSpent?: boolean
  regularKey?: string
  requireAuthorization?: boolean
  requireDestinationTag?: boolean
  signers?: Signers
  transferRate?: number | null
  tickSize?: number
  nftokenMinter?: string
}
