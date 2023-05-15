import { xAddressToClassicAddress, isValidXAddress } from "ripple-address-codec";
import { removeUndefined } from "../../common";
import { FormattedMemo, Memo } from "../common/types/objects";

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

export function convertStringToHex(value: string): string {
  return Buffer.from(value, "utf8").toString("hex").toUpperCase();
}

export function convertMemo(memo: FormattedMemo): Memo {
  return {
    Memo: removeUndefined({
      MemoData: memo.data ? convertStringToHex(memo.data) : undefined,
      MemoType: memo.type ? convertStringToHex(memo.type) : undefined,
      MemoFormat: memo.format ? convertStringToHex(memo.format) : undefined,
    }),
  };
}
