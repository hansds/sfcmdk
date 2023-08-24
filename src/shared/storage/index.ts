const LOCAL_STORAGE_KEY = "salesforce-command-palette";

export function storeForOrg(orgId: string, data: any) {
  chrome.storage.local.set({ [LOCAL_STORAGE_KEY]: { [orgId]: data } });
}
