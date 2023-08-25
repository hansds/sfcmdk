import { storeForOrg } from "../storage";
import { GetLoginAsUsersResponse } from "./core";
import { fetchAuthenticatedSalesforce } from "./utils";

enum MessageType {
  GetLoginAsUsers = "getLoginAsUsers",
  FetchCustomObjects = "fetchCustomObjects",
}

export interface Request {
  type: MessageType.GetLoginAsUsers;
  orgId: string;
}

export function receiveMessages(
  request: Request,
  sender,
  sendResponse: (response) => void
) {
  console.log("request from background", request);
  (async () => {
    if (request.type == MessageType.GetLoginAsUsers) {
      const response = await fetchAuthenticatedSalesforce(
        "services/data/v50.0/query/?q=SELECT+Id,Name,Profile.Name+FROM+User+WHERE+IsActive+=+true",
        request.orgId
      );
      const json = await response.json();
      console.log("json", json);
      storeForOrg(request.orgId, { loginAsUsers: json });

      sendResponse(json);
    } else if (request.type == MessageType.FetchCustomObjects) {
      sendResponse([]);
    }
  })();

  return true;
}

export async function getLoginAsUsers(
  orgId: string
): Promise<GetLoginAsUsersResponse> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: MessageType.GetLoginAsUsers, orgId },
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
