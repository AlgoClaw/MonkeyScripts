// ==UserScript==
// @name        Charles Schwab UI Fix
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/CS_UI_Fix.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/UImods/main/CS_UI_Fix.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/UImods/main/CS_UI_Fix.user.js
// @include     *://*.schwab.com/*
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
    CSSMod.prototype.applyCSSFix = function (css) {
        //
        css += ".module-spacer {display: none !important;}\n"; //
        css += ".message-container {display: none !important;}\n"; //
        css += ".positions-footnotes {display: none !important;}\n"; //
        css += ".show-disclosures {display: none !important;}\n"; //
        css += "[id=quickQuote] {display: none !important;}\n"; //
        css += "[id=meganav-footer-container] {display: none !important;}\n"; //
        css += "[id=sectionQq] {display: none !important;}\n"; //
        css += "[id=newAccountMessaging] {display: none !important;}\n"; //
        css += "[id=right_rail_collapsed] {display: none !important;}\n"; //
        css += "[id=SnapContainer] {display: none !important;}\n"; //
        css += "[id=accountDisclosuresLinkId] {display: none !important;}\n"; //
        css += "[id=section-body] {margin-bottom: 0px !important;}\n"; //
        css += "[id=lblComplianceNo] {display: none !important;}\n"; //
        css += ".sdps-p-top_medium {padding-top: 0px !important;}\n"; //
        //
        css += ".leftPanel {width: 50% !important;}\n"; //
        css += ".leftPanel {min-width: 900px !important;}\n"; //
        css += ".sdps-flex {width: 50% !important;}\n"; //
        css += ".sdps-flex {min-width: 900px !important;}\n"; //
        css += ".container-full {display: flex !important;}\n"; //
        css += ".container-full {flex-direction: column !important;}\n"; //
        css += ".container-full {align-items: center !important;}\n"; //
        //
        css += ".sdps-m-around_large {margin-top: 0px !important;}\n"; //
        css += ".sdps-m-around_large {margin-bottom: 0px !important;}\n"; //
        css += ".sdps-m-around_large {margin-left: 0px !important;}\n"; //
        css += ".sdps-m-around_large {margin-right: 0px !important;}\n"; //
        css += ".sdps-flex {margin-top: 0px !important;}\n"; //
        css += ".sdps-flex {margin-bottom: 0px !important;}\n"; //
        css += ".sdps-flex {margin-left: 0px !important;}\n"; //
        css += ".sdps-flex {margin-right: 0px !important;}\n"; //
        //
        css += ".leftPanel {padding-left: 0px !important;}\n"; //
        css += ".leftPanel {padding-right: 0px !important;}\n"; //
        css += ".sdps-panel__body {padding-top: 0px !important;}\n"; //
        css += ".sdps-panel__body {padding-bottom: 0px !important;}\n"; //
        //css += ".sdps-panel__body {padding-left: 0px !important;}\n"; //
        //css += ".sdps-panel__body {padding-right: 0px !important;}\n"; //
        //
        css += ".group-footer {padding-top: 0px !important;}\n"; //
        css += ".account-row {line-height: 0px !important;}\n"; //
        css += ".category-heading {padding-bottom: 0px !important;}\n"; //
        css += ".vertical-aligned {padding-top: 0px !important;}\n"; //
        css += ".vertical-aligned {padding-bottom: 0px !important;}\n"; //
        css += ".vertical-center {height: 0px !important;}\n"; //
        css += "[id=panel-heading] {padding-top: 0px !important;}\n"; //
        css += "[id=panel-heading] {padding-bottom: 0px !important;}\n"; //
        //
        return css;
    };
    return CSSMod;
}());
new CSSMod().applyFix();
