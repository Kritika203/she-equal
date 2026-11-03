// WorkShield background service worker (Manifest V3).
// It only reacts when the user right-clicks SELECTED text and chooses the menu item.
// Nothing is read on its own and nothing is sent anywhere.

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "check-with-workshield",
    title: "Check with WorkShield",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== "check-with-workshield") return;
  const text = (info.selectionText || "").trim();
  if (!text) return;

  await chrome.storage.local.set({ pendingCheck: text });

  // Hint on the icon that a check is waiting.
  chrome.action.setBadgeText({ text: "1" });
  chrome.action.setBadgeBackgroundColor({ color: "#C73E33" });

  // openPopup() is not available in every Chrome version. If it fails, the saved
  // text is picked up the next time the user opens the popup.
  try {
    await chrome.action.openPopup();
  } catch (e) {
    /* fail silently */
  }
});
