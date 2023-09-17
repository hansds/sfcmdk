import { cacheInStorage } from "../storage";
import {
  fetchAuthenticatedSalesforce,
  getObjectTypeFromId,
  getSalesforceEnvironment,
  openInActiveOrNewTab,
} from "../background/utils";
import {
  GenericRequest,
  MessageRequest,
  MessageResponse,
  SalesforceReponse,
  SfCustomObject,
  SfUser,
} from "./types";

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

export function receiveMessages(
  message: MessageRequest<keyof RequestMap>,
  sender,
  sendResponse: (response) => void
) {
  const requestType = message.type;

  handleMessages(message, sender, sendResponse).catch((error) => {
    const response: MessageResponse<keyof RequestMap> = {
      type: requestType,
      error: error.message,
    };

    sendResponse(response);
  });

  return true;
}

async function handleMessages(
  message: MessageRequest<keyof RequestMap>,
  sender,
  sendResponse: (response) => void
) {
  const requestType = message.type;
  {
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
            "services/data/v50.0/query/?q=SELECT+DurableId,NamespacePrefix,Label,PluralLabel,KeyPrefix,QualifiedApiName+FROM+EntityDefinition+WHERE+IsCustomizable=true+ORDER+BY+QualifiedApiName+ASC",
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

      openInActiveOrNewTab(
        `https://${environment.domain}/lightning/setup/ObjectManager/${typedMessage.data.objectId}/Details/view`,
        typedMessage.data.newTab
      );
    } else if (requestType == MessageType.NavigateToSalesforcePath) {
      const typedMessage =
        message as MessageRequest<MessageType.NavigateToSalesforcePath>;
      const environment = await getSalesforceEnvironment(
        typedMessage.data.orgId
      );

      openInActiveOrNewTab(
        `https://${environment.domain}/${typedMessage.data.path}`,
        typedMessage.data.newTab
      );
    } else if (requestType == MessageType.OpenRecord) {
      const typedMessage = message as MessageRequest<MessageType.OpenRecord>;
      const environment = await getSalesforceEnvironment(
        typedMessage.data.orgId
      );

      const objectType = await getObjectTypeFromId(
        typedMessage.data.recordId,
        typedMessage.data.orgId
      );

      if (!typedMessage.data.recordId) {
        throw new Error("You must pass a record id");
      }
      if (!objectType)
        throw new Error("Could not determine object type from record id");

      openInActiveOrNewTab(
        `chrome-extension://aodjmnfhjibkcdimpodiifdjnnncaafh/inspect.html?host=${environment.domain}&objectType=${objectType}&recordId=${typedMessage.data.recordId}`,
        typedMessage.data.newTab
      );
    } else if (requestType == MessageType.OpenObjectList) {
      const typedMessage =
        message as MessageRequest<MessageType.OpenObjectList>;
      const environment = await getSalesforceEnvironment(
        typedMessage.data.orgId
      );

      openInActiveOrNewTab(
        `https://${environment.domain}/lightning/o/${typedMessage.data.apiName}/list`,
        typedMessage.data.newTab
      );
    }
  }
}
