// const renderDom = () => {
//     setTimeout(() => {
//       const shadowRoot = document
//         .querySelector("#sidebarProfile")
//         .attachShadow({ mode: "open" });

//       // Render the React component inside the shadow root
//       console.log("rendering react component");
//       const MyComponent = () => <h1>Hello World!</h1>;
//       ReactDOM.render(<Popup />, shadowRoot);
//     }, 1000);
//   };

// document.addEventListener("DOMContentLoaded", renderDom);

// const renderDom = () => {
//   setTimeout(() => {
//     const shadowRoot = document
//       .querySelector("#sidebarProfile")
//       .attachShadow({ mode: "open" });

//     // Render the React component inside the shadow root
//     console.log("rendering react component");
//     const MyComponent = () => <h1>Hello World!</h1>;
//     ReactDOM.render(<Popup />, shadowRoot);
//   }, 1000);
// };

// chrome.runtime.getBackgroundPage(({ document }) => {
//   document.addEventListener("DOMContentLoaded", renderDom);
// });

// console.log("background page loaded");


// import { MessageRequestTypes } from "../../utils/constants";

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     if (request.type === MessageRequestTypes.InjectCompletion) {
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         const tabId = tabs[0].id;
//         chrome.tabs.sendMessage(tabId, request, (response) => {
//           console.log("response from content script", response);
//         });
//       });
//     }
//   });