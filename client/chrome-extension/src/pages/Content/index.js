import {
  MessageRequestTypes,
  Platforms,
  ReplyButtonIds,
  ReplyTextboxClassNames,
  SendReplyButtonIds,
  StorageVariables
} from "../../utils/constants";
import {
  getClientIdFromStorage,
  getPlatformFromUrl,
  getTicketIdFromPlatformAndUrl
} from "../../utils/util";
import ApiClient from "../../utils/client";

const API = new ApiClient();

// inject copilot suggestion into the reply input box
const injectCompletion = (platform, text) => {
  if (platform == Platforms.HelpScout) {
    // Clicks the "Reply" button so that reply textbox becomes visible
    document.getElementById(ReplyButtonIds.HelpScout).click();
    // Timeout 0.5 seconds because the reply textbox ("redactor_redactor redactor_editor")
    // DOM element isn't visibile right away. We have to wait for the Click action to complete
    // and the DOM element to become visible
    setTimeout(() => {
      document.getElementsByClassName(ReplyTextboxClassNames.HelpScout)[0].innerText = text;
    }, 500);
  }
}

// add listener for copilot suggestion injection
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const {
    type,
  } = request;

  if (type == MessageRequestTypes.InjectCompletion) {
    const {
      platform,
      text,
    } = request;
    injectCompletion(platform, text);
  }
  sendResponse(true);
  return;
});

// make a call to the API to save the actual ticket response sent by the CX agent
const saveTicketResponse = async () => {
  // get reply text
  const replyText = document.getElementsByClassName(ReplyTextboxClassNames.HelpScout)[0].innerText;
  // get client id
  const clientId = await getClientIdFromStorage();
  // get conversation id
  const platform = getPlatformFromUrl(document.location.href);
  const conversationId = getTicketIdFromPlatformAndUrl(platform, document.location.href);
  // post ticket response
  await API.post('/tickets', {
    client_id: clientId,
    conversation_id: conversationId,
    response: replyText,
    from_agent: true,
  });
}

// add a listener to the send button that triggers `saveTicketResponse`
const addSendButtonListener = () => {
  try {
    // Timeout 0.5 seconds because the DOM element isn't visibile right away.
    // We have to wait for the DOM elements to become visible
    setTimeout(() => {
      const sendButton = document.getElementById(SendReplyButtonIds.HelpScout);
      sendButton.addEventListener('click', saveTicketResponse);
    }, 500);
  } catch (e) {
    console.error(e);
  }
}

// add listener for `reply` button -> add listener to `send` button which is now visible
const addReplyButtonLister = () => {
  // Timeout 0.5 seconds because the DOM element isn't visibile right away.
  // We have to wait for the DOM elements to become visible
  setTimeout(() => {
    const replyButton = document.getElementById(ReplyButtonIds.HelpScout);
    replyButton.addEventListener('click', addSendButtonListener);
  }, 500);
}

// add a listener to the reply button once the document loads
document.addEventListener('DOMContentLoaded', addReplyButtonLister);