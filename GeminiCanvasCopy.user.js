// ==UserScript==
// @name         Gemini - Canvas Direct Copy Fix
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/GeminiCanvasCopy.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/MonkeyScripts/main/GeminiCanvasCopy.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/MonkeyScripts/main/GeminiCanvasCopy.user.js
// @version      2025.06.20.04
// @description  Disables the Monaco editor's copy interceptor to allow direct copying of highlighted text from the Gemini Canvas.
// @include      https://gemini.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /**
     * This script fixes the copy functionality by waiting for the Monaco editor to appear
     * and then attaching a high-priority "keydown" event listener. This listener
     * intercepts the Ctrl+C/Cmd+C command, stops the website's scripts from running,
     * and copies the user's true selection.
     */
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Find the editor container, which has the class '.monaco-editor'.
                    const editorNode = node.querySelector('.monaco-editor');

                    // Check if the editor exists and if we haven't already attached our fix.
                    if (editorNode && !editorNode.dataset.copyFixAttached) {
                        console.log('Canvas Fix: Editor detected. Attaching keydown interceptor.');
                        editorNode.dataset.copyFixAttached = 'true'; // Mark as fixed to prevent re-attaching.

                        // Add the event listener to the editor. The 'capture: true' option
                        // ensures our listener runs before any others on the element.
                        editorNode.addEventListener('keydown', (event) => {
                            const isCopyShortcut = (event.ctrlKey || event.metaKey) && event.key === 'c';

                            if (isCopyShortcut) {
                                // Get the currently selected text.
                                const selection = window.getSelection().toString();
                                if (selection) {
                                    console.log('Canvas Fix: Copy shortcut intercepted.');
                                    // This is the crucial part: it stops the event from reaching
                                    // Monaco's built-in (and faulty) copy handlers.
                                    event.stopImmediatePropagation();

                                    // Manually perform the copy using the Clipboard API.
                                    navigator.clipboard.writeText(selection).then(() => {
                                        console.log('Canvas Fix: Successfully copied text to clipboard.');
                                    }).catch(err => {
                                        console.error('Canvas Fix: Error copying text:', err);
                                    });
                                }
                            }
                        }, { capture: true });
                    }
                }
            });
        }
    });

    console.log('Canvas Fix: Initializing observer to find editor...');
    // Start observing the entire page for changes to detect when the editor is loaded.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
