import { LedgerEntry } from "xrpl";
import { Trustline } from "../models/trustline";
const { RippleStateFlags } = LedgerEntry;

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
export type AccountObjectType = "check" | "escrow" | "offer" | "payment_channel" | "signer_list" | "state";

/**
 * https://gist.github.com/WietseWind/5df413334385367c548a148de3d8a713
 * https://github.com/XRPL-Labs/XUMM-App/blob/2c39d04e65dd8d48001f4cb452b1fbe2e2c53f00/src/services/AccountService.ts#L198
 *
 * This function returns account_lines line results
 * based on account_objects (type = state) results,
 * » Returns only the account_lines to show based on:
 *   - Counts towards your reserve
 */
export function accountObjectsToAccountLines(account: string, accountObjects: AccountObject[]) {
  // console.log(JSON.stringify(accountObjects));
  const notInDefaultState = accountObjects.filter((obj: any) => {
    return (
      obj.HighLimit &&
      obj.LowLimit &&
      // tslint:disable-next-line:no-bitwise
      obj.Flags & RippleStateFlags[obj.HighLimit.issuer === account ? "lsfHighReserve" : "lsfLowReserve"]
    );
  });

  const accountLinesFormatted: Trustline[] = notInDefaultState.map((obj: any) => {
    const parties = [obj.HighLimit, obj.LowLimit];
    const [self, counterparty] = obj.HighLimit.issuer === account ? parties : parties.reverse();

    const ripplingFlags = [
      // tslint:disable-next-line:no-bitwise
      (RippleStateFlags.lsfHighNoRipple & obj.Flags) === RippleStateFlags.lsfHighNoRipple,
      // tslint:disable-next-line:no-bitwise
      (RippleStateFlags.lsfLowNoRipple & obj.Flags) === RippleStateFlags.lsfLowNoRipple,
    ];
    // tslint:disable-next-line:variable-name
    const [no_ripple, no_ripple_peer] = obj.HighLimit.issuer === account ? ripplingFlags : ripplingFlags.reverse();

    const balance =
      obj.HighLimit.issuer === account && obj.Balance.value.startsWith("-")
        ? obj.Balance.value.slice(1)
        : obj.Balance.value;

    return {
      account: counterparty.issuer,
      balance,
      currency: self.currency,
      limit: self.value,
      limit_peer: counterparty.value,
      no_ripple,
      no_ripple_peer,
    } as Trustline;
  });

  return accountLinesFormatted;
}
