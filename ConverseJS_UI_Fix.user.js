// ==UserScript==
// @name        ConverseJS UI Fix
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/ConverseJS_UI_Fix.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/UImods/main/ConverseJS_UI_Fix.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/UImods/main/ConverseJS_UI_Fix.user.js
// @match       *://*.xyz
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
        //
        css += ".chat-msg__content {margin-left: 6px !important;}\n"; //
        css += ".chat-msg__text {margin-left: 36 !important;}\n"; //
        css += ".chat-info.message {display: none !important}\n"; //
        css += ".open-chat.cbox-list-item.list-item-link span .avatar {display: none !important}\n"; //
        css += ".chat-status--avatar {display: none !important}\n"; //
        css += ".separator {display: none !important}\n"; //
        css += ".date-separator {display: none !important}\n"; //
        css += ".online.both.current-xmpp-contact.open {background-color: unset !important}\n"; //
        css += ".converse-brand__heading {display: none !important}\n"; //
        css += ".xmpp-status.d-flex {display: none !important}\n"; //
        css += "converse-rich-text {display: none !important}\n"; //
        css += "#chatrooms {display: none !important}\n"; //
        css += ".show-msg-author-modal .align-self-center.avatar {display: none !important}\n"; //
        //
        return css;
    };
    return CSSMod;
}());
new CSSMod().applyFix();
