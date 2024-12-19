import { parseImportBlob } from "../ledger/import";
import parseAmount from "../ledger/amount";
import { isPartialPayment } from "../utils";
import { FormattedIssuedCurrencyAmount, FormattedIssuedMPTAmount } from "../../types";
import { parseBalanceChanges } from "./balance_changes";

function parseDeliveredAmount(tx: any): FormattedIssuedCurrencyAmount | FormattedIssuedMPTAmount | undefined {
  if (!["Import", "Payment"].includes(tx.TransactionType) || tx.meta.TransactionResult !== "tesSUCCESS") {
    return undefined;
  }

  if (tx.meta.delivered_amount && tx.meta.delivered_amount === "unavailable") {
    return undefined;
  }

  // parsable delivered_amount
  if (tx.meta.delivered_amount) {
    return parseAmount(tx.meta.delivered_amount);
  }

  // DeliveredAmount only present on partial payments
  if (tx.meta.DeliveredAmount) {
    return parseAmount(tx.meta.DeliveredAmount);
  }

  // no partial payment flag, use tx.Amount
  if (tx.Amount && !isPartialPayment(tx)) {
    return parseAmount(tx.Amount);
  }

  // DeliveredAmount for Import tx
  if (tx.TransactionType === "Import") {
    // take balance changes from meta
    const balanceChanges = parseBalanceChanges(tx.meta);
    const blob = parseImportBlob(tx.Blob);

    if (typeof blob === "string") {
      return undefined;
    }
    const account = blob.transaction.tx.Account;
    const balanceChange = balanceChanges[account];
    if (!balanceChange || balanceChange.length !== 1) {
      return undefined;
    }

    // currency is native
    return {
      currency: balanceChange[0].currency,
      value: balanceChange[0].value,
    };
  }

  return undefined;
}

export { parseDeliveredAmount };
