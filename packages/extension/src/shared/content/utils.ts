/**
 * Contains only functions used by the content script
 */
const SALESFORCE_ID_REGEX = /^[0-9a-zA-Z]{15}([0-9a-zA-Z]{3})?$/;

export function getOrgIdFromDocument(document: Document): string {
  const contentSessionId = document.cookie.match(/(?<=sid=)[^;]+/)?.[0] ?? "";

  return contentSessionId?.substring(0, 15);
}

/**
 * Returns true if the given string is probably a 15 or 18 character Salesforce ID
 *
 * This is not entirely certain, but it's good enough for our purposes.
 * We also check that the ID contains a 0, to avoid matching any string of 15 or 18 characters which is relatively common in the commands we use.
 */
export function isProbablySalesforceId(id: string): boolean {
  return id.match(SALESFORCE_ID_REGEX) !== null && id.includes("0");
}
