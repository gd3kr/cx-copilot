import { MessageRequestTypes, Platforms, ReplyButtonIds, ReplyTextboxClassNames } from "../../utils/constants";


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