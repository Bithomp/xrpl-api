import { removeUndefined } from "../common";

import { parseOutcome } from "./outcome";
import { Outcome } from "../v1/transaction/types";

import { FormattedAccountDeleteSpecification } from "../v1/common/types/objects/account";
import { FormattedSettingsSpecification } from "../v1/common/types/objects/settings";
import {
  FormattedCheckCancelSpecification,
  FormattedCheckCashSpecification,
  FormattedCheckCreateSpecification,
} from "../v1/common/types/objects/checks";
import { FormattedDepositPreauthSpecification } from "../v1/common/types/objects/deposits";
import {
  FormattedEscrowCancelSpecification,
  FormattedEscrowCreateSpecification,
  FormattedEscrowFinishSpecification,
} from "../v1/common/types/objects/escrows";
import {
  FormattedOfferCancelSpecification,
  FormattedOfferCreateSpecification,
} from "../v1/common/types/objects/offers";
import { FormattedPaymentSpecification } from "../v1/common/types/objects/payments";
import {
  FormattedPaymentChannelClaimSpecification,
  FormattedPaymentChannelCreateSpecification,
  FormattedPaymentChannelFundSpecification,
} from "../v1/common/types/objects/payment_channels";
import { FormattedTicketCreateSpecification } from "../v1/common/types/objects/tickets";
import { FormattedTrustlineSpecification } from "../v1/common/types/objects/trustlines";
import {
  FormattedNFTokenBurnSpecification,
  FormattedNFTokenMintSpecification,
  FormattedNFTokenCancelOfferSpecification,
  FormattedNFTokenCreateOfferSpecification,
  FormattedNFTokenAcceptOfferSpecification,
} from "../v1/common/types/objects/nftokens";
import {
  FormattedURITokenBurnSpecification,
  FormattedURITokenBuySpecification,
  FormattedURITokenCreateSellOfferSpecification,
  FormattedURITokenCancelSellOfferSpecification,
  FormattedURITokenMintSpecification,
} from "../v1/common/types/objects/uritokens";

import { FormattedImportSpecification } from "../v1/common/types/objects/import";
import { FormattedInvokeSpecification } from "../v1/common/types/objects/invoke";

import { FormattedAmendmentSpecification } from "../v1/common/types/objects/amendments";
import { FormattedFeeUpdateSpecification } from "../v1/common/types/objects/fees";

import parseSettings from "./specification/settings";
import parseAccountDelete from "./specification/account-delete";
import parseCheckCancel from "./specification/check-cancel";
import parseCheckCash from "./specification/check-cash";
import parseCheckCreate from "./specification/check-create";
import parseDepositPreauth from "./specification/deposit-preauth";
import parseEscrowCancel from "./specification/escrow-cancel";
import parseEscrowCreation from "./specification/escrow-create";
import parseEscrowFinish from "./specification/escrow-finish";
import parseOfferCancel from "./specification/offer-cancel";
import parseOfferCreate from "./specification/offer-create";
import parsePayment from "./specification/payment";
import parsePaymentChannelClaim from "./specification/payment-channel-claim";
import parsePaymentChannelCreate from "./specification/payment-channel-create";
import parsePaymentChannelFund from "./specification/payment-channel-fund";
import parseTicketCreate from "./specification/ticket-create";
import parseTrustline from "./specification/trustline";

import parseNFTokenBurn from "./specification/nftoken-burn";
import parseNFTokenMint from "./specification/nftoken-mint";
import parseNFTokenCancelOffer from "./specification/nftoken-cancel-offer";
import parseNFTokenCreateOffer from "./specification/nftoken-create-offer";
import parseNFTokenAcceptOffer from "./specification/nftoken-accept-offer";

import parseURITokenBurn from "./specification/uritoken-burn";
import parseURITokenBuy from "./specification/uritoken-buy";
import parseURITokenCancelSellOffer from "./specification/uritoken-cancel-sell-offer";
import parseURITokenCreateSellOffer from "./specification/uritoken-create-sell-offer";
import parseURITokenMint from "./specification/uritoken-mint";

import parseImport from "./specification/import";
import parseInvoke from "./specification/invoke";

import parseAmendment from "./specification/amendment"; // pseudo-transaction
import parseFeeUpdate from "./specification/fee-update"; // pseudo-transaction

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

  URITokenMint: "uritokenMint",
  URITokenBurn: "uritokenBurn",
  URITokenCreateSellOffer: "uritokenCreateSellOffer",
  URITokenCancelSellOffer: "uritokenCancelSellOffer",
  URITokenBuy: "uritokenBuy",

  Import: "import",
  Invoke: "invoke",

  EnableAmendment: "amendment", // pseudo-transaction
  SetFee: "feeUpdate", // pseudo-transaction
};

function parseTransactionType(type: string): string {
  return transactionTypeToType[type] || type;
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
  order: parseOfferCreate,
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

  uritokenBurn: parseURITokenBurn,
  uritokenBuy: parseURITokenBuy,
  uritokenCreateSellOffer: parseURITokenCreateSellOffer,
  uritokenCancelSellOffer: parseURITokenCancelSellOffer,
  uritokenMint: parseURITokenMint,

  import: parseImport,
  invoke: parseInvoke,

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
  | FormattedNFTokenMintSpecification
  | FormattedNFTokenCancelOfferSpecification
  | FormattedNFTokenCreateOfferSpecification
  | FormattedNFTokenAcceptOfferSpecification
  | FormattedURITokenBurnSpecification
  | FormattedURITokenBuySpecification
  | FormattedURITokenCreateSellOfferSpecification
  | FormattedURITokenCancelSellOfferSpecification
  | FormattedURITokenMintSpecification
  | FormattedImportSpecification
  | FormattedInvokeSpecification
  | FormattedAmendmentSpecification
  | FormattedFeeUpdateSpecification;

export interface FormattedTransaction {
  type: string;
  address: string;
  sequence: number;
  id: string;
  specification: FormattedSpecification;
  outcome?: Outcome;
  rawTransaction?: string;
}

// includeRawTransaction: undefined by default (getTransaction)
function parseTransaction(tx: any, includeRawTransaction: boolean): FormattedTransaction {
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
