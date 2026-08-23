// normalize Sponsorship PreviousFields
export function normalizeSponsorshipPreviousFields(meta: any, tx: any): void {
  if (meta.TransactionResult !== "tesSUCCESS") {
    return;
  }

  if (tx.TransactionType === "SponsorshipSet") {
    normalizeSponsorshipPreviousFieldsSponsorshipSet(meta, tx);
  }
}

export function normalizeSponsorshipPreviousFieldsSponsorshipSet(meta: any, tx: any): void {
  // is SponsorshipSet Set with FeeAmountDelta, but no previousFields for Sponsorship node, means previousFields.FeeAmount is 0
  if (!tx.FeeAmountDelta) {
    return;
  }

  const owner = tx.Account;
  const sponsee = tx.Sponsee;
  const affectedNodes = meta.AffectedNodes || [];

  // we need only modified Sponsorship nodes
  const modifiedSponsorshipNodes = affectedNodes.filter((node: any) => {
    const modifiedNode = node.ModifiedNode;
    return (
      modifiedNode &&
      modifiedNode.LedgerEntryType === "Sponsorship" &&
      modifiedNode.FinalFields?.Owner === owner &&
      modifiedNode.FinalFields?.Sponsee === sponsee
    );
  });

  if (modifiedSponsorshipNodes.length === 0) {
    return;
  }

  // should be only one modified Sponsorship node for this transaction
  const modifiedSponsorshipNode = modifiedSponsorshipNodes[0].ModifiedNode;
  const finalFields = modifiedSponsorshipNode.FinalFields || {};
  const previousFields = modifiedSponsorshipNode.PreviousFields || {};

  if (finalFields.FeeAmount && !previousFields.FeeAmount) {
    previousFields.FeeAmount = "0";
  }
}
