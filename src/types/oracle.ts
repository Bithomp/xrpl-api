import { FormattedBaseSpecification } from "./specification";

export interface OraclePriceDataSeriesInterface {
  PriceData: {
    BaseAsset: string;
    QuoteAsset: string;
    AssetPrice?: string;
    Scale?: number;
  };
}

export interface FormattedOraclePriceDataSeriesInterface {
  baseAsset: string;
  quoteAsset: string;
  assetPrice?: string;
  scale?: number;
  originalAssetPriceChange?: string;
}

export type FormattedOracleSetSpecification = {
  oracleDocumentID: number;
  provider: string;
  uri?: string;
  assetClass: string;
  lastUpdateTime: number;
  priceDataSeries: FormattedOraclePriceDataSeriesInterface[];
} & FormattedBaseSpecification;

export type FormattedOracleDeleteSpecification = {
  oracleDocumentID: number;
} & FormattedBaseSpecification;
