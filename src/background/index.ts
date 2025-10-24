// Background script for Markdown Viewer extension
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  try {
    // Send message to content script to toggle markdown view
    await chrome.tabs.sendMessage(tab.id, {
      action: 'toggleMarkdownView'
    });
  } catch (error) {
    console.error('Error toggling markdown view:', error);
  }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Markdown Viewer extension installed');
});