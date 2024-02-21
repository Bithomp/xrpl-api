import { removeUndefined } from "../../common";
import { FormattedSourceAddress, FormattedDestinationAddress } from "../../types/objects/account";
import { normalizeNodes, parseTimestamp } from "../utils";

interface FormattedEscrowSummaryInterface {
  status?: string;
  escrowIndex?: number;
  escrowSequence?: number;
  amount?: string;
  condition?: string;
  source?: FormattedSourceAddress;
  destination?: FormattedDestinationAddress;
  allowCancelAfter?: string;
  allowExecuteAfter?: string;
  previousTxnID?: string;
  previousTxnLgrSeq?: number;
}

function parseEscrowStatus(tx: any, node: any) {
  if (node.diffType === "CreatedNode") {
    return "created";
  }

  if (node.diffType === "DeletedNode") {
    if (tx.TransactionType === "EscrowCancel") {
      return "cancelled";
    }

    if (tx.TransactionType === "EscrowFinish") {
      return "executed";
    }

    return "deleted";
  }
  return undefined;
}

function parseEscrowSequence(tx: any) {
  if (tx.TransactionType === "EscrowCreate") {
    return tx.Sequence || tx.TicketSequence;
  }

  if (tx.TransactionType === "EscrowCancel" || tx.TransactionType === "EscrowFinish") {
    return tx.OfferSequence;
  }

  return undefined;
}

function summarizeEscrow(tx: any, node: any): FormattedEscrowSummaryInterface {
  const final = node.diffType === "CreatedNode" ? node.newFields : node.finalFields;

  const source: FormattedSourceAddress = {
    address: final.Account,
    tag: final.SourceTag,
  };

  const destination: FormattedDestinationAddress = {
    address: final.Destination,
    tag: final.DestinationTag,
  };

  const summary: FormattedEscrowSummaryInterface = {
    status: parseEscrowStatus(tx, node),
    escrowIndex: node.ledgerIndex,
    escrowSequence: parseEscrowSequence(tx),
    amount: final.Amount,
    condition: final.Condition,
    source: removeUndefined(source),
    destination: removeUndefined(destination),
    allowCancelAfter: parseTimestamp(final.CancelAfter),
    allowExecuteAfter: parseTimestamp(final.FinishAfter),
  };

  if (final.PreviousTxnID) {
    summary.previousTxnID = final.PreviousTxnID;
  } else if (node.diffType === "CreatedNode") {
    summary.previousTxnID = tx.hash;
  }

  if (final.PreviousTxnLgrSeq) {
    summary.previousTxnLgrSeq = final.PreviousTxnLgrSeq;
  } else if (node.diffType === "CreatedNode") {
    summary.previousTxnLgrSeq = tx.ledger_index;
  }

  return removeUndefined(summary);
}

function parseEscrowChanges(tx: any): FormattedEscrowSummaryInterface | undefined {
  const escrows = normalizeNodes(tx.meta).filter((n: any) => {
    return n.entryType === "Escrow";
  });

  return escrows.length === 1 ? summarizeEscrow(tx, escrows[0]) : undefined;
}

export { parseEscrowChanges };
