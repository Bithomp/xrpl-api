import * as errors from './errors'
import {xAddressToClassicAddress, isValidXAddress} from 'ripple-address-codec'

export function ensureClassicAddress(account: string): string {
  if (isValidXAddress(account)) {
    const {classicAddress, tag} = xAddressToClassicAddress(account)

    // Except for special cases, X-addresses used for requests
    // must not have an embedded tag. In other words,
    // `tag` should be `false`.
    if (tag !== false) {
      throw new Error(
        'This command does not support the use of a tag. Use an address without a tag.'
      )
    }

    // For rippled requests that use an account, always use a classic address.
    return classicAddress
  } else {
    return account
  }
}

export {errors}
export {
  dropsToXrp,
  xrpToDrops,
  toRippledAmount,
  removeUndefined,
  rippleToUnixTime,
  rippleToUnixTimestamp,
  iso8601ToRippleTime,
  rippleTimeToISO8601
} from './utils'
