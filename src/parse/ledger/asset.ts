import { FormattedIssuedCurrency, IssuedCurrency } from "../../types";

import { getNativeCurrency } from "../../client";

function parseAsset(asset: IssuedCurrency): FormattedIssuedCurrency | undefined {
  if (asset === undefined) {
    return undefined;
  }

  if (asset.currency === getNativeCurrency()) {
    return {
      currency: asset.currency,
    };
  }

  return {
    currency: asset.currency,
    counterparty: asset.issuer,
  };
}

export default parseAsset;
