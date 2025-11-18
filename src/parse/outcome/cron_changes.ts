import { removeUndefined } from "../../common";
import { NormalizedNode, normalizeNode } from "../utils";
import { ledgerTimeToTimestamp } from "../../models/ledger";

interface FormattedCronSummaryInterface {
  status?: "created" | "cancelled" | "executed" | "modified";
  cronIndex?: string;
  previousCronIndex?: string; // from DeletedNode

  owner?: string;

  startTime?: number;
  repeatCount?: number;
  delaySeconds?: number;

  previousTxnID?: string; // from DeletedNode
  previousTxnLgrSeq?: number; // from DeletedNode
}

function parseCronStatus(
  tx: any,
  currentNode: NormalizedNode,
  previousNode?: NormalizedNode
): "created" | "cancelled" | "executed" | "modified" | undefined {
  if (tx.TransactionType === "Cron") {
    return "executed";
  }

  if (tx.TransactionType === "CronSet") {
    if (currentNode.diffType === "CreatedNode" && previousNode && previousNode.diffType === "DeletedNode") {
      return "modified";
    }

    if (currentNode.diffType === "CreatedNode" && !previousNode) {
      return "created";
    }

    if (tx.Flags === 1) {
      return "cancelled";
    }
  }

  return undefined;
}

function summarizeCron(
  tx: any,
  currentNode: NormalizedNode,
  previousNode?: NormalizedNode
): FormattedCronSummaryInterface {
  const final = currentNode.diffType === "CreatedNode" ? currentNode.newFields : (currentNode.finalFields as any);

  const summary: FormattedCronSummaryInterface = {
    status: parseCronStatus(tx, currentNode, previousNode),
    cronIndex: currentNode.ledgerIndex,
    owner: final.Owner,
    startTime: ledgerTimeToTimestamp(final.StartTime),
    repeatCount: final.RepeatCount,
    delaySeconds: final.DelaySeconds,
  };

  if (previousNode) {
    summary.previousCronIndex = previousNode.ledgerIndex;

    const previous = previousNode.finalFields;

    if (previous.PreviousTxnID) {
      summary.previousTxnID = previous.PreviousTxnID as string;
    }

    if (previous.PreviousTxnLgrSeq) {
      summary.previousTxnLgrSeq = previous.PreviousTxnLgrSeq as number;
    }
  }

  return removeUndefined(summary);
}

function parseCronChanges(tx: any): FormattedCronSummaryInterface | undefined {
  const affectedNodes = tx.meta.AffectedNodes.filter((affectedNode: any) => {
    const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
    return node.LedgerEntryType === "Cron";
  });

  // could be 1 or 2 nodes affected
  // 1 - for create, cancel, last execution
  // 2 - execution when Cron is deleted and new Cron is created
  if (affectedNodes.length > 2) {
    return undefined;
  }

  let currentNode: NormalizedNode;
  let previousNode: NormalizedNode | undefined;

  if (affectedNodes.length === 2) {
    const firstNode = normalizeNode(affectedNodes[0]);
    const secondNode = normalizeNode(affectedNodes[1]);

    if (firstNode.diffType === "DeletedNode") {
      previousNode = firstNode;
      currentNode = secondNode;
    } else {
      previousNode = secondNode;
      currentNode = firstNode;
    }
  } else {
    currentNode = normalizeNode(affectedNodes[0]);
  }

  return summarizeCron(tx, currentNode, previousNode);
}

export { parseCronChanges };
