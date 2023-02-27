import {
  MessageRequestTypes,
  Platforms,
  ReplyButtonIds,
  ReplyTextboxClassNames,
  SendReplyButtonIds,
  StorageVariables,
} from "../../utils/constants";
import {
  getClientIdFromStorage,
  getPlatformFromUrl,
  getTicketIdFromPlatformAndUrl,
} from "../../utils/util";
import ApiClient from "../../utils/client";
import React from "react";
import ReactDOM from "react-dom";

import Popup from "../Popup/Popup";
import styles from "../Popup/index.css";
import "../../styles/globals.css";

const API = new ApiClient();

// inject copilot suggestion into the reply input box
const injectCompletion = (platform, text) => {
  if (text === null || text === undefined || text.trim().length === 0) {
    return;
  }

  if (platform == Platforms.HelpScout) {
    // Get the number of sections with class `js-thread-content` in the ticket.
    // This is used to determine number of human messages in the ticket
    const sections = document.querySelectorAll("section.js-thread-content");
    // If there are more than 1 human messages, don't inject the completion
    if (sections.length > 1) {
      return;
    }

    const customerName =
      document.querySelector(".c-profile__name")?.textContent;
    const firstName = customerName?.split(" ")[0];

    const prefix = `Hey ${firstName},\n\n`;
    const suffix = `\n\n Thanks,\nJake`;

    // Clicks the "Reply" button so that reply textbox becomes visible
    document.getElementById(ReplyButtonIds.HelpScout).click();
    // Timeout 0.5 seconds because the reply textbox ("redactor_redactor redactor_editor")
    // DOM element isn't visibile right away. We have to wait for the Click action to complete
    // and the DOM element to become visible
    setTimeout(() => {
      document.getElementsByClassName(
        ReplyTextboxClassNames.HelpScout
      )[0].innerText = prefix + text + suffix;
    }, 500);
  } else if (platform == Platforms.ZenDesk) {
    const inputBox = document.querySelectorAll('[role="textbox"]')[0];
    inputBox.innerText = text;
  }
};

// add listener for copilot suggestion injection
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { type } = request;

  if (type == MessageRequestTypes.InjectCompletion) {
    const { platform, text } = request;
    injectCompletion(platform, text);
  }
  sendResponse(true);
  return;
});

// make a call to the API to save the actual ticket response sent by the CX agent
const saveTicketResponse = async () => {
  // get reply text
  const replyText = document.getElementsByClassName(
    ReplyTextboxClassNames.HelpScout
  )[0].innerText;
  // get client id
  const clientId = await getClientIdFromStorage();
  // get conversation id
  const platform = getPlatformFromUrl(document.location.href);
  const conversationId = getTicketIdFromPlatformAndUrl(
    platform,
    document.location.href
  );
  // post ticket response
  await API.post("/tickets", {
    client_id: clientId,
    conversation_id: conversationId,
    response: replyText,
    from_browser: true,
  });
};

// add a listener to the send button that triggers `saveTicketResponse`
const addSendButtonListener = () => {
  try {
    // Timeout 0.5 seconds because the DOM element isn't visibile right away.
    // We have to wait for the DOM elements to become visible
    setTimeout(() => {
      const sendButton = document.getElementById(SendReplyButtonIds.HelpScout);
      sendButton.addEventListener("click", saveTicketResponse);
    }, 500);
  } catch (e) {
    console.error(e);
  }
};

// add listener for `reply` button -> add listener to `send` button which is now visible
const addReplyButtonLister = () => {
  // Timeout 0.5 seconds because the DOM element isn't visibile right away.
  // We have to wait for the DOM elements to become visible
  const url = document.location.href;
  if (url.includes("helpscout")) {
    setTimeout(() => {
      const replyButton = document.getElementById(ReplyButtonIds.HelpScout);
      replyButton.addEventListener("click", addSendButtonListener);
    }, 500);
  }
};

// add a listener to the reply button once the document loads
document.addEventListener("DOMContentLoaded", addReplyButtonLister);

const renderDom = () => {
  const copilotSidebarCloneId = "copilot-sidebar-clone";

  if (document.getElementById(copilotSidebarCloneId)) {
    return;
  }
  const sidebarClone = document.createElement("div");
  sidebarClone.id = "copilot-sidebar-clone";

  let sidebar;

  // Get document url to get platform
  const url = document.location.href;

  // Prepare for injection based on platform and gather other required data
  let platform;

  if (url.includes("helpscout")) {
    platform = Platforms.HelpScout;
    sidebar = document.getElementsByClassName("c-app-layout__col")[1];
    sidebar.parentNode.insertBefore(sidebarClone, sidebar.nextSibling);
  } else if (url.includes("zendesk")) {
    platform = Platforms.ZenDesk;
    sidebar = document.querySelectorAll("[id=undefined--primary-pane]")[1];
    const parentGridColumnsStyle = sidebar.parentNode.style.gridTemplateColumns;
    const firstColumnStyle = parentGridColumnsStyle.split(" ")[0];
    sidebar.parentNode.style.gridTemplateColumns = `${parentGridColumnsStyle} ${firstColumnStyle}`;
    sidebar.parentNode.insertBefore(sidebarClone, sidebar.nextSibling);
  }

  const shadowRoot = sidebarClone.attachShadow({ mode: "open" });
  shadowRoot.id = "copilot-sidebar";



  console.debug("Injecting CX Copilot sidebar...");
  ReactDOM.render(
    <Popup
      injectCompletion={injectCompletion}
      platform={platform}
      url={document.location.href}
    />,
    shadowRoot
  );
};

// Listen for TabUpdated
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "TabUpdated") {
    renderDom();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    renderDom();
  }, 1000);
});
