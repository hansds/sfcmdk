export function getOrgId(document: Document): string {
  return document.cookie.match(/(?<=sid=)[A-Za-z0-9]{15}/)?.[0] || "";
}

interface SalesforceEnvironment {
  domain: string;
  sessionId: string;
}

export async function getSalesforceEnvironment(
  orgId: string
): Promise<SalesforceEnvironment> {
  return new Promise((resolve, reject) => {
    if (!chrome.cookies) {
      reject(Error("Cannot access Chrome Cookies API"));
    }
    chrome.cookies.getAll({ domain: ".salesforce.com" }, (cookies) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        const cookie = cookies.find(
          (c) => c.name == "sid" && c.value.startsWith(orgId)
        );

        if (!cookie || !cookie.domain || !cookie.value)
          reject(Error("No session cookie found"));

        const env = {
          domain: cookie.domain,
          sessionId: cookie.value,
        };

        resolve(env);
      }
    });
  });
}

export async function fetchAuthenticatedSalesforce(
  path: string,
  orgId: string
) {
  const { sessionId, domain } = await getSalesforceEnvironment(orgId);

  return fetch(`https://${domain}/${path}`, {
    headers: {
      Authorization: `Bearer ${sessionId}`,
    },
  });
}

async function getActiveOrNewTab(newTab: boolean) {
  if (newTab) {
    return await chrome.tabs.create({});
  } else {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    return tabs[0];
  }
}

export async function openInActiveOrNewTab(url: string, newTab: boolean) {
  const tab = await getActiveOrNewTab(newTab);

  return await chrome.tabs.update(tab.id, { url });
}
