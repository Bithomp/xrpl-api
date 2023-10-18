import * as Client from "../client";
import { LedgerIndex } from "../models/ledger";
import { HookNamespaceResponse } from "../models/account_namespace";
import { ErrorResponse } from "../models/base_model";

// NOTE: Hooks is not part of mainnet, this code can be changed in the future without notice

export interface GetAccountNamespaceOptions {
  ledgerIndex?: LedgerIndex;
}

/**
 * @returns {Promise<HookNamespaceResponse | ErrorResponse>} like
 * {
 *   account: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
 *   ledger_current_index: 255928,
 *   namespace_entries: [
 *     {
 *       Flags: 0,
 *       HookStateData: "00",
 *       HookStateKey: "00000000000000000000000088CECA8ED635F79573136EAAA2B70F07C2F2B9D8",
 *       LedgerEntryType: "HookState",
 *       OwnerNode: "0",
 *       index: "0895F253FDCBFAF5A7DAE54AB2BF04A81595D360799036CAF36D2B0542C08DC7",
 *     },
 *   ]
 *   validated: true,
 * }
 * @exception {Error}
 */
export async function getAccountNamespace(
  account: string,
  namespaceId: string,
  options: GetAccountNamespaceOptions = {}
): Promise<HookNamespaceResponse | ErrorResponse> {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response = await connection.request({
    command: "account_namespace",
    account,
    namespace_id: namespaceId,
    ledger_index: options.ledgerIndex || "validated",
  });

  if (!response) {
    return {
      account,
      status: "error",
      error: "invalidResponse",
    };
  }

  if (response.error) {
    const { error, error_code, error_message, status, validated } = response;

    return {
      account,
      namespace_id: namespaceId,
      error,
      error_code,
      error_message,
      status,
      validated,
    };
  }

  const result = response.result;

  return result;
}
