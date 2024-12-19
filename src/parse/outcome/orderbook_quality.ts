import * as assert from "assert";
import BigNumber from "bignumber.js";

import { getNativeCurrency } from "../../client";

/*
The quality, as stored in the last 64 bits of a directory index, is stored as
the quotient of TakerPays/TakerGets. It uses drops (1e-6 XRP) for XRP values.
*/

function adjustQualityForXRP(quality, takerGetsCurrency, takerPaysCurrency): string {
  const numeratorShift = takerPaysCurrency === getNativeCurrency() ? -6 : 0;
  const denominatorShift = takerGetsCurrency === getNativeCurrency() ? -6 : 0;
  const shift = numeratorShift - denominatorShift;
  return shift === 0 ? new BigNumber(quality).toString() : new BigNumber(quality).shiftedBy(shift).toString();
}

function parseOrderbookQuality(qualityHex, takerGetsCurrency, takerPaysCurrency): string {
  assert.ok(qualityHex.length === 16);
  const mantissa = new BigNumber(qualityHex.substring(2), 16);
  const offset = parseInt(qualityHex.substring(0, 2), 16) - 100;
  const quality = mantissa.toString() + "e" + offset.toString(); // eslint-disable-line prefer-template
  return adjustQualityForXRP(quality, takerGetsCurrency, takerPaysCurrency);
}

export { parseOrderbookQuality };
