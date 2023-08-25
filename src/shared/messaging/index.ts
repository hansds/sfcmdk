import { storeForOrg } from "../storage";
import { fetchAuthenticatedSalesforce } from "../background/utils";
import { GenericRequest, MessageRequest, MessageResponse } from "./types";

export enum MessageType {
  GetUsers,
  GetCustomObjects,
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
  message: MessageRequest<keyof RequestMap>,
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

      const response: MessageResponse<MessageType.GetUsers> = {
        type: MessageType.GetUsers,
        data: json,
      };

      sendResponse(response);
    } else if (requestType == MessageType.GetCustomObjects) {
      const response: MessageResponse<MessageType.GetCustomObjects> = {
        type: MessageType.GetCustomObjects,
        data: [],
      };

      sendResponse(response);
    }
  })();

  return true;
}
