// ==UserScript==
// @name        Remove ReadOnly Fields
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/RemoveReadOnly.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/MonkeyScripts/main/RemoveReadOnly.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/MonkeyScripts/main/RemoveReadOnly.user.js
// @include     *
// @description Removes readonly attributes and event hijacking. Patched to prevent conflicts on gemini.google.com.
// @version     2025.06.20.11
//
// ==/UserScript==
//

(function() {
    'use strict';

    /**
     * Injects a global stylesheet to override CSS that disables user interaction.
     * This is focused on enabling text selection.
     */
    function injectGlobalStyles() {
        const styleId = 'enable-all-the-things-style';
        if (document.getElementById(styleId)) {
            return; // Style already injected
        }

        const css = `
            /* This rule enables text selection everywhere. It is generally safe. */
            * {
                -webkit-touch-callout: text !important;
                -webkit-user-select: text !important;
                -khtml-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                -o-user-select: text !important;
                user-select: text !important;
            }
        `;

        const style = document.createElement('style');
        style.id = styleId;
        style.type = 'text/css';
        style.textContent = css;
        document.head.appendChild(style);
    }

    /**
     * The main function to find and re-enable all restricted elements on the page.
     * It runs on initial load and is called by the MutationObserver for dynamic content.
     */
    function enableElements() {
        // Select all elements on the page that have attributes designed to restrict them.
        const restrictedElements = document.querySelectorAll(
            '[disabled], [readonly], [oncopy], [onpaste], [oncut], [oncontextmenu], [unselectable="on"]'
        );

        // Loop through each found element and remove restrictions.
        restrictedElements.forEach(el => {
            // Removing the 'disabled' attribute is the proper way to make elements clickable again.
            el.removeAttribute('readonly');
            el.removeAttribute('disabled');
            el.removeAttribute('unselectable');

            // Remove inline event handlers that prevent copy, paste, cut, or context menu.
            el.removeAttribute('oncopy');
            el.removeAttribute('onpaste');
            el.removeAttribute('oncut');
            el.removeAttribute('oncontextmenu');
        });

        // Specifically target all input fields to enable autocomplete.
        document.querySelectorAll('input').forEach(el => {
            el.setAttribute('autocomplete', 'on');
        });
    }

    /**
     * Overrides the native addEventListener to prevent sites from dynamically
     * adding scripts that block user actions like copy, paste, and selecting text.
     */
    function preventEventHijacking() {
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            const forbiddenEvents = ['paste', 'copy', 'cut', 'selectstart'];
            if (forbiddenEvents.includes(type)) {
                console.log(`[Remove ReadOnly] Blocked a script from adding a '${type}' event listener.`);
                return; // Silently block the addition of the event listener.
            }
            // For all other events, use the original function.
            originalAddEventListener.call(this, type, listener, options);
        };
    }

    // --- Main Execution ---

    // 1. Inject the global CSS overrides for text selection.
    injectGlobalStyles();

    // 2. Prevent scripts from adding new restrictive event listeners, but ONLY
    //    if we are not on gemini.google.com to avoid conflicts.
    if (window.location.hostname !== 'gemini.google.com') {
        preventEventHijacking();
    }

    // 3. Run the main function to enable all elements currently on the page.
    enableElements();

    // 4. Set up a MutationObserver to handle dynamically added elements.
    // This ensures that elements loaded after the initial page load are also processed.
    const observer = new MutationObserver((mutations) => {
        // We can simply re-run enableElements. It's fast enough.
        enableElements();
    });

    // Start observing the entire document for changes to the element tree.
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();
