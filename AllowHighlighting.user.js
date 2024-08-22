// ==UserScript==
// @name        Allow Highlighting
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/AllowHighlighting.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/UImods/main/AllowHighlighting.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/UImods/main/AllowHighlighting.user.js
// @include     *
// @description null
// @version     0.002
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
        css += "* {-webkit-user-select: text !important;}\n"; //
        css += "* {-khtml-user-select: text !important;}\n"; //
        css += "* {-moz-user-select: text !important;}\n"; //
        css += "* {-ms-user-select: text !important;}\n"; //
        css += "* {-o-user-select: text !important;}\n"; //
        css += "* {user-select: text !important;}\n"; //
        //
        return css;
    };
    return CSSMod;
}());
new CSSMod().applyFix();
