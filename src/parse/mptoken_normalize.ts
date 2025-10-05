const TRANSFER_TRANSACTION_TYPES = ["Payment", "CheckCash", "EscrowFinish", "Clawback", "AMMClawback"];

// normalize MPToken and MPTokenIssuance nodes in transaction metadata
// for EscrowCreate, EscrowFinish, EscrowCancel
// by default, MPToken nodes are has missing previousFields details
export function normalizeMPTokensPreviousFields(meta: any, tx: any): void {
  if (meta.TransactionResult !== "tesSUCCESS") {
    return;
  }

  if (tx.TransactionType === "EscrowCreate") {
    normalizeMPTokensPreviousFieldsEscrowCreate(meta);
  } else if (tx.TransactionType === "EscrowFinish") {
    normalizeMPTokensPreviousFieldsEscrowFinish(meta);
  } else if (tx.TransactionType === "EscrowCancel") {
    normalizeMPTokensPreviousFieldsEscrowCancel(meta);
  } else if (TRANSFER_TRANSACTION_TYPES.includes(tx.TransactionType)) {
    normalizeMPTokensPreviousFieldsTransfer(meta, tx);
  }
}

export function normalizeMPTokensPreviousFieldsEscrowCreate(meta: any): void {
  // if EscrowCreate - LockedAmount with "0" value is missed in PreviousFields
  // MPTokenIssuance original example
  // {
  //     "ModifiedNode": {
  //         "FinalFields": {
  //             "Flags": 104,
  //             "Issuer": "rhbqxHTJ82kPkNPcMCLNkB7LZYK3RWvjDN",
  //             "LockedAmount": "10000",
  //             "MaximumAmount": "10000",
  //             "OutstandingAmount": "10000",
  //             "OwnerNode": "0",
  //             "Sequence": 54904
  //         },
  //         "LedgerEntryType": "MPTokenIssuance",
  //         "LedgerIndex": "26865E1A310F5BA5B36E66C5C69BD62295EB2122F1FAE56215BD34BC2B7B4CC0",
  //         "PreviousFields": {},
  //         "PreviousTxnID": "6A0A3E1DAFA79E8BAA98F5EB05FF137E5E3FFB5F143968478E886D48E5594954",
  //         "PreviousTxnLgrSeq": 54909
  //     }
  // },
  // MPTokenIssuance fixed example
  // {
  //     "ModifiedNode": {
  //         "FinalFields": {
  //             "Flags": 104,
  //             "Issuer": "rhbqxHTJ82kPkNPcMCLNkB7LZYK3RWvjDN",
  //             "LockedAmount": "10000",
  //             "MaximumAmount": "10000",
  //             "OutstandingAmount": "10000",
  //             "OwnerNode": "0",
  //             "Sequence": 54904
  //         },
  //         "LedgerEntryType": "MPTokenIssuance",
  //         "LedgerIndex": "26865E1A310F5BA5B36E66C5C69BD62295EB2122F1FAE56215BD34BC2B7B4CC0",
  //         "PreviousFields": {
  //             "LockedAmount": "0",
  //         },
  //         "PreviousTxnID": "6A0A3E1DAFA79E8BAA98F5EB05FF137E5E3FFB5F143968478E886D48E5594954",
  //         "PreviousTxnLgrSeq": 54909
  //     }
  // },
  // MPToken original example
  //   {
  //     "ModifiedNode": {
  //         "FinalFields": {
  //             "Account": "rh6iZBNDiDSDmekSJqTZTHRnT2hNQJk5fA",
  //             "Flags": 0,
  //             "LockedAmount": "10000",
  //             "MPTokenIssuanceID": "0000D678277F62543F873DD8018E1BC8740EB7040B6A636D",
  //             "OwnerNode": "0"
  //         },
  //         "LedgerEntryType": "MPToken",
  //         "LedgerIndex": "9514F9C3E0DE0E06DFF09C58707812D596F356AA71057CEF83C14DF90EB9DDA8",
  //         "PreviousFields": {
  //             "MPTAmount": "10000"
  //         },
  //         "PreviousTxnID": "6A0A3E1DAFA79E8BAA98F5EB05FF137E5E3FFB5F143968478E886D48E5594954",
  //         "PreviousTxnLgrSeq": 54909
  //     }
  // },
  // MPToken fixed example
  //   {
  //     "ModifiedNode": {
  //         "FinalFields": {
  //             "Account": "rh6iZBNDiDSDmekSJqTZTHRnT2hNQJk5fA",
  //             "Flags": 0,
  //             "LockedAmount": "10000",
  //             "MPTokenIssuanceID": "0000D678277F62543F873DD8018E1BC8740EB7040B6A636D",
  //             "OwnerNode": "0"
  //         },
  //         "LedgerEntryType": "MPToken",
  //         "LedgerIndex": "9514F9C3E0DE0E06DFF09C58707812D596F356AA71057CEF83C14DF90EB9DDA8",
  //         "PreviousFields": {
  //             "MPTAmount": "10000",
  //             "LockedAmount": "0"
  //         },
  //         "PreviousTxnID": "6A0A3E1DAFA79E8BAA98F5EB05FF137E5E3FFB5F143968478E886D48E5594954",
  //         "PreviousTxnLgrSeq": 54909
  //     }
  // },

  // find created Escrow node, need amount and mpt_issuance_id
  const escrowNode = meta.AffectedNodes.find((node: any) => {
    const createdNode = node.CreatedNode;
    return createdNode && createdNode.LedgerEntryType === "Escrow";
  });

  if (!escrowNode) {
    return;
  }

  const escrowFields = escrowNode.CreatedNode.NewFields;
  const mptokenIssuanceID = escrowFields?.Amount?.mpt_issuance_id;
  if (!mptokenIssuanceID) {
    return;
  }

  // find MPTokenIssuance node, in only ModifiedNode
  const mptIssuanceNode = meta.AffectedNodes.find((node: any) => {
    const modifiedNode = node.ModifiedNode;
    return modifiedNode && modifiedNode.LedgerEntryType === "MPTokenIssuance";
  });

  if (mptIssuanceNode) {
    const prevFields = mptIssuanceNode.ModifiedNode.PreviousFields;
    if (prevFields && prevFields.LockedAmount === undefined) {
      if (prevFields.LockedAmount === undefined) {
        prevFields.LockedAmount = "0";
      }
    }
  }

  // find MPToken node, in only ModifiedNode
  const mptokenNode = meta.AffectedNodes.find((node: any) => {
    const modifiedNode = node.ModifiedNode;
    return (
      modifiedNode &&
      modifiedNode.LedgerEntryType === "MPToken" &&
      modifiedNode.FinalFields.Account === escrowFields.Account &&
      modifiedNode.FinalFields.MPTokenIssuanceID === mptokenIssuanceID
    );
  });

  if (mptokenNode) {
    const finalFields = mptokenNode.ModifiedNode.FinalFields;
    const prevFields = mptokenNode.ModifiedNode.PreviousFields;
    if (prevFields && prevFields.LockedAmount === undefined) {
      if (finalFields.Amount === undefined) {
        finalFields.Amount = "0";
      }

      if (prevFields.LockedAmount === undefined) {
        prevFields.LockedAmount = "0";
      }
    }
  }
}

