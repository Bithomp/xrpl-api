import { xAddressToClassicAddress, isValidXAddress } from "ripple-address-codec";
import { Amount, IssuedCurrencyAmount, FormattedIssuedCurrencyAmount } from "../../types/objects";
import { xrpToDrops } from "../../common";

import { getNativeCurrency } from "../../client";

export function toRippledAmount(amount: Amount | FormattedIssuedCurrencyAmount): Amount {
  if (typeof amount === "string") return amount;

  if (amount.currency === getNativeCurrency()) {
    return xrpToDrops(amount.value);
  }
  if (amount.currency === "drops") {
    return amount.value;
  }

  // if amount is IssuedCurrencyAmount use issuer, else if FormattedIssuedCurrencyAmount use counterparty
  const issuer = (amount as FormattedIssuedCurrencyAmount).counterparty || (amount as IssuedCurrencyAmount).issuer;

  return {
    currency: amount.currency,
    issuer,
    value: amount.value,
  };
}

/**
 * @typedef {Object} ClassicAccountAndTag
 * @property {string} classicAccount - The classic account address.
 * @property {number | false | undefined } tag - The destination tag;
 *                    `false` if no tag should be used;
 *                    `undefined` if the input could not specify whether a tag should be used.
 */
export interface ClassicAccountAndTag {
  classicAccount: string;
  tag: number | false | undefined;
}

/**
 * Given an address (account), get the classic account and tag.
 * If an `expectedTag` is provided:
 * 1. If the `Account` is an X-address, validate that the tags match.
 * 2. If the `Account` is a classic address, return `expectedTag` as the tag.
 *
 * @param Account The address to parse.
 * @param expectedTag If provided, and the `Account` is an X-address,
 *                    this method throws an error if `expectedTag`
 *                    does not match the tag of the X-address.
 * @returns {ClassicAccountAndTag}
 *          The classic account and tag.
 */
export function getClassicAccountAndTag(Account: string, expectedTag?: number): ClassicAccountAndTag {
  if (isValidXAddress(Account)) {
    const classic = xAddressToClassicAddress(Account);
    // eslint-disable-next-line eqeqeq
    if (expectedTag != null && classic.tag !== expectedTag) {
      throw new Error("address includes a tag that does not match the tag specified in the transaction");
    }
    return {
      classicAccount: classic.classicAddress,
      tag: classic.tag,
    };
  } else {
    return {
      classicAccount: Account,
      tag: expectedTag,
    };
  }
}
