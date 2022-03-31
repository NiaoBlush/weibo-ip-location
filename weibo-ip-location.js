// ==UserScript==
// @name                微博ip属地显示助手
// @name:zh             微博ip属地显示助手
// @name:zh-CN          微博ip属地显示助手
// @description         新浪微博显示用户ip属地
// @description:zh      新浪微博显示用户ip属地
// @description:zh-CN   新浪微博显示用户ip属地
// @version             1.0
// @author              NiaoBlush
// @license             GPL
// @namespace           https://github.com/NiaoBlush/weibo-ip-location
// @homepageURL         https://github.com/NiaoBlush/weibo-ip-location
// @supportURL          https://github.com/NiaoBlush/weibo-ip-location/issues
// @grant               none
// @include             https://weibo.com/*
// @require             https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==


(function () {
    "use strict";

    function getRegion(uid) {
        return new Promise((resolve, reject) => {
            $.get(`https://weibo.com/ajax/profile/detail?uid=${uid}`, function (res) {
                if (res.data && res.data.region) {
                    const regionFull = res.data.region;
                    console.debug("regionFull", regionFull);
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

    const mark = (jObj, region) => {
        if (!region) {
            return;
        }
        const foreign = region && district.indexOf(region) === -1

        jObj.append(`<span style="background-color: ${foreign ? "red" : "#00d0ff"};color: #FFF;margin-left: 5px;font-weight: bold;border-radius: 8px;padding: 2px 5px;">${region}</span>`)
    }

    console.log("[weibo ip region] $.fn.jquery", $.fn.jquery);

    const regionMap = {}

    $("[class^='Home_feed']").bind("DOMNodeInserted", function (e) {
        const ele = $(e.target)
        const list = ele.find("a[class^='ALink_default']:not([aria-label])")
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
        // console.info("regionMap", regionMap);
    })

})();


