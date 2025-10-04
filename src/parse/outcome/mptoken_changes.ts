import BigNumber from "bignumber.js";

import { removeUndefined } from "../../common";

import parseMPTokenFlags from "../ledger/mptoken-flags";
import { MPTokenFlagsKeysInterface } from "../../types/mptokens";

export function parseMPTokenChanges(tx: object): object {
  return new MPTokenChanges(tx).call();
}

interface MPTokenChangesInterface {
  status: "added" | "modified" | "removed";
  flags?: MPTokenFlagsKeysInterface;
  account: string;
  amount?: string;
  mptIssuanceID?: string;

  // changes
  amountChange?: string; // amount difference
  flagsChange?: MPTokenFlagsKeysInterface; // previous flags
}

class MPTokenChanges {
  public readonly tx: any;
  public readonly changes: { [mptIssuanceID: string]: { [holder: string]: MPTokenChangesInterface } };

  public constructor(tx: any) {
    this.tx = tx;
    this.changes = {};
  }

  public call(): any {
    if (this.hasAffectedNodes() === false) {
      return this.changes;
    }

    this.parseAffectedNodes();

    return this.changes;
  }

  private hasAffectedNodes(): boolean {
    if (this.tx.meta?.AffectedNodes === undefined) {
      return false;
    }

    if (this.tx.meta?.AffectedNodes?.length === 0) {
      return false;
    }

    return true;
  }

  private addChange(mptIssuanceID: string, account: string, change: MPTokenChangesInterface): void {
    if (!this.changes[mptIssuanceID]) {
      this.changes[mptIssuanceID] = {};
    }

    this.changes[mptIssuanceID][account] = removeUndefined(change);
  }

  private parseAffectedNodes(): void {
    for (const affectedNode of this.tx.meta.AffectedNodes) {
      const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
      if (node?.LedgerEntryType === "MPToken" && node?.LedgerIndex) {
        // create a new AMM entry
        if (affectedNode.CreatedNode) {
          const mptIssuanceID = node.NewFields.MPTokenIssuanceID;
          const account = node.NewFields.Account;

          this.addChange(mptIssuanceID, account, {
            status: "added",
            flags: parseMPTokenFlags(node.NewFields.Flags),
            mptIssuanceID,
            account,
            amount: node.NewFields.MPTAmount,
          });
        }

        // modify an existing AMM entry
        if (affectedNode.ModifiedNode) {
          const mptIssuanceID = node.FinalFields.MPTokenIssuanceID;
          const account = node.FinalFields.Account;

          // calc amount change
          let amountChange: string | undefined = new BigNumber(node.FinalFields.MPTAmount ?? 0)
            .minus(node.PreviousFields.MPTAmount ?? 0)
            .toString();

          if (amountChange === "0") {
            amountChange = undefined;
          }

          let flagsChange: MPTokenFlagsKeysInterface | undefined;
          if (node.PreviousFields?.Flags !== undefined) {
            flagsChange = parseMPTokenFlags(node.PreviousFields.Flags);
          }

          this.addChange(mptIssuanceID, account, {
            status: "modified",
            flags: parseMPTokenFlags(node.FinalFields.Flags),
            mptIssuanceID,
            account,
            amount: node.FinalFields.MPTAmount,

            // changes
            amountChange,
            flagsChange,
          });
        }

        // delete an existing AMM entry
        if (affectedNode.DeletedNode) {
          const mptIssuanceID = node.FinalFields.MPTokenIssuanceID;
          const account = node.FinalFields.Account;

          this.addChange(mptIssuanceID, account, {
            status: "removed",
            flags: parseMPTokenFlags(node.FinalFields.Flags),
            mptIssuanceID,
            account,
            amount: node.FinalFields.MPTAmount,
          });
        }
      }
    }
  }
}
