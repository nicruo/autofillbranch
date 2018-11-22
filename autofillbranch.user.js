// ==UserScript==
// @name         Azure DevOps - Branch Autofill
// @namespace    http://nicruo.github.io
// @version      0.1.3
// @description  Autofill the branch name on Azure DevOps
// @author       nicruo
// @match        https://*.visualstudio.com/*
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// @grant           GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    let fields = {
        'max-words': {
            'label': 'Max Words',
            'type': 'int',
            'default' : 5
        }
    };

    GM_config.init({
        id: 'autofillbranch_config',
        title: 'Configuration',
        fields: fields
    });

    GM_registerMenuCommand("Configure Branch Autofill", () => {
        GM_config.open();
    });

    let dialogOpen = false;
    let task;
    let type;
    let branchInput;

    let improvClass = "bowtie-symbol-color-palette";
    let bugClass = "bowtie-symbol-bug";

    let timerId = setInterval(() => {
        if(checkForDialog()) {
            if(!dialogOpen) {
                dialogOpen = true;
                let maxWords = GM_config.get('max-words');
                let taskString = task.textContent.trim();

                let typeString = hasClass(type, improvClass) ? "improv" : (hasClass(type, bugClass) ? "bug" : "pbi");

                branchInput.value = typeString + "/" + taskString.replace(/[^\w\s]/gi, '').replace(/\s+/g,' ').split(/[ \u00A0]/g).splice(0, +maxWords).join("_");
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
