/**
 * Contains only functions used by the content script
 */

export function getDocumentSessionId(document: Document): string {
  return document.cookie.match(/(?<=sid=)[^;]+/)?.[0] || "";
}
