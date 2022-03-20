// ==UserScript==
// @name            weibo ip location
// @version         1.0
// @author          NiaoBlush
// @license         MIT
// @grant           none
// @include         https://weibo.com/*
// @require         https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js


(function () {
    "use strict";

    const getLocation = (uid) => {
        return new Promise((resolve, reject) => {
            $.get(`https://weibo.com/ajax/profile/info?uid=${uid}`, function (res) {
                if (res.data && res.data.user && res.data.user.location) {
                    resolve(res.data.user.location)
                } else {
                    resolve("")
                }
            })
        })
    }

    console.log("hello");
    console.log("$.fn.jquery", $.fn.jquery);

    getLocation(6253476127)
        .then((l) => {
            console.log("l", l);
        })



})();


