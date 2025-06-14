// ==UserScript==
// @name        USPTO Patent Center UI FIx
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/USPTO_PatentCenter_UI_Fix.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/UImods/main/USPTO_PatentCenter_UI_Fix.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/UImods/main/USPTO_PatentCenter_UI_Fix.user.js
// @version     6.2
// @description Customizes the USPTO Patent Center sidebar for direct 'Documents' and 'Transactions' access, and enhances the documents table.
// @match       *://patentcenter.uspto.gov/applications/*
// @grant       GM_addStyle
// @run-at      document-idle
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

            /* Hide the sub-tabs for Documents and Transactions in the main content area */
            .ifw-documents-and-transactions .nav-tabs {
                display: none !important;
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
     * Adds a "Transactions" link to the side navigation menu by cloning the original "Documents" link.
     * This preserves the SPA routing behavior and prevents full page reloads.
     * This function is idempotent to prevent infinite loops with MutationObserver.
     */
    function addSideNavLinks() {
        // Find the UNPROCESSED "Documents & Transactions" list item to use as an anchor.
        const originalLi = document.querySelector('li[data-name="documents-transactions"]');
        if (!originalLi) {
            return; // Can't find the anchor point, or it has already been processed.
        }

        const originalAnchor = originalLi.querySelector('a');
        if (!originalAnchor) {
            return; // Can't find the anchor link.
        }

        // --- CLONE THE ORIGINAL LINK TO PRESERVE SPA ROUTING ATTRIBUTES ---
        const transactionsLi = originalLi.cloneNode(true);
        const transactionsAnchor = transactionsLi.querySelector('a');

        // --- CONFIGURE THE NEW TRANSACTIONS LINK ---
        transactionsLi.setAttribute('data-name', 'transactions-link');
        transactionsAnchor.textContent = 'Transactions';
        transactionsAnchor.href = originalAnchor.href.replace('/ifw/docs', '/ifw/transactions');
        // Update the routerlink attribute which is used by Angular for routing
        transactionsAnchor.setAttribute('routerlink', 'ifw/transactions');

        // --- RECONFIGURE THE ORIGINAL LINK TO BE "DOCUMENTS" ---
        originalAnchor.textContent = 'Documents';
        // Modify the original item's data-name so it's not found again. This is critical.
        originalLi.setAttribute('data-name', 'documents-link-processed');

        // --- INSERT THE NEW LINK INTO THE DOM ---
        originalLi.after(transactionsLi);
    }


    /**
     * Updates the 'active' state for the Documents and Transactions links based on the current URL.
     */
    function updateSideNavActiveState() {
        const docsLi = document.querySelector('li[data-name="documents-link-processed"]');
        const transLi = document.querySelector('li[data-name="transactions-link"]');

        // Exit if the links haven't been created yet.
        if (!docsLi || !transLi) {
            return;
        }

        const docsA = docsLi.querySelector('a');
        const transA = transLi.querySelector('a');

        if (!docsA || !transA) {
            return;
        }

        const currentUrl = window.location.href;

        // Check if the URL is for the transactions page
        if (currentUrl.includes('/ifw/transactions')) {
            // Set Transactions link to active
            transLi.classList.add('active');
            transA.classList.add('active_nav');
            // Set Documents link to inactive
            docsLi.classList.remove('active');
            docsA.classList.remove('active_nav');
        }
        // Check if the URL is for the documents page
        else if (currentUrl.includes('/ifw/docs')) {
            // Set Documents link to active
            docsLi.classList.add('active');
            docsA.classList.add('active_nav');
            // Set Transactions link to inactive
            transLi.classList.remove('active');
            transA.classList.remove('active_nav');
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
                            if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('/')) {
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
     * Checks the page and runs the necessary enhancements.
     * This function is designed to be called repeatedly without causing issues.
     */
    function runEnhancer() {
        // Modify the side navigation links. This function is now idempotent.
        addSideNavLinks();
        // Update the active state of the nav links based on the URL.
        updateSideNavActiveState();

        // Only run the table enhancements on the "docs" tab
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

        // This check prevents reprocessing the same table
        if (headerRow.cells[0].textContent === 'Mail Date') {
            return;
        }

        processTable(documentsTable);
    }

    // --- Main Execution ---
    applyGlobalStyles();

    const observer = new MutationObserver(() => {
        runEnhancer();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    runEnhancer();

})();
