import { storeForOrg } from "../storage";
import { fetchAuthenticatedSalesforce } from "./utils";

export enum MessageType {
  GetUsers,
  GetCustomObjects,
}

export interface GenericRequest {
  orgId: string;
}

// types.ts
export interface Request<T extends keyof RequestMap> {
  type: T;
  data: RequestMap[T]["request"];
}

export interface Response<T extends keyof RequestMap> {
  type: T;
  data: RequestMap[T]["response"];
}

export interface RequestMap {
  [MessageType.GetUsers]: {
    request: GenericRequest;
    response: User[];
  };
  [MessageType.GetCustomObjects]: {
    request: GenericRequest;
    response: CustomObject[];
  };
  // Add more request/response types as needed
}

export interface User {
  id: number;
  name: string;
}

export interface CustomObject {
  id: number;
  name: string;
}

export function receiveMessages(
  message: Request<keyof RequestMap>,
  sender,
  sendResponse: (response) => void
) {
  const requestType = message.type;

  (async () => {
    if (requestType == MessageType.GetUsers) {
      const users = await fetchAuthenticatedSalesforce(
        "services/data/v50.0/query/?q=SELECT+Id,Name,Username,Profile.Name+FROM+User+WHERE+IsActive+=+true",
        message.data.orgId
      );
      const json = await users.json();
      storeForOrg(message.data.orgId, { users: json });

      const response: Response<MessageType.GetUsers> = {
        type: MessageType.GetUsers,
        data: json,
      };

      sendResponse(response);
    } else if (requestType == MessageType.GetCustomObjects) {
      const response: Response<MessageType.GetCustomObjects> = {
        type: MessageType.GetCustomObjects,
        data: [],
      };

      sendResponse(response);
    }
  })();

  return true;
}

// TODO: move this into shared
export function sendTypedMessage<T extends keyof RequestMap>(
  type: T,
  data: RequestMap[T]["request"]
): Promise<Response<T>> {
  const message: Request<T> = {
    type: type,
    data: data,
  };

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response: Response<T> | undefined) => {
      console.log("response", response);

      if (response) {
        resolve(response);
      } else {
        reject();
      }
    });
  });
}
