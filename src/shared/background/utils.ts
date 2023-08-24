export function getOrgId(document: Document): string {
  return document.cookie.match(/(?<=sid=)[A-Za-z0-9]{15}/)?.[0] || "";
}

export async function getSessionId(orgId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!chrome.cookies) {
      reject(Error("Cannot access Chrome Cookies API"));
    }
    chrome.cookies.getAll({ domain: ".salesforce.com" }, (cookies) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        const sessionId = cookies.find(
          (c) => c.name == "sid" && c.value.startsWith(orgId)
        )?.value;

        console.log("sessionId", sessionId);
        resolve(sessionId);
      }
    });
  });
}

export function doAuthenticatedSalesforceRequest(
  sessionId: string,
  url: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Authorization", `Bearer ${sessionId}`);
    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.onerror = function () {
      reject(xhr.statusText);
    };
    xhr.send();
  });
}