export function normalizeMPTokensPreviousFieldsEscrowFinish(meta: any): void {
  // find deleted Escrow node, need amount and mpt_issuance_id
  const escrowNode = meta.AffectedNodes.find((node: any) => {
    const deletedNode = node.DeletedNode;
    return deletedNode && deletedNode.LedgerEntryType === "Escrow";
  });

  if (!escrowNode) {
    return;
  }

  const escrowFields = escrowNode.DeletedNode.FinalFields;
  const mptokenIssuanceID = escrowFields?.Amount?.mpt_issuance_id;
  if (!mptokenIssuanceID) {
    return;
  }

  const value = escrowFields?.Amount?.value ?? "0";

  // only single MPToken has changed and some or all value is unlocked
  if (escrowFields.Account === escrowFields.Destination) {
    // find MPToken node, in only ModifiedNode
    const mptokenNode = meta.AffectedNodes.find((node: any) => {
      const modifiedNode = node.ModifiedNode;
      return (
        modifiedNode &&
        modifiedNode.LedgerEntryType === "MPToken" &&
        modifiedNode.FinalFields.Account === escrowFields.Account &&
        modifiedNode.FinalFields.MPTokenIssuanceID === mptokenIssuanceID
      );
    });

    if (mptokenNode) {
      const finalFields = mptokenNode.ModifiedNode.FinalFields;
      const prevFields = mptokenNode.ModifiedNode.PreviousFields;
      if (prevFields && prevFields.LockedAmount === undefined) {
        if (finalFields.LockedAmount === undefined) {
          finalFields.LockedAmount = "0"; // entire value is unlocked
        }

        if (prevFields.MPTAmount === undefined) {
          prevFields.MPTAmount = "0"; // entire value was locked
        }
      }
    }

    return;
  }

  // transfer from one account to another, so two MPTokens are changed
  // MPToken original example
  //     {
  //     "ModifiedNode": {
  //         "FinalFields": {
  //             "Account": "r3etb2R2JDcQS2gXBJk4M4ShutXJe2zkhs",
  //             "Flags": 0,
  //             "MPTAmount": "10000",
  //             "MPTokenIssuanceID": "0000D678277F62543F873DD8018E1BC8740EB7040B6A636D",
  //             "OwnerNode": "0"
  //         },
  //         "LedgerEntryType": "MPToken",
  //         "LedgerIndex": "8D015BE0F70768424EEE1B2B667ABDE494D57832017D873841E2CB414295864B",
  //         "PreviousFields": {},
  //         "PreviousTxnID": "6EA0DC1F33FB87BC4100D1F0A43A5FC7E85E144DC52F85092DC43A14159BD4F3",
  //         "PreviousTxnLgrSeq": 54910
  //     }
  // },
  // {
  //     "ModifiedNode": {
  //         "FinalFields": {
  //             "Account": "rh6iZBNDiDSDmekSJqTZTHRnT2hNQJk5fA",
  //             "Flags": 0,
  //             "MPTokenIssuanceID": "0000D678277F62543F873DD8018E1BC8740EB7040B6A636D",
  //             "OwnerNode": "0"
  //         },
  //         "LedgerEntryType": "MPToken",
  //         "LedgerIndex": "9514F9C3E0DE0E06DFF09C58707812D596F356AA71057CEF83C14DF90EB9DDA8",
  //         "PreviousFields": {
  //             "LockedAmount": "10000"
  //         },
  //         "PreviousTxnID": "45D255B56446F337295158E10CED9868A62C156D41BD14A0727A14E43726BDA2",
  //         "PreviousTxnLgrSeq": 54911
  //     }
  // },
  // MPToken fixed example
  //     {
  //     "ModifiedNode": {
  //         "FinalFields": {
  //             "Account": "r3etb2R2JDcQS2gXBJk4M4ShutXJe2zkhs",
  //             "Flags": 0,
  //             "MPTAmount": "10000",
  //             "MPTokenIssuanceID": "0000D678277F62543F873DD8018E1BC8740EB7040B6A636D",
  //             "OwnerNode": "0"
  //         },
  //         "LedgerEntryType": "MPToken",
  //         "LedgerIndex": "8D015BE0F70768424EEE1B2B667ABDE494D57832017D873841E2CB414295864B",
  //         "PreviousFields": {
  //             "MPTAmount": "0"
  //         },
  //         "PreviousTxnID": "6EA0DC1F33FB87BC4100D1F0A43A5FC7E85E144DC52F85092DC43A14159BD4F3",
  //         "PreviousTxnLgrSeq": 54910
  //     }
  // },
  // {
  //     "ModifiedNode": {
  //         "FinalFields": {
  //             "Account": "rh6iZBNDiDSDmekSJqTZTHRnT2hNQJk5fA",
  //             "Flags": 0,
  //             "MPTokenIssuanceID": "0000D678277F62543F873DD8018E1BC8740EB7040B6A636D",
  //             "LockedAmount": "0",
  //             "OwnerNode": "0"
  //         },
  //         "LedgerEntryType": "MPToken",
  //         "LedgerIndex": "9514F9C3E0DE0E06DFF09C58707812D596F356AA71057CEF83C14DF90EB9DDA8",
  //         "PreviousFields": {
  //             "LockedAmount": "10000"
  //         },
  //         "PreviousTxnID": "45D255B56446F337295158E10CED9868A62C156D41BD14A0727A14E43726BDA2",
  //         "PreviousTxnLgrSeq": 54911
  //     }
  // },

  // 1 get source MPToken node
  const mptokenSourceNode = meta.AffectedNodes.find((node: any) => {
    const modifiedNode = node.ModifiedNode;
    return (
      modifiedNode &&
      modifiedNode.LedgerEntryType === "MPToken" &&
      modifiedNode.FinalFields.Account === escrowFields.Account &&
      modifiedNode.FinalFields.MPTokenIssuanceID === mptokenIssuanceID
    );
  });

  if (mptokenSourceNode) {
    const finalFields = mptokenSourceNode.ModifiedNode.FinalFields;
    const prevFields = mptokenSourceNode.ModifiedNode.PreviousFields;
    if (prevFields && prevFields.MPTAmount === undefined) {
      if (finalFields.MPTAmount === undefined) {
        finalFields.MPTAmount = "0"; // entire value is sent
      }

      if (finalFields.LockedAmount === undefined) {
        finalFields.LockedAmount = "0"; // entire value is unlocked
      }

      if (prevFields.LockedAmount === undefined) {
        prevFields.LockedAmount = value; // entire value was locked
      }
    }
  }

  // 2 get destination MPToken node
  const mptokenDestNode = meta.AffectedNodes.find((node: any) => {
    const modifiedNode = node.ModifiedNode;
    return (
      modifiedNode &&
      modifiedNode.LedgerEntryType === "MPToken" &&
      modifiedNode.FinalFields.Account === escrowFields.Destination &&
      modifiedNode.FinalFields.MPTokenIssuanceID === mptokenIssuanceID
    );
  });

  if (mptokenDestNode) {
    const prevFields = mptokenDestNode.ModifiedNode.PreviousFields;
    if (prevFields && prevFields.LockedAmount === undefined) {
      if (prevFields.MPTAmount === undefined) {
        prevFields.MPTAmount = "0"; // address had no tokens before
      }
    }
  }
}

