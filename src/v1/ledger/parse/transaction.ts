import { removeUndefined } from "../../common";

import parseOutcome from "../parse_outcome";
import { Outcome } from "../../transaction/types";

import { FormattedAccountDeleteSpecification } from "../../common/types/objects/account";
import { FormattedSettingsSpecification } from "../../common/types/objects/settings";
import {
  FormattedCheckCancelSpecification,
  FormattedCheckCashSpecification,
  FormattedCheckCreateSpecification,
} from "../../common/types/objects/checks";
import { FormattedDepositPreauthSpecification } from "../../common/types/objects/deposits";
import {
  FormattedEscrowCancelSpecification,
  FormattedEscrowCreateSpecification,
  FormattedEscrowFinishSpecification,
} from "../../common/types/objects/escrows";
import {
  FormattedOfferCancelSpecification,
  FormattedOfferCreateSpecification,
} from "../../common/types/objects/offers";
import { FormattedPaymentSpecification } from "../../common/types/objects/payments";
import {
  FormattedPaymentChannelClaimSpecification,
  FormattedPaymentChannelCreateSpecification,
  FormattedPaymentChannelFundSpecification,
} from "../../common/types/objects/payment_channels";
import { FormattedTicketCreateSpecification } from "../../common/types/objects/tickets";
import { FormattedTrustlineSpecification } from "../../common/types/objects/trustlines";
import {
  FormattedNFTokenBurnSpecification,
  FormattedNFTokenMintSpecification,
} from "../../common/types/objects/nftokens";

import parseSettings from "./settings";
import parseAccountDelete from "./account-delete";
import parseCheckCancel from "./check-cancel";
import parseCheckCash from "./check-cash";
import parseCheckCreate from "./check-create";
import parseDepositPreauth from "./deposit-preauth";
import parseEscrowCancel from "./escrow-cancel";
import parseEscrowCreation from "./escrow-create";
import parseEscrowFinish from "./escrow-finish";
import parseOfferCancel from "./offer-cancel";
import parseOfferCreation from "./offer-create";
import parsePayment from "./payment";
import parsePaymentChannelClaim from "./payment-channel-claim";
import parsePaymentChannelCreate from "./payment-channel-create";
import parsePaymentChannelFund from "./payment-channel-fund";
import parseTicketCreate from "./ticket-create";
import parseTrustline from "./trustline";
import parseNFTokenBurn from "./nftoken-burn";
import parseNFTokenMint from "./nftoken-mint";
import {
  parseNFTokenCancelOffer,
  parseNFTokenCreateOffer,
  parseNFTokenAcceptOffer,
} from "../../../models/account_nfts";
import parseAmendment from "./amendment"; // pseudo-transaction
import parseFeeUpdate from "./fee-update"; // pseudo-transaction

// Ordering matches https://developers.ripple.com/transaction-types.html
const transactionTypeToType = {
  AccountSet: "settings",
  AccountDelete: "accountDelete",
  CheckCancel: "checkCancel",
  CheckCash: "checkCash",
  CheckCreate: "checkCreate",
  DepositPreauth: "depositPreauth",
  EscrowCancel: "escrowCancellation",
  EscrowCreate: "escrowCreation",
  EscrowFinish: "escrowExecution",
  OfferCancel: "orderCancellation",
  OfferCreate: "order",
  Payment: "payment",
  PaymentChannelClaim: "paymentChannelClaim",
  PaymentChannelCreate: "paymentChannelCreate",
  PaymentChannelFund: "paymentChannelFund",
  SetRegularKey: "settings",
  SignerListSet: "settings",
  TicketCreate: "ticketCreate",
  TrustSet: "trustline",

  NFTokenBurn: "nftokenBurn",
  NFTokenMint: "nftokenMint",
  NFTokenCancelOffer: "nftokenCancelOffer",
  NFTokenCreateOffer: "nftokenCreateOffer",
  NFTokenAcceptOffer: "nftokenAcceptOffer",

  EnableAmendment: "amendment", // pseudo-transaction
  SetFee: "feeUpdate", // pseudo-transaction
};

function parseTransactionType(type) {
  return transactionTypeToType[type] || null;
}

const parserTypeFunc = {
  settings: parseSettings,
  accountDelete: parseAccountDelete,
  checkCancel: parseCheckCancel,
  checkCash: parseCheckCash,
  checkCreate: parseCheckCreate,
  depositPreauth: parseDepositPreauth,
  escrowCancellation: parseEscrowCancel,
  escrowCreation: parseEscrowCreation,
  escrowExecution: parseEscrowFinish,
  orderCancellation: parseOfferCancel,
  order: parseOfferCreation,
  payment: parsePayment,
  paymentChannelClaim: parsePaymentChannelClaim,
  paymentChannelCreate: parsePaymentChannelCreate,
  paymentChannelFund: parsePaymentChannelFund,
  ticketCreate: parseTicketCreate,
  trustline: parseTrustline,

  nftokenBurn: parseNFTokenBurn,
  nftokenMint: parseNFTokenMint,
  nftokenCancelOffer: parseNFTokenCancelOffer,
  nftokenCreateOffer: parseNFTokenCreateOffer,
  nftokenAcceptOffer: parseNFTokenAcceptOffer,

  amendment: parseAmendment, // pseudo-transaction
  feeUpdate: parseFeeUpdate, // pseudo-transaction
};

export type FormattedSpecification =
  | FormattedSettingsSpecification
  | FormattedAccountDeleteSpecification
  | FormattedCheckCancelSpecification
  | FormattedCheckCashSpecification
  | FormattedCheckCreateSpecification
  | FormattedDepositPreauthSpecification
  | FormattedEscrowCancelSpecification
  | FormattedEscrowCreateSpecification
  | FormattedEscrowFinishSpecification
  | FormattedOfferCancelSpecification
  | FormattedOfferCreateSpecification
  | FormattedPaymentSpecification
  | FormattedPaymentChannelClaimSpecification
  | FormattedPaymentChannelCreateSpecification
  | FormattedPaymentChannelFundSpecification
  | FormattedTicketCreateSpecification
  | FormattedTrustlineSpecification
  | FormattedNFTokenBurnSpecification
  | FormattedNFTokenMintSpecification;

export interface TransactionDetailsInterface {
  type: string;
  address: string;
  sequence: number;
  id: string;
  specification: FormattedSpecification;
  outcome?: Outcome;
  rawTransaction?: string;
}

// includeRawTransaction: undefined by default (getTransaction)
function parseTransaction(tx: any, includeRawTransaction: boolean): TransactionDetailsInterface {
  const type = parseTransactionType(tx.TransactionType);

  // tslint:disable-next-line:ban-types
  const parser: Function = parserTypeFunc[type];

  const specification = parser
    ? parser(tx)
    : {
        UNAVAILABLE: "Unrecognized transaction type.",
        SEE_RAW_TRANSACTION: "Since this type is unrecognized, `rawTransaction` is included in this response.",
      };
  if (!parser) {
    includeRawTransaction = true;
  }

  const outcome = parseOutcome(tx);
  return removeUndefined({
    // tslint:disable-next-line:object-literal-shorthand
    type: type,
    address: tx.Account,
    sequence: tx.Sequence,
    id: tx.hash,
    specification: removeUndefined(specification),
    outcome: outcome ? removeUndefined(outcome) : undefined,
    rawTransaction: includeRawTransaction ? JSON.stringify(tx) : undefined,
  });
}

export { parseTransactionType, parseTransaction };
