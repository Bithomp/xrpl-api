import {parseOutcome} from './utils'
import {removeUndefined} from '../../common'

import parseSettings from './settings'
import parseAccountDelete from './account-delete'
import parseCheckCancel from './check-cancel'
import parseCheckCash from './check-cash'
import parseCheckCreate from './check-create'
import parseDepositPreauth from './deposit-preauth'
import parseEscrowCancellation from './escrow-cancellation'
import parseEscrowCreation from './escrow-creation'
import parseEscrowExecution from './escrow-execution'
import parseOrderCancellation from './cancellation'
import parseOrder from './order'
import parsePayment from './payment'
import parsePaymentChannelClaim from './payment-channel-claim'
import parsePaymentChannelCreate from './payment-channel-create'
import parsePaymentChannelFund from './payment-channel-fund'
import parseTicketCreate from './ticket-create'
import parseTrustline from './trustline'

import parseAmendment from './amendment' // pseudo-transaction
import parseFeeUpdate from './fee-update' // pseudo-transaction

const TransactionsParserMaping = {
    AccountSet: parseSettings,
    AccountDelete: parseAccountDelete,
    CheckCancel: parseCheckCancel,
    CheckCash: parseCheckCash,
    CheckCreate: parseCheckCreate,
    DepositPreauth: parseDepositPreauth,
    EscrowCancel: parseEscrowCancellation,
    EscrowCreate: parseEscrowCreation,
    EscrowFinish: parseEscrowExecution,
    OfferCancel: parseOrderCancellation,
    OfferCreate: parseOrder,
    Payment: parsePayment,
    PaymentChannelClaim: parsePaymentChannelClaim,
    PaymentChannelCreate: parsePaymentChannelCreate,
    PaymentChannelFund: parsePaymentChannelFund,
    SetRegularKey: parseSettings,
    SignerListSet: parseSettings,
    TicketCreate: parseTicketCreate,
    TrustSet: parseTrustline,

    EnableAmendment: parseAmendment, // pseudo-transaction
    SetFee: parseFeeUpdate // pseudo-transaction
}

// includeRawTransaction: undefined by default (getTransaction)
function parseTransaction(tx: any, includeRawTransaction: boolean): any {
  const parser: Function = TransactionsParserMaping[tx.TransactionType]

  const specification = parser
    ? parser(tx)
    : {
        UNAVAILABLE: 'Unrecognized transaction type.',
        SEE_RAW_TRANSACTION:
          'Since this type is unrecognized, `rawTransaction` is included in this response.'
      }
  if (!parser) {
    includeRawTransaction = true
  }

  const outcome = parseOutcome(tx)
  return removeUndefined({
    specification: removeUndefined(specification),
    outcome: outcome ? removeUndefined(outcome) : undefined,
    rawTransaction: includeRawTransaction ? JSON.stringify(tx) : undefined
  })
}

export default parseTransaction
