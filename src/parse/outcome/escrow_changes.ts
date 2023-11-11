import { normalizeNodes } from "../../v1/common/utils";

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

function summarizeEscrow(tx: any, node: any) {
  const final = node.diffType === "CreatedNode" ? node.newFields : node.finalFields;

  const summary = {
    status: parseEscrowStatus(tx, node),
    owner: final.Account,
    escrowIndex: node.ledgerIndex,
    escrowSequence: tx.Sequence || tx.TicketSequence,
  };

  return summary;
}

function parseEscrowChanges(tx: any) {
  const escrows = normalizeNodes(tx.meta).filter((n: any) => {
    return n.entryType === "Escrow";
  });

  return escrows.length === 1 ? summarizeEscrow(tx, escrows[0]) : undefined;
}

export { parseEscrowChanges };
