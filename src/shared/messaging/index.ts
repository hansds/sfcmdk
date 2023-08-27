import { storeForOrg } from "../storage";
import {
  fetchAuthenticatedSalesforce,
  getSalesforceEnvironment,
} from "../background/utils";
import {
  GenericRequest,
  MessageRequest,
  MessageResponse,
  SalesforceReponse,
} from "./types";

export enum MessageType {
  GetUsers,
  GetCustomObjects,
  LoginAsUser,
  ManageObject,
}

export interface RequestMap {
  [MessageType.GetUsers]: {
    request: GenericRequest;
    response: SalesforceReponse;
  };
  [MessageType.GetCustomObjects]: {
    request: GenericRequest;
    response: SalesforceReponse;
  };
  [MessageType.LoginAsUser]: {
    request: GenericRequest & { userId: string };
    response: void;
  };
  [MessageType.ManageObject]: {
    request: GenericRequest & { objectId: string };
    response: void;
  };
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
      // storeForOrg(message.data.orgId, { users: json });

      const response: MessageResponse<MessageType.GetUsers> = {
        type: MessageType.GetUsers,
        data: json,
      };

      sendResponse(response);
    } else if (requestType == MessageType.GetCustomObjects) {
      const customObjects = await fetchAuthenticatedSalesforce(
        "services/data/v50.0/query/?q=SELECT+DurableId,NamespacePrefix,Label+FROM+EntityDefinition+WHERE+IsCustomizable=true+ORDER+BY+QualifiedApiName+ASC",
        message.data.orgId
      );
      const json = await customObjects.json();
      // storeForOrg(message.data.orgId, { users: json });

      const response: MessageResponse<MessageType.GetCustomObjects> = {
        type: MessageType.GetCustomObjects,
        data: json,
      };

      sendResponse(response);
    } else if (requestType == MessageType.LoginAsUser) {
      const typedMessage = message as MessageRequest<MessageType.LoginAsUser>;
      const environment = await getSalesforceEnvironment(
        typedMessage.data.orgId
      );

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        const url = new URL(activeTab.url);
        const path = url.pathname;
        chrome.tabs.update(activeTab.id, {
          url: `https://${environment.domain}/servlet/servlet.su?oid=${
            typedMessage.data.orgId
          }&suorgadminid=${
            typedMessage.data.userId
          }&retURL=${encodeURIComponent(path)}&targetURL=${encodeURIComponent(
            path
          )}`,
        });
      });
    } else if (requestType == MessageType.ManageObject) {
      const typedMessage = message as MessageRequest<MessageType.ManageObject>;
      const environment = await getSalesforceEnvironment(
        typedMessage.data.orgId
      );

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        chrome.tabs.update(activeTab.id, {
          url: `https://${environment.domain}/lightning/setup/ObjectManager/${typedMessage.data.objectId}/Details/view`,
        });
      });
    }
  })();

  return true;
}
