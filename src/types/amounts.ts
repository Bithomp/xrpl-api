export interface IssuedCurrency {
  currency: string;
  issuer?: string;
}

export interface FormattedIssuedCurrency {
  currency: string;
  counterparty?: string;
}

export interface IssuedCurrencyAmount extends IssuedCurrency {
  value: string;
}

export interface FormattedIssuedCurrencyAmount extends FormattedIssuedCurrency {
  value: string;
}

export interface FormattedIssuedMPTAmount {
  mpt_issuance_id?: string;
  value: string;
}

export type Amount = IssuedCurrencyAmount | FormattedIssuedMPTAmount | string; // string as drops amount

export type FormattedAmount = FormattedIssuedCurrencyAmount | FormattedIssuedMPTAmount | string; // string as native currency (XRP, XAH) amount
