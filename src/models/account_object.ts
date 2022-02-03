import { LedgerEntry } from "xrpl";

// https://github.com/XRPLF/xrpl.js/blob/2b424276344b2aa8b8b76d621500f4d9e1436663/packages/xrpl/src/models/methods/accountObjects.ts#L61
/**
 * Account Objects can be a Check, a DepositPreauth, an Escrow, an Offer, a
 * PayChannel, a SignerList, a Ticket, or a RippleState.
 */
export type AccountObject =
  | LedgerEntry.Check
  | LedgerEntry.DepositPreauth
  | LedgerEntry.Escrow
  | LedgerEntry.Offer
  | LedgerEntry.PayChannel
  | LedgerEntry.SignerList
  | LedgerEntry.Ticket
  | LedgerEntry.RippleState;

// https://github.com/XRPLF/xrpl.js/blob/2b424276344b2aa8b8b76d621500f4d9e1436663/packages/xrpl/src/models/common/index.ts#L3
export type AccountObjectType =
  | 'check'
  | 'escrow'
  | 'offer'
  | 'payment_channel'
  | 'signer_list'
  | 'state'
