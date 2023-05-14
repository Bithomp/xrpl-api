export interface ErrorResponse {
  id?: number | string;
  account?: string;
  transaction?: string;
  status: "error";
  error: string;
  error_code?: string;
  error_message?: string;
  api_version?: number;
  validated?: boolean;
}
