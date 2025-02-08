import BigNumber from "bignumber.js";
import { AuthAccount, TransactionMetadata } from "xrpl";
import { removeUndefined } from "../../common";
import { NormalizedNode, normalizeNode } from "../utils";
import { FormattedIssuedCurrency, FormattedAmount, VoteSlotInterface } from "../../types";
import parseAmount from "../ledger/amount";
import parseAsset from "../ledger/asset";
import parseAuthAccounts from "../ledger/auth-accounts";
import { getNativeCurrency } from "../../client";
import { ledgerTimeToUnixTime } from "../../models";

interface FormattedAuctionSlot {
  account: string;
  authAccounts?: string[];
  discountedFee?: number;
  expiration?: number;
  price?: FormattedAmount;
  timeInterval?: number;
}

interface FormattedVoteSlot {
  account: string;
  tradingFee?: number;
  voteWeight?: number;
}

// changes of LPTokenBalance, VoteSlots
interface FormattedAmmSummaryInterface {
  status?: "created" | "modified" | "deleted";
  ammID?: string;
  account?: string;
  asset?: FormattedIssuedCurrency;
  asset2?: FormattedIssuedCurrency;
  auctionSlot: FormattedAuctionSlot;
  lpTokenBalance: FormattedAmount;
  tradingFee: number;
  ownerNode: string;
  voteSlots: FormattedVoteSlot[];

  // changes
  lpTokenBalanceChange?: FormattedAmount;
  tradingFeeChanges?: number;
  voteSlotsChanges?: FormattedAmmVoteSlotChanges[];
  auctionSlotChanges?: FormattedAuctionSlotChanges;
}

interface FormattedAuctionSlotChanges {
  accountChanges?: string;
  authAccountsChanges?: { status: string; account: string }[];
  discountedFeeChange?: number;
  expirationChange?: number;
  priceChange?: FormattedAmount;
  timeIntervalChange?: number;
}

interface FormattedAmmActionSlotChanges {
  accountChanges?: string;
  discountedFeeChange?: number;
  expirationChange?: number;
  priceChange?: FormattedAmount;
  timeIntervalChange?: number;
  authAccountsChanges?: { status: string; account: string }[];
}

interface FormattedAmmVoteSlotChanges {
  status: "added" | "modified" | "removed";
  account: string;
  tradingFee?: number;
  voteWeight?: number;
  tradingFeeChange?: number;
  voteWeightChange?: number;
}

function parseAmmStatus(node: NormalizedNode): "created" | "modified" | "deleted" | undefined {
  if (node.diffType === "CreatedNode") {
    return "created";
  }

  if (node.diffType === "ModifiedNode") {
    return "modified";
  }

  if (node.diffType === "DeletedNode") {
    return "deleted";
  }
  return undefined;
}

function parseAuctionSlot(auctionSlot: any): FormattedAuctionSlot {
  const slot = {
    account: auctionSlot.Account,
    authAccounts: parseAuthAccounts(auctionSlot.AuthAccounts),
    discountedFee: auctionSlot.DiscountedFee,
    expiration: auctionSlot.Expiration ? ledgerTimeToUnixTime(auctionSlot.Expiration) : undefined,
    price: auctionSlot.Price,
    timeInterval: auctionSlot.TimeInterval,
  };

  return removeUndefined(slot);
}

function parseVoteSlot(voteSlot: VoteSlotInterface): FormattedVoteSlot {
  return {
    account: voteSlot.VoteEntry.Account,
    tradingFee: voteSlot.VoteEntry.TradingFee,
    voteWeight: voteSlot.VoteEntry.VoteWeight,
  };
}

