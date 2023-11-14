import {
  EXTENSIONS,
  getInstalledExtensions,
  isExtensionInstalled,
} from "../background/extensions";
import {
  fetchAuthenticatedSalesforce,
  getObjectTypeFromId,
  getSalesforceEnvironment,
  openInActiveOrNewTab,
} from "../background/utils";
import { cacheInStorage } from "../storage";
import {
  MessageRequest,
  MessageResponse,
  MessageType,
  RequestMap,
} from "./types";

export function receiveMessages(
  message: MessageRequest<keyof RequestMap>,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: MessageResponse<keyof RequestMap>) => void
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
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: MessageResponse<keyof RequestMap>) => void
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

        if (!activeTab || !activeTab.url || !activeTab.id)
          throw new Error("Could not find active tab");

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
    } else if (requestType == MessageType.InspectRecord) {
      const typedMessage = message as MessageRequest<MessageType.InspectRecord>;
      const environment = await getSalesforceEnvironment(
        typedMessage.data.orgId
      );

      const objectType = await getObjectTypeFromId(
        typedMessage.data.recordId,
        typedMessage.data.orgId
      );

      const isSalesforceInspectorInstalled = await isExtensionInstalled(
        EXTENSIONS.SalesforceInspector.id
      );

      if (!isSalesforceInspectorInstalled) {
        openInActiveOrNewTab(EXTENSIONS.SalesforceInspector.url, true);

        throw new Error("Salesforce Inspector is not installed.");
      }

      if (!typedMessage.data.recordId) {
        throw new Error("You must pass a record id");
      }
      if (!objectType)
        throw new Error("Could not determine object type from record id");

      openInActiveOrNewTab(
        `chrome-extension://${EXTENSIONS.SalesforceInspector.id}/inspect.html?host=${environment.domain}&objectType=${objectType}&recordId=${typedMessage.data.recordId}`,
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
    } else if (requestType == MessageType.OpenRecord) {
      const typedMessage = message as MessageRequest<MessageType.OpenRecord>;
      const environment = await getSalesforceEnvironment(
        typedMessage.data.orgId
      );

      if (!typedMessage.data.recordId) {
        throw new Error("You must pass a record id");
      }

      openInActiveOrNewTab(
        `https://${environment.domain}/${typedMessage.data.recordId}`,
        typedMessage.data.newTab
      );
    }
  }
}
