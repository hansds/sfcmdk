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
  data: RequestMap[T]["response"];
}
