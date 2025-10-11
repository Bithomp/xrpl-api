import BigNumber from "bignumber.js";

import { removeUndefined } from "../../common";
import { buildMPTokenIssuanceID } from "../../models/mptoken";

import parseMPTokenIssuanceFlags from "../ledger/mptoken-issuance-flags";
import { MPTokenIssuanceFlagsKeysInterface } from "../../types/mptokens";

export function parseMPTokenIssuanceChanges(tx: object): object {
  return new MPTokenIssuanceChanges(tx).call();
}

interface MPTokenIssuanceChangesInterface {
  status: "added" | "modified" | "removed";
  scale?: number;
  flags?: MPTokenIssuanceFlagsKeysInterface;
  issuer: string;
  metadata?: string;
  maximumAmount?: string;
  outstandingAmount?: string;
  lockedAmount?: string;
  sequence?: number;
  transferFee?: number;
  mptIssuanceID?: string;

  // changes
  outstandingAmountChange?: string; // amount difference
  lockedAmountChange?: string; // locked amount difference
  flagsChange?: MPTokenIssuanceFlagsKeysInterface; // previous flags
}

class MPTokenIssuanceChanges {
  public readonly tx: any;
  public readonly changes: { [mptIssuanceID: string]: MPTokenIssuanceChangesInterface };

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

  private addChange(mptIssuanceID: string, change: MPTokenIssuanceChangesInterface): void {
    this.changes[mptIssuanceID] = removeUndefined(change);
  }

  private parseAffectedNodes(): void {
    for (const affectedNode of this.tx.meta.AffectedNodes) {
      const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
      if (node?.LedgerEntryType === "MPTokenIssuance" && node?.LedgerIndex) {
        // create a new URIToken entry with or without offer
        if (affectedNode.CreatedNode) {
          // generate mptIssuanceID
          const mptIssuanceID = buildMPTokenIssuanceID(node.NewFields.Sequence, node.NewFields.Issuer);

          this.addChange(mptIssuanceID, {
            status: "added",
            flags: parseMPTokenIssuanceFlags(node.NewFields.Flags),
            mptIssuanceID,
            issuer: node.NewFields.Issuer,
            sequence: node.NewFields.Sequence,
            transferFee: node.NewFields.TransferFee,
            maximumAmount: node.NewFields.MaximumAmount,
            outstandingAmount: node.NewFields.OutstandingAmount,
            lockedAmount: node.NewFields.LockedAmount,
            metadata: node.NewFields.Metadata,
            scale: node.NewFields.AssetScale,
          });
        }

        // modify an existing URIToken entry, create an offer, cancel an offer, change an owner, or change an offer
        if (affectedNode.ModifiedNode) {
          // generate mptIssuanceID
          const mptIssuanceID = buildMPTokenIssuanceID(node.FinalFields.Sequence, node.FinalFields.Issuer);

          // calc amount change
          let outstandingAmountChange: string | undefined = new BigNumber(node.FinalFields.OutstandingAmount ?? 0)
            .minus(node.PreviousFields.OutstandingAmount ?? 0)
            .toString();

          if (outstandingAmountChange === "0") {
            outstandingAmountChange = undefined;
          }

          let lockedAmountChange: string | undefined = undefined;
          if (node.PreviousFields.LockedAmount !== undefined) {
            lockedAmountChange = new BigNumber(node.FinalFields.LockedAmount ?? 0)
              .minus(new BigNumber(node.PreviousFields.LockedAmount ?? 0))
              .toString();

            if (lockedAmountChange === "0") {
              lockedAmountChange = undefined;
            }
          }

          let lockedAmount = node.FinalFields.LockedAmount;
          if (lockedAmount === undefined && lockedAmountChange !== undefined) {
            lockedAmount = "0";
          }

          let flagsChange: MPTokenIssuanceFlagsKeysInterface | undefined;
          if (node.PreviousFields?.Flags !== undefined) {
            flagsChange = parseMPTokenIssuanceFlags(node.PreviousFields.Flags);
          }

          this.addChange(mptIssuanceID, {
            status: "modified",
            flags: parseMPTokenIssuanceFlags(node.FinalFields.Flags),
            mptIssuanceID,
            issuer: node.FinalFields.Issuer,
            sequence: node.FinalFields.Sequence,
            transferFee: node.FinalFields.TransferFee,
            maximumAmount: node.FinalFields.MaximumAmount,
            outstandingAmount: node.FinalFields.OutstandingAmount,
            lockedAmount,
            metadata: node.FinalFields.Metadata,
            scale: node.FinalFields.AssetScale,

            // changes
            outstandingAmountChange,
            lockedAmountChange,
            flagsChange,
          });
        }

        // delete an existing URIToken entry with or without an offer
        if (affectedNode.DeletedNode) {
          // generate mptIssuanceID
          const mptIssuanceID = buildMPTokenIssuanceID(node.FinalFields.Sequence, node.FinalFields.Issuer);

          this.addChange(mptIssuanceID, {
            status: "removed",
            flags: parseMPTokenIssuanceFlags(node.FinalFields.Flags),
            mptIssuanceID,
            issuer: node.FinalFields.Issuer,
            sequence: node.FinalFields.Sequence,
            transferFee: node.FinalFields.TransferFee,
            maximumAmount: node.FinalFields.MaximumAmount,
            outstandingAmount: node.FinalFields.OutstandingAmount,
            lockedAmount: node.FinalFields.LockedAmount,
            metadata: node.FinalFields.Metadata,
            scale: node.FinalFields.AssetScale,
          });
        }
      }
    }
  }
}
