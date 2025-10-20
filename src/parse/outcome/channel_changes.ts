import BigNumber from "bignumber.js";
import { TransactionMetadata } from "xrpl";
import parseAmount from "../ledger/amount";
import { parseSource } from "../ledger/source";
import { parseDestination } from "../ledger/destination";
import { NormalizedNode, normalizeNode } from "../utils";
import { FormattedSourceAddress, FormattedDestinationAddress } from "../../types/account";
import { IssuedCurrencyAmount } from "../../types/amounts";

interface FormattedChannelSummaryInterface {
  status?: "created" | "modified" | "deleted";
  channelId: string;
  source?: FormattedSourceAddress;
  destination?: FormattedDestinationAddress;
  channelAmountDrops: string;
  amount: IssuedCurrencyAmount;
  channelBalanceDrops?: string;
  balance?: IssuedCurrencyAmount;
  channelAmountChangeDrops?: string;
  amountChange?: IssuedCurrencyAmount;
  channelBalanceChangeDrops?: string;
  balanceChange?: IssuedCurrencyAmount;
  previousTxnID?: string;
}

function parsePaymentChannelStatus(node: NormalizedNode): "created" | "modified" | "deleted" | undefined {
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

function summarizePaymentChannel(node: NormalizedNode): FormattedChannelSummaryInterface {
  const final = node.diffType === "CreatedNode" ? node.newFields : (node.finalFields as any);
  const prev = node.previousFields as any;

  const summary: FormattedChannelSummaryInterface = {
    // Status may be 'created', 'modified', or 'deleted'.
    status: parsePaymentChannelStatus(node),

    // The LedgerIndex indicates the Channel ID,
    // which is necessary to sign claims.
    channelId: node.ledgerIndex,

    // The source address that owns this payment channel.
    // This comes from the sending address of the
    // transaction that created the channel.
    source: parseSource(final),

    // The destination address for this payment channel.
    // While the payment channel is open, this address is the only one that can receive
    // XRP from the channel. This comes from the Destination field of the transaction
    // that created the channel.
    destination: parseDestination(final),

    // Total XRP, in drops, that has been allocated to this channel.
    // This includes XRP that has been paid to the destination address.
    // This is initially set by the transaction that created the channel and
    // can be increased if the source address sends a PaymentChannelFund transaction.
    channelAmountDrops: new BigNumber(final.Amount || 0).toString(10),
    amount: parseAmount(final.Amount) as IssuedCurrencyAmount,
  };

  if (final.Balance) {
    // Total XRP, in drops, already paid out by the channel.
    // The difference between this value and the Amount field is how much XRP can still
    // be paid to the destination address with PaymentChannelClaim transactions.
    // If the channel closes, the remaining difference is returned to the source address.
    summary.channelBalanceDrops = new BigNumber(final.Balance || 0).toString(10);
    summary.balance = parseAmount(final.Balance) as IssuedCurrencyAmount;
  }

  if (prev.Amount) {
    // The change in the number of XRP drops allocated to this channel.
    // This is positive if this is a PaymentChannelFund transaction.
    summary.channelAmountChangeDrops = new BigNumber(final.Amount).minus(new BigNumber(prev.Amount || 0)).toString(10);

    summary.amountChange = parseAmount(prev.Amount) as IssuedCurrencyAmount;
    summary.amountChange.value = new BigNumber(summary.amount.value)
      .minus(new BigNumber(summary.amountChange.value))
      .toString(10);
  }

  if (prev.Balance) {
    // The change in the number of XRP drops already paid out by the channel.
    summary.channelBalanceChangeDrops = new BigNumber(final.Balance)
      .minus(new BigNumber(prev.Balance || 0))
      .toString(10);

    summary.balanceChange = parseAmount(prev.Balance) as IssuedCurrencyAmount;
    summary.balanceChange.value = new BigNumber(summary.balanceChange.value)
      .minus(new BigNumber(summary.balance?.value || 0))
      .toString(10);
  }

  if (node.PreviousTxnID) {
    // The identifying hash of the transaction that
    // most recently modified this payment channel object.
    // You can use this to retrieve the object's history.
    summary.previousTxnID = node.PreviousTxnID;
  }

  return summary;
}

function parseChannelChanges(metadata: TransactionMetadata): FormattedChannelSummaryInterface | undefined {
  const affectedNodes = metadata.AffectedNodes.filter((affectedNode: any) => {
    const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
    return node.LedgerEntryType === "PayChannel";
  });

  if (affectedNodes.length !== 1) {
    return undefined;
  }

  const normalizedNode = normalizeNode(affectedNodes[0]);

  return summarizePaymentChannel(normalizedNode);
}

export { parseChannelChanges };
