import BigNumber from "bignumber.js";
import { TransactionMetadata } from "xrpl";
import parseAmount from "../ledger/amount";
import { NormalizedNode, normalizeNode } from "../utils";
import { FormattedSourceAddress, FormattedDestinationAddress } from "../../types/account";
import { IssuedCurrencyAmount } from "../../types/amounts";

interface FormattedSponsorshipSummaryInterface {
  status?: "created" | "modified" | "deleted";
  sponsorshipID: string;
  owner?: FormattedSourceAddress;
  sponsee?: FormattedDestinationAddress;

  feeAmountDrops: string;
  feeAmount: IssuedCurrencyAmount;
  feeAmountChangeDrops?: string;
  feeAmountChange?: IssuedCurrencyAmount;

  previousTxnLgrSeq?: number;
  previousTxnID?: string;
}

function parseSponsorshipStatus(node: NormalizedNode): "created" | "modified" | "deleted" | undefined {
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

function summarizeSponsorship(node: NormalizedNode): FormattedSponsorshipSummaryInterface {
  const final = node.diffType === "CreatedNode" ? node.newFields : (node.finalFields as any);
  const prev = node.previousFields as any;

  const summary: FormattedSponsorshipSummaryInterface = {
    // Status may be 'created', 'modified', or 'deleted'.
    status: parseSponsorshipStatus(node),

    // The LedgerIndex indicates the Sponsorship ID,
    // which is necessary to sign claims.
    sponsorshipID: node.ledgerIndex,

    // The source address that owns this payment sponsorship.
    // This comes from the sending address of the
    // transaction that created the sponsorship.
    owner: { address: final.Owner },

    // The destination address for this payment sponsorship.
    // While the payment sponsorship is open, this address is the only one that can receive
    // XRP from the sponsorship. This comes from the Destination field of the transaction
    // that created the sponsorship.
    sponsee: { address: final.Sponsee },

    // Total XRP, in drops, that has been allocated to this sponsorship.
    // This includes XRP that has been paid to the destination address.
    // This is initially set by the transaction that created the sponsorship and
    // can be increased if the source address sends a SponsorshipFund transaction.
    feeAmountDrops: new BigNumber(final.FeeAmount || 0).toString(10),
    feeAmount: parseAmount(final.FeeAmount) as IssuedCurrencyAmount,
  };

  if (prev.FeeAmount) {
    // The change in the number of XRP drops allocated to this sponsorship.
    // This is positive if this is a SponsorshipFund transaction.
    summary.feeAmountChangeDrops = new BigNumber(final.FeeAmount || 0)
      .minus(new BigNumber(prev.FeeAmount || 0))
      .toString(10);

    summary.feeAmountChange = parseAmount(prev.FeeAmount) as IssuedCurrencyAmount;
    summary.feeAmountChange.value = new BigNumber(summary.feeAmount?.value || 0)
      .minus(new BigNumber(summary.feeAmountChange.value))
      .toString(10);
  }

  if (node.PreviousTxnID) {
    // The identifying hash of the transaction that
    // most recently modified this payment sponsorship object.
    // You can use this to retrieve the object's history.
    summary.previousTxnID = node.PreviousTxnID;
  }

  if (node.PreviousTxnLgrSeq) {
    // The ledger index of the transaction that
    // most recently modified this payment sponsorship object.
    summary.previousTxnLgrSeq = node.PreviousTxnLgrSeq;
  }

  return summary;
}

function parseSponsorshipChanges(metadata: TransactionMetadata): FormattedSponsorshipSummaryInterface | undefined {
  if (!metadata || !metadata.AffectedNodes) {
    return undefined;
  }

  const affectedNodes = metadata.AffectedNodes.filter((affectedNode: any) => {
    const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
    return node.LedgerEntryType === "Sponsorship";
  });

  if (affectedNodes.length !== 1) {
    return undefined;
  }

  const normalizedNode = normalizeNode(affectedNodes[0]);

  return summarizeSponsorship(normalizedNode);
}

export { parseSponsorshipChanges };
