import { fetchAuthenticated } from "../salesforce";
import { storeForOrg } from "../storage";
import { GetLoginAsUsersResponse, fetchLoginAsUsers } from "./core";
import { getSessionId } from "./utils";

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
  sendResponse: (response?: any) => void
) {
  (async () => {
    if (request.type == MessageType.GetLoginAsUsers) {
      // const loginAsUsers = await fetchLoginAsUsers(request.sessionId);

      const sessionId = await getSessionId(request.orgId);

      console.log("got me sessionid", sessionId);

      const response = await fetchAuthenticated(
        "https://***REMOVED***.lightning.force.com/services/data/v50.0/query/?q=SELECT+Id,Name,Profile.Name+FROM+User+WHERE+IsActive+=+true",
        sessionId
      );
      const json = await response.json();

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
