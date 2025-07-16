import { TransactionMetadata } from "xrpl";
import { NormalizedNode, normalizeNode } from "../utils";
import { FormattedRemark } from "../../types";
import { parseRemarks } from "../ledger/remarks";

type FormattedRemarkSummaryInterface = {
  status?: "created" | "modified" | "deleted";
  previousValue?: string;
} & FormattedRemark;

interface FormattedRemarksSummaryInterface {
  status?: "created" | "modified" | "deleted";
  objectID: string;
  entryType?: string;
  remarks?: FormattedRemarkSummaryInterface[];
  previousTxnID?: string;
}

function parseEntryRemarks(node: NormalizedNode): FormattedRemarkSummaryInterface[] | undefined {
  const final = node.diffType === "CreatedNode" ? node.newFields : (node.finalFields as any);
  const prev = node.previousFields as any;

  if (!final.Remarks && !prev.Remarks) {
    return undefined;
  }

  const remarks = (parseRemarks(final.Remarks) || []) as FormattedRemarkSummaryInterface[];

  // if there any changes in remarks
  if (prev.Remarks) {
    const previousRemarks = parseRemarks(prev.Remarks) || [];

    // set status in remarks
    remarks.forEach((remark) => {
      const previousRemark = previousRemarks.find((r) => r.name === remark.name);
      if (previousRemark) {
        if (previousRemark.value !== remark.value) {
          remark.status = "modified";
          remark.previousValue = previousRemark.value;
        }
      } else {
        remark.status = "created";
      }
    });

    // check for deleted remarks
    previousRemarks.forEach((previousRemark) => {
      if (!remarks.some((r) => r.name === previousRemark.name)) {
        remarks.push({
          ...previousRemark,
          status: "deleted",
        });
      }
    });
  } else {
    // set status in remarks
    remarks.forEach((remark) => {
      remark.status = "created";
    });
  }

  return remarks;
}

function summarizeRemarks(node: NormalizedNode): FormattedRemarksSummaryInterface {
  const summary: FormattedRemarksSummaryInterface = {
    objectID: node.ledgerIndex,
    entryType: node.entryType,

    remarks: parseEntryRemarks(node),
  };

  if (node.PreviousTxnID) {
    // The identifying hash of the transaction that
    // most recently modified this payment check object.
    // You can use this to retrieve the object's history.
    summary.previousTxnID = node.PreviousTxnID;
  }

  return summary;
}

function parseRemarksChanges(tx: any): FormattedRemarksSummaryInterface | undefined {
  if (!tx.ObjectID || !tx.meta || !Array.isArray(tx.meta.AffectedNodes)) {
    return undefined;
  }

  const metadata = tx.meta as TransactionMetadata;
  const affectedNodes = metadata.AffectedNodes.filter((affectedNode: any) => {
    const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;

    return node.LedgerIndex === tx.ObjectID;
  });

  if (affectedNodes.length !== 1) {
    return undefined;
  }

  const normalizedNode = normalizeNode(affectedNodes[0]);

  return summarizeRemarks(normalizedNode);
}

export { parseRemarksChanges };
