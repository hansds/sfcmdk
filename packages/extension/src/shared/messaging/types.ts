export interface RequestMap {
  [MessageType.RefreshMetadata]: {
    request: GenericRequest;
    response: void;
  };
  [MessageType.GetUsers]: {
    request: GenericRequest;
    response: SalesforceReponse<SfUser>;
  };
  [MessageType.GetCustomObjects]: {
    request: GenericRequest;
    response: SalesforceReponse<SfCustomObject>;
  };
  [MessageType.LoginAsUser]: {
    request: GenericRequest & { userId: string };
    response: void;
  };
  [MessageType.ManageObject]: {
    request: GenericRequest & { objectId: string; newTab: boolean };
    response: void;
  };
  [MessageType.NavigateToSalesforcePath]: {
    request: GenericRequest & { path: string; newTab: boolean };
    response: void;
  };
  [MessageType.OpenRecord]: {
    request: GenericRequest & { recordId: string; newTab: boolean };
    response: void;
  };
  [MessageType.OpenObjectList]: {
    request: GenericRequest & { apiName: string; newTab: boolean };
    response: void;
  };
}

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
