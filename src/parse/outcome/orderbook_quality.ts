import * as assert from "assert";
import BigNumber from "bignumber.js";

import { adjustQualityForXRP } from "../utils";

/*
The quality, as stored in the last 64 bits of a directory index, is stored as
the quotient of TakerPays/TakerGets. It uses drops (1e-6 XRP) for XRP values.
*/

function parseOrderbookQuality(
  qualityHex: string,
  takerGetsCurrency: string | null,
  takerPaysCurrency: string | null
): string {
  assert.ok(qualityHex.length === 16);

  const mantissa = new BigNumber(qualityHex.substring(2), 16);
  const offset = parseInt(qualityHex.substring(0, 2), 16) - 100;
  const quality = mantissa.toString() + "e" + offset.toString(); // eslint-disable-line prefer-template

  return adjustQualityForXRP(quality, takerGetsCurrency, takerPaysCurrency);
}

export { parseOrderbookQuality };
