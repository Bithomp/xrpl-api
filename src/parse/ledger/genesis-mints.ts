import { FormattedGenesisMint } from "../../types/genesis_mint";
import parseAmount from "./amount";

// {
//   "GenesisMints": [
//     {
//         "GenesisMint": {
//             "Amount": "42946089",
//             "Destination": "rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ"
//         }
//     },
//     {
//         "GenesisMint": {
//             "Amount": "2146872",
//             "Destination": "rD74dUPRFNfgnY2NzrxxYRXN4BrfGSN6Mv"
//         }
//     },
//   ]
// }
export function parseGenesisMints(tx: any): FormattedGenesisMint[] | undefined {
  if (tx && tx.GenesisMints) {
    return tx.GenesisMints.map((m: any) => {
      return {
        amount: parseAmount(m.GenesisMint.Amount),
        destination: m.GenesisMint.Destination,
      };
    });
  }
}
