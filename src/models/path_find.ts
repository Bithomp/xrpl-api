import { Amount, PathFindPathOption } from "xrpl";

/**
 * Response expected from a {@link PathFindRequest}.
 *
 * @category Responses
 */
export interface PathFindResponseResult {
  /**
   * Array of objects with suggested paths to take, as described below. If
   * empty, then no paths were found connecting the source and destination
   * accounts.
   */
  alternatives: PathFindPathOption[];
  /** Unique address of the account that would receive a transaction. */
  destination_account: string;
  /** Currency amount provided in the WebSocket request. */
  destination_amount: Amount;
  /** Unique address that would send a transaction. */
  source_account: string;
  /**
   * If false, this is the result of an incomplete search. A later reply
   * may have a better path. If true, then this is the best path found. (It is
   * still theoretically possible that a better path could exist, but rippled
   * won't find it.) Until you close the pathfinding request, rippled.
   * Continues to send updates each time a new ledger closes.
   */
  full_reply: boolean;
  /**
   * The ID provided in the WebSocket request is included again at this
   * level.
   */
  id?: number | string;
  /**
   * The value true indicates this reply is in response to a path_find close
   * command.
   */
  closed?: true;
  /**
   * The value true indicates this reply is in response to a `path_find`
   * status command.
   */
  status?: true;
}
