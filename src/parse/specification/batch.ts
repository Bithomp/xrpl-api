import * as assert from "assert";
import { XrplDefinitionsBase } from "ripple-binary-codec";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { parseAccount } from "../ledger/account";
import { FormattedBatchSpecification } from "../../types/batch";
import parseTxBatchFlags from "../ledger/tx-batch-flags";

import { parseTransactionType, parserTypeFunc } from "../transaction";
import unrecognizedParser from "./unrecognized";
import { hashSignedTx } from "../../wallet";

function parseBatchRawTransaction(tx: any, nativeCurrency?: string, definitions?: XrplDefinitionsBase): any {
  const type = parseTransactionType(tx.TransactionType);
  const parser: Function = parserTypeFunc[type];

  const specification = parser ? parser(tx, nativeCurrency, definitions) : unrecognizedParser(tx);

  let id: string | undefined;
  try {
    id = hashSignedTx(tx, definitions, false);
  } catch (_err: any) {
    // ignore
  }

  return removeUndefined({
    id,
    type,
    address: parseAccount(tx.Account),
    sequence: tx.Sequence,
    ticketSequence: tx.TicketSequence,
    specification: removeUndefined(specification),
  });
}

function parseBatch(tx: any, nativeCurrency?: string, definitions?: XrplDefinitionsBase): FormattedBatchSpecification {
  assert.ok(tx.TransactionType === "Batch");

  const transactions = tx.RawTransactions.map((t: any) =>
    parseBatchRawTransaction(t.RawTransaction, nativeCurrency, definitions)
  );

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    transactions,
    flags: parseTxBatchFlags(tx.Flags as number, { nativeCurrency }),
    memos: parseMemos(tx),
  });
}

export default parseBatch;
