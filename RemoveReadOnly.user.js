// ==UserScript==
// @name        Remove ReadOnly Fields
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/RemoveReadOnly.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/MonkeyScripts/main/RemoveReadOnly.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/MonkeyScripts/main/RemoveReadOnly.user.js
// @include     *
// @description null
// @version     0.001
//
// ==/UserScript==
//
(function() {
    'use strict';
    var allow = function(e){
        e.stopImmediatePropagation();
        return true;
    };
    document.addEventListener('paste', allow, true);
    document.addEventListener('copy', allow, true);
    document.addEventListener('drag', allow, true);
    document.addEventListener('drop', allow, true);
})();

(function enableAutocomplete(element) {
    if (element.hasAttribute("autocomplete")) {
        element.setAttribute("autocomplete", "on");
    }
})();