function summarizeVoteSlotsChanges(node: NormalizedNode): FormattedAmmVoteSlotChanges[] | undefined {
  const final = node.diffType === "CreatedNode" ? node.newFields : (node.finalFields as any);
  const prev = node.previousFields as any;

  const changes = final.VoteSlots.reduce((acc: FormattedAmmVoteSlotChanges[], slot: VoteSlotInterface) => {
    const prevSlot = prev.VoteSlots.find((s: VoteSlotInterface) => s.VoteEntry.Account === slot.VoteEntry.Account);

    if (!prevSlot) {
      return acc.concat({
        status: "added",
        account: slot.VoteEntry.Account,
        tradingFee: slot.VoteEntry.TradingFee,
        voteWeight: slot.VoteEntry.VoteWeight,
      });
    }

    const tradingFeeChange = slot.VoteEntry.TradingFee - prevSlot.VoteEntry.TradingFee;
    const voteWeightChange = slot.VoteEntry.VoteWeight - prevSlot.VoteEntry.VoteWeight;

    if (tradingFeeChange !== 0 || voteWeightChange !== 0) {
      return acc.concat(
        removeUndefined({
          status: "modified" as "modified", // use as "modified" because "removeUndefined" is used
          account: slot.VoteEntry.Account,
          tradingFee: slot.VoteEntry.TradingFee,
          voteWeight: slot.VoteEntry.VoteWeight,
          tradingFeeChange: tradingFeeChange || undefined,
          voteWeightChange: voteWeightChange || undefined,
        })
      );
    }

    return acc;
  }, []);

  // removed VoteSlots
  const removed = prev.VoteSlots.filter((s: VoteSlotInterface) => {
    return !final.VoteSlots.find((slot: VoteSlotInterface) => slot.VoteEntry.Account === s.VoteEntry.Account);
  });

  if (removed.length > 0) {
    return changes.concat(
      removed.map((s: VoteSlotInterface) => {
        return {
          status: "removed",
          account: s.VoteEntry.Account,
          tradingFee: s.VoteEntry.TradingFee,
          voteWeight: s.VoteEntry.VoteWeight,
        };
      })
    );
  }

  if (changes.length === 0) {
    return undefined;
  }

  return changes;
}

function summarizeActionSlotChanges(node: NormalizedNode): FormattedAuctionSlotChanges | undefined {
  const final = node.diffType === "CreatedNode" ? node.newFields : node.finalFields as any;
  const prev = node.previousFields as any;

  const changes: FormattedAmmActionSlotChanges = {};

  if (prev.AuctionSlot) {
    if (final.AuctionSlot.Account !== prev.AuctionSlot.Account) {
      changes.accountChanges = final.AuctionSlot.Account;
    }

    if (final.AuctionSlot.DiscountedFee !== prev.AuctionSlot.DiscountedFee) {
      changes.discountedFeeChange = final.AuctionSlot.DiscountedFee - prev.AuctionSlot.DiscountedFee;
    }

    if (final.AuctionSlot.Expiration !== prev.AuctionSlot.Expiration) {
      changes.expirationChange = final.AuctionSlot.Expiration - prev.AuctionSlot.Expiration;
    }

    if (final.AuctionSlot.Price.value !== prev.AuctionSlot.Price.value) {
      changes.priceChange = {
        currency: final.AuctionSlot.Price.currency,
        issuer: final.AuctionSlot.Price.issuer,
        value: new BigNumber(final.AuctionSlot.Price.value)
          .minus(new BigNumber(prev.AuctionSlot.Price.value))
          .toString(10),
        counterparty: final.AuctionSlot.Price.issuer, // @deprecated, use issuer
      };
    }

    if (final.AuctionSlot.TimeInterval !== prev.AuctionSlot.TimeInterval) {
      changes.timeIntervalChange = final.AuctionSlot.TimeInterval - prev.AuctionSlot.TimeInterval;
    }

    if (!isEqualAuthAccounts(final.AuctionSlot.AuthAccounts, prev.AuctionSlot.AuthAccounts)) {
      const prevAuthAccounts = prev.AuctionSlot.AuthAccounts || [];
      const finalAuthAccounts = final.AuctionSlot.AuthAccounts || [];
      let authAccountsChanges = finalAuthAccounts.map((auth: AuthAccount) => {
        if (!prevAuthAccounts.includes(auth.AuthAccount.Account)) {
          return {
            status: "added",
            account: auth.AuthAccount.Account,
          };
        }
      });

      const removed = prevAuthAccounts.filter((auth: AuthAccount) => {
        return !finalAuthAccounts.includes(auth.AuthAccount.Account);
      });

      if (removed.length > 0) {
        authAccountsChanges = authAccountsChanges.concat(
          removed.map((account: AuthAccount) => {
            return {
              status: "removed",
              account: account.AuthAccount.Account,
            };
          })
        );
      }

      changes.authAccountsChanges = authAccountsChanges;
    }
  }

  if (Object.keys(changes).length === 0) {
    return undefined;
  }

  return removeUndefined(changes);
}

