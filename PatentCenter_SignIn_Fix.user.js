// ==UserScript==
// @name        Patent Center - Stay Signed In
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/PatentCenter_SignIn_Fix.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/UImods/main/PatentCenter_SignIn_Fix.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/UImods/main/PatentCenter_SignIn_Fix.user.js
// @version     2025.06.16.1
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
            console.log('USPTO UI Fix: Automatically clicking "Yes, keep me signed in" button.', staySignedInButton);
            staySignedInButton.click();
        } else {
            // Log to the console if the dialog isn't found, for debugging purposes.
            console.log(`USPTO UI Fix: Sign in dialog not found at ${new Date().toLocaleTimeString()}.`);
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
                    console.log(`USPTO UI Fix: Session timer reset successfully at ${new Date().toLocaleTimeString()}.`);
                } else {
                    // Log an error if the request fails
                    console.error('USPTO UI Fix: Failed to reset session timer.', response.status, response.statusText);
                }
            })
            .catch(error => {
                // Log any network errors that occur during the fetch
                console.error('USPTO UI Fix: Error while trying to reset session timer.', error);
            });
    }

    // --- Main Execution ---

    // Periodically check for the session timeout dialog every minute (60,000 milliseconds)
    setInterval(staySignedIn, 60000);

    // Periodically reset the session timer every 5 minutes (300,000 milliseconds)
    setInterval(resetSessionTimer, 300000);

})();
