// ==UserScript==
// @name         Refresh_page_every_X_minutes
// @version      0.0
// @description  null
// @match        https://patentcenter.uspto.gov/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){ location.reload(); }, 5*60*1000);
})();
