import { removeUndefined } from "../../common";
import { normalizeNodes } from "../utils";

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

function summarizeUNLReport(tx: any, node: any) {
  const final = node.diffType === "CreatedNode" ? node.newFields : node.finalFields;

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
  const escrows = normalizeNodes(tx.meta).filter((n: any) => {
    return n.entryType === "UNLReport";
  });

  return escrows.length === 1 ? summarizeUNLReport(tx, escrows[0]) : undefined;
}

export { parseUNLReportChanges };