export function normalizeMPTokensPreviousFieldsEscrowCancel(meta: any): void {
  // find deleted Escrow node, need amount and mpt_issuance_id
  const escrowNode = meta.AffectedNodes.find((node: any) => {
    const deletedNode = node.DeletedNode;
    return deletedNode && deletedNode.LedgerEntryType === "Escrow";
  });

  if (!escrowNode) {
    return;
  }

  const escrowFields = escrowNode.DeletedNode.FinalFields;
  const mptokenIssuanceID = escrowFields?.Amount?.mpt_issuance_id;
  if (!mptokenIssuanceID) {
    return;
  }

  // only single MPToken has changed and some or all value is unlocked
  // find MPToken node, in only ModifiedNode
  const mptokenNode = meta.AffectedNodes.find((node: any) => {
    const modifiedNode = node.ModifiedNode;
    return (
      modifiedNode &&
      modifiedNode.LedgerEntryType === "MPToken" &&
      modifiedNode.FinalFields.Account === escrowFields.Account &&
      modifiedNode.FinalFields.MPTokenIssuanceID === mptokenIssuanceID
    );
  });

  if (mptokenNode) {
    const finalFields = mptokenNode.ModifiedNode.FinalFields;
    const prevFields = mptokenNode.ModifiedNode.PreviousFields;
    if (prevFields && prevFields.LockedAmount === undefined) {
      if (finalFields.LockedAmount === undefined) {
        finalFields.LockedAmount = "0"; // entire value is unlocked
      }

      if (prevFields.MPTAmount === undefined) {
        prevFields.MPTAmount = "0"; // entire value was locked
      }
    }
  }
}

