chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Helpscout is weird. The page doesn't reload when you open a new email, only the URL changes.
  // This helps trigger the content script every time the URL changes.
  if (changeInfo.url) {
    setTimeout(() => {
      chrome.tabs.sendMessage(tabId, {
        message: "TabUpdated",
        url: changeInfo.url,
        tabR: tab,
        changeInfo: changeInfo,
      });
    }, 1000);
  }
});
