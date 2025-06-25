export type TAPIResponse<T> =
  | { error: null; data: T }
  | { error: string; data: null };

export type ErrorResponse = {
  status: number;
  statusText: string;
  data: { error: string };
};

export type SignatureResponseData = { signature: string; timestamp: number };