export function normalizeMPTokensPreviousFieldsTransfer(meta: any, tx: any): void {
  // MPToken original example
  //   {
  //     "ModifiedNode": {
  //         "FinalFields": {
  //             "Account": "rUcPfT7wdGuA8YZiwt58PJCrgzF5UHAaqz",
  //             "Flags": 0,
  //             "MPTAmount": "6969696969",
  //             "MPTokenIssuanceID": "05EA16F276AA755D480BD7BFE4090A4009C6342909716A36",
  //             "OwnerNode": "0"
  //         },
  //         "LedgerEntryType": "MPToken",
  //         "LedgerIndex": "018521692E0F86030D79E2D0943E99C919994BFB956FB706AB32D76FADC34B55",
  //         "PreviousFields": {},
  //         "PreviousTxnID": "245F46D186FB7F25001D0E02E07462FC93E6D6454D53071B9A91BE8A2D1D01B9",
  //         "PreviousTxnLgrSeq": 99228255
  //     }
  // },

  // rUcPfT7wdGuA8YZiwt58PJCrgzF5UHAaqz is destination address
  // MPToken fixed example
  //   {
  //     "ModifiedNode": {
  //         "FinalFields": {
  //             "Account": "rUcPfT7wdGuA8YZiwt58PJCrgzF5UHAaqz",
  //             "Flags": 0,
  //             "MPTAmount": "6969696969",
  //             "MPTokenIssuanceID": "05EA16F276AA755D480BD7BFE4090A4009C6342909716A36",
  //             "OwnerNode": "0"
  //         },
  //         "LedgerEntryType": "MPToken",
  //         "LedgerIndex": "018521692E0F86030D79E2D0943E99C919994BFB956FB706AB32D76FADC34B55",
  //         "PreviousFields": {
  //             "MPTAmount": "0"
  //         },
  //         "PreviousTxnID": "245F46D186FB7F25001D0E02E07462FC93E6D6454D53071B9A91BE8A2D1D01B9",
  //         "PreviousTxnLgrSeq": 99228255
  //     }
  // },

  // payment could go from MPToken to MPToken, or from MPTokenIssuance to MPToken

  if (tx.Destination === undefined) {
    return;
  }

  let amount: any = null;
  if (typeof tx.Amount === "object") {
    amount = tx.Amount;
  } else if (typeof tx.SendMax === "object") {
    amount = tx.SendMax;
  } else if (typeof tx.DeliverMax === "object") {
    amount = tx.DeliverMax;
  }

  if (!amount) {
    return;
  }

  const mptokenIssuanceID = amount.mpt_issuance_id;
  const destination = tx.Destination;

  // because of fee amount could be different than final balance change
  // const value = amount.value;

  if (!mptokenIssuanceID || !destination) {
    return;
  }

  // find MPToken node, in only ModifiedNode
  const mptokenNode = meta.AffectedNodes.find((node: any) => {
    const modifiedNode = node.ModifiedNode;
    return (
      modifiedNode &&
      modifiedNode.LedgerEntryType === "MPToken" &&
      modifiedNode.FinalFields.Account === destination &&
      modifiedNode.FinalFields.MPTokenIssuanceID === mptokenIssuanceID
    );
  });

  if (mptokenNode) {
    const prevFields = mptokenNode.ModifiedNode.PreviousFields;
    if (prevFields && prevFields.LockedAmount === undefined) {
      if (prevFields.MPTAmount === undefined) {
        prevFields.MPTAmount = "0"; // address had no tokens before
      }
    }
  }
}
