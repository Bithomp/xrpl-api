import { TransactionMetadata } from "xrpl";
import { NormalizedNode, normalizeNode } from "../utils";
import { removeUndefined } from "../../common";

interface FormattedDIDSummaryInterface {
  status?: "created" | "modified" | "deleted";
  didID?: string;
  account?: string;
  uri: string;
  data: string;
  didDocument: string;

  // changes
  uriChange?: string;
  dataChanges?: string;
  didDocumentChanges?: string;
}

function parseDIDStatus(node: NormalizedNode): "created" | "modified" | "deleted" | undefined {
  if (node.diffType === "CreatedNode") {
    return "created";
  }

  if (node.diffType === "ModifiedNode") {
    return "modified";
  }

  if (node.diffType === "DeletedNode") {
    return "deleted";
  }
  return undefined;
}

function summarizeDID(node: NormalizedNode): FormattedDIDSummaryInterface {
  const final = node.diffType === "CreatedNode" ? node.newFields : node.finalFields as any;
  const prev = node.previousFields as any;

  const summary: FormattedDIDSummaryInterface = {
    status: parseDIDStatus(node),
    didID: node.ledgerIndex,
    account: final.Account,
    uri: final.URI,
    data: final.Data,
    didDocument: final.DIDDocument,
  };

  if (prev.URI) {
    summary.uriChange = prev.URI;
  }

  if (prev.Data) {
    summary.dataChanges = prev.Data;
  }

  if (prev.DIDDocument) {
    summary.didDocumentChanges = prev.DIDDocument;
  }

  return removeUndefined(summary);
}

function parseDIDChanges(metadata: TransactionMetadata): FormattedDIDSummaryInterface | undefined {
  const affectedNodes = metadata.AffectedNodes.filter((affectedNode: any) => {
    const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
    return node.LedgerEntryType === "DID";
  });

  if (affectedNodes.length !== 1) {
    return undefined;
  }

  const normalizedNode = normalizeNode(affectedNodes[0]);

  return summarizeDID(normalizedNode);
}

export { parseDIDChanges };
