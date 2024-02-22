import _ from "lodash";
import BigNumber from "bignumber.js";
import { ValidationError } from "./errors";

export type SortDirection = -1 | 0 | 1;

// https://github.com/XRPLF/xrpl.js/blob/6e0fff2ad642c2f94ddb83a23f57dff49d1678ec/src/ledger/utils.ts#L80
export function signum(num: number): SortDirection {
  return num === 0 ? 0 : num > 0 ? 1 : -1;
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

  if (first.tx.ledger_index === second.tx.ledger_index) {
    return signum(first.meta.TransactionIndex - second.meta.TransactionIndex);
  }

  return first.tx.ledger_index < second.tx.ledger_index ? -1 : 1;
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Convert hash and marker to marker
 * "hash", "marker" => "hash,marker"
 * "hash", { ledger: 16658790, seq: 1 } } => { ledger: 16658790, seq: 1, bithompHash: "hash" }
 */
export function createMarker(hash: string, marker?: any): any {
  if (marker === undefined) {
    return undefined;
  }

  if (marker === null) {
    return undefined;
  }

  if (typeof marker === "string") {
    return `${hash},${marker}`;
  }

  if (typeof marker === "object") {
    marker.bithompHash = hash;
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

  if (typeof marker === "object" && marker.bithompHash) {
    hash = marker.bithompHash;
    delete marker.bithompHash;
    return { hash, marker };
  }

  if (typeof marker !== "string") {
    return { hash, marker };
  }

  if (marker) {
    const markerParams = marker.split(",");
    if (markerParams.length > 1) {
      hash = markerParams[0];
      markerParams.shift();
      marker = markerParams.join(","); // eslint-disable-line no-param-reassign
    }
  }

  return { hash, marker };
}

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
  drops = new BigNumber(drops).toString(10); // eslint-disable-line no-param-reassign

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

  return new BigNumber(drops).dividedBy(1000000.0).toString(10);
}

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
  xrp = new BigNumber(xrp).toString(10); // eslint-disable-line no-param-reassign

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

  return new BigNumber(xrp).times(1000000.0).integerValue(BigNumber.ROUND_FLOOR).toString(10);
}

export function removeUndefined<T extends object>(obj: T): T {
  return _.omitBy(obj, (value) => value == null) as T; // eslint-disable-line eqeqeq
}

export function getConstructorName(object: object): string | undefined {
  if (object.constructor.name) {
    return object.constructor.name;
  }
  // try to guess it on legacy browsers (ie)
  const constructorString = object.constructor.toString();
  const functionConstructor = constructorString.match(/^function\s+([^(]*)/);
  const classConstructor = constructorString.match(/^class\s([^\s]*)/);

  if (functionConstructor) {
    return functionConstructor[1];
  } else if (classConstructor) {
    return classConstructor[1];
  }

  return undefined;
}
