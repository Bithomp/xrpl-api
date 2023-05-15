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

export type Amount = IssuedCurrencyAmount | string; // string as drops amount

export type FormattedAmount = FormattedIssuedCurrencyAmount | string; // string as XRP amount
