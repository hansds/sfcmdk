import { RequestMap } from ".";

export enum MessageType {
  RefreshMetadata,
  GetUsers,
  GetCustomObjects,
  LoginAsUser,
  ManageObject,
  NavigateToSalesforcePath,
  OpenRecord,
  OpenObjectList,
}

export interface GenericRequest {
  orgId: string;
}

export interface MessageRequest<T extends keyof RequestMap> {
  type: T;
  data: RequestMap[T]["request"];
}

export interface MessageResponse<T extends keyof RequestMap> {
  type: T;
  data?: RequestMap[T]["response"];
  error?: string;
}

export interface SalesforceReponse<T> {
  totalSize: number;
  done: boolean;
  records: T[];
}

type SalesforceAttributes = { type: string; url: string };
type SalesforceObject = {
  attributes: SalesforceAttributes;
};

export type SfUser = SalesforceObject & {
  Id: string;
  Name: string;
  Username: string;
  Profile: SalesforceObject & { Name: string };
};

export type SfCustomObject = SalesforceObject & {
  DurableId: string;
  NamespacePrefix: string;
  Label: string;
  PluralLabel: string;
  KeyPrefix: string;
  QualifiedApiName: string;
};
