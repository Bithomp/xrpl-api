import { FormattedAmount } from "./amounts";
import { FormattedBaseSpecification } from "./specification";

export type FormattedGenesisMint = {
  amount: FormattedAmount;
  destination: string;
};

export type FormattedGenesisMintSpecification = {
  genesisMints?: FormattedGenesisMint[];
} & FormattedBaseSpecification;
