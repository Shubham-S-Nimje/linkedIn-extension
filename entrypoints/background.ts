export default defineBackground(() => {
  console.log("Hello background!", { id: chrome.runtime.id });

  // Add a listener to respond to messages
  // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //   if (message.action === "openModal") {
  //     console.log("Received request to open modal from content script");
  //     // Respond with a message or perform necessary actions
  //     sendResponse({ status: "Modal open request received" });
  //   }
  // });
});