function isEqualAuthAccounts(obj1: AuthAccount[] | undefined, obj2: AuthAccount[] | undefined): boolean {
  if (obj1 === undefined && obj2 === undefined) {
    return true;
  }

  if ((obj1 === undefined && obj2 !== undefined) || (obj1 !== undefined && obj2 === undefined)) {
    return false;
  }

  if ((obj1 as AuthAccount[]).length !== (obj2 as AuthAccount[]).length) {
    return false;
  }

  const obj1Sorted = (obj1 as AuthAccount[]).sort((a, b) => a.AuthAccount.Account.localeCompare(b.AuthAccount.Account));
  const obj2Sorted = (obj2 as AuthAccount[]).sort((a, b) => a.AuthAccount.Account.localeCompare(b.AuthAccount.Account));

  for (let i = 0; i < obj1Sorted.length; i++) {
    if (obj1Sorted[i].AuthAccount.Account !== obj2Sorted[i].AuthAccount.Account) {
      return false;
    }
  }

  return true;
}

function summarizeAmm(node: NormalizedNode): FormattedAmmSummaryInterface {
  const final = node.diffType === "CreatedNode" ? node.newFields : (node.finalFields as any);
  const prev = node.previousFields as any;

  // asset could be missed for new AMM if it is XRP
  let asset = parseAsset(final.Asset);
  if (node.diffType === "CreatedNode" && !asset) {
    asset = { currency: getNativeCurrency() };
  }

  const summary: FormattedAmmSummaryInterface = {
    status: parseAmmStatus(node),
    ammID: node.ledgerIndex,
    account: final.Account,
    asset: asset,
    asset2: parseAsset(final.Asset2),
    auctionSlot: parseAuctionSlot(final.AuctionSlot),
    lpTokenBalance: parseAmount(final.LPTokenBalance),
    tradingFee: final.TradingFee,
    ownerNode: final.OwnerNode,
    voteSlots: final.VoteSlots ? final.VoteSlots.map(parseVoteSlot) : undefined,
  };

  if (prev.LPTokenBalance) {
    // The change of LPTokenBalance
    summary.lpTokenBalanceChange = {
      currency: final.LPTokenBalance.currency,
      issuer: final.LPTokenBalance.issuer,
      value: new BigNumber(final.LPTokenBalance.value).minus(new BigNumber(prev.LPTokenBalance.value)).toString(10),
      counterparty: final.LPTokenBalance.issuer, // @deprecated, use issuer
    };
  }

  if (prev.VoteSlots) {
    // The change of VoteSlots
    summary.voteSlotsChanges = summarizeVoteSlotsChanges(node);
  }

  if (prev.TradingFee) {
    // The change of TradingFee
    summary.tradingFeeChanges = final.TradingFee - (prev.TradingFee || 0);
  }

  if (prev.AuctionSlot) {
    // The change of AuctionSlot
    summary.auctionSlotChanges = summarizeActionSlotChanges(node);
  }

  return removeUndefined(summary);
}

function parseAmmChanges(metadata: TransactionMetadata): FormattedAmmSummaryInterface | undefined {
  const affectedNodes = metadata.AffectedNodes.filter((affectedNode: any) => {
    const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
    return node.LedgerEntryType === "AMM";
  });

  if (affectedNodes.length !== 1) {
    return undefined;
  }

  const normalizedNode = normalizeNode(affectedNodes[0]);

  return summarizeAmm(normalizedNode);
}

export { parseAmmChanges };
