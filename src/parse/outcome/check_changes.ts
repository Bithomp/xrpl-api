import BigNumber from "bignumber.js";
import { TransactionMetadata } from "xrpl";
import parseAmount from "../ledger/amount";
import { parseSource } from "../ledger/source";
import { parseDestination } from "../ledger/destination";
import { NormalizedNode, normalizeNode } from "../utils";
import { ledgerTimeToUnixTime } from "../../models";
import { FormattedSourceAddress, FormattedDestinationAddress } from "../../types/account";
import { IssuedCurrencyAmount, FormattedIssuedMPTAmount } from "../../types/amounts";

interface FormattedCheckSummaryInterface {
  status?: "created" | "modified" | "deleted";
  checkID: string;
  source?: FormattedSourceAddress;
  destination?: FormattedDestinationAddress;
  sendMax: IssuedCurrencyAmount | FormattedIssuedMPTAmount;
  expiration?: number;
  invoiceID?: string;
  sequence?: number;
  sendMaxChange?: IssuedCurrencyAmount | FormattedIssuedMPTAmount;
  previousTxnID?: string;
}

function parseCheckStatus(node: NormalizedNode): "created" | "modified" | "deleted" | undefined {
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

// "Account": "r3bHm7MsgqDi3HPFeTuZrxM5oiF4L4eMjX",
// "Destination": "r9PpzByDqSefhyU82bLDzr125NwQTKXEut",
// "DestinationNode": "0",
// "Expiration": 792888771,
// "Flags": 0,
// "OwnerNode": "0",
// "PreviousTxnID": "38226E39968CD8B46BCBCFC6837CD3A7A43794207FC8BF6143A97317503238A1",
// "PreviousTxnLgrSeq": 93993923,
// "SendMax": {
//   "currency": "4655524945000000000000000000000000000000",
//   "issuer": "rsbKWsVx8io3WhKaLhs4ehfeFhwQRmX6BC",
//   "value": "80000000"
// },
// "Sequence": 93993915
function summarizeCheck(node: NormalizedNode): FormattedCheckSummaryInterface {
  const final = node.diffType === "CreatedNode" ? node.newFields : (node.finalFields as any);
  const prev = node.previousFields as any;

  const summary: FormattedCheckSummaryInterface = {
    // Status may be 'created', 'modified', or 'deleted'.
    status: parseCheckStatus(node),

    // The LedgerIndex indicates the Channel ID,
    // which is necessary to sign claims.
    checkID: node.ledgerIndex,

    // The source address that owns this payment check.
    // This comes from the sending address of the
    // transaction that created the check.
    source: parseSource(final),

    // The destination address for this payment check.
    // While the payment check is open, this address is the only one that can receive
    // XRP from the check. This comes from the Destination field of the transaction
    // that created the check.
    destination: parseDestination(final),

    // Total XRP, in drops, that has been allocated to this check.
    // This includes XRP that has been paid to the destination address.
    // This is initially set by the transaction that created the check and
    // can be increased if the source address sends a PaymentChannelFund transaction.
    sendMax: parseAmount(final.SendMax),

    // The sequence number of the transaction that created this check.
    sequence: final.Sequence,
  };

  if (final.Expiration) {
    summary.expiration = ledgerTimeToUnixTime(final.Expiration);
  }

  if (final.InvoiceID) {
    // The InvoiceID is an optional 256-bit hash that can be used to identify
    // the reason for the check. This is set by the transaction that created the check.
    summary.invoiceID = final.InvoiceID;
  }

  if (prev.SendMax) {
    // // The change in the number of XRP as object or IOU allocated to this check.
    // // This is positive if this is a PaymentChannelFund transaction.
    summary.sendMaxChange = parseAmount(prev.SendMax);
    summary.sendMaxChange.value = new BigNumber(summary.sendMaxChange.value)
      .minus(new BigNumber(summary.sendMax.value))
      .toString(10);
  }

  if (node.PreviousTxnID) {
    // The identifying hash of the transaction that
    // most recently modified this payment check object.
    // You can use this to retrieve the object's history.
    summary.previousTxnID = node.PreviousTxnID;
  }

  return summary;
}

function parseCheckChanges(metadata: TransactionMetadata): FormattedCheckSummaryInterface | undefined {
  const affectedNodes = metadata.AffectedNodes.filter((affectedNode: any) => {
    const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
    return node.LedgerEntryType === "Check";
  });

  if (affectedNodes.length !== 1) {
    return undefined;
  }

  const normalizedNode = normalizeNode(affectedNodes[0]);

  return summarizeCheck(normalizedNode);
}

export { parseCheckChanges };
