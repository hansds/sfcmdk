import packageJson from "./package.json";

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: packageJson.long_name,
  version: packageJson.version,
  description: packageJson.description,
  // options_page: "src/pages/options/index.html",
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module",
  },
  // action: {
  //   default_popup: "src/pages/popup/index.html",
  //   default_icon: "logo-app-gradient-square@32.png",
  // },
  // chrome_url_overrides: {
  //   newtab: "src/pages/newtab/index.html",
  // },
  icons: {
    "128": "logo-app-gradient-square@128.png",
  },
  content_scripts: [
    {
      matches: ["*://*.force.com/*", "*://*.salesforce.com/*"],
      js: ["src/pages/content/index.js"],
      // KEY for cache invalidation
      css: ["assets/css/contentStyle<KEY>.chunk.css"],
      all_frames: true,
    },
  ],
  // devtools_page: "src/pages/devtools/index.html",
  web_accessible_resources: [
    {
      resources: [
        "assets/js/*.js",
        "assets/css/*.css",
        "logo-app-gradient-square@128.png",
        "logo-app-gradient-square@32.png",
      ],
      matches: ["*://*/*"],
    },
  ],
  host_permissions: ["*://*.force.com/", "*://*.salesforce.com/"],
  permissions: ["cookies", "storage", "tabs", "activeTab", "management"],
};

export default manifest;
