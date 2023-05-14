import * as _ from "lodash";
import BigNumber from "bignumber.js";
import { dropsToXrp, normalizeNodes } from "../../v1/common/utils";

/* tslint:disable:prefer-const only-arrow-functions no-var-keyword */

function groupByAddress(lockedBalanceChanges) {
  const grouped = _.groupBy(lockedBalanceChanges, function (node) {
    return node.address;
  });
  return _.mapValues(grouped, function (group) {
    return _.map(group, function (node) {
      return node.lockedBalance;
    });
  });
}

function parseValue(value) {
  return new BigNumber(value.value || value);
}

function computeBalanceChange(node) {
  var value: null | BigNumber = null;
  if (node.newFields.LockedBalance) {
    value = parseValue(node.newFields.LockedBalance);
  } else if (node.previousFields.LockedBalance && node.finalFields.LockedBalance) {
    value = parseValue(node.finalFields.LockedBalance).minus(parseValue(node.previousFields.LockedBalance));
  }
  return value === null ? null : value.isZero() ? null : value;
}

function parseFinalBalance(node) {
  if (node.newFields.LockedBalance) {
    return parseValue(node.newFields.LockedBalance);
  } else if (node.finalFields.LockedBalance) {
    return parseValue(node.finalFields.LockedBalance);
  }
  return null;
}

function parseXRPQuantity(node, valueParser) {
  var value = valueParser(node);

  if (value === null) {
    return null;
  }

  return {
    address: node.finalFields.Account || node.newFields.Account,
    lockedBalance: {
      counterparty: "",
      currency: "XRP",
      value: dropsToXrp(value).toString(),
    },
  };
}

function parseTrustlineQuantity(node, valueParser) {
  var value = valueParser(node);

  if (value === null) {
    return null;
  }

  /*
   * A trustline can be created with a non-zero starting lockedBalance
   * If an offer is placed to acquire an asset with no existing trustline,
   * the trustline can be created when the offer is taken.
   */
  var fields = _.isEmpty(node.newFields) ? node.finalFields : node.newFields;

  // the lockedBalance is always from low node's perspective
  var result = {
    address: fields.LowLimit.issuer,
    lockedBalance: {
      counterparty: fields.HighLimit.issuer,
      currency: fields.LockedBalance.currency,
      value: value.toString(),
    },
  };
  return [result];
}

function parseQuantities(metadata, valueParser) {
  var values = normalizeNodes(metadata).map(function (node) {
    if (node.entryType === "AccountRoot") {
      return [parseXRPQuantity(node, valueParser)];
    } else if (node.entryType === "RippleState") {
      return parseTrustlineQuantity(node, valueParser);
    }
    return [];
  });
  return groupByAddress(_.compact(_.flatten(values)));
}

/**
 *  Computes the complete list of every locked lockedBalance that changed in the ledger
 *  as a result of the given transaction.
 *
 *  @param {Object} metadata Transaction metada
 *  @returns {Object} parsed lockedBalance changes
 */
function parseLockedBalanceChanges(metadata) {
  return parseQuantities(metadata, computeBalanceChange);
}

/**
 *  Computes the complete list of every final locked lockedBalance in the ledger
 *  as a result of the given transaction.
 *
 *  @param {Object} metadata Transaction metada
 *  @returns {Object} parsed balances
 */
function parseFinalLockedBalances(metadata) {
  return parseQuantities(metadata, parseFinalBalance);
}

export { parseLockedBalanceChanges, parseFinalLockedBalances };
