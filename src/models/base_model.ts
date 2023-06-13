export interface ErrorResponse {
  id?: number | string;
  account?: string;
  transaction?: string;
  public_key?: string;
  nft_id?: string;
  status: "error" | "timeout";
  error: string;
  error_code?: string;
  error_message?: string;
  api_version?: number;
  marker?: any;
  validated?: boolean;
}
