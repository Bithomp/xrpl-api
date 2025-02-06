import { FormattedIssuedCurrency, IssuedCurrency } from "../../types";

import { getNativeCurrency } from "../../client";

function parseAsset(asset: IssuedCurrency): IssuedCurrency | FormattedIssuedCurrency | undefined {
  if (asset === undefined) {
    return undefined;
  }

  if (asset.currency === getNativeCurrency()) {
    return {
      currency: asset.currency,
    };
  }

  return {
    issuer: asset.issuer,
    currency: asset.currency,
    counterparty: asset.issuer, // @deprecated, use issuer
  };
}

export default parseAsset;
