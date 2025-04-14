import BigNumber from "bignumber.js";

import { removeUndefined } from "../../common";
import { buildMPTokenIssuanceID } from "../../models/mptoken";

export function parseMPTokenIssuanceChanges(tx: object): object {
  return new MPTokenIssuanceChanges(tx).call();
}

interface MPTokenIssuanceChangesInterface {
  status: "added" | "modified" | "removed";
  scale?: number;
  flags?: number;
  issuer: string;
  metadata?: string;
  maximumAmount?: string;
  outstandingAmount?: string;
  sequence?: number;
  transferFee?: number;
  mptIssuanceID?: string;

  // changes
  outstandingAmountChange?: string; // amount difference
  flagsChange?: number; // previous flags
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
            flags: node.NewFields.Flags,
            mptIssuanceID,
            issuer: node.NewFields.Issuer,
            sequence: node.NewFields.Sequence,
            transferFee: node.NewFields.TransferFee,
            maximumAmount: node.NewFields.MaximumAmount,
            outstandingAmount: node.NewFields.OutstandingAmount,
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

          this.addChange(mptIssuanceID, {
            status: "modified",
            flags: node.FinalFields.Flags,
            mptIssuanceID,
            issuer: node.FinalFields.Issuer,
            sequence: node.FinalFields.Sequence,
            transferFee: node.FinalFields.TransferFee,
            maximumAmount: node.FinalFields.MaximumAmount,
            outstandingAmount: node.FinalFields.OutstandingAmount,
            metadata: node.FinalFields.Metadata,
            scale: node.FinalFields.AssetScale,

            // changes
            outstandingAmountChange,
            flagsChange: node.PreviousFields.Flags,
          });
        }

        // delete an existing URIToken entry with or without an offer
        if (affectedNode.DeletedNode) {
          // generate mptIssuanceID
          const mptIssuanceID = buildMPTokenIssuanceID(node.FinalFields.Sequence, node.FinalFields.Issuer);

          this.addChange(mptIssuanceID, {
            status: "removed",
            flags: node.FinalFields.Flags,
            mptIssuanceID,
            issuer: node.FinalFields.Issuer,
            sequence: node.FinalFields.Sequence,
            transferFee: node.FinalFields.TransferFee,
            maximumAmount: node.FinalFields.MaximumAmount,
            outstandingAmount: node.FinalFields.OutstandingAmount,
            metadata: node.FinalFields.Metadata,
            scale: node.FinalFields.AssetScale,
          });
        }
      }
    }
  }
}
