// ==UserScript==
// @name        USPTO Patent Center UI Fix
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/USPTO_PatentCenter_UI_Fix.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/UImods/main/USPTO_PatentCenter_UI_Fix.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/UImods/main/USPTO_PatentCenter_UI_Fix.user.js
// @version     2025.06.16.01
// @description Customizes the USPTO Patent Center sidebar, hides headers, and reformats dates and spacing.
// @include     *://patentcenter.uspto.gov/applications/*
// @grant       GM_addStyle
// @run-at      document-idle
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const docCodesToSelect = ['SPEC', 'DRW', 'CLM', 'CTRS', 'ELC.', 'CTNF', 'EXIN', 'A...', 'REM', 'CTFR', 'A.NE', 'AP.PRE.REQ', 'AP.PRE.DEC', 'NOA'];
    const highlightColor = '#b5ffcc'; // A pleasant light green

    /**
     * Injects CSS into the page to handle styling changes safely.
     */
    function applyGlobalStyles() {
        const styleId = 'uspto-enhancer-styles';
        if (document.getElementById(styleId)) {
            return; // Styles already exist
        }

        const styles = `
            /* Hide the original header */
            .linkHeading {
                display: none !important;
            }

            /* Remove padding from the main card body housing the header */
            .card-body {
                padding: 0 !important;
            }

            /* Style for the new simplified header table */
            .simplified-header-table {
                width: 100%;
                border-collapse: collapse;
                margin: 0 !important;
            }
            .simplified-header-table td {
                padding: 2px 5px !important; /* Add a little padding for readability */
                border: 1px solid #dee2e6;
                line-height: 1.4; /* Ensure consistent line height */
            }
            .simplified-header-table td:first-child {
                font-weight: bold;
                width: 1%; /* Make column as narrow as its content allows */
                white-space: nowrap; /* Prevent the label text from wrapping */
                background-color: #f8f9fa;
            }


            /* Set padding for the main document table cells */
             [id^='DataTables_Table_'] th, [id^='DataTables_Table_'] td {
                padding: .2rem !important;
                vertical-align: middle !important;
            }

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
                width: 100%;
                white-space: normal !important;
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
     * Finds elements with negative or excessive spacing and adjusts them.
     */
    function normalizeSpacing() {
        // This function is disabled for now to prevent conflicts with the new header.
        // It can be re-enabled if needed, but the new header logic is more targeted.
    }


    /**
     * Traverses the entire page to find and reformat date strings.
     */
    function reformatAllDatesOnPage() {
        try {
            const dateRegex = /\b(\d{1,2})\/(\d{1,2})\/((?:19|20)\d{2})\b/g;
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
                acceptNode: function(node) {
                    if (node.parentElement.closest('script, style, [data-dates-reformatted]')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (dateRegex.test(node.nodeValue)) {
                        dateRegex.lastIndex = 0;
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_REJECT;
                }
            });

            let node;
            while (node = walker.nextNode()) {
                node.nodeValue = node.nodeValue.replace(dateRegex, (match, month, day, year) => {
                    const paddedMonth = month.padStart(2, '0');
                    const paddedDay = day.padStart(2, '0');
                    return `${year}-${paddedMonth}-${paddedDay}`;
                });
                node.parentElement.dataset.datesReformatted = 'true';
            }
        } catch (error) {
            console.error('Error in reformatAllDatesOnPage:', error);
        }
    }

    /**
     * Replaces the default application info header with a simplified table.
     */
    function createSimplifiedHeader() {
        const infoContainer = document.querySelector('pc-applications-data, pc-applications .card-body');
        if (!infoContainer || infoContainer.dataset.headerSimplified) {
            return;
        }

        const data = {};

        const labels = infoContainer.querySelectorAll('h5');

        const findDataByLabel = (labelText) => {
            for (const h5 of labels) {
                if (h5.textContent.includes(labelText)) {
                    const p = h5.nextElementSibling;
                    return p ? p : null;
                }
            }
            return null;
        };

        // --- Data Extraction ---
        const appNumElem = findDataByLabel('Application #');
        if (appNumElem) data.appNumber = appNumElem.textContent.trim();
        if (!data.appNumber) return;

        const docketElem = findDataByLabel('Attorney Docket #');
        if (docketElem) {
            const clone = docketElem.cloneNode(true);
            const button = clone.querySelector('button');
            if (button) button.remove();
            data.docketNumber = clone.textContent.trim();
        }

        const confirmElem = findDataByLabel('Confirmation #');
        if (confirmElem) data.confirmation = confirmElem.textContent.trim();

        const filingDateElem = findDataByLabel('Filing');
        if (filingDateElem) data.filingDate = filingDateElem.textContent.trim();

        const statusElem = findDataByLabel('Status');
        if (statusElem) {
            const clone = statusElem.cloneNode(true);
            clone.querySelectorAll('span').forEach(span => span.remove());
            data.status = clone.textContent.trim().replace(/\s+/g, ' ');
        }

        // MODIFICATION: Clean up the Patent Number field
        const patentNumElem = findDataByLabel('Patent #');
        if (patentNumElem) {
            const fullText = patentNumElem.textContent.trim();
            // Use a regex to extract only the number, which may include commas.
            const match = fullText.match(/^[\d,]+/);
            data.patentNumber = match ? match[0] : fullText;
        }

        const titleH3 = document.querySelector('h3.d-inline-block');
        if (titleH3) data.title = titleH3.textContent.trim();

        // --- Handle Publication Number ---
        const storageKey = `pubNum_${data.appNumber}`;
        // Find the publication link directly by its unique URL structure, which is more reliable.
        const pubLink = document.querySelector('a[href*="ppubs.uspto.gov/pubwebapp/external.html"]');
        if (pubLink) {
            const pubNum = pubLink.textContent.trim().replace(/ /g, '').replace(/-/g, '');
            sessionStorage.setItem(storageKey, pubNum);
            data.publicationNumber = pubNum;
        } else {
            // If not on the current page, try to retrieve it from session storage.
            data.publicationNumber = sessionStorage.getItem(storageKey) || '-';
        }

        // --- Table Creation ---
        const infoCard = document.querySelector('pc-applications .card-body');
        if (!infoCard) return;

        const tableHTML = `
            <table class="simplified-header-table">
                <tbody>
                    <tr><td>Application #</td><td>${data.appNumber || '-'}</td></tr>
                    <tr><td>Attorney Docket #</td><td>${data.docketNumber || '-'}</td></tr>
                    <tr><td>Confirmation #</td><td>${data.confirmation || '-'}</td></tr>
                    <tr><td>U.S. Filing Date</td><td>${data.filingDate || '-'}</td></tr>
                    <tr><td>Title</td><td>${data.title || '-'}</td></tr>
                    <tr><td>Status</td><td>${data.status || '-'}</td></tr>
                    <tr><td>Publication #</td><td>${data.publicationNumber || '-'}</td></tr>
                    <tr><td>Patent #</td><td>${data.patentNumber || '-'}</td></tr>
                </tbody>
            </table>
        `;

        const originalTitleSection = infoCard.querySelector('section.border-bottom');
        const originalDataSection = infoCard.querySelector('section.pt-3');

        if (originalTitleSection && originalDataSection) {
            const newHeaderContainer = document.createElement('div');
            newHeaderContainer.innerHTML = tableHTML;
            infoCard.insertBefore(newHeaderContainer, originalTitleSection);
            originalTitleSection.remove();
            originalDataSection.remove();
        }
        infoContainer.dataset.headerSimplified = 'true';
        if(infoCard) infoCard.dataset.headerSimplified = 'true';
    }


    /**
     * Adds a "Transactions" link to the side navigation menu.
     */
    function addSideNavLinks() {
        const originalLi = document.querySelector('li[data-name="documents-transactions"]');
        if (!originalLi || document.querySelector('li[data-name="transactions-link"]')) return;
        const originalAnchor = originalLi.querySelector('a');
        if (!originalAnchor) return;

        const transactionsLi = originalLi.cloneNode(true);
        const transactionsAnchor = transactionsLi.querySelector('a');
        transactionsLi.setAttribute('data-name', 'transactions-link');
        transactionsAnchor.textContent = 'Transactions';
        transactionsAnchor.href = originalAnchor.href.replace('/ifw/docs', '/ifw/transactions');
        transactionsAnchor.setAttribute('routerlink', 'ifw/transactions');

        originalAnchor.textContent = 'Documents';
        originalLi.setAttribute('data-name', 'documents-link-processed');
        originalLi.after(transactionsLi);
    }

    /**
     * Updates the 'active' state for the side navigation links.
     */
    function updateSideNavActiveState() {
        const docsLi = document.querySelector('li[data-name="documents-link-processed"]');
        const transLi = document.querySelector('li[data-name="transactions-link"]');
        if (!docsLi || !transLi) return;
        const docsA = docsLi.querySelector('a');
        const transA = transLi.querySelector('a');
        if (!docsA || !transA) return;

        const currentUrl = window.location.href;
        if (currentUrl.includes('/ifw/transactions')) {
            transLi.classList.add('active', 'active_nav');
            docsLi.classList.remove('active', 'active_nav');
        } else if (currentUrl.includes('/ifw/docs')) {
            docsLi.classList.add('active', 'active_nav');
            transLi.classList.remove('active', 'active_nav');
        }
    }

    /**
     * Main function to process the documents table.
     */
    function processTable(documentsTable) {
        const headerRow = documentsTable.querySelector('thead > tr');
        if (headerRow && !headerRow.dataset.headersProcessed) {
            headerRow.cells[0].textContent = 'Mail Date';
            headerRow.cells[1].textContent = 'Doc Code';
            headerRow.cells[2].textContent = 'Document Description';
            headerRow.cells[4].textContent = 'PDF';
            headerRow.cells[5].textContent = 'XML';
            headerRow.cells[6].textContent = 'DOCX';
            headerRow.dataset.headersProcessed = 'true';
        }

        const rows = documentsTable.querySelectorAll('tbody > tr:not([data-processed="true"])');
        rows.forEach((row) => {
            row.dataset.processed = 'true';

            const sourceCell = row.cells[5];
            const pdfCell = row.cells[4];
            const xmlCell = row.cells[5];
            const docxCell = row.cells[6];

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

            const docCodeCell = row.cells[1];
            const descriptionCell = row.cells[2];
            if (docCodeCell && descriptionCell) {
                const docCodeText = docCodeCell.textContent.trim();
                if (docCodesToSelect.some(code => docCodeText.toLowerCase() === code.toLowerCase())) {
                    descriptionCell.innerHTML = `<span style="background-color: ${highlightColor};">${descriptionCell.innerHTML}</span>`;
                    const checkbox = row.querySelector('input[type="checkbox"]');
                    if (checkbox && !checkbox.checked) {
                        checkbox.click();
                    }
                }
            }
        });
    }


    /**
     * Checks the page and runs all necessary enhancements.
     */
    function runEnhancer() {
        createSimplifiedHeader();
        reformatAllDatesOnPage();
        addSideNavLinks();
        updateSideNavActiveState();
        normalizeSpacing();


        if (!/applications\/\d{8}\/ifw\/docs/.test(window.location.href)) {
            return;
        }

        const documentsTable = document.querySelector('[id^="DataTables_Table_"]');
        if (documentsTable) {
             processTable(documentsTable);
        }
    }

    // --- Main Execution ---
    applyGlobalStyles();
    const observer = new MutationObserver(runEnhancer);
    observer.observe(document.body, { childList: true, subtree: true });
    runEnhancer();

})();
