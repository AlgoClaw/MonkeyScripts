// ==UserScript==
// @name        Patent Center - IFW Autocheck
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/PatentCenter_IFW_Autocheck.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/UImods/main/PatentCenter_IFW_Autocheck.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/UImods/main/PatentCenter_IFW_Autocheck.user.js
// @version     2025.06.16.1
// @description null
// @include     *://*.uspto.gov/*
// @grant       none
// @run-at      document-idle
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    // This array contains the document codes that will be automatically selected and highlighted.
    const docCodesToSelect = ['SPEC', 'CLM', 'DRW', 'DRW.NONBW', 'NT.CR.APP.PA', 'NT.INC.REPLY', 'NT.INCPL.APP', 'NTC.MISS.PRT', 'NTC.OMIT.APP', 'A.PA', 'CTRS', 'ELC.', 'CTNF', 'EXIN', 'A...', 'A.I.', 'A.LA', 'A.NA', 'REM', 'CTFR', 'A.NE', 'CTAV', 'AP.PRE.REQ', 'AP.PRE.DEC', 'CTEQ', 'A.QU', 'A.I.', 'A.LA', 'A.NA', 'AMSB', 'AP.B', 'APBD', 'SA..', 'SADV', 'SAFR', 'SAPB', 'N271','APDA', 'APDN', 'APDP', 'APDR', 'APDS', 'APDS.NGR', 'APDT', 'APE2', 'APEA', 'APND', 'BD.A', 'CLM.NE', 'NOA'];
    // This is the color used for highlighting the document description text.
    const highlightColor = '#b5ffcc'; // A pleasant light green

    /**
     * Processes the documents table to highlight rows and select checkboxes.
     * @param {HTMLTableElement} documentsTable - The table element containing the documents.
     */
    function highlightAndSelect(documentsTable) {
        // Find all rows in the table body that have not yet been processed.
        // The 'data-processed' attribute is added to prevent re-processing rows.
        const rows = documentsTable.querySelectorAll('tbody > tr:not([data-processed="true"])');

        rows.forEach((row) => {
            // Mark the row as processed immediately to avoid duplicate actions.
            row.dataset.processed = 'true';

            const docCodeCell = row.cells[1];
            const descriptionCell = row.cells[2];

            // Ensure the necessary cells exist before proceeding.
            if (docCodeCell && descriptionCell) {
                const docCodeText = docCodeCell.textContent.trim();

                // Check if the document code in the cell matches any code in our list.
                // The comparison is case-insensitive.
                if (docCodesToSelect.some(code => docCodeText.toLowerCase() === code.toLowerCase())) {

                    // Highlight the description by wrapping its content in a span with a background color.
                    descriptionCell.innerHTML = `<span style="background-color: ${highlightColor};">${descriptionCell.innerHTML}</span>`;

                    // Find the checkbox in the row.
                    const checkbox = row.querySelector('input[type="checkbox"]');

                    // If a checkbox exists and is not already checked, click it.
                    if (checkbox && !checkbox.checked) {
                        checkbox.click();
                    }
                }
            }
        });
    }

    /**
     * Checks the page for the documents table and runs the processing function.
     * This function is designed to be called repeatedly by a MutationObserver.
     */
    function runEnhancer() {
        // This script should only run on the "Documents & Transactions" page for a specific application.
        if (!/applications\/\d{8}\/ifw\/docs/.test(window.location.href)) {
            return;
        }

        const documentsTable = document.querySelector('[id^="DataTables_Table_"]');
        if (documentsTable) {
             highlightAndSelect(documentsTable);
        }
    }

    // --- Main Execution ---

    // A MutationObserver is used to detect when new content (like the table) is added to the page.
    // This is necessary because the table may be loaded dynamically via JavaScript.
    const observer = new MutationObserver(runEnhancer);

    // Start observing the entire document body for changes to its child elements.
    observer.observe(document.body, { childList: true, subtree: true });

    // Run the enhancer once on initial page load, in case the content is already present.
    runEnhancer();

})();
