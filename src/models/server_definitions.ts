// Latest version for xahau network definitions is available by this link:
// https://xahau.network/server_definitions

interface FieldInfo {
  nth: number;
  isVLEncoded: boolean;
  isSerialized: boolean;
  isSigningField: boolean;
  type: string;
}

interface DefinitionsData {
  TYPES: Record<string, number>;
  LEDGER_ENTRY_TYPES: Record<string, number>;
  FIELDS: (string | FieldInfo)[][];
  TRANSACTION_RESULTS: Record<string, number>;
  TRANSACTION_TYPES: Record<string, number>;
}

interface AmendmentInterface {
  count?: number;
  enabled?: boolean;
  name?: string;
  supported?: boolean;
  threshold?: number;
  validations?: number;
  vetoed?: string;
}

interface ServerDefinitionsResponseResultBase extends DefinitionsData {
  features?: { [key: string]: AmendmentInterface }[];
}

export type ServerDefinitionsResponseResult = {
  hash: string;
  native_currency_code?: string;
} & ServerDefinitionsResponseResultBase;
