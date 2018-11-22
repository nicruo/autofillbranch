// ==UserScript==
// @name         Azure DevOps - Branch Autofill
// @namespace    http://nicruo.github.io
// @version      0.1.2
// @description  Autofill the branch name on Azure DevOps
// @author       nicruo
// @match        https://*.visualstudio.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let dialogOpen = false;
    let task;
    let type;

    let improvClass = "bowtie-symbol-color-palette";
    let bugClass = "bowtie-symbol-bug";


    let branchInput;

    let timerId = setInterval(() => {
        if(checkForDialog()) {
            if(!dialogOpen) {
                dialogOpen = true;
                let taskString = task.textContent.trim();

                let typeString = hasClass(type, improvClass) ? "improv" : (hasClass(type, bugClass) ? "bug" : "pbi");

                branchInput.value = typeString + "/" + taskString.replace(/[^\w\s]/gi, '').replace(/\s+/g,' ').split(/[ \u00A0]/g).splice(0, 10).join("_");
                triggerEvent(branchInput, 'keyup');
            }
        } else {
            if(dialogOpen) {
                dialogOpen = false;
                branchInput = null;
                task = null;
            }
    }}, 1000);

    function checkForDialog() {
        branchInput = document.querySelector('[placeholder="Enter your branch name"]');
        if(branchInput !== null) {
            task = document.querySelector("div.vc-create-branch-dialog div.la-primary-data");
            type = document.querySelector("div.vc-create-branch-dialog div.la-primary-icon .bowtie-icon");

            return task !== null;
        }
        return false;
    }

    function hasClass(element, className) {
        return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
    }

    function triggerEvent(el, type) {
        if ('createEvent' in document) {
            // modern browsers, IE9+
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);
            el.dispatchEvent(e);
        } else {
            // IE 8
            let e = document.createEventObject();
            e.eventType = type;
            el.fireEvent('on'+e.eventType, e);
        }
    }
})();
