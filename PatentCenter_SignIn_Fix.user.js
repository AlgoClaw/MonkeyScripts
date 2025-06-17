// ==UserScript==
// @name        Patent Center - Stay Signed In
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/PatentCenter_SignIn_Fix.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/UImods/main/PatentCenter_SignIn_Fix.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/UImods/main/PatentCenter_SignIn_Fix.user.js
// @version     2025.06.17.2
// @description Handles session timeouts by clicking "Stay Signed In" and resetting the session timer.
// @include     *://*.uspto.gov/*
// @grant       none
// @run-at      document-idle
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Monitors for the session timeout dialog and clicks the "Stay Signed In" button.
     * This function checks for the presence and visibility of the button before clicking it.
     */
    function staySignedIn() {
        // Select the "Stay Signed In" button by its ID
        const staySignedInButton = document.querySelector('#stmStaySignedInBtn');

        // Check if the button exists and is visible on the page
        if (staySignedInButton && staySignedInButton.offsetParent !== null) {
            console.log(`Sign In Dialog: Automatically clicking "Yes, keep me signed in" buttonat ${new Date().toLocaleTimeString()}.`, staySignedInButton);
            staySignedInButton.click();
        } else {
            // Log to the console if the dialog isn't found, for debugging purposes.
            console.log(`Sign In Dialog: Sign in dialog NOT found at ${new Date().toLocaleTimeString()}.`);
        }
    }

    /**
     * Sends a GET request to the server to keep the session alive.
     * This prevents the session from expiring due to inactivity.
     */
    function resetSessionTimer() {
        // Use the fetch API to send a request to the server's reset-timer endpoint
        fetch('https://patentcenter.uspto.gov/reset-timer')
            .then(response => {
                if (response.ok) {
                    // Log a success message to the console
                    console.log(`Reset Timer: Session timer reset successfully at ${new Date().toLocaleTimeString()}.`);
                } else {
                    // Log an error if the request fails
                    console.error('Reset Timer: Failed to reset session timer.', response.status, response.statusText);
                }
            })
            .catch(error => {
                // Log any network errors that occur during the fetch
                console.error('Reset Timer: Error while trying to reset session timer.', error);
            });
    }

    // --- Main Execution ---

    // Periodically check for the session timeout dialog every minute (60,000 milliseconds)
    setInterval(staySignedIn, 60000);

    // Periodically reset the session timer every 5 minutes (300,000 milliseconds)
    setInterval(resetSessionTimer, 300000);

})();
