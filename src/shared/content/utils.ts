/**
 * Contains only functions used by the content script
 */

export function getOrgIdFromDocument(document: Document): string {
  const contentSessionId = document.cookie.match(/(?<=sid=)[^;]+/)?.[0] ?? "";

  return contentSessionId?.substring(0, 15);
}
