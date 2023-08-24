import * as Messaging from "@src/shared/background/messaging";
import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

/**
 * Receive messages from the extension
 */
chrome.runtime.onMessage.addListener(Messaging.receiveMessages);
