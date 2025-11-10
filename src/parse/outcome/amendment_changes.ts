import { NormalizedNode, normalizeNode } from "../utils";
import { AmendmentsMajority } from "../../types/ledger_entries";

type AmendmentStatus = "majority" | "enabled" | "lostMajority" | "obsolete";
interface FormattedAmendmentSummaryInterface {
  status?: AmendmentStatus;
  amendment?: string;
}

function parseAmendmentStatus(tx: any, node: NormalizedNode): AmendmentStatus | undefined {
  const amendment = tx.Amendment;
  const final = node.diffType === "CreatedNode" ? node.newFields : (node.finalFields as any);
  const prev = node.previousFields as any;

  const amendments: string[] = final.Amendments || [];
  const majority: AmendmentsMajority[] = final.Majorities || [];

  if (amendments.includes(amendment)) {
    return "enabled";
  }

  for (const maj of majority) {
    if (maj.Majority.Amendment === amendment) {
      return "majority";
    }
  }

  // check if it lost majority
  if (prev && prev.Majorities) {
    const prevMajority: AmendmentsMajority[] = prev.Majorities;
    for (const maj of prevMajority) {
      if (maj.Majority.Amendment === amendment) {
        return "lostMajority";
      }
    }
  }

  // check if it deleted as obsolete
  if (node.diffType === "DeletedNode") {
    const prevFinal = node.finalFields as any;
    const prevAmendments: string[] = prevFinal.Amendments || [];

    if (!prevAmendments.includes(amendment)) {
      return "obsolete";
    }
  }

  return undefined;
}

function summarizeAmendment(tx: any, node: NormalizedNode): FormattedAmendmentSummaryInterface {
  const summary: FormattedAmendmentSummaryInterface = {
    status: parseAmendmentStatus(tx, node),
    amendment: tx.Amendment,
  };

  return summary;
}

function parseAmendmentChanges(tx: any): FormattedAmendmentSummaryInterface | undefined {
  const amendment = tx.Amendment;
  if (!amendment) {
    return undefined;
  }

  const affectedNodes = tx.meta.AffectedNodes.filter((affectedNode: any) => {
    const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
    return node.LedgerEntryType === "Amendments";
  });

  if (affectedNodes.length !== 1) {
    return undefined;
  }

  const normalizedNode = normalizeNode(affectedNodes[0]);

  return summarizeAmendment(tx, normalizedNode);
}

export { parseAmendmentChanges };
