// ==UserScript==
// @name         Azure DevOps - Branch Autofill
// @namespace    http://nicruo.github.io
// @version      0.1
// @description  Autofill the branch name on Azure DevOps
// @author       nicruo
// @match        https://*.visualstudio.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let dialogOpen = false;
    let task;

    let branchInput;

    let timerId = setInterval(() => {
        if(checkForDialog()){

            if(!dialogOpen)
            {
                dialogOpen = true;
                let taskString = task.textContent.trim();
                branchInput.value = taskString.split(/[ \u00A0]/g).splice(0, 5).join("_");

                triggerEvent(branchInput, 'keyup');
                //alert("A editar");
            }

        } else {

            if(dialogOpen) {
                //alert("Parou editar");
                dialogOpen = false;
                branchInput = null;
                task = null;
            }

        }}, 1000);
    // Your code here...

    function checkForDialog() {
        branchInput = document.querySelector('[placeholder="Enter your branch name"]');
        if(branchInput !== null) {
            task = document.querySelector("div.vc-create-branch-dialog div.la-primary-data");
            return task !== null;
        }
        return false;
    }

    function triggerEvent(el, type){
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