// ==UserScript==
// @name        Node-RED UI Fix
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/Scrutiny_UI_Fix.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/UImods/main/Scrutiny_UI_Fix.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/UImods/main/Scrutiny_UI_Fix.user.js
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
        css += "[id=red-ui-workspace] {display: flex !important;}\n"; //
        css += "[id=red-ui-workspace] {flex-direction: column !important;}\n"; //
        //
        css += ".red-ui-tabs {height: unset !important;}\n"; //
        css += ".red-ui-tabs {padding-left: 0px !important;}\n"; //
        css += ".red-ui-tabs {margin-bottom: 0px !important;}\n"; //
        css += ".red-ui-tabs {overflow: unset !important;}\n"; //
        //
        css += ".red-ui-tab-scroll {display: none !important;}\n"; //
        //
        css += ".red-ui-tabs-scroll-container {height: fit-content !important;}\n"; //
        css += ".red-ui-tabs-scroll-container {overflow-x: unset !important;}\n"; //
        css += ".red-ui-tabs-scroll-container {overflow-y: unset !important;}\n"; //
        //
        css += "[id=red-ui-workspace-tabs] {width: 100% !important;}\n"; //
        css += "[id=red-ui-workspace-tabs] {opacity: unset !important;}\n"; //
        css += "[id=red-ui-workspace-tabs] {display: flex !important;}\n"; //
        css += "[id=red-ui-workspace-tabs] {flex-wrap: wrap !important;}\n"; //
        css += "[id=red-ui-workspace-tabs] {height: fit-content !important;}\n"; //
        //
        css += ".red-ui-tab {margin-left: 1px !important;}\n"; //
        css += ".red-ui-tab {margin-right: 1px !important;}\n"; //
        css += ".red-ui-tab {width: unset !important;}\n"; //
        //
        css += ".red-ui-tab-label {padding-left: 1px !important;}\n"; //
        css += ".red-ui-tab-label {padding-right: 1px !important;}\n"; //
        //
        css += ".red-ui-tabs-fade {display: none !important;}\n"; //
        //
        css += "[id=red-ui-workspace-chart] {top: 0px !important;}\n"; //
        css += "[id=red-ui-workspace-chart] {position: relative !important;}\n"; //
        css += "[id=red-ui-workspace-chart] {overflow: scroll !important;}\n"; //
        css += "[id=red-ui-workspace-chart] {margin-bottom: 25px !important;}\n"; //
        //
        css += "[id=red-ui-workspace-footer] {height: 25px !important;}\n"; //
        //
        // Shift up to use header space
        //css += "[id=red-ui-main-container] {top: 0px !important;}\n"; //
        //css += "[id=red-ui-sidebar-separator] {top: 0px !important;}\n"; //
        //css += "[id=red-ui-sidebar] {top: 40px !important;}\n"; //
        //
        // Option 1 (no plus and menu buttons for tabs)
        css += ".red-ui-tabs {padding-right: 0px !important;}\n"; //
        css += ".red-ui-tab-button.red-ui-tabs-add {display: none !important;}\n"; //
        css += ".red-ui-tab-button.red-ui-tabs-menu {display: none !important;}\n"; //
        //
        // Option 2 (plus and menu buttons for tabs)
        //css += ".red-ui-tabs {padding-right: 64px !important;}\n"; //
        //
        // Node List (left panel) - More Compact
        css += ".red-ui-palette-node {margin-top:    2px !important;}\n"; //
        css += ".red-ui-palette-node {margin-bottom: 2px !important;}\n"; //
        css += ".red-ui-palette-node {margin-left:  10px !important;}\n"; //
        css += ".red-ui-palette-node {margin-right: 10px !important;}\n"; //
        css += ".red-ui-palette-node {width: calc(100% - 20px) !important;}\n"; //
        css += ".red-ui-palette-node {max-width: 150px !important;}\n"; //
        css += ".red-ui-palette-node {height: 100% !important;}\n"; //
        css += ".red-ui-palette-node {max-height: 40px !important;}\n"; //
        css += ".red-ui-palette-label {margin-top:    0px !important;}\n"; //
        css += ".red-ui-palette-label {margin-bottom: 0px !important;}\n"; //
        //
        // Palette List - More Compact
        css += ".red-ui-editableList-item-content {padding-top:    2px !important;}\n"; //
        css += ".red-ui-editableList-item-content {padding-bottom: 2px !important;}\n"; //
        //
        // Right Sidebar Buttons
        css += ".red-ui-tab-link-button {display: inline-block !important;}\n"; //
        css += ".red-ui-tab-link-button {margin-left:  0px !important;}\n"; //
        css += ".red-ui-tab-link-button {margin-right: 0px !important;}\n"; //
        css += ".red-ui-tab-link-button {width: 20px !important;}\n"; //
        css += ".red-ui-tab-link-button-menu {display: none !important;}\n"; //
        return css;
    };
    return CSSMod;
}());
new CSSMod().applyFix();
