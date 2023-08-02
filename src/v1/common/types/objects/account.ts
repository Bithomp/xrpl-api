import { FormattedBaseSpecification } from "./specification";
import { FormattedIssuedCurrencyAmount } from "../../../../types";

export type FormattedAccountDeleteSpecification = {
  // account (address) of an account to receive any leftover XRP after deleting the sending account.
  // Must be a funded account in the ledger, and must not be the sending account.
  destination: string;

  // (Optional) Arbitrary destination tag that identifies a hosted recipient or other information
  // for the recipient of the deleted account's leftover XRP. NB: Ensure that the hosted recipient is
  // able to account for AccountDelete transactions; if not, your balance may not be properly credited.
  destinationTag?: number;

  // X-address of an account to receive any leftover XRP after deleting the sending account.
  // Must be a funded account in the ledger, and must not be the sending account.
  destinationXAddress: string;
} & FormattedBaseSpecification;

export type FormattedSourceAddress = {
  address: string;
  maxAmount?: FormattedIssuedCurrencyAmount;
  tag?: number;
};

export type FormattedDestinationAddress = {
  address: string;
  tag?: number;
};
