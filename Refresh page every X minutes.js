    // ==UserScript==
    // @name         Refresh page every X minutes
    // @version      0.0
    // @description  null
    // @match        https://patentcenter.uspto.gov/*
    // @grant        none
    // ==/UserScript==

    (function() {
        'use strict';
        setTimeout(function(){ location.reload(); }, 5*60*1000);
    })();

