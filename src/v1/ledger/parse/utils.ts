import BigNumber from 'bignumber.js'
import {PaymentFlags} from "xrpl";
import * as common from '../../common'

function adjustQualityForXRP(
  quality: string,
  takerGetsCurrency: string,
  takerPaysCurrency: string
) {
  // quality = takerPays.value/takerGets.value
  // using drops (1e-6 XRP) for XRP values
  const numeratorShift = takerPaysCurrency === 'XRP' ? -6 : 0
  const denominatorShift = takerGetsCurrency === 'XRP' ? -6 : 0
  const shift = numeratorShift - denominatorShift
  return shift === 0
    ? quality
    : new BigNumber(quality).shiftedBy(shift).toString()
}

function parseQuality(quality?: number | null): number | undefined {
  if (typeof quality !== 'number') {
    return undefined
  }
  return new BigNumber(quality).shiftedBy(-9).toNumber()
}

function parseTimestamp(rippleTime?: number | null): string | undefined {
  if (typeof rippleTime !== 'number') {
    return undefined
  }
  return common.rippleTimeToISO8601(rippleTime)
}

function isPartialPayment(tx: any) {
  // tslint:disable-next-line:no-bitwise
  return (tx.Flags & PaymentFlags.tfPartialPayment) !== 0
}

function hexToString(hex: string): string | undefined {
  return hex ? Buffer.from(hex, 'hex').toString('utf-8') : undefined
}

export {
  parseQuality,
  hexToString,
  parseTimestamp,
  adjustQualityForXRP,
  isPartialPayment
}
