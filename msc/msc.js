(function(window) {
    "use strict";
    var DOMAIN = "meishichina.com",
        register,
        tools,
        cookie,

        /**
         * 全站命名空间
         * @copyright 美食天下
         * @author xieliang
         * @date 201140331
         * @email xieyaowu@meishichina.com
         * @global
         * @namespace msc
         */
        msc = window.msc || (window.msc = {});

    /**
     * 注册空间
     * @param  {string} namespace 要注册的名称, 以 , 分隔
     * @return {object}           注册后的空间对象
     * 
     * @memberOf msc
     * @function
     * @example
     *     1, msc.register("msc.tools.text") => {};
     *     2, msc.register("msc.ui") => {};
     */
    register = msc.register = function(namespace) {
        var namespace = namespace.split("."),
            i = 0,
            len = namespace.length,
            obj = window;

        for (; i < len; i++) {
            obj = obj[namespace[i]] = obj[namespace[i]] || {};
        }
        return obj;
    }

    /**
     * 工具包
     * @namespace msc.tools
     * @memberOf msc
     */
    tools = register("msc.tools");


    /**
     * cookie操作
     * @namespace msc.tools.cookie
     * @memberOf msc.tools
     */
    cookie = register("msc.tools.cookie");

    /**
     * 页面视觉层
     * @memberOf msc
     * @namespace msc.ui
     */
    register("msc.ui");
    

    /**
     * 判断浏览器
     * @memberOf msc.tools
     * @namespace msc.tools.browser
     * @example
     *     1: msc.tools.browser.msie; //ie浏览器
     *     2: msc.tools.browser.webkit; //谷歌内核
     *     3: msc.tools.browser.mozilla; //火狐内核
     *     4: msc.tools.browser.isIe6; //是否为ie6
     *     5: msc.tools.browser.isMedia; //浏览器是否支持css3中的media特性, 此判断为判断浏览器版本，ie9(包括)++和标准浏览器支持
     *     6: msc.tools.browser.isCss3; //浏览器支持css3标准动画，此判断为判断浏览器版本，标准浏览器和ie10支持
     */
    tools.browser = function() {
        var obj = {},
            d = function(ua) {
                ua = ua.toLowerCase();
                var b = /(chrome|version)[ \/]([\w.]+)/.exec(ua) ||
                    /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||
                    /(msie) ([\w.]+)/.exec(ua) ||
                    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) || [];
                return {
                    browser: b[1] || "",
                    version: b[2] || "0"
                }
            }(window.navigator.userAgent);
        if (d.browser) {
            obj[d.browser] = true;
            obj.version = d.version;
        };
        if (obj.webkit) {
            obj.safari = true;
        };

        //判断ie6
        obj.isIe6 = !-[1, ] && !window.XMLHttpRequest;

        //判断是否支持media, ie6 7 8
        obj.isMedia = !! -[1, ];

        //判断是否支持transition ie6789
        obj.isCss3 = ( !! -[1, ] ? (obj.msie && parseInt(obj.version) <= 9 ? false : true) : false);

        return obj;
    }();


    /**
     * 获取后端ajax整个域名, 因为后端为一个主入口
     * @param  {object} param 要配置的参数
     * @return {string}       整个url
     * @memberOf msc.tools
     * @function
     * @example
     *     1, msc.tools.getAjaxUrl({ac:"user",op:"get_follow_list"}); => /ajax/ajax.php?ac=user&op=get_follow_list
     */
    tools.getAjaxUrl = function(param){
        param = param || {};
        param = $.param(param);
        return '/ajax/ajax.php?' + param;
    }
    


    /**
     * 获取地址栏参数
     * @param  {string} name 要获取的参数名, 可以为空则表示解析url为对象
     * @param  {string} [url=location.URL]  被解析的url, 如果为空则使用当面页面的url
     * @return {string}      得到的值, 或者解析后的对象
     * 
     * @memberOf msc.tools
     * @name msc.tools.requset
     * @function
     * @example
     *     1:
     *         url: index.php?a=1&b=2&c=3
     *         msc.tools.request("a") => 2
     *         msc.tools.request("b") => 3
     *         msc.tools.reuqest("xx") => ""
     *         msc.tools.request() => {a:1,b:2,c:3}
     *     2:
     *         msc.tools.request("a","?a=1&b=2&c=3") => 1
     *     3:
     *         msc.tools.request("", "?a=1&b=2&c=3") => {a:1, b:2, c:3}
     */
    
    tools.request = function(name, url) {
        url = url ? (url.indexOf("?") > -1 ? url.substr(url.indexOf("?") + 1) : url) : window.location.search.substr(1);
        var results;
        if (name) {
            results = url.match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"));
            results = results === null ? "" : decodeURIComponent(results[2]);
        } else {
            results = {};
            if (url) {
                var params = url.split('&'),
                    qrs2,
                    i = 0,
                    len = params.length;
                for (i = 0; i < len; i++) {
                    qrs2 = params[i].split('=');
                    results[qrs2[0]] = (qrs2[1] === undefined ? '' : decodeURIComponent(qrs2[1]));
                }
            }
        }
        return results;
    }



    /**
     * 获取随机数
     * @param  {number} start 起数 或者 空
     * @param  {number} end   结束数
     * @return {number}       随机的数字
     * 
     * @function
     * @memberOf msc.tools
     * @name msc.tools.random
     * @example
     *     1, msc.tools.random();// 随机一个数
     *     2, msc.tools.random(1,200);//随机1-200之间
     */
    tools.random = function(start, end) {
        if (start === undefined) {
            return Math.round(Math.random() * 1e6);
        }
        return Math.round(Math.random() * (end - start) + start);
    }



    /**
     * 对beforeunload封装
     * @param  {(string|function|undefined)} str 如果为字符串则关闭时返回, 如果是fn则关闭时执行, 否则清除
     * @return {object}     msc.tools对象
     * 
     * @function
     * @memberOf msc.tools
     * @name msc.tools.beforeunload
     */
    tools.beforeunload = function(str) {
        if ("string" === typeof(str)) {
            window.onbeforeunload = function(e) {
                e = e || window.event;
                e.returnValue = str;
                return str;
            }
        } else if ("function" === typeof(str)) {
            window.onbeforeunload = function() {
                str();
            }
        } else {
            window.onbeforeunload = null;
        }
        return tools;
    }



    /**
     * 打开新窗口
     * @param {string} url 连接
     * @param {(object|undefined)} options 可选的配置参数, 其中包含width,height,left,top四个参数
     * @param {number} [options.width=550] 窗口宽, 默认为 550
     * @param {number} [options.height=420] 窗口高, 默认为420
     * @param {number} [options.left=auto] 窗口x, 默认居中
     * @param {number} [options.top=auto] 窗口y, 默认居中 
     * @return {object} msc.tools对象
     * 
     * @function
     * @memberOf msc.tools
     * @name msc.tools.open
     * @example
     *     1, msc.open("/");
     *     2, msc.open("/",{
     *            width:1000,
     *            height:300
     *        });
     *     3, msc.open("/", {
     *         left:0,
     *         top:0,
     *         width:100,
     *         height:100
     *     })
     */
    tools.open = function(url, options) {
        var str = "";
        if (options) {
            options.height = options.height || 420;
            options.width = options.width || 550;
            options.left = options.left || ((screen.width - options.width) / 2); //默认为居中
            options.top = options.top || ((screen.height - options.height) / 2); //默认为居中

            for (var i in options) {
                str += ',' + i + '=' + options[i];
            }
            str = str.substr(1);
        };
        window.open(url, 'connect_window', str);
        str = null;
        return msc;
    }




    /**
     * 获取cookie
     * @param  {string} name 要获取的名
     * @return {string}      获取到的值, 如果不存在则为 空字符串
     *
     * @function
     * @memberOf msc.tools.cookie
     * @name msc.tools.cookie.get
     */
    cookie.get = function(name) {
        if (name) {
            name = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (name !== null) {
                return decodeURIComponent(name[2]);
            }
        }
        return "";
    }

    /**
     * 设置cookie
     * @param {(string|object)} name  键名或者一组对象
     * @param {string} value 键值
     * @param {(number|Date)} time  过期的时间, 如果为数字单位为天, 或者为date对象
     * @return {object} msc.cookie对象
     *
     * @function
     * @memberOf msc.tools.cookie
     * @name msc.tools.cookie.set
     */
    cookie.set = function(name, value, time) {
        if (!name) { //没有名称或者没有值则返回this
            return this
        }
        if ("object" === typeof(name)) {
            for (var i in name) {
                msc.cookie.set(i, name[i]);
            };
            return this;
        };
        var expires = "";
        if (time && (typeof time == 'number' || time.toUTCString)) {
            var date;
            if (typeof time === 'number') {
                date = new Date();
                date.setTime(date.getTime() + (time * 24 * 60 * 60 * 1000));
            } else {
                date = time;
            };
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            date = null;
        };

        document.cookie = name + "=" + encodeURIComponent(value) + ";path=/;domain=" + DOMAIN + expires;
        return cookie;
    }

    /**
     * 删除cookie
     * @param  {string} name 要移除的名
     * @return {object}      msc.cookie对象
     *
     * @function
     * @memberOf msc.tools.cookie
     * @name msc.tools.cookie.remove
     */
    cookie.remove = function(name) {
        if ( !! this.get(name)) {
            this.set(name, 0, -10);
        }
        return cookie;
    }

}(window));