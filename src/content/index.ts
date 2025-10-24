// Content script for Markdown Viewer extension
import { extract, toMarkdown } from '@mizchi/readability';

let isMarkdownViewEnabled = false;
let originalContent = '';

// Initialize markdown view state from storage
chrome.storage.local.get(['markdownViewEnabled'], (result) => {
  isMarkdownViewEnabled = result.markdownViewEnabled || false;
  if (isMarkdownViewEnabled) {
    convertToMarkdown();
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleMarkdownView') {
    toggleMarkdownView();
    sendResponse({ success: true });
  }
  return true;
});

function toggleMarkdownView() {
  isMarkdownViewEnabled = !isMarkdownViewEnabled;

  if (isMarkdownViewEnabled) {
    convertToMarkdown();
  } else {
    restoreOriginalContent();
  }

  // Save state to storage
  chrome.storage.local.set({ markdownViewEnabled: isMarkdownViewEnabled });
}

async function convertToMarkdown() {
  try {
    const html = document.documentElement.outerHTML;
    const extracted = extract(html, {
      charThreshold: 100,
    });

    if (extracted.root) {
      const markdown = toMarkdown(extracted.root);

      // Store original content
      originalContent = document.body.innerHTML;

      // Replace page content with markdown
      document.body.innerHTML = `
        <div id="markdown-viewer-container" style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
          background: white;
          color: #333;
        ">
          <div style="margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
            <button id="toggle-view-btn" style="
              background: #007acc;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            ">元の表示に戻す</button>
          </div>
          <pre style="
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            white-space: pre-wrap;
            word-wrap: break-word;
          ">${markdown}</pre>
        </div>
      `;

      // Add click handler for toggle button
      const toggleBtn = document.getElementById('toggle-view-btn');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          toggleMarkdownView();
        });
      }
    }
  } catch (error) {
    console.error('Error converting to markdown:', error);
    showError('マークダウン変換中にエラーが発生しました。');
  }
}

function restoreOriginalContent() {
  if (originalContent) {
    document.body.innerHTML = originalContent;
  }
}

function showError(message: string) {
  document.body.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #f8d7da;
      color: #721c24;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #f5c6cb;
      text-align: center;
      z-index: 10000;
    ">
      <h3>エラー</h3>
      <p>${message}</p>
      <button onclick="location.reload()" style="
        background: #dc3545;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
      ">ページを再読み込み</button>
    </div>
  `;
}