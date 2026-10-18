import BigNumber from "bignumber.js";
import { ValidationError } from "./errors";
import { dropsInXRP } from "./index";

export type SortDirection = -1 | 0 | 1;

// https://github.com/XRPLF/xrpl.js/blob/6e0fff2ad642c2f94ddb83a23f57dff49d1678ec/src/ledger/utils.ts#L80
export function signum(num: number): SortDirection {
  return Number.isNaN(num) || num === 0 ? 0 : num > 0 ? 1 : -1;
}

// https://github.com/XRPLF/xrpl.js/blob/6e0fff2ad642c2f94ddb83a23f57dff49d1678ec/src/ledger/utils.ts#L90
/**
 *  Order two rippled transactions based on their ledger_index.
 *  If two transactions took place in the same ledger, sort
 *  them based on TransactionIndex
 *  See: https://developers.ripple.com/transaction-metadata.html
 */
export function compareTransactions(first: any, second: any): SortDirection {
  if (!first.tx || !first.meta || !second.tx || !second.meta) {
    return 0;
  }

  const firstLedgerIndex = first.tx.ledger_index ?? first.tx.inLedger;
  const secondLedgerIndex = second.tx.ledger_index ?? second.tx.inLedger;
  if (!Number.isFinite(firstLedgerIndex) || !Number.isFinite(secondLedgerIndex)) {
    return 0;
  }

  if (firstLedgerIndex !== secondLedgerIndex) {
    return firstLedgerIndex < secondLedgerIndex ? -1 : 1;
  }

  const firstTransactionIndex = first.meta.TransactionIndex;
  const secondTransactionIndex = second.meta.TransactionIndex;
  if (!Number.isFinite(firstTransactionIndex) || !Number.isFinite(secondTransactionIndex)) {
    return 0;
  }

  return signum(firstTransactionIndex - secondTransactionIndex);
}

/**
 * Asynchronously pauses the execution for the specified number of milliseconds.
 * @param ms - The number of milliseconds to sleep.
 * @returns A Promise that resolves after the specified number of milliseconds.
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * @return {Number} ms since unix epoch
 */
export function getTimestamp(): number {
  return Date.now();
}

/**
 * Convert hash and marker to marker
 * "hash", "marker" => "hash,marker"
 * "hash", { ledger: 16658790, seq: 1 } } => { ledger: 16658790, seq: 1, bithompHash: "hash" }
 */
export function createMarker(hash: string, marker?: any): any {
  if (marker === undefined || marker === null) {
    return undefined;
  }

  if (typeof marker === "string") {
    return `${hash},${marker}`;
  }

  if (typeof marker === "object") {
    return { ...marker, bithompHash: hash };
  }

  return marker;
}

/**
 * Convert marker to hash and marker
 * "abc,dex,def" => { hash: "abc", marker: "dex,def" }
 *
 * { ledger: 16658790, seq: 1 } => { hash: undefined, marker: { ledger: 16658790, seq: 1 } }
 * { ledger: 16658790, seq: 1, bithompHash: "hash" } => { hash: "hash", marker: { ledger: 16658790, seq: 1 } }
 */
export function parseMarker(marker?: any): any {
  let hash: undefined | string;

  if (marker && typeof marker === "object" && Object.prototype.hasOwnProperty.call(marker, "bithompHash")) {
    const { bithompHash, ...rest } = marker;
    hash = bithompHash;
    return { hash, marker: rest };
  }

  if (typeof marker !== "string") {
    return { hash, marker };
  }

  const separator = marker.indexOf(",");
  if (separator !== -1) {
    hash = marker.slice(0, separator);
    marker = marker.slice(separator + 1); // eslint-disable-line no-param-reassign
  }

  return { hash, marker };
}

/**
 * Converts the given value from drops to XRP (native currency).
 *
 * @param drops - The value in drops to be converted.
 * @returns The converted value in XRP (native currency) as a string.
 * @throws {ValidationError} If the value is invalid or has too many decimal places.
 */
