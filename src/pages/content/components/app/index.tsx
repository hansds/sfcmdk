import { createRoot } from "react-dom/client";
import SalesforceCommand from "@src/pages/content/components/salesforceCommand";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/content");
init();

document.addEventListener("keydown", function (event) {
  if (event.key === "k" && event.metaKey) {
    togglePalette();

    // const getSessionIdRequest: Messaging.Request = {
    //   type: "getSessionId",
    // };
    // chrome.runtime.sendMessage(getSessionIdRequest, function (response) {
    //   console.log(response);
    // });

    // Messaging.getSessionId().then((sessionId) => {
    //   console.log(sessionId);
    // });

    chrome.storage.local.get("salesforce-command-palette").then((result) => {
      console.log(result);
    });
  }
  if (event.key === "Escape") {
    const paletteElement = document.getElementById(
      "salesforce-command-palette-content-view-root"
    );
    if (paletteElement && paletteElement.style.display !== "none") {
      setPaletteVisible(paletteElement, false);
    }
  }
});

export function init() {
  if (isSalesforceDomain()) {
    createApp();
    console.log("Salesforce Command Palette: Content View Loaded");
  }
}

function createApp() {
  const root = document.createElement("div");
  root.id = "salesforce-command-palette-content-view-root";
  root.style.display = "none";
  root.style.top = "0";
  root.style.left = "0";
  root.style.right = "0";
  root.style.bottom = "0";
  root.style.position = "fixed";
  root.style.zIndex = "9999";
  root.style.justifyContent = "center";
  root.style.alignItems = "center";
  root.style.pointerEvents = "none";

  // root.style.display = "none";

  document.body.prepend(root);

  // Fixes UX where Salesforce steals focus when opening command palette very quickly on page load
  root.addEventListener("focusout", () => {
    const paletteElement = document.getElementById(
      "salesforce-command-palette-content-view-root"
    );

    if (!paletteElement) return;

    if (paletteElement.style.display !== "none") {
      document.dispatchEvent(new Event("salesforce-command-palette-opened"));
    }
  });

  createRoot(root).render(<SalesforceCommand />);
}

function isSalesforceDomain() {
  return !!document.URL.match(
    "https?://([a-z0-9]+[-]*[a-z0-9]*[.])*force[.]com"
  );
}

function togglePalette() {
  const paletteElement = document.getElementById(
    "salesforce-command-palette-content-view-root"
  );

  if (!paletteElement) return;

  if (paletteElement.style.display === "none") {
    setPaletteVisible(paletteElement, true);
  } else {
    setPaletteVisible(paletteElement, false);
  }
}

function setPaletteVisible(paletteElement: HTMLElement, visible: boolean) {
  if (visible) {
    paletteElement.style.display = "flex";
    paletteElement.style.pointerEvents = "auto";

    document.dispatchEvent(new Event("salesforce-command-palette-opened"));
  } else {
    paletteElement.style.display = "none";
    paletteElement.style.pointerEvents = "none";
  }
}
