import BigNumber from "bignumber.js";
import { normalizeNodes } from "../utils";
import { removeUndefined } from "../../common";
import { OraclePriceDataSeriesInterface, FormattedOraclePriceDataSeriesInterface } from "../../types";

interface FormattedOracleSummaryInterface {
  status?: "created" | "modified" | "deleted";
  oracleID?: string;
  oracleDocumentID?: number;
  provider: string;
  uri?: string;
  assetClass: string;
  lastUpdateTime: number;
  priceDataSeries: FormattedOraclePriceDataSeriesInterface[];

  // changes
  uriChanges?: string;
  lastUpdateTimeChanges?: number;
  priceDataSeriesChanges?: FormattedPriceDataSeriesChanges[];
}

interface FormattedPriceDataSeriesChanges {
  status: "added" | "modified" | "removed";
  baseAsset: string;
  quoteAsset: string;
  assetPrice?: string; // BigNumber
  scale?: number;
  originalAssetPrice?: string; // BigNumber
  assetPriceChange?: string; // BigNumber
  scaleChange?: number;
  originalPriceChange?: string; // BigNumber
}

function parseOracleStatus(node: any): "created" | "modified" | "deleted" | undefined {
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

// UINT64 as string to BigNumber
function hexPriceToBigNumber(hex: string | undefined): BigNumber | undefined {
  if (hex === undefined) {
    return undefined;
  }

  if (typeof hex !== "string") {
    throw new Error("Price must be a string.");
  }

  return new BigNumber(`0x${hex}`);
}

function getOriginalAssetPrice(assetPrice: BigNumber | undefined, scale: number | undefined): BigNumber | undefined {
  if (assetPrice === undefined || scale === undefined) {
    return undefined;
  }

  if (assetPrice.isZero()) {
    return assetPrice;
  }

  if (scale === 0) {
    return assetPrice;
  }

  return assetPrice.dividedBy(new BigNumber(10).pow(scale));
}

function parsePriceDataSeries(series: OraclePriceDataSeriesInterface): FormattedOraclePriceDataSeriesInterface {
  const assetPrice = hexPriceToBigNumber(series.PriceData.AssetPrice);
  const scale = series.PriceData.Scale;
  const originalAssetPrice = getOriginalAssetPrice(assetPrice, scale);

  return removeUndefined({
    baseAsset: series.PriceData.BaseAsset,
    quoteAsset: series.PriceData.QuoteAsset,
    assetPrice: assetPrice?.toString(),
    scale: series.PriceData.Scale,
    originalAssetPrice: originalAssetPrice?.toString(),
  });
}

function summarizePriceDataSeriesChanges(node: any): FormattedPriceDataSeriesChanges[] | undefined {
  const final = node.diffType === "CreatedNode" ? node.newFields : node.finalFields;
  const prev = node.previousFields || {};

  const changes = final.PriceDataSeries.reduce(
    (acc: FormattedPriceDataSeriesChanges[], series: OraclePriceDataSeriesInterface) => {
      const prevSeries = prev.PriceDataSeries.find(
        (s: OraclePriceDataSeriesInterface) =>
          s.PriceData.BaseAsset === series.PriceData.BaseAsset && s.PriceData.QuoteAsset === series.PriceData.QuoteAsset
      );

      const priceFinal = hexPriceToBigNumber(series.PriceData.AssetPrice) || new BigNumber(0);
      const scaleFinal = series.PriceData.Scale || 0;
      const originalPriceFinal = getOriginalAssetPrice(priceFinal, scaleFinal);

      if (!prevSeries) {
        return acc.concat({
          status: "added",
          baseAsset: series.PriceData.BaseAsset,
          quoteAsset: series.PriceData.QuoteAsset,
          assetPrice: priceFinal?.toString(),
          scale: scaleFinal,
          originalAssetPrice: originalPriceFinal?.toString(),
        });
      }

      const pricePrev = hexPriceToBigNumber(prevSeries.PriceData.AssetPrice) || new BigNumber(0);
      const scalePrev = prevSeries.PriceData.Scale || 0;

      const assetPriceChange = (priceFinal || new BigNumber(0)).minus(pricePrev);
      const scaleChange = (scaleFinal ?? 0) - scalePrev;

      if (!assetPriceChange.isZero() || scaleChange !== 0) {
        const originalPricePrev = getOriginalAssetPrice(pricePrev, scalePrev) || new BigNumber(0);
        const originalPriceChange = (originalPriceFinal || new BigNumber(0)).minus(originalPricePrev);

        return acc.concat(
          removeUndefined({
            status: "modified" as "modified", // use as "modified" because "removeUndefined" is used
            baseAsset: series.PriceData.BaseAsset,
            quoteAsset: series.PriceData.QuoteAsset,
            assetPrice: priceFinal?.toString(),
            scale: scaleFinal,
            originalAssetPrice: originalPriceFinal?.toString(),
            assetPriceChange: assetPriceChange.isZero() ? undefined : assetPriceChange?.toString(),
            scaleChange: scaleChange || undefined,
            originalPriceChange: originalPriceChange.isZero() ? undefined : originalPriceChange.toString(),
          })
        );
      }

      return acc;
    },
    []
  );

  // removed PriceDataSeries
  const removed = prev.PriceDataSeries.filter((s: OraclePriceDataSeriesInterface) => {
    return !final.PriceDataSeries.find(
      (series: OraclePriceDataSeriesInterface) =>
        series.PriceData.BaseAsset === s.PriceData.BaseAsset && series.PriceData.QuoteAsset === s.PriceData.QuoteAsset
    );
  });

  if (removed.length > 0) {
    return changes.concat(
      removed.map((s: OraclePriceDataSeriesInterface) => {
        const price = hexPriceToBigNumber(s.PriceData.AssetPrice);
        return {
          status: "removed",
          baseAsset: s.PriceData.BaseAsset,
          quoteAsset: s.PriceData.QuoteAsset,
          assetPrice: price?.toString(),
          scale: s.PriceData.Scale,
          originalAssetPrice: getOriginalAssetPrice(price, s.PriceData.Scale),
        };
      })
    );
  }

  if (changes.length === 0) {
    return undefined;
  }

  return changes;
}

function summarizeOracle(node: any): FormattedOracleSummaryInterface {
  const final = node.diffType === "CreatedNode" ? node.newFields : node.finalFields;
  const prev = node.previousFields || {};

  const summary: FormattedOracleSummaryInterface = {
    status: parseOracleStatus(node),
    oracleID: node.LedgerIndex,
    oracleDocumentID: final.OracleDocumentID,
    provider: final.Provider,
    uri: final.URI,
    assetClass: final.AssetClass,
    lastUpdateTime: final.LastUpdateTime,
    priceDataSeries: final.PriceDataSeries.map(parsePriceDataSeries),
  };

  if (prev.URI) {
    summary.uriChanges = final.URI;
  }

  if (prev.LastUpdateTime) {
    summary.lastUpdateTimeChanges = final.LastUpdateTime - (prev.LastUpdateTime || 0);
  }

  if (prev.PriceDataSeries) {
    summary.priceDataSeriesChanges = summarizePriceDataSeriesChanges(node);
  }

  return removeUndefined(summary);
}

function parseOracleChanges(metadata: any): FormattedOracleSummaryInterface | undefined {
  const oracles = normalizeNodes(metadata).filter((n) => {
    return n.entryType === "Oracle";
  });

  return oracles.length === 1 ? summarizeOracle(oracles[0]) : undefined;
}

export { parseOracleChanges, parsePriceDataSeries };
