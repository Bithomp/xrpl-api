import { TransactionMetadata } from "xrpl";
import { NormalizedNode, normalizeNode } from "../utils";
import { parsePermissions } from "../ledger/permissions";

interface FormattedDelegateSummaryInterface {
  status?: "created" | "modified" | "deleted";
  delegateIndex: string;
  account?: string;
  authorize?: string;
  permissions?: string[];
  permissionsChange?: string[];
  previousTxnID?: string;
}

function parseDelegateStatus(node: NormalizedNode): "created" | "modified" | "deleted" | undefined {
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

function summarizeCheck(node: NormalizedNode): FormattedDelegateSummaryInterface {
  const final = node.diffType === "CreatedNode" ? node.newFields : (node.finalFields as any);
  const prev = node.previousFields as any;

  const summary: FormattedDelegateSummaryInterface = {
    // Status may be 'created', 'modified', or 'deleted'.
    status: parseDelegateStatus(node),
    delegateIndex: node.ledgerIndex,
    account: final.Account as string,
    authorize: final.Authorize as string,

    permissions: parsePermissions(final.Permissions),
  };

  if (node.diffType === "ModifiedNode") {
    // If this is a modified node, we can also include the permissions change.
    // add ones what deleted or added by this transaction
    summary.permissionsChange = [];
    const prevPermissions = parsePermissions(prev.Permissions);
    const finalPermissions = summary.permissions || [];

    const addedPermissions = finalPermissions.filter((perm) => !prevPermissions.includes(perm));
    const removedPermissions = prevPermissions.filter((perm) => !finalPermissions.includes(perm));

    if (addedPermissions.length > 0) {
      summary.permissionsChange.push(...addedPermissions);
    }

    if (removedPermissions.length > 0) {
      summary.permissionsChange.push(...removedPermissions);
    }

    if (summary.permissionsChange.length === 0) {
      summary.permissionsChange = undefined; // No changes, so we don't need this field
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

function parseDelegateChanges(metadata: TransactionMetadata): FormattedDelegateSummaryInterface | undefined {
  const affectedNodes = metadata.AffectedNodes.filter((affectedNode: any) => {
    const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
    return node.LedgerEntryType === "Delegate";
  });

  if (affectedNodes.length !== 1) {
    return undefined;
  }

  const normalizedNode = normalizeNode(affectedNodes[0]);

  return summarizeCheck(normalizedNode);
}

export { parseDelegateChanges };
