import { storeForOrg } from "../storage";
import { GetUsersResponse } from "./core";
import { fetchAuthenticatedSalesforce } from "./utils";

enum MessageType {
  GetUsers = "getUsers",
  GetCustomObjects = "getCustomObjects",
}

export interface Request {
  type: MessageType.GetUsers;
  orgId: string;
}

export function receiveMessages(
  request: Request,
  sender,
  sendResponse: (response) => void
) {
  (async () => {
    if (request.type == MessageType.GetUsers) {
      const response = await fetchAuthenticatedSalesforce(
        "services/data/v50.0/query/?q=SELECT+Id,Name,Username,Profile.Name+FROM+User+WHERE+IsActive+=+true",
        request.orgId
      );
      const json = await response.json();
      storeForOrg(request.orgId, { users: json });

      sendResponse(json);
    } else if (request.type == MessageType.GetCustomObjects) {
      sendResponse([]);
    }
  })();

  return true;
}

export async function getUsers(orgId: string): Promise<GetUsersResponse> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: MessageType.GetUsers, orgId },
      (response) => {
        console.log("response", response);

        if (response) {
          resolve(response);
        } else {
          reject();
        }
      }
    );
  });
}
