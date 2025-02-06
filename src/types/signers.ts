export interface SignerEntry {
  SignerEntry: {
    Account: string;
    SignerWeight: number;
  };
}

export interface FormattedSigner {
  address: string;
  weight: number;
}

export interface TransactionSigner {
  Signer: {
    SigningPubKey: string;
    TxnSignature: string;
    Account?: string;
  };
}

export interface FormattedTransactionSigner {
  address: string;
  signingPubKey?: string;
  txnSignature?: string;
}
