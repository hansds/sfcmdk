import { RequestMap } from ".";

export interface GenericRequest {
  orgId: string;
}

// types.ts
export interface MessageRequest<T extends keyof RequestMap> {
  type: T;
  data: RequestMap[T]["request"];
}

export interface MessageResponse<T extends keyof RequestMap> {
  type: T;
  data?: RequestMap[T]["response"];
  error?: string;
}

export interface SalesforceReponse {
  totalSize: number;
  done: boolean;
  records: JSONArray;
}

type JSONValue = string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
  [x: string]: JSONValue;
  Id: string;
}

export type JSONArray = Array<JSONObject>;
