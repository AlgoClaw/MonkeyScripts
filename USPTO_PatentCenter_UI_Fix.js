// ==UserScript==
// @name         USPTO Patent Center UI FIx
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/USPTO_PatentCenter_UI_Fix.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/UImods/main/USPTO_PatentCenter_UI_Fix.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/UImods/main/USPTO_PatentCenter_UI_Fix.js
// @version      5.5
// @description  null
// @match        *://patentcenter.uspto.gov/applications/*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const docCodesToSelect = ['CTFR', 'A...', 'CLM', 'REM'];
    const highlightColor = '#b5ffcc'; // A pleasant light green

    /**
     * Injects CSS into the page to handle styling changes safely.
     * This is applied only once to avoid duplicating styles.
     */
    function applyGlobalStyles() {
        const styleId = 'uspto-enhancer-styles';
        if (document.getElementById(styleId)) {
            return; // Styles already exist
        }

        const styles = `
            /* Ensure the table takes up full width */
            [id^='DataTables_Table_'] {
                width: 100% !important;
            }

            /* Force specific columns to not wrap content */
            [id^='DataTables_Table_'] > * > tr > :nth-child(1), /* Mail Date */
            [id^='DataTables_Table_'] > * > tr > :nth-child(2), /* Doc code */
            [id^='DataTables_Table_'] > * > tr > :nth-child(4), /* Pages */
            [id^='DataTables_Table_'] > * > tr > :nth-child(5), /* PDF */
            [id^='DataTables_Table_'] > * > tr > :nth-child(6), /* XML */
            [id^='DataTables_Table_'] > * > tr > :nth-child(7), /* DOCX */
            [id^='DataTables_Table_'] > * > tr > :nth-child(8) { /* Checkbox */
                white-space: nowrap;
            }

            /* Allow the description column to wrap and take up remaining space */
            [id^='DataTables_Table_'] > * > tr > :nth-child(3) {
                width: 100%; /* Encourages it to fill available space */
                white-space: normal !important; /* Explicitly allow wrapping */
            }

            /* Hide all header icons (sort arrows, info icon) */
            [id^='DataTables_Table_'] thead .material-icons {
                display: none !important;
            }

            /* De-style the download buttons to look like plain text links */
            .download-link-button {
                all: unset !important;
                color: #005ea2 !important;
                cursor: pointer !important;
                font-family: inherit !important;
                font-size: inherit !important;
            }
        `;
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(styles);
        } else {
            const styleNode = document.createElement('style');
            styleNode.id = styleId;
            styleNode.type = 'text/css';
            styleNode.appendChild(document.createTextNode(styles));
            document.head.appendChild(styleNode);
        }
    }

    /**
     * Main function to process the documents table.
     * @param {HTMLTableElement} documentsTable The table element to process.
     */
    function processTable(documentsTable) {

        const headerRow = documentsTable.querySelector('thead > tr');
        if (!headerRow) return;

        // --- Rename Headers by repurposing existing columns ---
        headerRow.cells[0].textContent = 'Mail Date';
        headerRow.cells[1].textContent = 'Doc Code';
        headerRow.cells[2].textContent = 'Document Description';
        headerRow.cells[4].textContent = 'PDF';
        headerRow.cells[5].textContent = 'XML';
        headerRow.cells[6].textContent = 'DOCX';

        const rows = documentsTable.querySelectorAll('tbody > tr');

        rows.forEach((row) => {
            const sourceCell = row.cells[5];
            const pdfCell = row.cells[4];
            const xmlCell = row.cells[5];
            const docxCell = row.cells[6];

            // --- Separate Links ---
            if (sourceCell && pdfCell && xmlCell && docxCell) {
                const allSpans = Array.from(sourceCell.querySelectorAll('span.text-primary.cursor-pointer'));

                pdfCell.textContent = '';
                xmlCell.textContent = '';
                docxCell.textContent = '';

                allSpans.forEach(span => {
                    const button = span.querySelector('button');
                    const linkText = (button ? button.textContent : span.textContent).trim();

                    if (linkText.startsWith('PDF')) pdfCell.appendChild(span);
                    else if (linkText.startsWith('XML')) xmlCell.appendChild(span);
                    else if (linkText.startsWith('DOCX')) docxCell.appendChild(span);
                });

                [pdfCell, xmlCell, docxCell].forEach(cell => {
                    const span = cell.querySelector('span');
                    if (span) {
                        Array.from(span.childNodes).forEach(node => {
                           if(node.nodeType === Node.TEXT_NODE && node.textContent.includes('/')) {
                               node.remove();
                           }
                        });
                        const button = span.querySelector('button');
                        if (button) button.classList.add('download-link-button');
                    }
                });
            }

            // --- Date Reformatting ---
            const dateCell = row.cells[0];
            if (dateCell) {
                const originalDateText = dateCell.textContent.trim();
                const dateParts = originalDateText.split('/');
                if (dateParts.length === 3) {
                    const [month, day, year] = dateParts;
                    dateCell.textContent = `${year}-${month}-${day}`;
                }
            }

            // --- Doc Code Highlighting and Checkbox Selection ---
            const docCodeCell = row.cells[1];
            const descriptionCell = row.cells[2];
            if (docCodeCell && descriptionCell) {
                const docCodeText = docCodeCell.textContent.trim();
                const docCodeFound = docCodesToSelect.some(code => docCodeText.toLowerCase() === code.toLowerCase());
                if (docCodeFound) {
                    descriptionCell.innerHTML = `<span style="background-color: ${highlightColor};">${descriptionCell.innerHTML}</span>`;
                    const checkbox = row.querySelector('input[type="checkbox"]');
                    if (checkbox && !checkbox.checked) checkbox.click();
                }
            }
        });
    }

    /**
     * Checks if the page is the documents tab and if the table needs processing.
     * This function is designed to be called repeatedly without causing issues.
     */
    function runEnhancer() {
        // Only run on the "docs" tab. The regex checks for the 8-digit application number format.
        if (!/applications\/\d{8}\/ifw\/docs/.test(window.location.href)) {
            return;
        }

        const documentsTable = document.querySelector('[id^="DataTables_Table_"]');
        if (!documentsTable) {
            return;
        }

        const headerRow = documentsTable.querySelector('thead > tr');
        if (!headerRow || !documentsTable.querySelector('tbody > tr')) {
            return;
        }

        // Check if the first header cell has already been renamed to "Mail Date".
        if (headerRow.cells[0].textContent === 'Mail Date') {
            return;
        }

        console.log('New or updated documents table found. Running enhancer...');
        processTable(documentsTable);
    }

    // --- Main Execution ---
    // Apply styles once on script load.
    applyGlobalStyles();

    // Set up an observer to watch for dynamic page changes. This is the primary trigger.
    const observer = new MutationObserver(() => {
        runEnhancer();
    });

    // Start observing the entire document body for changes to its children.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also run the enhancer on initial load, just in case.
    runEnhancer();

})();
