import _ from "lodash";
import parseAmount from "./amount";
import { FormattedIssuedCurrencyAmount, Amount } from "../../types";
import { Path, GetPaths } from "../../types/path_find";
import { PathFindResponseResult } from "../../models/path_find";

function parsePaths(paths) {
  return paths.map((steps) => steps.map((step) => _.omit(step, ["type", "type_hex"])));
}

function removeAnyCounterpartyEncoding(address: string, amount: FormattedIssuedCurrencyAmount) {
  return amount.counterparty === address ? _.omit(amount, "counterparty") : amount;
}

function createAdjustment(address: string, adjustmentWithoutAddress: object): any {
  const amountKey = Object.keys(adjustmentWithoutAddress)[0];
  const amount = adjustmentWithoutAddress[amountKey];
  return _.set({ address: address }, amountKey, removeAnyCounterpartyEncoding(address, amount));
}

function parseAlternative(
  sourceAddress: string,
  destinationAddress: string,
  destinationAmount: Amount,
  alternative: any
): Path {
  // we use "maxAmount"/"minAmount" here so that the result can be passed
  // directly to preparePayment
  const amounts =
    // prettier-ignore
    /* eslint-disable multiline-ternary, eqeqeq */
    alternative.destination_amount != null
      ? {
        source: { amount: parseAmount(alternative.source_amount) },
        destination: { minAmount: parseAmount(alternative.destination_amount) },
      }
      : {
        source: { maxAmount: parseAmount(alternative.source_amount) },
        destination: { amount: parseAmount(destinationAmount) },
      };
  /* eslint-enable multiline-ternary */

  return {
    source: createAdjustment(sourceAddress, amounts.source),
    destination: createAdjustment(destinationAddress, amounts.destination),
    paths: JSON.stringify(parsePaths(alternative.paths_computed)),
  };
}

function parsePathfind(pathfindResult: PathFindResponseResult): GetPaths {
  const sourceAddress = pathfindResult.source_account;
  const destinationAddress = pathfindResult.destination_account;
  const destinationAmount = pathfindResult.destination_amount;
  return pathfindResult.alternatives.map((alt) =>
    parseAlternative(sourceAddress, destinationAddress, destinationAmount, alt)
  );
}

export default parsePathfind;
