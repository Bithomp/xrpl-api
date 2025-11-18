import * as assert from "assert";
import { removeUndefined } from "../../common";

import { parseSource } from "../ledger/source";
import { parseAccount } from "../ledger/account";
import { FormattedCronSpecification } from "../../types/cron";

function parseCron(tx: any): FormattedCronSpecification {
  assert.ok(tx.TransactionType === "Cron");

  return removeUndefined({
    source: parseSource(tx),
    owner: tx.Owner ? parseAccount(tx.Owner) : undefined,
  });
}

export default parseCron;
