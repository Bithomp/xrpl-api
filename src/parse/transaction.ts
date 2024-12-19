import { XrplDefinitionsBase } from "ripple-binary-codec";
import { removeUndefined } from "../common";
import { parseAccount } from "./ledger/account";

import { parseOutcome } from "./outcome";
import { Outcome } from "../types/outcome";

import { FormattedAccountDeleteSpecification } from "../types/account";
import { FormattedSettingsSpecification } from "../types/settings";
import {
  FormattedCheckCancelSpecification,
  FormattedCheckCashSpecification,
  FormattedCheckCreateSpecification,
} from "../types/checks";
import { FormattedDepositPreauthSpecification } from "../types/deposits";
import {
  FormattedEscrowCancelSpecification,
  FormattedEscrowCreateSpecification,
  FormattedEscrowFinishSpecification,
} from "../types/escrows";
import { FormattedOfferCancelSpecification, FormattedOfferCreateSpecification } from "../types/offers";
import { FormattedPaymentSpecification } from "../types/payments";
import {
  FormattedPaymentChannelClaimSpecification,
  FormattedPaymentChannelCreateSpecification,
  FormattedPaymentChannelFundSpecification,
} from "../types/payment_channels";
import { FormattedTicketCreateSpecification } from "../types/tickets";
import { FormattedTrustlineSpecification } from "../types/trustlines";
import {
  FormattedNFTokenBurnSpecification,
  FormattedNFTokenMintSpecification,
  FormattedNFTokenCancelOfferSpecification,
  FormattedNFTokenCreateOfferSpecification,
  FormattedNFTokenAcceptOfferSpecification,
} from "../types/nftokens";
import {
  FormattedURITokenBurnSpecification,
  FormattedURITokenBuySpecification,
  FormattedURITokenCreateSellOfferSpecification,
  FormattedURITokenCancelSellOfferSpecification,
  FormattedURITokenMintSpecification,
} from "../types/uritokens";

import { FormattedImportSpecification } from "../types/import";
import { FormattedInvokeSpecification } from "../types/invoke";
import { FormattedUNLReportSpecification } from "../types/unl_reports";
import { FormattedRemitsSpecification } from "../types/remits";

import { FormattedClawbackSpecification } from "../types/clawback";

import {
  FormattedAmmBidSpecification,
  FormattedAmmCreateSpecification,
  FormattedAmmDeleteSpecification,
  FormattedAmmDepositSpecification,
  FormattedAmmWithdrawSpecification,
  FormattedAmmVoteSpecification,
} from "../types/amm";

import { FormattedDIDSetSpecification, FormattedDIDDeleteSpecification } from "../types/did";

import { FormattedOracleSetSpecification, FormattedOracleDeleteSpecification } from "../types/oracle";

import {
  FormattedMPTokenIssuanceCreateSpecification,
  FormattedMPTokenAuthorizeSpecification,
  FormattedMPTokenIssuanceSetSpecification,
  FormattedMPTokenIssuanceDestroySpecification,
} from "../types/mptokens";

import { FormattedGenesisMintSpecification } from "../types/genesis_mint";

import { FormattedAmendmentSpecification } from "../types/amendments";
import { FormattedFeeUpdateSpecification } from "../types/fees";

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
import parseUNLReport from "./specification/unl-report";
import parseRemit from "./specification/remit";

import parseClawback from "./specification/clawback";

import parseAmmBid from "./specification/amm-bid";
import parseAmmCreate from "./specification/amm-create";
import parseAmmDelete from "./specification/amm-delete";
import parseAmmDeposit from "./specification/amm-deposit";
import parseAmmWithdraw from "./specification/amm-withdraw";
import parseAmmVote from "./specification/amm-vote";

import parseDIDSet from "./specification/did-set";
import parseDIDDelete from "./specification/did-delete";

import parseOracleSet from "./specification/oracle-set";
import parseOracleDelete from "./specification/oracle-delete";

import parseMPTokenIssuanceCreate from "./specification/mptoken-issuance-create";
import parseMPTokenAuthorize from "./specification/mptoken-authorize";
import parseMPTokenIssuanceSet from "./specification/mptoken-issuance-set";
import parseMPTokenIssuanceDestroy from "./specification/mptoken-issuance-destroy";

