// ==UserScript==
// @name        Amazon Link Rewriter
// @homepageURL https://github.com/AlgoClaw/MonkeyScripts/blob/main/AmazonLinkRewrite.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/MonkeyScripts/main/AmazonLinkRewrite.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/MonkeyScripts/main/AmazonLinkRewrite.user.js
// @description null
// @version     0.001
// @grant       none
// @include     *
// ==/UserScript==

//////////////////////////////////////////////////////////////////////////////////////////////////
// Define REGEX patterns to find and replace
var FIND001 = 'https:\/\/.*amazon\.com.*\/dp(\/[A-z0-9]{10}).*'
var FIND002 = 'https:\/\/.*amazon\.com.*\/gp\/product(\/[A-z0-9]{10}).*'
var REPLACE = 'https:\/\/amazon.com\/dp$1'

//////////////////////////////////////////////////////////////////////////////////////////////////
//Run function every 3 seconds
setInterval(RewriteLinks, 3000);

// Function to rewrite static links
function RewriteLinks() {
    var links;
    links = document.evaluate("//a[@href]",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
    for (var i=0;i<links.snapshotLength;i++) {
        var thisLink = links.snapshotItem(i);
        thisLink.href = thisLink.href.replace(RegExp(FIND001),REPLACE);
        thisLink.href = thisLink.href.replace(RegExp(FIND002),REPLACE);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// Rewrite link on mouse click (left, middle, and right)
document.addEventListener("click", (e) => change_link(e), false) // left click
document.addEventListener("auxclick", (e) => change_link(e), false) //  right/middle click
function change_link(event) {
    const link = event.currentTarget.activeElement;
    //console.log(link.href); // link before change
    link.href = link.href.replace(RegExp(FIND001),REPLACE);
    link.href = link.href.replace(RegExp(FIND002),REPLACE);
    //console.log(link.href); // link after change
}
