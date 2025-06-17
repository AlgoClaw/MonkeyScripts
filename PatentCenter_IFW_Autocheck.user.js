// ==UserScript==
// @name        Patent Center - IFW Autocheck
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/PatentCenter_IFW_Autocheck.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/UImods/main/PatentCenter_IFW_Autocheck.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/UImods/main/PatentCenter_IFW_Autocheck.user.js
// @version     2025.06.16.3
// @description Robustly highlights and selects checkboxes for specific document codes in the USPTO Patent Center.
// @include     *://*.uspto.gov/*
// @grant       none
// @run-at      document-idle
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const docCodesToSelect = ['SPEC', 'CLM', 'DRW', 'DRW.NONBW', 'NT.CR.APP.PA', 'NT.INC.REPLY', 'NT.INCPL.APP', 'NTC.MISS.PRT', 'NTC.OMIT.APP', 'A.PA', 'CTRS', 'ELC.', 'CTNF', 'EXIN', 'A...', 'A.I.', 'A.LA', 'A.NA', 'REM', 'CTFR', 'A.NE', 'CTAV', 'AP.PRE.REQ', 'AP.PRE.DEC', 'CTEQ', 'A.QU', 'A.I.', 'A.LA', 'A.NA', 'AMSB', 'AP.B', 'APBD', 'SA..', 'SADV', 'SAFR', 'SAPB', 'N271','APDA', 'APDN', 'APDP', 'APDR', 'APDS', 'APDS.NGR', 'APDT', 'APE2', 'APEA', 'APND', 'BD.A', 'CLM.NE', 'NOA'];
    const highlightColor = '#b5ffcc'; // A pleasant light green

    // To store the correct column indexes once determined
    let columnIndex = {
        docCode: -1,
        description: -1,
        determined: false // Flag to ensure we only determine columns once
    };

    /**
     * Determines the correct column indexes by reading the table headers.
     * This makes the script resilient to column reordering.
     * @param {HTMLTableElement} documentsTable - The table to process.
     * @returns {boolean} - True if columns were found, false otherwise.
     */
    function findColumnIndexes(documentsTable) {
        const headers = documentsTable.querySelectorAll('thead th');
        if (headers.length === 0) {
            console.log("IFW Autocheck: Could not find table headers.");
            return false;
        }

        headers.forEach((header, index) => {
            const headerText = header.textContent.trim().toLowerCase();
            if (headerText.includes('doc code')) {
                columnIndex.docCode = index;
            } else if (headerText.includes('document description')) {
                columnIndex.description = index;
            }
        });

        if (columnIndex.docCode === -1 || columnIndex.description === -1) {
            console.error("IFW Autocheck: Failed to find 'Doc Code' or 'Document Description' columns.");
            return false;
        }

        console.log("IFW Autocheck: Column indexes determined:", columnIndex);
        columnIndex.determined = true;
        return true;
    }


    /**
     * Processes the documents table to highlight rows and select checkboxes.
     * @param {HTMLTableElement} documentsTable - The table element containing the documents.
     */
    function highlightAndSelect(documentsTable) {
        // Find column indexes if we haven't already.
        if (!columnIndex.determined) {
            if (!findColumnIndexes(documentsTable)) {
                return; // Stop if we can't find the required columns.
            }
        }

        // Find only rows that have not been processed yet.
        const rows = documentsTable.querySelectorAll('tbody > tr:not([data-autocheck-processed="true"])');
        if (rows.length === 0) return; // No new rows to process

        console.log(`IFW Autocheck: Processing ${rows.length} new row(s).`);

        rows.forEach((row) => {
            // Mark the row as processed so we don't check it again.
            row.dataset.autocheckProcessed = 'true';

            const docCodeCell = row.cells[columnIndex.docCode];
            const descriptionCell = row.cells[columnIndex.description];

            if (docCodeCell && descriptionCell) {
                const docCodeText = docCodeCell.textContent.trim();

                if (docCodesToSelect.some(code => docCodeText.toLowerCase() === code.toLowerCase())) {
                    descriptionCell.innerHTML = `<span style="background-color: ${highlightColor};">${descriptionCell.innerHTML}</span>`;
                    const checkbox = row.querySelector('input[type="checkbox"]');
                    if (checkbox && !checkbox.checked) {
                        checkbox.click();
                        console.log(`IFW Autocheck: Selected checkbox for Doc Code: ${docCodeText}`);
                    }
                }
            }
        });
    }

    /**
     * Checks the page for the documents table and runs the processing function.
     * This function is called by the MutationObserver whenever the page content changes.
     */
    function runEnhancer() {
        // Exit if we are not on the correct page.
        if (!/applications\/\d{8}\/ifw\/docs/.test(window.location.href)) {
            return;
        }

        const documentsTable = document.querySelector('[id^="DataTables_Table_"]');
        // If the table exists, run the processing function.
        // This is safe to run multiple times because highlightAndSelect() marks
        // individual rows as processed, preventing duplicate actions.
        if (documentsTable) {
             highlightAndSelect(documentsTable);
        }
    }

    // --- Main Execution ---
    console.log("IFW Autocheck script loaded and running...");

    // Use a MutationObserver to watch for changes to the page content.
    // This is essential for modern websites that load data dynamically.
    const observer = new MutationObserver(runEnhancer);

    // Start observing the entire document body for new elements being added or removed.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Run the function once on initial load, just in case the content is already there.
    runEnhancer();
})();
