// ==UserScript==
// @name            weibo ip location
// @version         1.0
// @author          NiaoBlush
// @license         MIT
// @grant           none
// @include         https://weibo.com/*
// @require         https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js


(function () {
    "use strict";

    const getLocation = (uid) => {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                $.get(`https://weibo.com/ajax/profile/info?uid=${uid}`, function (res) {
                    if (res.data && res.data.user && res.data.user.location) {
                        resolve(res.data.user.location)
                    } else {
                        resolve("")
                    }
                })
            }, 500)
        })
    }

    const mark = (jObj, location) => {
        // jObj.css("border", "solid 2px red");
        jObj.append(`<span style="background-color: red;color: #FFF;margin-left: 5px;font-weight: bold;border-radius: 8px;padding: 2px 5px;">${location}</span>`)
    }

    console.log("hello");
    console.log("$.fn.jquery", $.fn.jquery);

    const locationMap = {}

    //先暂时这样 跳过载入完成的判断
    setTimeout(function () {
        const list = $("a.ALink_default_2ibt1:not([aria-label])")
        list.each(function () {
            const href = $(this).attr("href");
            const array = /\/u\/(\d+)/.exec(href)
            if (array != null) {
                const uid = array[1];
                if (!locationMap[uid]) {
                    locationMap[uid] = "pending"
                    getLocation(uid)
                        .then(l => {
                            locationMap[uid] = l;
                            console.log("l", l);
                            if (l.startsWith("海外")) {
                                mark($(this), l)
                            }
                        })
                } else {

                }
                // console.log("uid", uid);
            }
            // console.log("href", href);
        })
        // const list=$("a")
        // console.log("list a", list);
    }, 1500)


})();


