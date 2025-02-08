import { removeUndefined } from "../../common";
import { NormalizedNode, normalizeNode } from "../utils";

interface FormattedUNLReportSummaryInterface {
  status: "added";
  activeValidator?: {
    account: string;
    publicKey: string;
  };
  importVLKey?: {
    account: string;
    publicKey: string;
  };
}

function summarizeUNLReport(tx: any, node: NormalizedNode) {
  const final = node.diffType === "CreatedNode" ? node.newFields : node.finalFields as any;

  if (tx.ImportVLKey && final.ImportVLKeys) {
    for (const vlKey of final.ImportVLKeys) {
      if (vlKey.ImportVLKey.PublicKey === tx.ImportVLKey.PublicKey) {
        const summary: FormattedUNLReportSummaryInterface = {
          status: "added",
          importVLKey: {
            account: vlKey.ImportVLKey.Account,
            publicKey: vlKey.ImportVLKey.PublicKey,
          },
        };
        return removeUndefined(summary);
      }
    }
  }

  if (tx.ActiveValidator && final.ActiveValidators) {
    for (const activeValidator of final.ActiveValidators) {
      if (activeValidator.ActiveValidator.PublicKey === tx.ActiveValidator.PublicKey) {
        const summary: FormattedUNLReportSummaryInterface = {
          status: "added",
          activeValidator: {
            account: activeValidator.ActiveValidator.Account,
            publicKey: activeValidator.ActiveValidator.PublicKey,
          },
        };
        return removeUndefined(summary);
      }
    }
  }

  return undefined;
}

function parseUNLReportChanges(tx: any) {
  const affectedNodes = tx.meta.AffectedNodes.filter((affectedNode: any) => {
    const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
    return node.LedgerEntryType === "UNLReport";
  });

  if (affectedNodes.length !== 1) {
    return undefined;
  }

  const normalizedNode = normalizeNode(affectedNodes[0]);

  return summarizeUNLReport(tx, normalizedNode);
}

export { parseUNLReportChanges };
