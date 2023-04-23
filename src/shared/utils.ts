import jsforce from "jsforce";

export function getOrgId(document: Document): string {
  return document.cookie.match(/(?<=sid=)[A-Za-z0-9]{15}/)?.[0] || "";
}

export function getSessionId(): string {
  if (!chrome.cookies) {
    throw new Error("Cannot access Chrome Cookies API");
  }

  chrome.cookies.getAll({ domain: ".force.com" }, (cookies) => {
    console.log("cookies", cookies);
    const sessionId = cookies.find((c) => c.name === "sid")?.value;
    console.log("sessionId", sessionId);
    return sessionId;
  });

  return "";
}

export function doSalesforceCall(sessionId: string) {
  const conn = new jsforce.Connection({
    serverUrl: "https://***REMOVED***.lightning.force.com",
    sessionId: sessionId,
  });

  console.log(conn);

  conn.query("SELECT Id, Name FROM Account LIMIT 5").then((res) => {
    console.log("res", res);
  });
}
