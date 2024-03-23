import BigNumber from "bignumber.js";
import { normalizeNodes } from "../utils";
import { removeUndefined } from "../../common";
import { FormattedIssuedCurrency, FormattedAmount, VoteSlotInterface } from "../../types";
import parseAmount from "../ledger/amount";
import parseAsset from "../ledger/asset";
import parseAuthAccounts from "../ledger/auth-accounts";
import { getNativeCurrency } from "../../client";

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
  status?: string;
  ammID?: string;
  account?: string;
  asset?: FormattedIssuedCurrency;
  asset2?: FormattedIssuedCurrency;
  auctionSlot: FormattedAuctionSlot;
  lpTokenBalance: FormattedAmount;
  tradingFee: number;
  ownerNode: string;
  voteSlots: FormattedVoteSlot[];

  /// changes
  lpTokenBalanceChange?: FormattedAmount;
  tradingFeeChanges?: number;
  voteSlotsChanges?: any[];
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
  status: string;
  account: string;
  tradingFee?: number;
  voteWeight?: number;
  tradingFeeChange: number;
  voteWeightChange: number;
}

function parseAmmStatus(node: any): string | undefined {
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
    expiration: auctionSlot.Expiration,
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

function summarizeVoteSlotsChanges(node: any): FormattedAmmVoteSlotChanges[] | undefined {
  const final = node.diffType === "CreatedNode" ? node.newFields : node.finalFields;
  const prev = node.previousFields || {};

  const changes = final.VoteSlots.map((slot: VoteSlotInterface) => {
    const prevSlot = prev.VoteSlots.find((s: VoteSlotInterface) => s.VoteEntry.Account === slot.VoteEntry.Account);

    if (prevSlot) {
      const tradingFeeChange = slot.VoteEntry.TradingFee - prevSlot.VoteEntry.TradingFee;
      const voteWeightChange = slot.VoteEntry.VoteWeight - prevSlot.VoteEntry.VoteWeight;
      return removeUndefined({
        status: "modified",
        account: slot.VoteEntry.Account,
        tradingFeeChange: tradingFeeChange !== 0 ? tradingFeeChange : undefined,
        voteWeightChange: voteWeightChange !== 0 ? voteWeightChange : undefined,
      });
    }

    return {
      status: "added",
      account: slot.VoteEntry.Account,
      tradingFee: slot.VoteEntry.TradingFee,
      voteWeight: slot.VoteEntry.VoteWeight,
    };
  });

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

function summarizeActionSlotChanges(node: any): FormattedAuctionSlotChanges | undefined {
  const final = node.diffType === "CreatedNode" ? node.newFields : node.finalFields;
  const prev = node.previousFields || {};

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
        counterparty: final.AuctionSlot.Price.issuer,
        value: new BigNumber(final.AuctionSlot.Price.value)
          .minus(new BigNumber(prev.AuctionSlot.Price.value))
          .toString(10),
      };
    }

    if (final.AuctionSlot.TimeInterval !== prev.AuctionSlot.TimeInterval) {
      changes.timeIntervalChange = final.AuctionSlot.TimeInterval - prev.AuctionSlot.TimeInterval;
    }

    if (prev.AuctionSlot.AuthAccounts) {
      const authAccountsChanges = final.AuctionSlot.AuthAccounts.map((account: string) => {
        if (!prev.AuctionSlot.AuthAccounts.includes(account)) {
          return {
            status: "added",
            account,
          };
        }
      });

      const removed = prev.AuctionSlot.AuthAccounts.filter((account: string) => {
        return !final.AuctionSlot.AuthAccounts.includes(account);
      });

      if (removed.length > 0) {
        authAccountsChanges.concat(
          removed.map((account: string) => {
            return {
              status: "removed",
              account,
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

function summarizeAmm(node: any): FormattedAmmSummaryInterface {
  const final = node.diffType === "CreatedNode" ? node.newFields : node.finalFields;
  const prev = node.previousFields || {};

  // asset could be missed for new AMM if it is XRP
  let asset = parseAsset(final.Asset);
  if (node.diffType === "CreatedNode" && !asset) {
    asset = { currency: getNativeCurrency() };
  }

  const summary: FormattedAmmSummaryInterface = {
    status: parseAmmStatus(node),
    ammID: node.LedgerIndex,
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
      counterparty: final.LPTokenBalance.issuer,
      value: new BigNumber(final.LPTokenBalance.value).minus(new BigNumber(prev.LPTokenBalance.value)).toString(10),
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

function parseAmmChanges(metadata: any): FormattedAmmSummaryInterface | undefined {
  const amms = normalizeNodes(metadata).filter((n) => {
    return n.entryType === "AMM";
  });

  return amms.length === 1 ? summarizeAmm(amms[0]) : undefined;
}

export { parseAmmChanges };