export function dropsToXrp(drops: BigNumber.Value): string {
  if (typeof drops === "string") {
    if (!drops.match(/^-?[0-9]*\.?[0-9]*$/)) {
      throw new ValidationError(
        `dropsToXrp: invalid value '${drops}', should be a number matching (^-?[0-9]*\\.?[0-9]*$).`
      );
    } else if (drops === ".") {
      throw new ValidationError(
        `dropsToXrp: invalid value '${drops}', should be a BigNumber or string-encoded number.`
      );
    }
  }

  // Converting to BigNumber and then back to string should remove any
  // decimal point followed by zeros, e.g. '1.00'.
  // Important: specify base 10 to avoid exponential notation, e.g. '1e-7'.
  const dropsValue = new BigNumber(drops);
  drops = dropsValue.toString(10); // eslint-disable-line no-param-reassign

  // drops are only whole units
  if (drops.includes(".")) {
    throw new ValidationError(`dropsToXrp: value '${drops}' has too many decimal places.`);
  }

  // This should never happen; the value has already been
  // validated above. This just ensures BigNumber did not do
  // something unexpected.
  if (!drops.match(/^-?[0-9]+$/)) {
    throw new ValidationError(`dropsToXrp: failed sanity check - value '${drops}', does not match (^-?[0-9]+$).`);
  }

  return dropsValue.dividedBy(dropsInXRP).toString(10);
}

/**
 * Converts XRP (native currency) value to drops.
 *
 * @param xrp - The XRP (native currency) value to convert.
 * @returns The converted value in drops.
 * @throws {ValidationError} If the provided XRP value is invalid.
 */
export function xrpToDrops(xrp: BigNumber.Value): string {
  if (typeof xrp === "string") {
    if (!xrp.match(/^-?[0-9]*\.?[0-9]*$/)) {
      throw new ValidationError(
        `xrpToDrops: invalid value '${xrp}', should be a number matching (^-?[0-9]*\\.?[0-9]*$).`
      );
    } else if (xrp === ".") {
      throw new ValidationError(`xrpToDrops: invalid value '${xrp}', should be a BigNumber or string-encoded number.`);
    }
  }

  // Important: specify base 10 to avoid exponential notation, e.g. '1e-7'.
  const xrpValue = new BigNumber(xrp);
  xrp = xrpValue.toString(10); // eslint-disable-line no-param-reassign

  // This should never happen; the value has already been
  // validated above. This just ensures BigNumber did not do
  // something unexpected.
  if (!xrp.match(/^-?[0-9.]+$/)) {
    throw new ValidationError(`xrpToDrops: failed sanity check - value '${xrp}', does not match (^-?[0-9.]+$).`);
  }

  const components = xrp.split(".");
  if (components.length > 2) {
    throw new ValidationError(`xrpToDrops: failed sanity check - value '${xrp}' has too many decimal points.`);
  }

  const fraction = components[1] || "0";
  if (fraction.length > 6) {
    throw new ValidationError(`xrpToDrops: value '${xrp}' has too many decimal places.`);
  }

  return xrpValue.times(dropsInXRP).integerValue(BigNumber.ROUND_FLOOR).toString(10);
}

/**
 * Removes undefined and null values from an object.
 *
 * @param obj - The object to remove values from.
 * @returns The object with values removed.
 */
export function removeUndefined<T extends object>(obj: T): T {
  const cleaned: Record<string, any> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = (obj as Record<string, any>)[key];
      // eslint-disable-next-line eqeqeq
      if (value != null) {
        cleaned[key] = value;
      }
    }
  }

  return cleaned as T;
}

/**
 * If the object is empty, returns undefined; otherwise, returns the object.
 *
 * @param obj - The object to check.
 * @returns The object or undefined if it is empty.
 */
export function emptyObjectToUndefined<T extends object>(obj: T): T | undefined {
  if (!obj || Object.keys(obj).length === 0) {
    return undefined;
  }
  return obj;
}

/**
 * Retrieves the constructor name of an object.
 *
 * @param object - The object to retrieve the constructor name from.
 * @returns The constructor name of the object, or undefined if it cannot be determined.
 */
export function getConstructorName(object: object): string | undefined {
  const constructor = object?.constructor;
  if (constructor?.name) {
    return constructor.name;
  }
  if (!constructor || typeof constructor.toString !== "function") {
    return undefined;
  }
  // try to guess it on legacy browsers (ie)
  const constructorString = constructor.toString();
  const functionConstructor = constructorString.match(/^function\s+([^(]*)/);
  const classConstructor = constructorString.match(/^class\s([^\s]*)/);

  if (functionConstructor) {
    return functionConstructor[1];
  } else if (classConstructor) {
    return classConstructor[1];
  }

  return undefined;
}

/**
 * Determines if the given response object is a Clio response by checking for a specific warning.
 *
 * @param response - The response object to check.
 * @returns `true` if the response contains a warning with `id` 2001, indicating a Clio response; otherwise, `false`.
 */
export function isClioResponse(response: any): boolean {
  if (!Array.isArray(response?.warnings)) {
    return false;
  }

  return response.warnings.some((warning: any) => warning?.id === 2001);
}
