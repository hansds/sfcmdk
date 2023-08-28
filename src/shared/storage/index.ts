import { MessageType } from "../messaging";
import { SalesforceReponse } from "../messaging/types";

const STORAGE_KEY_FETCHED_DATA = "fetchedData";

type StorageData = {
  data: SalesforceReponse;
  lastUpdated: number;
};

export async function cacheInStorage(
  key: MessageType,
  orgId: string,
  fetchFunction: () => Promise<SalesforceReponse>
) {
  const localStorage = await chrome.storage.local.get();
  const fetchedData = localStorage[STORAGE_KEY_FETCHED_DATA];
  const now = Date.now();
  let response;

  if (fetchedData && fetchedData[orgId] && fetchedData[orgId][key]) {
    const { data: cachedData, lastUpdated } = fetchedData[orgId][
      key
    ] as StorageData;

    if (now - lastUpdated < 1000 * 60 * 60 * 24) {
      console.log(
        "✅ Using cached data since it was last updated at",
        lastUpdated,
        orgId,
        key
      );

      response = cachedData;
    }
  }
  if (!response) {
    response = await fetchFunction();

    console.log(
      "🟧 Fetched data since it was last updated at",
      localStorage[orgId]?.lastUpdated,
      orgId,
      key
    );

    const mergeFetchedDataChanges = {
      ...localStorage[STORAGE_KEY_FETCHED_DATA],
      ...{
        [orgId]: {
          ...localStorage[STORAGE_KEY_FETCHED_DATA]?.[orgId],
          ...{ [key]: { data: response, lastUpdated: now } },
        },
      },
    };

    chrome.storage.local.set({
      ...localStorage,
      ...{ [STORAGE_KEY_FETCHED_DATA]: mergeFetchedDataChanges },
    });
  }

  return response;
}
