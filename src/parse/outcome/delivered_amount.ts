import BigNumber from "bignumber.js";
import { getNativeCurrency } from "../../client";
import { parseImportBlob } from "../ledger/import";
import parseAmount from "../ledger/amount";
import { IssuedCurrencyAmount, FormattedIssuedCurrencyAmount, FormattedIssuedMPTAmount } from "../../types";
import { BalanceChanges, parseBalanceChanges } from "./balance_changes";

function parseDeliveredAmount(
  tx: any,
  balanceChanges: BalanceChanges
): IssuedCurrencyAmount | FormattedIssuedCurrencyAmount | FormattedIssuedMPTAmount | undefined {
  // Transactions may use either field name depending on the server/API source.
  const metadata = tx.meta || tx.metaData;
  if (!metadata || metadata.TransactionResult !== "tesSUCCESS") {
    return undefined;
  }

  if (tx.TransactionType === "Payment") {
    const txBalanceChanges = balanceChanges || parseBalanceChanges(tx.meta, getNativeCurrency(), tx);
    if (txBalanceChanges) {
      const account = tx.Destination;
      const changes = txBalanceChanges[account];
      if (changes) {
        // find all possible balance changes
        const positives = changes.filter((change) => change.value[0] !== "-");
        if (positives.length === 1) {
          return positives[0];
        }
      }
    }
  } else if (tx.TransactionType === "CheckCash") {
    const txBalanceChanges = balanceChanges || parseBalanceChanges(tx.meta, getNativeCurrency(), tx);
    if (txBalanceChanges) {
      const account = tx.Account;
      const changes = txBalanceChanges[account];
      if (changes) {
        // find all possible balance changes
        const positives = changes.filter((change) => change.value[0] !== "-");
        if (positives.length === 1) {
          return positives[0];
        }
      }
    }
  } else if (tx.TransactionType === "Import") {
    const txBalanceChanges = balanceChanges || parseBalanceChanges(tx.meta, getNativeCurrency(), tx);
    const blob = parseImportBlob(tx.Blob);
    if (typeof blob === "object") {
      const account = blob.transaction.tx.Account;
      const balanceChange = txBalanceChanges[account];
      if (balanceChange && balanceChange.length === 1) {
        // currency is native
        return {
          currency: balanceChange[0].currency,
          value: new BigNumber(balanceChange[0].value).abs().toString(),
        };
      }
    }
  }

  // parsable delivered_amount
  if (metadata.delivered_amount && metadata.delivered_amount !== "unavailable") {
    return parseAmount(metadata.delivered_amount);
  }

  // DeliveredAmount only present on partial payments
  if (metadata.DeliveredAmount) {
    return parseAmount(metadata.DeliveredAmount);
  }

  return undefined;
}

export { parseDeliveredAmount };
