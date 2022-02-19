import {
  Amount,
  RippledAmount,
  Adjustment,
  MaxAdjustment,
  MinAdjustment
} from '../common/types/objects'

// Amount where counterparty and value are optional
export type LaxLaxAmount = {
  currency: string
  value?: string
  issuer?: string
  counterparty?: string
}

export type Path = {
  source: Adjustment | MaxAdjustment
  destination: Adjustment | MinAdjustment
  paths: string
}

// tslint:disable-next-line:array-type
export type GetPaths = Array<Path>

export type PathFind = {
  source: {
    address: string
    amount?: Amount
    // tslint:disable-next-line:array-type
    currencies?: Array<{currency: string; counterparty?: string}>
  }
  destination: {
    address: string
    amount: LaxLaxAmount
  }
}

export type PathFindRequest = {
  command: string
  source_account: string
  destination_amount: RippledAmount
  destination_account: string
  source_currencies?: {currency: string; issuer?: string}[]
  send_max?: RippledAmount
}

export type RippledPathsResponse = {
  // tslint:disable-next-line:array-type
  alternatives: Array<{
    // tslint:disable-next-line:array-type
    paths_computed: Array<
    // tslint:disable-next-line:array-type
      Array<{
        type: number
        type_hex: string
        account?: string
        issuer?: string
        currency?: string
      }>
    >
    source_amount: RippledAmount
  }>
  type: string
  destination_account: string
  destination_amount: RippledAmount
  // tslint:disable-next-line:array-type
  destination_currencies?: Array<string>
  source_account: string
  // tslint:disable-next-line:array-type
  source_currencies?: Array<{currency: string}>
  full_reply?: boolean
}
