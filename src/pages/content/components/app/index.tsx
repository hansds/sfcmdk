import { createRoot } from "react-dom/client";
import SalesforceCommand from "@src/pages/content/components/salesforceCommand";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/content");
init();

document.addEventListener("keydown", function (event) {
  if (event.key === "k" && event.metaKey) {
    togglePalette();
  }
  if (event.key === "Escape") {
    setPaletteVisibility(false);
  }
});

export function init() {
  if (isSalesforceDomain()) {
    createApp();
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

  if (paletteElement.style.display === "none") {
    setPaletteVisibility(true);
  } else {
    setPaletteVisibility(false);
  }
}

function setPaletteVisibility(visible: boolean) {
  const paletteElement = document.getElementById(
    "salesforce-command-palette-content-view-root"
  );

  if (!paletteElement) return;

  if (visible) {
    paletteElement.style.display = "flex";
    paletteElement.style.pointerEvents = "auto";

    document.dispatchEvent(new Event("salesforce-command-palette-opened"));
  } else {
    paletteElement.style.display = "none";
    paletteElement.style.pointerEvents = "none";
  }
}
