import { TransactionMetadata } from "xrpl";
import { ledgerTimeToUnixTime } from "../../models";
import { NormalizedNode, normalizeNode, decodeHexData } from "../utils";
import { CredentialFlagsKeysInterface } from "../../types";
import parseCredentialFlags from "../ledger/credential-flags";

interface FormattedCredentialSummaryInterface {
  status?: "created" | "modified" | "deleted";
  credentialIndex: string;
  issuer?: string;
  subject?: string;
  credentialType?: string;
  expiration?: number;
  uri?: string;
  flags?: CredentialFlagsKeysInterface;
  previousTxnID?: string;

  // changes
  flagsChange?: CredentialFlagsKeysInterface;
}

function parseCredentialStatus(node: NormalizedNode): "created" | "modified" | "deleted" | undefined {
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

function summarizeCredential(node: NormalizedNode): FormattedCredentialSummaryInterface {
  const final = node.diffType === "CreatedNode" ? node.newFields : (node.finalFields as any);
  const prev = node.previousFields as any;

  const summary: FormattedCredentialSummaryInterface = {
    // Status may be 'created', 'modified', or 'deleted'.
    status: parseCredentialStatus(node),
    credentialIndex: node.ledgerIndex,

    issuer: final.Issuer as string,
    subject: final.Subject as string,
    credentialType: decodeHexData(final.CredentialType),
    flags: parseCredentialFlags(final.Flags, { excludeFalse: false }),
  };

  if (final.Expiration !== undefined) {
    summary.expiration = ledgerTimeToUnixTime(final.Expiration);
  }

  if (final.URI !== undefined) {
    summary.uri = final.URI;
  }

  if (node.diffType === "ModifiedNode") {
    if (prev.Flags !== undefined) {
      summary.flagsChange = parseCredentialFlags(prev.Flags, { excludeFalse: false });
    }
  }

  if (node.PreviousTxnID) {
    // The identifying hash of the transaction that
    // most recently modified this payment check object.
    // You can use this to retrieve the object's history.
    summary.previousTxnID = node.PreviousTxnID;
  }

  return summary;
}

function parseCredentialChanges(metadata: TransactionMetadata): FormattedCredentialSummaryInterface | undefined {
  const affectedNodes = metadata.AffectedNodes.filter((affectedNode: any) => {
    const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
    return node.LedgerEntryType === "Credential";
  });

  if (affectedNodes.length !== 1) {
    return undefined;
  }

  const normalizedNode = normalizeNode(affectedNodes[0]);

  return summarizeCredential(normalizedNode);
}

export { parseCredentialChanges };
