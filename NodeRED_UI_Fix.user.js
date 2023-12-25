// ==UserScript==
// @name        Node-RED UI Fix
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/NodeRED_UI_Fix.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/UImods/main/NodeRED_UI_Fix.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/UImods/main/NodeRED_UI_Fix.user.js
// @include     *://*:1880/*
// @description null
// @version     0.001
//
// ==/UserScript==
//
var CSSMod = /** @class */ (function () {
    function CSSMod() {
        var _this = this;
        this.isEmbedded = window.top !== window.self;
        document.body.classList.add("CSS-fix");
    };
    //
    CSSMod.prototype.applyFix = function () {
        this.addCSS();
        var _this = this;
    };
    //
    CSSMod.prototype.addCSS = function () {
        var css = "";
        var StyleId = "CSSFix-Style";
        //
        css = this.applyCSSFix(css);
        //
        var style = document.getElementById(StyleId);
        style = document.createElement("style");
        style.id = StyleId;
        style.textContent = css;
        document.head.appendChild(style);
    };
    //
    CSSMod.prototype.applyCSSFix = function (css) {
        //
        //
        css += ".red-ui-tab-scroll {display: none !important;}\n"; //
        css += ".red-ui-tabs {height: 100% !important;}\n"; //
        css += ".red-ui-tabs {padding-left: 0px !important;}\n"; //
        css += ".red-ui-tabs {padding-right: unset !important;}\n"; //
        css += ".red-ui-tabs-scroll-container {height: 100% !important;}\n"; //
        css += "[id=red-ui-workspace-tabs] {width: 100% !important;}\n"; //
        css += "[id=red-ui-workspace-tabs] {opacity: unset !important;}\n"; //
        css += "[id=red-ui-workspace-tabs] {display: flex !important;}\n"; //
        css += "[id=red-ui-workspace-tabs] {flex-wrap: wrap !important;}\n"; //
        css += ".red-ui-tab {margin-left: 1px !important;}\n"; //
        css += ".red-ui-tab {margin-right: 1px !important;}\n"; //
        css += ".red-ui-tab {width: unset !important;}\n"; //
        css += ".red-ui-tab-label {padding-left: 1px !important;}\n"; //
        css += ".red-ui-tab-label {padding-right: 1px !important;}\n"; //
        css += ".red-ui-tabs-fade {display: none !important;}\n"; //
        css += "[id=red-ui-workspace-chart] {margin-top: 50px !important;}\n"; //
        //
        return css;
    };
    return CSSMod;
}());
new CSSMod().applyFix();