import parseGenesisMint from "./specification/genesis-mint";

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
  UNLReport: "unlReport",
  Remit: "remit",

  Clawback: "clawback",

  AMMBid: "ammBid",
  AMMCreate: "ammCreate",
  AMMDelete: "ammDelete",
  AMMDeposit: "ammDeposit",
  AMMWithdraw: "ammWithdraw",
  AMMVote: "ammVote",

  DIDSet: "didSet",
  DIDDelete: "didDelete",

  OracleSet: "oracleSet",
  OracleDelete: "oracleDelete",

  MPTokenIssuanceCreate: "MPTokenIssuanceCreate",
  MPTokenAuthorize: "MPTokenAuthorize",
  MPTokenIssuanceSet: "MPTokenIssuanceSet",
  MPTokenIssuanceDestroy: "MPTokenIssuanceDestroy",

  GenesisMint: "genesisMint",

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
  unlReport: parseUNLReport,
  remit: parseRemit,

  clawback: parseClawback,

  ammBid: parseAmmBid,
  ammCreate: parseAmmCreate,
  ammDelete: parseAmmDelete,
  ammDeposit: parseAmmDeposit,
  ammWithdraw: parseAmmWithdraw,
  ammVote: parseAmmVote,

  didSet: parseDIDSet,
  didDelete: parseDIDDelete,

  oracleSet: parseOracleSet,
  oracleDelete: parseOracleDelete,

  MPTokenIssuanceCreate: parseMPTokenIssuanceCreate,
  MPTokenAuthorize: parseMPTokenAuthorize,
  MPTokenIssuanceSet: parseMPTokenIssuanceSet,
  MPTokenIssuanceDestroy: parseMPTokenIssuanceDestroy,

  genesisMint: parseGenesisMint,

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
  | FormattedUNLReportSpecification
  | FormattedRemitsSpecification
  | FormattedClawbackSpecification
  | FormattedAmmBidSpecification
  | FormattedAmmCreateSpecification
  | FormattedAmmDeleteSpecification
  | FormattedAmmDepositSpecification
  | FormattedAmmWithdrawSpecification
  | FormattedAmmVoteSpecification
  | FormattedGenesisMintSpecification
  | FormattedAmendmentSpecification
  | FormattedFeeUpdateSpecification
  | FormattedDIDSetSpecification
  | FormattedDIDDeleteSpecification
  | FormattedOracleSetSpecification
  | FormattedOracleDeleteSpecification
  | FormattedMPTokenIssuanceCreateSpecification
  | FormattedMPTokenAuthorizeSpecification
  | FormattedMPTokenIssuanceSetSpecification
  | FormattedMPTokenIssuanceDestroySpecification;

type FormattedUnrecognizedParserSpecification = {
  UNAVAILABLE: string;
  SEE_RAW_TRANSACTION: string;
};

function unrecognizedParser(_tx: any): FormattedUnrecognizedParserSpecification {
  return {
    UNAVAILABLE: "Unrecognized transaction type.",
    SEE_RAW_TRANSACTION: "Since this type is unrecognized, `rawTransaction` is included in this response.",
  };
}

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
function parseTransaction(
  tx: any,
  includeRawTransaction: boolean,
  nativeCurrency?: string,
  definitions?: XrplDefinitionsBase
): FormattedTransaction {
  let universalTx = tx;
  if (universalTx.tx_json) {
    universalTx = { ...universalTx, ...universalTx.tx_json };
  }

  const type = parseTransactionType(universalTx.TransactionType);

  const parser: Function = parserTypeFunc[type];

  /* eslint-disable multiline-ternary */
  const specification = parser ? parser(universalTx) : unrecognizedParser(universalTx);
  /* eslint-enable multiline-ternary */

  if (!parser) {
    includeRawTransaction = true; // eslint-disable-line no-param-reassign
  }

  const outcome = parseOutcome(universalTx, nativeCurrency, definitions);
  return removeUndefined({
    type: type,
    address: parseAccount(universalTx.Account),
    sequence: universalTx.Sequence,
    ticketSequence: universalTx.TicketSequence,
    id: universalTx.hash,
    ctid: universalTx.ctid,
    specification: removeUndefined(specification),
    outcome: outcome ? removeUndefined(outcome) : undefined,
    rawTransaction: includeRawTransaction ? JSON.stringify(tx) : undefined,
  });
}

export { parseTransactionType, parseTransaction };
