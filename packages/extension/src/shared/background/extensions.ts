export const EXTENSIONS: Record<string, { id: string; url: string }> = {
  SalesforceInspector: {
    id: "aodjmnfhjibkcdimpodiifdjnnncaafh",
    url: "https://chrome.google.com/webstore/detail/salesforce-inspector/aodjmnfhjibkcdimpodiifdjnnncaafh",
  },
};

export async function isExtensionInstalled(id: string): Promise<boolean> {
  const extensionInfo = await chrome.management.get(id);

  return !!extensionInfo && extensionInfo.enabled;
}
