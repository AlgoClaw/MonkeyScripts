// ==UserScript==
// @name        YT UI Fix
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/YT_UI_Fix.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/UImods/main/YT_UI_Fix.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/UImods/main/YT_UI_Fix.user.js
// @match       *://*.youtube.com/*
// @description null
// @version     0.001
//
// ==/UserScript==
//
// https://www.youtube.com/watch?v=Wbl9Pl6Smbc
//
// Stop Autoplay of Videos on Channel Pages
// https://gist.github.com/gregilo/f2c034c2a91fba10a2de868e2b490b6c
//
// Auto Expand Video Description
(function() {
    'use strict';
  window.addEventListener('yt-page-data-updated', function () {
    var checkExist = setInterval(function() {
      var ytMeta = document.querySelector('#expand.button.style-scope.ytd-text-inline-expander');
      if(ytMeta){
         (ytMeta).click();
          clearInterval(checkExist);
       }
    }, 100);
  });
})();
//
// Turn Off Autoplay
var var_interval_id = window.setInterval( function( window ) {
    let a = window.document.querySelector( "button.ytp-button[data-tooltip-target-id='ytp-autonav-toggle-button']" ); // get the button
    if ( a.getAttribute( "aria-label" ) == "Autoplay is on" ) {
        a.click( ); // disable autoplay next if enabled
    }
    if ( a.getAttribute( "aria-label" ) == "Autoplay is off" ) {
        window.clearInterval( var_interval_id ); // end script once done
    }
}, 1024, window );
//
// Closes Guide on Homepage
var var_hamburger = window.setInterval( function( window ) {
    let OpenOrClose = window.document.querySelector( "button[aria-label='Guide']" );
    let Button2Click = window.document.querySelector( "#guide-button.ytd-masthead" );

    if ( OpenOrClose.getAttribute( "aria-pressed" ) == "true" ) {
        Button2Click.click( );
    }
    if ( OpenOrClose.getAttribute( "aria-pressed" ) == "false" ) {
        window.clearInterval( var_hamburger ); // end script once done
    }
}, 1024, window );
//
// Move Progress and Control Bar Below Video
var YtNewUIFix = /** @class */ (function () {
    function YtNewUIFix() {
        var _this = this;
        this.isEmbedded = window.top !== window.self;
        this.mouseMoveEvent = document.createEvent("Events");
        this.mouseMoveEvent.initEvent("mousemove", false, false);
        document.body.classList.add("yt-ui-fix");
    };
    //
    YtNewUIFix.prototype.applyFix = function () {
        //if (document.body.innerHTML.length === 0) {return;} // empty page can be ignored (in share tab before it's active)
        this.addCSS();
        var _this = this;
        window.setInterval(function () {document.querySelector(".html5-video-player").dispatchEvent(_this.mouseMoveEvent)}, 1000);
        window.setInterval(function () {document.querySelector(".ytp-chrome-bottom").dispatchEvent(_this.mouseMoveEvent)}, 1000);
        window.setInterval(function () {document.querySelector(".ytp-progress-bar-container").dispatchEvent(_this.mouseMoveEvent)}, 1000);
    };
    //
    YtNewUIFix.prototype.addCSS = function () {
        var css = "";
        var StyleId = "YoutubeNewUIFix-Style";
        //
        css = this.removeCrap(css);
        css = this.moveControls(css);
        //
        var style = document.getElementById(StyleId);
        if (style && style.parentNode) {
            style.parentNode.removeChild(style);
        }
        style = document.createElement("style");
        style.id = StyleId;
        style.textContent = css;
        document.head.appendChild(style);
    };
    //
    ///////////////////////////////////////////////////////
    ////// MOVE CONTROLS AND PROGRESS BAR BELOW VIDEO /////
    ///////////////////////////////////////////////////////
    var ProgBarH = 25;
    var ControlHeight = 35;
    var VideoControlPad = 5;
    var ConProgH = ProgBarH + ControlHeight + VideoControlPad;
    var ProgScrubW = 5;
    var NonFullCPBord = 12;
    var FullCPBord = 24;
    var VidTitleUp = 0;
    //
    YtNewUIFix.prototype.moveControls = function (css) {
        //
        // Increase height of video container by height of progress and control bar (or 100% of vertical viewing area, if smaller)
        css += "#movie_player {min-height: min(calc(100% + " + ConProgH + "px),min(100vh,100vh)) !important;}\n";
        //css += "#movie_player {max-height: min(calc(100% + " + ConProgH + "px),min(100vh,70vw)) !important;}\n";
        //
        // Decrease height of video by height of progress and control bar
        css += ".html5-main-video {min-height: calc(100% - " + ConProgH + "px) !important;}\n";
        //
        // Move video to top of video container
        css += ".html5-main-video {top: 00px !important;}\n";
        //
        // Add bottom margin to video container
        css += "ytd-watch-flexy:not([theater]) #player                   {margin-bottom: " + (ConProgH - VidTitleUp) + "px !important;}\n"; // Regular mode
        css += "ytd-watch-flexy[theater]       #player-theater-container {margin-bottom: " + (ConProgH - VidTitleUp) + "px !important;}\n"; // Theater mode
        //
        // Add bottom margin to video container (July 2023 Patch)
        //css += "ytd-watch-flexy[theater]       #player-wide-container    {margin-bottom: " + (ConProgH) + "px !important;}\n";
        // Add bottom margin to video container (August 2023 Patch)
        css += "#player-full-bleed-container {margin-bottom: " + (ConProgH) + "px !important;}\n";
        css += "#full-bleed-container {height: calc(56.25vw + " + ConProgH + "px) !important;}\n";
        //
        // Theater Mode Adjustments (player-theater-container > player-container > ytd-player > container > #movie_player > .html5-video-container > .video-stream.html5-main-video)
        css += ".html5-video-container {min-height: calc(100% - " + ConProgH + "px) !important;}\n";
        css += ".html5-video-container {max-height: calc(100% - " + ConProgH + "px) !important;}\n";
        css += ".video-stream.html5-main-video {object-fit: contain !important;}\n";
        css += ".video-stream.html5-main-video {height: 100% !important;}\n";
        css += ".video-stream.html5-main-video {width: 100% !important;}\n";
        css += ".video-stream.html5-main-video {left: 0px !important;}\n";
        //
        // Set padding between bottom of controls and video title
        //css += "#columns.ytd-watch-flexy {padding-top: 10px !important;}\n";
        css += "h1.ytd-watch-metadata {padding-top: 5px !important;}\n";
        //css += "h1.ytd-watch-metadata {font-size: medium !important;}\n";
        //css += ".ytd-watch-metadata[id=description-and-actions] {font-size: small !important;}\n";
        //
        ///////////////////////////////////////////////////////
        ////////////// PROGRESS AND CONTROL BARS //////////////
        ///////////////////////////////////////////////////////
        //
        ////////////////////////////
        //// HEIGHT ADJUSTEMNTS ////
        ////////////////////////////
        //
        // Container for progress and control bars
        css += ".ytp-chrome-bottom {min-height:" + ConProgH + "px !important;}\n";
        css += ".ytp-chrome-bottom {max-height:" + ConProgH + "px !important;}\n";
        css += ".ytp-chrome-bottom {width: 100% !important;}\n";
        css += ".ytp-chrome-bottom {background-color: #1B1B1B !important;}\n";
        css += ".ytp-chrome-bottom {font-size: 115% !important;}\n";
        css += ".ytp-chrome-bottom {                                      bottom: 00px !important;}\n";
        css += ".ytp-chrome-bottom { margin-top: 00px !important;  margin-bottom: 00px !important;}\n";
        css += ".ytp-chrome-bottom { border-top: 00px !important;  border-bottom: 00px !important;}\n";
        css += ".ytp-chrome-bottom {padding-top: 00px !important; padding-bottom: 00px !important;}\n";
        //
        // Progress bar
        css += ".ytp-progress-bar-container {min-height:" + ProgBarH + "px !important;}\n";
        css += ".ytp-progress-bar-container {max-height:" + ProgBarH + "px !important;}\n";
        css += ".ytp-progress-bar-container {        top: 00px !important;         bottom: 00px !important;}\n"; // Fixes issues, in regular mode, when window width is squeezed tight and the progress bar moves down partially over controls
        css += ".ytp-progress-bar-container { margin-top: 00px !important;  margin-bottom: 00px !important;}\n";
        css += ".ytp-progress-bar-container { border-top: 00px !important;  border-bottom: 00px !important;}\n";
        css += ".ytp-progress-bar-container {padding-top: 00px !important; padding-bottom: 00px !important;}\n";
        //
        // Control bar
        css += ".ytp-chrome-controls {min-height:" + ControlHeight + "px !important;}\n";
        css += ".ytp-chrome-controls {max-height:" + ControlHeight + "px !important;}\n";
        css += ".ytp-chrome-controls {transform:  translateY(" + ProgBarH + "px) !important;}\n"; // Move control bar to below progress bar
        css += ".ytp-chrome-controls {        top: 00px !important;         bottom: 00px !important;}\n";
        css += ".ytp-chrome-controls { margin-top: 00px !important;  margin-bottom: 00px !important;}\n";
        css += ".ytp-chrome-controls { border-top: 00px !important;  border-bottom: 00px !important;}\n";
        css += ".ytp-chrome-controls {padding-top: 00px !important; padding-bottom: 00px !important;}\n";
        //
        css += ".ytd-miniplayer .ytp-chrome-controls {top: 230px !important;}\n";
        //
        ///////////////////////////
        //// WIDTH ADJUSTEMNTS ////
        ///////////////////////////
        //
        css += "ytd-watch-flexy[theater] {width: 100vw !important;}\n"; // Theater mode
        css += ".ytp-progress-bar-container {width: calc(100% + 1px) !important;}\n"; // Sometimes, if the window is too narrow, the last chapter can cover the play button
        //
        // Progress and Control Container
        css += "                                         .ytp-chrome-bottom {        left: 00px !important;                       right: 00px !important;}\n";
        css += ".html5-video-player:not(.ytp-fullscreen) .ytp-chrome-bottom { border-left: " + NonFullCPBord + "px solid #1B1B1B !important; border-right: " + NonFullCPBord + "px solid #1B1B1B !important;}\n"; // NOT Fullscreen
        css += ".html5-video-player:not(.ytp-fullscreen) .ytp-chrome-bottom { width: calc(100% - " + (NonFullCPBord + NonFullCPBord) + "px) !important;}\n"; // NOT Fullscreen
        css += ".html5-video-player.ytp-fullscreen       .ytp-chrome-bottom { border-left: " + FullCPBord + "px solid #1B1B1B !important; border-right: " + (FullCPBord + FullCPBord) + "px solid #1B1B1B !important;}\n"; //     Fullscreen
        css += ".html5-video-player.ytp-fullscreen       .ytp-chrome-bottom { width: calc(100% - " + (FullCPBord + FullCPBord) + "px) !important;}\n"; //     Fullscreen
        //
        // Move SponsorBlock bar
        css += ".html5-video-player:not(.ytp-fullscreen) #previewbar {width: calc(100% - 0px) !important;}\n"; // NOT Fullscreen
        css += ".html5-video-player.ytp-fullscreen       #previewbar {width: calc(100% - 0px) !important;}\n"; //     Fullscreen
        //
        // Move control bar
        css += ".html5-video-player:not(.ytp-fullscreen) .ytp-chrome-controls {margin-left: 00px !important; margin-right: 00px !important;}\n"; // NOT Fullscreen
        css += ".html5-video-player.ytp-fullscreen       .ytp-chrome-controls {margin-left: 00px !important; margin-right: 00px !important;}\n"; //     Fullscreen
        //
        ///////////////////////////
        //// OTHER ADJUSTEMNTS ////
        ///////////////////////////
        //
        // Prevent horizontal scrolling (issue in theater mode when using left-right arrows to navigate)
        css += "ytd-watch-flexy {overflow-x: hidden; !important;}\n";
        //
        // Keep progress and control bars always visible
        css += ".ytp-chrome-bottom {opacity: 1 !important }\n";
        //
        // Prevent progress bar changing height on hover
        css += ".ytp-progress-list           {transform: scaleY(1) !important;}\n"; // Regular Progess Bar
        css += ".ytp-chapter-hover-container {transform: scaleY(1) !important;}\n"; // Chapters on Progress Bar
        css += "#previewbar                  {transform: scaleY(1) !important;}\n"; // SponsorSkip
        css += ".ytp-scrubber-button         {transform: scaleY(1) !important;}\n"; // Progress bar selector
        css += ".ytp-timed-markers-container {transform: scaleY(1) !important;}\n"; // Timed Markers
        //
        // Volume
        css += ".ytp-volume-panel, .ytp-volume-control-hover {min-width: 52px; margin-right: 15px !important;}"; // Make volume slider always be visible
        css += ".ytp-mute-button {padding-top: 00px !important; padding-bottom: 00px !important;}"; // Fix Volume/speaker logo moving down when control height is made small
        //
        //
        css += ".ytd-watch-metadata[id=owner] {min-width: 300px !important;}";
        css += "#owner.ytd-watch-metadata     {min-width: 300px !important;}";
        css += ".ytp-volume-slider {min-height: 00px !important; height: 100% !important;}"; // Adjust volume slider to vertical middle of control bar
        css += ".ytp-chrome-controls {line-height: " + ControlHeight + "px !important;}"; // Adjust buttons to vertical middle of control bar
        css += ".ytp-time-display    {line-height: " + ControlHeight + "px !important;}"; // Adjust time to vertical middle of control bar
        css += "#startSegmentButton #startSegmentImage {height: 50% !important;}\n"; // Make SponsorSkip button same height as other buttons
        //
        // Progress bar adjustments
        css += ".ytp-scrubber-container {top: 0px !important; bottom: 0px !important left: 0px !important right: 0px !important}\n"; // Remove progress bar adjustments
        css += ".ytp-swatch-background-color {background-color: #556889 !important;}\n"; // Progress bar color
        css += ".ytp-scrubber-button {background-color: #cc0000 !important;}\n"; // Progress bar selector - Color
        css += ".ytp-scrubber-button {height:" + ProgBarH + "px !important;}\n";
        css += ".ytp-scrubber-button {width:" + ProgScrubW + "px !important;}\n";
        css += ".ytp-scrubber-button {margin-left:" + (ProgScrubW/2) + "px !important;}\n";
        css += ".ytp-scrubber-button {border-radius: 0px !important;}\n"; // Progress bar selector - Make Square
        //css += ".ytp-tooltip.ytp-bottom.ytp-preview {top: 500px !important;}\n"; // Move selection preview closer to progress bar
        //
        // Control Bar
        css += ".ytp-chrome-controls .ytp-play-button {max-width: 45px !important;}\n"; // Set Play Button Maximum Width (max)
        //
        // Volume Width Increase (not working right now)
        //var VolWidthInc = 50;
        //css += ".ytp-volume-area {width: " + (115 + VolWidthInc) + "px !important;}\n"; // 115
        //css += ".ytp-volume-panel {width: " + (52 + VolWidthInc) + "px !important;}\n"; // 52
        //css += ".ytp-volume-slider {width: " + (52 + VolWidthInc) + "px) !important;}\n"; // 52
        //css += ".ytp-volume-slider-handle::before {width: " + (64 + VolWidthInc) + "px) !important;}\n"; // 64
        //css += ".ytp-volume-slider-handle::after {width: " + (64 + VolWidthInc) + "px) !important;}\n"; // 64
        //
        // Preview mode, move progess bar (hover over videos on homepage)
        //css += "#inline-preview-player:not(.ytp-large-width-mode) .ytp-progress-bar-container {position: relative !important; transform: translateY(-" + ConProgH + "px) !important;}\n";
        //
        // Preview mode, move progess bar (pop up player on homepage)
        //css += ".ytp-player-minimized .ytp-progress-bar-container {position: relative !important; transform: translateY(-" + ConProgH + "px) !important;}\n";
        //
        // Prevent Home Screen Popup Previews on Hover (still provides GIF preview)
        css += "ytd-video-preview {pointer-events: none !important;}\n";
        css += "ytd-video-preview[active] {pointer-events: none !important;}\n";
        css += "ytd-video-preview[active] {display: none !important;}\n";
        //
        // Remove Homescreen miniplayer
        css += ".ytp-miniplayer-ui          {display: none !important;}\n";
        css += ".miniplayer                 {display: none !important;}\n";
        css += ".ytp-cued-thumbnail-overlay {display: none !important;}\n";
        //
        // Fix width of dislike button (when it says "Disabled by Owner")
        css += "#segmented-dislike-button {max-width: 100px !important;}\n";
        css += "ytd-toggle-button-renderer.style-scope.ytd-segmented-like-dislike-button-renderer {max-width: 100px !important;}\n";
        //
        return css;
    };
    //
    YtNewUIFix.prototype.removeCrap = function (css) {
        //
         // OVER VIDEO - Before Video - Image behind yet-to-be-started video
        css += ".ytp-cued-thumbnail-overlay-image {display: none !important;}\n";
        //
        // OVER VIDEO - Before/Pause Video - YT Logo Play Button
        css += ".ytp-large-play-button {display: none !important;}\n";
        //
        // OVER VIDEO - DURING VIDEO - Subscribe Card
        css += ".ytp-iv-player-content {display: none !important;}\n";
        //
        // OVER VIDEO - DURING VIDEO - Info cards ("i" circle) and "Suggested:" cards that popout therefrom
        css += ".ytp-chrome-top {display: none !important;}\n";
        //
        // OVER VIDEO - DURING VIDEO - Interaction card
        css += ".iv-click-target {display: none !important;}\n";
        //
        // OVER VIDEO - DURING VIDEO - End of video overlays that appear DURING video (cards, links, anything)
        css += ".ytp-ce-element {display: none !important;}\n";
        //
        // OVER VIDEO - DURING VIDEO - Embedded video pause overlays
        css += ".ytp-pause-overlay {display: none !important;}\n";
        //
        // OVER VIDEO - DURING VIDEO - "Includes Paid Promotion" Overlay
        css += ".ytp-paid-content-overlay {display: none !important;}\n";
        //
        // OVER VIDEO - DURING VIDEO - Subtitle/captions
        css += ".ytp-caption-window-container {display: none !important;}\n";
        //
        // OVER VIDEO - DURING VIDEO - Chapter name on hover
        css += ".ytp-chapter-container {display: none !important;}\n";
        //
        // OVER VIDEO - DURING VIDEO - Black gradient fade at top of video on mouse hover
        css += ".ytp-gradient-top {display: none !important;}\n";
        //
        // OVER VIDEO - DURING VIDEO - Black gradient fade at bottom of video on mouse hover
        css += ".ytp-gradient-bottom {display: none !important;}\n";
        //
        // OVER VIDEO - DURING VIDEO - Pause/play icons fade over video
        css += ".ytp-bezel-text-hide {display: none !important;}\n";
        //
        // OVER VIDEO - DURING VIDEO - Ad Buttons and Links
        css += ".ytp-ad-player-overlay-instream-info {display: none !important;}\n";
        css += ".ytp-ad-player-overlay-flyout-cta {display: none !important;}\n";
        //
        // OVER VIDEO - DURING VIDEO - SponsorBlock Notice at Beginning of Video
        css += ".sponsorSkipNoticeFadeIn.sponsorSkipNoticeTableContainer {display: none !important;}\n";
        //
        // OVER VIDEO - After Video - After video cards (everything that appears in the video area after the video ends)
        css += ".ytp-endscreen-content {display: none !important;}\n";
        css += ".autonav-endscreen {display: none !important;}\n";
        css += ".ytp-autonav-endscreen-link-container {display: none !important;}\n";
        //
        // OVER VIDEO - After Video - "Thanks for Tuning in" overlay card for live videos
        css += ".ytp-offline-slate-bar {display: none !important;}\n";
        //
        // Control Bar - Play/pause button
        //css += ".ytp-play-button {display: none !important;}\n";
        //
        // Control Bar - Next video button
        css += ".ytp-next-button {display: none !important;}\n";
        //
        // Control Bar - Autoplay toggle button
        css += ".ytp-button[data-tooltip-target-id=ytp-autonav-toggle-button] {display: none !important;}\n";
        //
        // Control Bar - Subtitles button
        css += ".ytp-subtitles-button {display: none !important;}\n";
        //
        // Control Bar - Watch later button
        //css += ".ytp-watch-later-button {display: none !important;}\n";
        //
        // Control Bar - Miniplayer button
        css += ".ytp-miniplayer-button {display: none !important;}\n";
        //
        // Control Bar - Theater/default video toggle button
        //css += ".ytp-size-button {display: none !important;}\n";
        //
        // Control Bar - Fullscreen button
        //css += ".ytp-fullscreen-button {display: none !important;}\n";
        //
        // Outside Video - Other - "Context" box below videos (covid, election, etc.)
        css += "#clarify-box {display: none !important;}\n";
        //
        // Outside Video - Other - "# ON TRENDING"
        css += "#super-title .yt-formatted-string.style-scope.yt-simple-endpoint {display: none !important;}\n";
        //
        // Outside Video - Other - Notification bell button
        css += ".ytd-subscription-notification-toggle-button-renderer {display: none !important;}\n";
        //
        // Outside Video - Other - Donate button
        css += "ytd-button-renderer.size-default.style-default.force-icon-button.ytd-menu-renderer.style-scope:nth-of-type(2) {display: none !important;}\n";
        //
        // Outside Video - Other - Clip button
        css += "ytd-button-renderer.size-default.style-default.force-icon-button.ytd-menu-renderer.style-scope:nth-of-type(3) {display: none !important;}\n";
        //
        // Outside Video - Other - Sponsor Button
        css += "#categoryPill {display: none !important;}\n";
        //
        // Outside Video - Other - YouTube Premium Popup
        //css += ".ytd-popup-container {display: none !important;}\n";
        //
        // Outside Video - Other - Merchandise Shelf
        css += "ytd-merch-shelf-renderer {display: none !important;}\n";
        //
        // Outside Video - Other - Weird Comment Box Link
        css += ".ytd-watch-metadata[id=comment-teaser] {display: none !important;}\n";
        //
        // Outside Video - Other - Tag links/text (the hashtags below the video, #technology, #pc, etc.)
        css += ".ytd-video-primary-info-renderer.style-scope.super-title {display: none !important;}\n";
        //
        // Outside Video - Video Recommendation List - Ads and Other Garbage
        css += ".ytd-action-companion-ad-renderer {display: none !important;}\n";
        css += "ytd-promoted-sparkles-web-renderer {display: none !important;}\n";
        //
        // Outside Video - Video Recommendation List - "Watch Later" and "Watchlist" overlay buttons
        css += "#hover-overlays {display: none !important;}\n";
        //
        // Outside Video - Video Recommendation List - "Playlist"/"Mix" recommendation
        css += ".use-ellipsis {display: none !important;}\n";
        //
        // Outside Video - Video Recommendation List - "Movie" recommendation
        css += ".ytd-compact-movie-renderer {display: none !important;}\n";
        //
        // Outside Video - Video Recommendation List - Category buttons above the videos
        css += "yt-related-chip-cloud-renderer.ytd-watch-next-secondary-results-renderer.style-scope {display: none !important;}\n";
        //
        // Outside Video - Live Chat - Pinned uploader messages
        css += "yt-live-chat-banner-renderer {display: none !important;}\n";
        //
        // Outside Video - Live Chat - 'Subscribe to chat' message
        css += "yt-live-chat-viewer-engagement-message-renderer {display: none !important;}\n";
        //
        // Outside Video - Live Chat - Pinned donations
        css += "yt-live-chat-ticker-renderer {display: none !important;}\n";
        //
        // Homepage -
        //css += ".ytd-rich-grid-renderer.style-scope #header {display: none !important;}\n";
        //
        // Homepage - "Recommended movies" shelf
        css += "ytd-rich-section-renderer {display: none !important;}\n";
        //
        // Channel - Top banner
        //css += "div.ytd-c4-tabbed-header-renderer.style-scope.banner-visible-area {display: none !important;}\n";
        //css += ".tp-yt-app-header-layout.style-scope {max-height: 150px !important;}\n";
        //
        // Channel - Recommended video
        //css += ".ytd-item-section-renderer.style-scope  .ytd-channel-video-player-renderer.style-scope {display: none !important;}\n";
        //
        // Left Side Menu Grab - There is side menu on YT (same menu when hamburger button is pressed at top-left), this menu can be grabbed and pulled out, but only in the progress bar area (which causes obvious issues).
        //css += "#guide-button {display: none !important;}\n";
        //css += "#contentContainer {display: none !important;}\n";
        //css += "#Guide {display: none !important;}\n";
        //
        // Outside Video - Other - Ads in Video Description
        css += ".ytd-metadata-row-container-renderer.style-scope {display: none !important;}\n";
        //
        // Category buttons at top of homepage
        css += "#header .ytd-rich-grid-renderer.style-scope {display: none !important;}\n";
        //
        // Top-Left Guide Button
        css += "#guide-button {display: none !important;}\n";
        css += "#container.ytd-masthead {padding-left: 0px !important;}\n";
        //
        // ???
        css += ".ytd-video-primary-info-renderer.style-scope.yt-simple-endpoint {display: none !important;}\n";
        //
        // Animations?
        //css += ".ytp-bezel {display: none !important;}\n";
        //css += ".html5-endscreen *, .html5-video-player div {transition-property: none !important; animation: none !important;}\n";
        //
        // Irrelevant search results
        css += "ytd-shelf-renderer {display: none !important;}\n";
        //
        return css;
    };
    return YtNewUIFix;
}());
new YtNewUIFix().applyFix();
