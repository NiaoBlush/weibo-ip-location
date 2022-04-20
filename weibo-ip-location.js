// ==UserScript==
// @name                微博ip属地显示助手
// @name:zh             微博ip属地显示助手
// @name:zh-CN          微博ip属地显示助手
// @description         新浪微博显示用户ip属地
// @description:zh      新浪微博显示用户ip属地
// @description:zh-CN   新浪微博显示用户ip属地
// @version             1.2
// @author              NiaoBlush
// @license             GPL
// @namespace           https://github.com/NiaoBlush/weibo-ip-location
// @homepageURL         https://github.com/NiaoBlush/weibo-ip-location
// @supportURL          https://github.com/NiaoBlush/weibo-ip-location/issues
// @grant               none
// @match               https://weibo.com/*
// @match               https://m.weibo.cn/*
// @require             https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==


(function () {
    "use strict";

    function getRegion(uid) {
        return new Promise((resolve, reject) => {
            $.get(`https://weibo.com/ajax/profile/detail?uid=${uid}`, function (res) {
                if (res.data && res.data.ip_location) {
                    const regionFull = res.data.ip_location;
                    console.debug("[weibo-ip-location] info", uid, regionFull);
                    const array = /IP属地：(.+)/.exec(regionFull);
                    if (array != null) {
                        resolve(array[1]);
                    } else {
                        resolve("")
                    }
                } else {
                    resolve("")
                }
            })
        })
    }

    const district = ["北京", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "上海", "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南", "广东", "广西", "海南", "重庆", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆", "台湾", "中国香港", "澳门"];

    const mark = ($obj, region) => {
        const markedClass = "weibo-ip-marked";
        if (!region || ($obj.hasClass(markedClass))) {
            return;
        }
        $obj.addClass(markedClass);
        const foreign = region && district.indexOf(region) === -1

        let html;
        if (foreign) {
            html = `<span style="background-color: red;color: #FFF;margin-left: 5px;font-weight: bold;border-radius: 8px;padding: 2px 5px;">${region}</span>`;
        } else {
            html = `<span style="color: #00d0ff;margin-left: 5px;font-weight: normal;border-radius: 8px;padding: 2px 5px;">(${region})</span>`;
        }
        $obj.append(html);
    }

    console.log("[weibo ip region] $.fn.jquery", $.fn.jquery);

    const regionMap = {}

    //v6
    $(".WB_main").bind("DOMNodeInserted", function (e) {
        const $e = $(e.target);
        if ($e.attr("id") === "v6_pl_content_homefeed") {
            $(".WB_main").unbind();
            console.log("$e.html()", $e.html());
            $e.bind("DOMNodeInserted", function (ev) {
                processList($(ev.target))
            })
        }
    })

    //v7
    $("[class^='Home_feed']").bind("DOMNodeInserted", function (e) {
        const ele = $(e.target)
        processList(ele)
    })

    function processList($ele) {
        const list = $ele.find("a[class^='ALink_default']:not([aria-label]),.WB_info>a[usercard]")
        list.each(async function () {
            const href = $(this).attr("href");
            const array = /\/u\/(\d+)/.exec(href)
            if (array != null) {
                const uid = array[1];
                let region = regionMap[uid]
                if (region === undefined) {
                    region = await getRegion(uid);
                    regionMap[uid] = region;
                }
                mark($(this), region)
            }
        })
    }

    //mobile
    if (location.host === "m.weibo.cn") {

        $("#app").bind("DOMNodeInserted", function (appE) {
            const appChild = $(appE.target)
            if (appChild.hasClass("main-wrap")) {

                $("#app").unbind("DOMNodeInserted");
                appChild.bind("DOMNodeInserted", function (mainE) {
                    console.log($(mainE.target));
                    const mainChild = $(mainE.target)
                    if (mainChild.is("div") && mainChild.attr("class") === undefined) {
                        appChild.unbind("DOMNodeInserted");
                        processMobileList(mainChild);
                        $(".pannelwrap").bind("DOMNodeInserted", function (pE) {

                            processMobileList($(pE.target));
                        })
                    }

                })

            }


        })

        function processMobileList($ele) {
            $ele.css({
                border: "1px solid red"
            })
        }
    }

})();


