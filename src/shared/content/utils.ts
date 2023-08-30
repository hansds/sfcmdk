/**
 * Contains only functions used by the content script
 */

export function getOrgIdFromDocument(document: Document): string {
  const contentSessionId = document.cookie.match(/(?<=sid=)[^;]+/)?.[0] ?? "";

  return contentSessionId?.substring(0, 15);
}

export function isSalesforceIdFormat(id: string): boolean {
  return id.match(/[a-zA-Z0-9]{18}|[a-zA-Z0-9]{15}/) !== null;
}
