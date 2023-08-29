import { cacheInStorage } from "../storage";
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
  RefreshMetadata,
  GetUsers,
  GetCustomObjects,
  LoginAsUser,
  ManageObject,
  NavigateToSalesforcePath,
}

export interface RequestMap {
  [MessageType.RefreshMetadata]: {
    request: GenericRequest;
    response: void;
  };
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
  [MessageType.NavigateToSalesforcePath]: {
    request: GenericRequest & { path: string };
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
    if (requestType == MessageType.RefreshMetadata) {
      chrome.storage.local.clear();
    } else if (requestType == MessageType.GetUsers) {
      const data = await cacheInStorage(
        MessageType.GetUsers,
        message.data.orgId,
        async () => {
          const users = await fetchAuthenticatedSalesforce(
            "services/data/v50.0/query/?q=SELECT+Id,Name,Username,Profile.Name+FROM+User+WHERE+IsActive+=+true",
            message.data.orgId
          );
          return await users.json();
        }
      );

      const response: MessageResponse<MessageType.GetUsers> = {
        type: MessageType.GetUsers,
        data,
      };

      sendResponse(response);
    } else if (requestType == MessageType.GetCustomObjects) {
      const data = await cacheInStorage(
        MessageType.GetCustomObjects,
        message.data.orgId,
        async () => {
          const customObjects = await fetchAuthenticatedSalesforce(
            "services/data/v50.0/query/?q=SELECT+DurableId,NamespacePrefix,Label+FROM+EntityDefinition+WHERE+IsCustomizable=true+ORDER+BY+QualifiedApiName+ASC",
            message.data.orgId
          );
          return await customObjects.json();
        }
      );

      const response: MessageResponse<MessageType.GetCustomObjects> = {
        type: MessageType.GetCustomObjects,
        data,
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
    } else if (requestType == MessageType.NavigateToSalesforcePath) {
      const typedMessage =
        message as MessageRequest<MessageType.NavigateToSalesforcePath>;
      const environment = await getSalesforceEnvironment(
        typedMessage.data.orgId
      );

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        chrome.tabs.update(activeTab.id, {
          url: `https://${environment.domain}/${typedMessage.data.path}`,
        });
      });
    }
  })();

  return true;
}
