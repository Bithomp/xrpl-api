import { TransactionMetadata } from "xrpl";
import { normalizeNodes } from "../utils";
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

function parseDIDStatus(node: any): "created" | "modified" | "deleted" | undefined {
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

function summarizeDID(node: any): FormattedDIDSummaryInterface {
  const final = node.diffType === "CreatedNode" ? node.newFields : node.finalFields;
  const prev = node.previousFields || {};

  const summary: FormattedDIDSummaryInterface = {
    status: parseDIDStatus(node),
    didID: node.LedgerIndex,
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
  const dids = normalizeNodes(metadata).filter((n) => {
    return n.entryType === "DID";
  });

  return dids.length === 1 ? summarizeDID(dids[0]) : undefined;
}

export { parseDIDChanges };
