// ==UserScript==
// @name        Patent Center - IFW Autocheck
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/PatentCenter_IFW_Autocheck.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/UImods/main/PatentCenter_IFW_Autocheck.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/UImods/main/PatentCenter_IFW_Autocheck.user.js
// @version     2025.06.16.04
// @description Robustly highlights and selects checkboxes for specific document codes in the USPTO Patent Center.
// @include     *://*.uspto.gov/*
// @grant       none
// @run-at      document-idle
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const docCodesToSelect = [

        // "INCOMING" and "OUTGOING" are from the USPTO's perspective (to maintain consistency with the "Doc Code Direction").
        // An "INCOMING" document is one filed/submitted by the Applicant to the USPTO.
        // An "OUTGOING" document is one mailed from the USPTO to the Applicant.

        // INCOMING - Core Application Documents
        'SPEC', ////////// Specification
        'CLM', /////////// Claims
        'DRW', /////////// Drawings – only Black and White line drawings
        'DRW.NONBW', ///// Drawings-other than Black and White line drawings
        'NDRW', ////////// New or Additional Drawings

        // OUTGOING - Actions and Other Examiner Documents
        'CTRS', ////////// Requirement for Restriction/Election
        'CTNF', ////////// Non-Final Rejection
        'EXIN', ////////// Examiner Interview Summary Record (PTOL - 413)
        'CTFR', ////////// Final Rejection
        'CTMS', ////////// Miscellaneous Action with SSP
        'CTAV', ////////// Advisory Action (PTOL-303)
        'SADV', ////////// Supplemental Advisory Action
        'CTEQ', ////////// Ex Parte Quayle Action
        'AP.PRE.DEC', //// Pre-Brief Appeal Conference decision
        'NOA', /////////// Notice of Allowance
        'N271', ////////// Response to Amendment under Rule 312

        // INCOMING - Remarks and Response Type
        'REM', /////////// Applicant Arguments or Remarks Made in an Amendment
        'A.PE', ////////// Preliminary Amendment
        'ELC.', ////////// Response to Election / Restriction Filed
        'SA..', ////////// Supplemental Response or Supplemental Amendment
        'A...', ////////// Amendment/Req Reconsideration-After Non-Final Reject
        'A.NE', ////////// Response After Final Action
        'SAFR', ////////// Supplemental Amendment after Final Rejection
        'RCEX', ////////// Request for Continued Examination (RCE)
        'AMSB', ////////// Amendment Submitted/Entered with Filing of CPA/RCE
        'AP.PRE.REQ', //// Pre-Brief Conference request
        'BD.A', ////////// Amendment/Argument after Patent Board Decision
        'A.QU', ////////// Response after Ex Parte Quayle Action
        'A.NA', ////////// Amendment after Notice of Allowance (Rule 312)
        'N427', ////////// Post Allowance Communication - Incoming

        // INCOMING - Remarks and Response Type - DEFECTIVE
        'A.I.', ////////// Informal or Non-Responsive Amendment
        'A.LA', ////////// Untimely (Late) Amendment Filed
        'DRW.NE', //////// Drawings - Amendment Not Entered
        'RCE.NE', //////// RCE not entered
        'ABST.NE', /////// Abstract-Amendment Not Entered
        'CLM.NE', //////// Claim-Amendment Not Entered
        'DRW.NE', //////// Drawings - Amendment Not Entered
        'SPEC.NE', /////// Specification-Amendment Not Entered

        // Notices - Incomplete / Omitted / Missing / Defective / Informal
        'NT.INCPL.APP', // Notice of Incomplete Application
        'NTC.OMIT.APP', // Notice of Omitted Items Application
        'NTC.MISS.PRT', // Notice to File Missing Parts
        'NT.CR.APP.PA', // Notice to File Corrected Application Papers
        'NFDR', ////////// Notice of Formal Drawings Required
        'NT.INC.REPLY', // Notice of Incomplete Reply
        'NTC.A.NONCPL', // Notice to the applicant regarding a Non-Compliant or Non-Responsive Amendment
        'APBD', ////////// Notice - Defective Appeal Brief
        'APND', ////////// Notice - Defective Notice of Appeal

        // Appeal Documents
        'AP.B', ////////// Appeal Brief Filed
        'SAPB', ////////// Supplemental Appeal Brief
        'APDA', ////////// Patent Board Decision - Examiner Affirmed
        'APDN', ////////// Patent Board Decision 196(b)
        'APDP', ////////// Patent Board Decision - Examiner Affirmed in Part
        'APDR', ////////// Patent Board Decision - Examiner Reversed
        'APDS', ////////// Dismissal of Appeal
        'APDS.NGR', ////// Appeal Dismissed- No response to NGR PTAB Decision
        'APDT', ////////// Patent Board Decision - Requirement under 196(D)
        'APE2', ////////// 2nd or Subsequent Examiner's Answer to Appeal Brief
        'APEA', ////////// Examiner's Answer to Appeal Brief

        // keep at end
        'null'
    ];
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
