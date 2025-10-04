// ==UserScript==
// @name        UI Mod - Node-RED
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/NodeRED_UI_Fix.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/UImods/main/NodeRED_UI_Fix.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/UImods/main/NodeRED_UI_Fix.user.js
// @include     *://*:1880/*
// @description null
// @version     2025.10.04.12.03.20
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
        css += "[id=red-ui-workspace-chart] {margin-bottom: 0px !important;}\n"; //
        css += "[id=red-ui-workspace-chart] {margin-top: 0px !important;}\n"; //
        //
        css += "[id=red-ui-workspace-toolbar] {position: relative !important;}\n"; //
        css += "[id=red-ui-workspace-toolbar] {top: 0px !important;}\n"; //
        css += "[id=red-ui-workspace-toolbar] {overflow: unset !important;}\n"; //
        css += "[id=red-ui-workspace-toolbar] {padding: unset !important;}\n"; //
        //
        css += "[id=red-ui-workspace-footer] {position: relative !important;}\n"; //
        css += "[id=red-ui-workspace-footer] {padding: unset !important;}\n"; //
        css += "[id=red-ui-workspace-footer] {height: 250px !important;}\n"; // Why does this need to be so large?
        css += "[id=red-ui-workspace-footer] {box-sizing: border-box !important;}\n"; //
        css += "[id=red-ui-workspace-footer] {display: block !important;}\n"; //
        //
        // Fix Drag & Drop for Tabs (janky)
        css += ".red-ui-tab {position: relative !important;}\n"; //
        css += ".red-ui-tab {left: unset !important;}\n"; //
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
        // Palette List ("Manage palette") - More Compact
        css += ".red-ui-editableList-item-content {padding-top:    2px !important;}\n"; //
        css += ".red-ui-editableList-item-content {padding-bottom: 2px !important;}\n"; //
        //
        // Right Sidebar Buttons - Compact, always visible
        css += ".red-ui-tab-link-button {display: inline-block !important;}\n"; //
        css += ".red-ui-tab-link-button {margin-left:  0px !important;}\n"; //
        css += ".red-ui-tab-link-button {margin-right: 0px !important;}\n"; //
        css += ".red-ui-tab-link-button {width: 20px !important;}\n"; //
        css += ".red-ui-tab-link-button-menu {display: none !important;}\n"; //
        //
        // Move Notification Window Out of the Way (to the top-left)
        css += "[id=red-ui-notifications] {width:  fit-content !important;}\n"; //
        css += "[id=red-ui-notifications] {height: fit-content !important;}\n"; //
        css += "[id=red-ui-notifications] {margin-left: 0 !important;}\n"; //
        css += "[id=red-ui-notifications] {left: 0 !important;}\n"; //
        //
        // Hide stupid drag-drop overlay that blocks interaction and doesn;t go away
        css += "[id=red-ui-drop-target] {display: none !important;}\n"; //
        //
        return css;
    };
    return CSSMod;
}());
new CSSMod().applyFix();
