(function(e, t, n) {
    function ut(e, t) {
        for (var n in t)
            t[n] && (e[n] ? e[n].set(t[n]) : e[n] = new Z(t[n]))
    }
    function at(e, t) {
        for (var n in t)
            e[n] = t[n]
    }
    function ft() {
        if (u.checkPermission())
            return;
        var t;
        while (t = A.shift()) {
            var n = u.createNotification(t.iconUrl, t.title, t.body), i = t.url;
            try {
                n.onclick = function() {
                    e.focus(), r.href = i, n.cancel()
                }
            } catch (s) {
            }
            n.show(), setTimeout(function() {
                n.cancel && n.cancel()
            }, 8e3)
        }
    }
    function lt() {
        return nt.data.user_id == 0
    }
    function ct(e, t, n) {
        if (o)
            try {
                o.removeItem(e), o.removeItem(e + ":timestamp"), o[e] = i.stringify(t), o[e + ":timestamp"] = Math.floor(n)
            } catch (r) {
            }
    }
    function ht(e) {
        b.theme = e, e != "none" && b.injectStylesheet(y + "/styles/embed" + (e ? "." + e + ".css?" + g[e] : "." + short_name) + ".css")
    }
    if (e.DUOSHUO)
        return;
    var r = e.location, i = e.JSON, s = e.XMLHttpRequest, o = i && i.stringify && e.localStorage, u = e.webkitNotifications, a = t.getElementsByTagName("head")[0] || t.getElementsByTagName("body")[0], f = e.navigator.userAgent, l = 0, c, h = function() {
        var e = {"<": "&lt;",">": "&gt;",'"': "&quot;","'": "&#x27;","`": "&#x60;"}, t = /&(?!\w+;)|[<>"'`]/g, n = /[&<>"'`]/, r = function(t) {
            return e[t] || "&amp;"
        };
        return function(e) {
            return e == null || e === !1 ? "" : n.test(e) ? e.replace(t, r) : e
        }
    }(), p = function(e) {
        if (e.match(/^(http|https):/))
            return e;
        var n = t.createElement("a");
        return n.href = e, S.hrefNormalized ? n.href : n.getAttribute("href", 4)
    }, d = {start: 0,end: 0}, v = function(e) {
        var n = this, r = 0, i = 0, s, o, u, a, f;
        t.selection && (o = t.selection.createRange(), o && o.parentElement() == n && (a = n.value.length, s = n.value.replace(/\r\n/g, "\n"), u = n.createTextRange(), u.moveToBookmark(o.getBookmark()), f = n.createTextRange(), f.collapse(!1), u.compareEndPoints("StartToEnd", f) > -1 ? r = i = a : (r = -u.moveStart("character", -a), r += s.slice(0, r).split("\n").length - 1, u.compareEndPoints("EndToEnd", f) > -1 ? i = a : (i = -u.moveEnd("character", -a), i += s.slice(0, i).split("\n").length - 1)))), d.start = r, d.end = i
    }, m = function(e) {
        return function() {
            return e
        }
    }, g = {"default": "19128c28",dark: "93dc4c47",bluebox: "dbc0a9af"}, y = "http://static.duoshuo.com", b = e.DUOSHUO = {DOMAIN: "duoshuo.com",REMOTE: "http://duoshuo.com",version: 131205,loaded: {jQuery: typeof jQuery != "undefined" && jQuery.fn.jquery >= "1.5",smilies: !1,mzadxN: typeof mzadxN != "undefined"},libs: {jQuery: y + "/libs/embed.compat.js?24f8ca3f.js",smilies: y + "/libs/smilies.js?921e8eda.js",mzadxN: "http://js.miaozhen.com/mz_ad_serving.js"},sourceName: {weibo: "\u65b0\u6d6a\u5fae\u535a",qq: "QQ",qzone: "QQ\u7a7a\u95f4",qqt: "\u817e\u8baf\u5fae\u535a",renren: "\u4eba\u4eba\u7f51",douban: "\u8c46\u74e3\u7f51",netease: "\u7f51\u6613\u5fae\u535a",kaixin: "\u5f00\u5fc3\u7f51",sohu: "\u641c\u72d0\u5fae\u535a",baidu: "\u767e\u5ea6",taobao: "\u6dd8\u5b9d",msn: "MSN",google: "\u8c37\u6b4c"},serviceNames: {weibo: "\u5fae\u535a",qq: "QQ",douban: "\u8c46\u74e3",renren: "\u4eba\u4eba",netease: "\u7f51\u6613",kaixin: "\u5f00\u5fc3",sohu: "\u641c\u72d0",baidu: "\u767e\u5ea6",taobao: "\u6dd8\u5b9d",msn: "MSN",google: "\u8c37\u6b4c"},


    parseDate: function(e) {
            return e.parse("2011-10-28T00:00:00+08:00") && function(t) {
                return new e(t)
            } || e.parse("2011/10/28T00:00:00+0800") && function(t) {
                return new e(t.replace(/-/g, "/").replace(/:(\d\d)$/, "$1"))
            } || e.parse("2011/10/28 00:00:00+0800") && function(t) {
                return new e(t.replace(/-/g, "/").replace(/:(\d\d)$/, "$1").replace("T", " "))
            } || function(t) {
                return new e(t)
            }
        }(Date),fullTime: function(e) {
            var t = b.parseDate(e);
            return t.getFullYear() + "\u5e74" + (t.getMonth() + 1) + "\u6708" + t.getDate() + "\u65e5 " + t.toLocaleTimeString()
        },elapsedTime: function(e) {
            var t = b.parseDate(e), n = new Date, r = (n - l - t) / 1e3;
            return r < 10 ? "\u521a\u521a" : r < 60 ? Math.round(r) + "\u79d2\u524d" : r < 3600 ? Math.round(r / 60) + "\u5206\u949f\u524d" : r < 86400 ? Math.round(r / 3600) + "\u5c0f\u65f6\u524d" : (n.getFullYear() == t.getFullYear() ? "" : t.getFullYear() + "\u5e74") + (t.getMonth() + 1) + "\u6708" + t.getDate() + "\u65e5"
        },require: function(e, t) {
            if (typeof e == "string")
                b.loaded[e] ? t() : j(b.libs[e], function() {
                    b.loaded[e] = !0, t()
                });
            else if (typeof e == "object") {
                var n, r = !0;
                for (n = 0; n < e.length; n++)
                    (function(i) {
                        if (b.loaded[e[n]])
                            return;
                        r = !1, j(b.libs[i], function() {
                            b.loaded[i] = !0;
                            for (var n = 0; n < e.length; n++)
                                if (!b.loaded[e[n]])
                                    return;
                            t()
                        })
                    })(e[n]);
                r && t()
            }
        },getCookie: function(e) {
            var r = " " + e + "=", i = t.cookie.split(";"), s = 0, o, u, a;
            for (; s < i.length; s++) {
                o = " " + i[s], u = o.indexOf(r);
                if (u >= 0 && u + r.length == (a = o.indexOf("=") + 1))
                    return decodeURIComponent(o.substring(a, o.length).replace(/\+/g, ""))
            }
            return n
        },param: function(e) {
            var t = [];
            for (var r in e)
                e[r] != n && t.push(r + "=" + encodeURIComponent(e[r]));
            return t.join("&")
        },ajax: function(e, t, r, o, u) {
            var a = b.getCookie("duoshuo_token");
            r.v = b.version, a ? r.jwt = a : U.remote_auth && (r.remote_auth = U.remote_auth);
            if (s && i && i.parse) {
                var f = new s;
                if (!!f && "withCredentials" in f) {
                    var l;
                    function c(e, t, n, r) {
                        var s, a, f, l = t;
                        if (e >= 200 && e < 300 || e === 304)
                            if (e === 304)
                                l = "notmodified", s = !0;
                            else
                                try {
                                    a = i.parse(n), l = "success", s = !0
                                } catch (c) {
                                    l = "parsererror", f = c
                                }
                        else {
                            f = l;
                            if (!l || e)
                                l = "error", e < 0 && (e = 0);
                            try {
                                a = i.parse(n)
                            } catch (c) {
                                l = "parsererror", f = c
                            }
                        }
                        s ? o(a) : l === "parseerror" ? F("\u89e3\u6790\u9519\u8bef: " + n) : (u && u(a), F("\u51fa\u9519\u5566(" + a.code + "): " + a.errorMessage), a.errorTrace && F(a.errorTrace))
                    }
                    f.open(e, b.hostUrl + t + ".json" + (e == "GET" ? "?" + b.param(r) : ""), !0), f.withCredentials = !0, f.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"), f.send(e == "GET" ? null : b.param(r)), l = function(e, t) {
                        var r, i, s, o;
                        try {
                            if (l && (t || f.readyState === 4)) {
                                l = n;
                                if (t)
                                    f.readyState !== 4 && f.abort();
                                else {
                                    r = f.status, s = f.getAllResponseHeaders();
                                    try {
                                        o = f.responseText
                                    } catch (e) {
                                    }
                                    try {
                                        i = f.statusText
                                    } catch (u) {
                                        i = ""
                                    }
                                }
                            }
                        } catch (a) {
                            t || c(-1, a)
                        }
                        o && c(r, i, o, s)
                    }, f.readyState === 4 ? l() : f.onreadystatechange = l;
                    return
                }
            }
            e != "GET" && (r._method = "POST");
            var h = "cb_" + Math.round(Math.random() * 1e6);
            b[h] = function(e) {
                switch (e.code) {
                    case 0:
                        o(e);
                        break;
                    default:
                        u && u(e), F("\u51fa\u9519\u5566(" + e.code + "): " + e.errorMessage), e.errorTrace && F(e.errorTrace)
                }
            }, r.callback = "DUOSHUO['" + h + "']", j(b.hostUrl + t + ".jsonp?" + b.param(r))
        },injectStylesheet: function(e) {
            var n = t.createElement("link");
            n.type = "text/css", n.rel = "stylesheet", n.href = e, a.appendChild(n)
        },setCustomStyle: function(e) {
            c || (c = t.createElement("style"), c.type = "text/css", a.appendChild(c)), e = e.replace(/\}/g, "}\n");
            if (c.styleSheet)
                c.styleSheet.cssText = e;
            else {
                while (c.firstChild)
                    c.removeChild(c.firstChild);
                c.appendChild(t.createTextNode(e))
            }
        },compileStyle: function(e) {
            var t = "", n = {textbox: "#ds-thread #ds-reset .ds-replybox .ds-textarea-wrapper"};
            if (e)
                for (var r in e)
                    t += n[r] + "{" + e[r] + "}\n";
            return t
        },init: function(e, t) {
            e && !T[e] && (T[e] = t || {type: "EmbedThread"}), b.initView && b.initView()
        }}, w = t.all, E, S = b.support = function() {
        var n = t.createElement("div");
        n.innerHTML = '<a href="/a">a</a><input type="checkbox"/>';
        var i = n.getElementsByTagName("a")[0], o = n.getElementsByTagName("input")[0], u = {placeholder: "placeholder" in o,touch: "ontouchstart" in e || "onmsgesturechange" in e,hrefNormalized: i.getAttribute("href") === "/a",iOS: f.match(/ \((iPad|iPhone|iPod);( U;)? CPU( iPhone)? OS /),android: f.match(/ \(Linux; U; Android /)};
        return E = !s && typeof n.style.maxHeight == "undefined", u.authInWin = e.postMessage && e.screen.width > 800 && !u.iOS && !u.android && r.origin, u
    }(), x = function(e, n) {
        var r = (t.body || t.documentElement).style;
        if (typeof r == "undefined")
            return !1;
        if (typeof r[e] == "string")
            return n ? e : !0;
        var i = ["Moz", "Webkit", "ms"], e = e.charAt(0).toUpperCase() + e.substr(1), s = 0;
        for (; s < i.length; s++)
            if (typeof r[i[s] + e] == "string")
                return n ? i[s] + e : !0
    }, T = b.selectors = {".ds-thread": {type: "EmbedThread"},".ds-recent-comments": {type: "RecentComments"},".ds-recent-visitors": {type: "RecentVisitors"},".ds-top-users": {type: "TopUsers"},".ds-top-threads": {type: "TopThreads"},".ds-login": {type: "LoginWidget"},".ds-thread-count": {type: "ThreadCount"}}, N = b.pagelets = [], C = {post: "\u53d1\u5e03",posting: "\u6b63\u5728\u53d1\u5e03",settings: "\u8bbe\u7f6e",reply: "\u56de\u590d",like: "\u9876",repost: "\u8f6c\u53d1",report: "\u4e3e\u62a5","delete": "\u5220\u9664",reply_to: "\u56de\u590d ",reposts: "\u8f6c\u53d1",comments: "\u8bc4\u8bba",floor: "\u697c",latest: "\u6700\u65b0",earliest: "\u6700\u65e9",hottest: "\u6700\u70ed",share_to: "\u5206\u4eab\u5230:",leave_a_message: "\u8bf4\u70b9\u4ec0\u4e48\u5427\u2026",no_comments_yet: "\u8fd8\u6ca1\u6709\u8bc4\u8bba\uff0c\u6c99\u53d1\u7b49\u4f60\u6765\u62a2",repost_reason: "\u8bf7\u8f93\u5165\u8f6c\u53d1\u7406\u7531",hot_posts_title: "\u88ab\u9876\u8d77\u6765\u7684\u8bc4\u8bba",comments_zero: "\u6682\u65e0\u8bc4\u8bba",comments_one: "1\u6761\u8bc4\u8bba",comments_multiple: "{num}\u6761\u8bc4\u8bba",reposts_zero: "\u6682\u65e0\u8f6c\u53d1",reposts_one: "1\u6761\u8f6c\u53d1",reposts_multiple: "{num}\u6761\u8f6c\u53d1",weibo_reposts_zero: "\u6682\u65e0\u65b0\u6d6a\u5fae\u535a",weibo_reposts_one: "1\u6761\u65b0\u6d6a\u5fae\u535a",weibo_reposts_multiple: "{num}\u6761\u65b0\u6d6a\u5fae\u535a",qqt_reposts_zero: "\u6682\u65e0\u817e\u8baf\u5fae\u535a",qqt_reposts_one: "1\u6761\u817e\u8baf\u5fae\u535a",qqt_reposts_multiple: "{num}\u6761\u817e\u8baf\u5fae\u535a"}, k = function(e, t, n, r) {
        b.ajax("GET", e, t, n || function() {
        }, r)
    }, L = function(e, t, n, r) {
        b.ajax("POST", e, t, n || function() {
        }, r)
    }, A = [], O, M = [], _ = function(t) {
        if (!("WebSocket" in e && i))
            return !1;
        M.push(i.stringify(t)), O || (O = b.webSocket = new WebSocket("ws://ws.duoshuo.com:8201/"), O.onopen = function() {
            var e;
            if (O.readyState === 1)
                while (e = M.shift())
                    O.send(e)
        }, O.onmessage = function(e) {
            try {
                var t = 0, n, r = i.parse(e.data)
            } catch (s) {
                return
            }
            switch (r.type) {
                case "post":
                    for (; t < b.pagelets.length; t++)
                        n = b.pagelets[t], n.threadId == r.thread_id && n.onMessage(r);
                    break;
                case "notification":
                    A.push(r), ft();
                    break;
                default:
            }
        }, e.addEventListener("beforeunload", function() {
            O.close()
        })), O.onopen()
    }, D = b.Collections = {}, P = b.Views = {}, H = b.Callbacks = {}, B = b.openDialog = function(e) {
        return b.dialog !== n && b.dialog.el.remove(), b.dialog = (new P.Dialog('<div class="ds-dialog"><div class="ds-dialog-inner ds-rounded"><div class="ds-dialog-body">' + e + '</div><div class="ds-dialog-footer"><a href="http://duoshuo.com/" target="_blank" class="ds-logo"></a><span>\u793e\u4f1a\u5316\u8bc4\u8bba\u6846</span></div><a class="ds-dialog-close" href="javascript:void(0)" title="\u5173\u95ed"></a></div></div>')).open()
    }, j = b.injectScript = function(r, i) {
        var s = t.createElement("script"), o = t.head || t.getElementsByTagName("head")[0] || t.documentElement;
        s.type = "text/javascript", s.src = r, s.async = "async", s.charset = "utf-8", i && (s.onload = s.onreadystatechange = function(t, r) {
            if (r || !s.readyState || /loaded|complete/.test(s.readyState))
                s.onload = s.onreadystatechange = null, o && s.parentNode && o.removeChild(s), s = n, r || i.call(e)
        }), o.insertBefore(s, o.firstChild)
    }, F = b.log = function(e) {
        typeof console == "object" && console.log(e)
    }, I = b.smilies = {}, q = ["EmbedThread", "RecentComments", "RecentVisitors", "TopUsers", "TopThreads", "LoginWidget", "ThreadCount"], R = 0, U, z = function() {
        var e = {}, t = 0;
        for (; t < arguments.length; t++)
            arguments[t] && at(e, arguments[t]);
        var n = b.param(e);
        return n ? "?" + n : ""
    }, W = function() {
        var e = b.getCookie("duoshuo_token");
        return e ? {jwt: e} : U.remote_auth ? {short_name: U.short_name,remote_auth: U.remote_auth} : n
    }, X = function() {
        return !U && (U = e.duoshuoQuery) && et.trigger("queryDefined"), U
    };
    for (var V in Object.prototype)
        return alert("Object.prototype\u4e0d\u4e3a\u7a7a\uff0c\u8bf7\u4e0d\u8981\u7ed9Object.prototype\u8bbe\u7f6e\u65b9\u6cd5");
    var $ = b.templates = {userUrl: function(e) {
            return e.url
        },avatarUrl: function(e, t) {
            return e.avatar_url || tt.data.default_avatar_url
        },userAnchor: function(e) {
            var t = $.userUrl(e);
            return t ? '<a rel="nofollow author" target="_blank" href="' + h(t) + '">' + h(e.name) + "</a>" : h(e.name)
        },avatarImg: function(e, t) {
            return '<img src="' + h($.avatarUrl(e, t)) + '" alt="' + h(e.name) + '"' + (t ? ' style="width:' + t + "px;height:" + t + 'px"' : "") + "/>"
        },avatar: function(e, t) {
            var n = $.avatarImg(e, t), r = $.userUrl(e);
            return r ? '<a rel="nofollow author" target="_blank" href="' + h(r) + '" ' + (e.user_id ? " onclick=\"this.href='" + b.hostUrl + "/user-url/?user_id=" + e.user_id + "';\"" : "") + ' title="' + h(e.name) + '">' + n + "</a>" : n
        },timeHtml: function(e, t) {
            return e ? t ? '<a href="' + t + '" target="_blank" rel="nofollow" class="ds-time" datetime="' + e + '" title="' + b.fullTime(e) + '">' + b.elapsedTime(e) + "</a>" : '<span class="ds-time" datetime="' + e + '" title="' + b.fullTime(e) + '">' + b.elapsedTime(e) + "</span>" : ""
        },serviceIcon: function(e, t) {
            return '<a href="javascript:void(0)" class="ds-service-icon' + (t ? "-grey" : "") + " ds-" + e + '" data-service="' + e + '" title="' + b.sourceName[e] + '"></a>'
        },loginButtons: function(e) {
            return '<div class="ds-login-buttons"><p>\u793e\u4ea4\u5e10\u53f7\u767b\u5f55:</p><div class="ds-social-links">' + $.serviceList() + $.additionalServices() + "</div></div>"
        },poweredBy: function(e) {
            return '<p class="ds-powered-by"><a href="http://duoshuo.com" target="_blank" rel="nofollow">' + h(e) + "</a></p>"
        },indicator: m('<div id="ds-indicator"></div>'),waitingImg: m('<div id="ds-waiting"></div>'),serviceList: function(e) {
            var t = '<ul class="ds-service-list">', n = ["weibo", "qq", "renren", "douban"], r = 0;
            for (; r < n.length; r++)
                t += $.loginItem(n[r], e);
            return t + '<li><a class="ds-more-services" href="javascript:void(0)">\u66f4\u591a\u00bb</a></li>' + "</ul>"
        },additionalServices: function(e) {
            var t = '<ul class="ds-service-list ds-additional-services">', n = ["kaixin", "netease", "sohu", "baidu", "google"], r = 0;
            for (; r < n.length; r++)
                t += $.loginItem(n[r], e);
            return t + "</ul>"
        },loginItem: function(e, t) {
            var n = $[t ? "bindUrl" : "loginUrl"](e);
            return '<li><a href="' + n + '" rel="nofollow" class="ds-service-link ds-' + e + '">' + b.serviceNames[e] + (nt.data.social_uid[e] ? ' <span class="ds-icon ds-icon-ok"></span>' : "") + "</a>" + "</li>"
        },loginUrl: function(e, t) {
            return t || (t = {}), U.sso && U.sso.login && (t.sso = 1, t.redirect_uri = U.sso.login), b.hostUrl + "/login/" + e + "/" + z(t)
        },bindUrl: function(e) {
            return b.hostUrl + "/bind/" + e + "/" + z(U.sso && U.sso.login ? {sso: 1,redirect_uri: U.sso.login} : null, W())
        },logoutUrl: function() {
            return b.hostUrl + "/logout/" + z(U.sso && U.sso.logout ? {sso: 1,redirect_uri: U.sso.logout} : null)
        },likePost: function(e) {
            return '<a class="ds-post-likes" href="javascript:void(0);"><span class="ds-icon ds-icon-like"></span>' + C.like + (e.likes > 0 ? "(" + e.likes + ")" : "") + "</a>"
        },ctxPost: function(e, t, n) {
            var r = J(e);
            return '<li class="ds-ctx-entry"' + (n ? ' style="display:none"' : "") + ' data-post-id="' + e.post_id + '"><div class="ds-avatar">' + $.avatar(r) + '</div><div class="ds-ctx-body"><div class="ds-ctx-head">' + $.userAnchor(r) + $.timeHtml(e.created_at, e.url) + (t >= 0 ? '<div class="ds-ctx-nth" title="' + b.fullTime(e.created_at) + '">' + (t + 1) + C.floor + "</div>" : "") + '</div><div class="ds-ctx-content">' + e.message + (t >= 0 ? '\u3000\u3000\u3000\u3000\u3000\u3000\u3000<div class="ds-comment-actions' + (e.vote > 0 ? " ds-post-liked" : "") + '">' + $.likePost(e) + ' <a class="ds-post-repost" href="javascript:void(0);"><span class="ds-icon ds-icon-share"></span>' + C.repost + "</a>" + ' <a class="ds-post-reply" href="javascript:void(0);"><span class="ds-icon ds-icon-reply"></span>' + C.reply + "</a>" + "</div>" : "") + "</div></div></li>"
        }}, J = function(e) {
        return ot[e.author_id] && ot[e.author_id].data || e.author
    }, K = function(e) {
        var t = [];
        for (var n in e)
            t.push('<input type="hidden" name="' + n + '" value="' + h(e[n]) + '" />');
        return t.join("\n")
    };
    for (; R < q.length; R++)
        b[q[R]] = function(e) {
            return function(t, n) {
                n = n || {}, n.type = e, t && !T[t] && (T[t] = n), b.initSelector && b.initSelector(t, n)
            }
        }(q[R]), b["create" + q[R]] = function(e) {
            return function(n, r) {
                var i = t.createElement(n);
                for (var s in r)
                    i.setAttribute("data-" + s, r[s]);
                return b[e](i), i
            }
        }(q[R]);
    b.RecentCommentsWidget = b.RecentComments;
    var Q = 0, G = b.Class = function() {
    };
    G.extend = function(e) {
        function r() {
            !Q && this.init && this.init.apply(this, arguments)
        }
        Q = 1;
        var t = new this;
        Q = 0;
        for (var n in e)
            t[n] = e[n];
        return r.prototype = t, r.prototype.constructor = r, r.extend = arguments.callee, r
    };
    var Y = b.Event = G.extend({on: function(e, t) {
            var r = this.handlers || (this.handlers = {});
            return r[e] === n && (r[e] = []), r[e].push(t), this
        },trigger: function(e, t) {
            var n = (this.handlers || (this.handlers = {}))[e];
            if (n)
                for (var r = 0; r < n.length; r++)
                    if (n[r].call(this, t) === !1)
                        break;
            return this
        }}), Z = b.Model = Y.extend({init: function(e) {
            this.data = e
        },reset: function(e) {
            this.data = e, this.trigger("reset")
        },remove: function(e) {
            this.data.splice(e, 1), this.trigger("reset")
        },set: function(e, t) {
            if (t === n)
                for (var r in e)
                    this.data[r] = e[r];
            else
                this.data[e] = t;
            this.trigger("reset")
        }}), et = b.events = new Y, tt = b.site = new Z, nt = b.visitor = new Z, rt = b.unread = new Z, it = b.threads = {}, st = b.postPool = {}, ot = b.users = {};
    et.on("queryDefined", function() {
        var e = U.short_name;
        b.hostUrl = e ? "http://" + e + "." + b.DOMAIN : b.REMOTE, U.theme && ht(U.theme);
        if (o) {
            var t = o["ds_site_" + e], n = o["ds_lang_" + e];
            t && tt.reset(i.parse(t)), n && at(C, i.parse(n))
        }
    }), X(), b.loaded.jQuery && (b.jQuery = e.jQuery), b.require("jQuery", function() {
        function dt(e, t, n) {
            if (e.find(".ds-post[data-post-id=" + t.post_id + "]")[0])
                return;
            return e.find(".ds-post-placeholder").remove(), i($.post(t, n)).hide()[n.order == "asc" ? "appendTo" : "prependTo"](e).slideDown(function() {
            })
        }
        function vt(e, t) {
            var n;
            this.delegate("a.ds-post-likes", "click", function(e) {
                if (lt())
                    return gt(), !1;
                var t = i(this).parent();
                return liked = t.hasClass("ds-post-liked"), matches = i(this).html().match(/\((\d+)\)/), likes = (matches ? parseInt(matches[1]) : 0) + (liked ? -1 : 1), L("/api/posts/vote", {post_id: t.closest(".ds-ctx-entry, .ds-post-self").attr("data-post-id"),vote: liked ? 0 : 1}), i(this).html(i(this).html().replace(/\(\d+\)/, "") + (likes ? "(" + likes + ")" : "")), t[liked ? "removeClass" : "addClass"]("ds-post-liked"), !1
            }).delegate("a.ds-post-repost", "click", function(e) {
                var t = i(this).closest(".ds-post-self"), n = st[t.attr("data-post-id")];
                return b.repostDialog(n, ""), !1
            }).delegate("a.ds-post-delete", "click", function(t) {
                if (confirm("\u786e\u5b9a\u8981\u5220\u9664\u8fd9\u6761\u8bc4\u8bba\u5417\uff1f")) {
                    var n = i(this).closest(".ds-post-self");
                    L("/api/posts/remove", {post_id: n.attr("data-post-id")}), n.parent().fadeOut(200, function() {
                        e.data.comments--, e.updateCounter("duoshuo"), i(this).remove()
                    })
                }
                return !1
            }).delegate("a.ds-post-report", "click", function(e) {
                if (confirm("\u786e\u5b9a\u8981\u4e3e\u62a5\u8fd9\u6761\u8bc4\u8bba\u5417\uff1f")) {
                    var t = i(this).closest(".ds-post-self");
                    L("/api/posts/report", {post_id: t.attr("data-post-id")}), alert("\u611f\u8c22\u60a8\u7684\u53cd\u9988\uff01")
                }
                return !1
            }).delegate("a.ds-post-reply", "click", function(r) {
                var s = i(this), o = s.closest(".ds-comment-actions");
                if (o.hasClass("ds-reply-active"))
                    n.el.fadeOut(200, function() {
                        i(this).detach()
                    }), o.removeClass("ds-reply-active");
                else {
                    var u = s.closest(".ds-ctx-entry, .ds-post-self");
                    n ? n.actionsBar.removeClass("ds-reply-active") : (n = new P.Replybox(e), n.render(!0).el.addClass("ds-inline-replybox").detach()), n.el.find("[name=parent_id]").val(u.attr("data-post-id")), n.el.show().appendTo(s.closest(".ds-ctx-body, .ds-comment-body")).find("textarea").focus(), n.actionsBar = o.addClass("ds-reply-active"), t.max_depth <= 1 ? n.postList = e.postList.el : (n.postList = u.siblings(".ds-children"), n.postList[0] || (n.postList = i('<ul class="ds-children"></ul>').insertAfter(u)))
                }
                return !1
            }).delegate("a.ds-weibo-comments", "click", function(e) {
                var n = i(this).closest(".ds-post-self"), r = n.attr("data-post-id"), s = n.data("source");
                if (n.attr("data-root-id") == 0) {
                    var o = n.siblings(".ds-children");
                    o[0] ? o.remove() : (o = i('<ul class="ds-children"></ul>').insertAfter(n), k("/api/posts/listComments", bt({post_id: r}), function(e) {
                        c(e), o.append(i.map(e.response, function(e) {
                            return $.post(e, t)
                        }).join(""))
                    }))
                }
                return !1
            }).delegate("a.ds-weibo-reposts", "click", function(t) {
                var n = i(this).closest(".ds-post-self"), r = st[n.attr("data-post-id")], s = r.data.source;
                if (!nt.data.social_uid[s == "qqt" ? "qq" : s]) {
                    mt(s);
                    return
                }
                var o = r.data.root_id, u = o != "0" ? st[o] : r, a = "";
                if (o != "0") {
                    var f = J(r.data);
                    a = (s == "weibo" ? "//@" + f.name : "|| @" + f.qqt_account) + ":" + r.data.message
                }
                return b.repostDialog(u, a, e, s), !1
            }).delegate("a.ds-expand", "click", function(e) {
                var t = i(this).parent();
                return t.siblings().show(), t.remove(), !1
            }), S.touch || this.delegate("a.ds-comment-context, .ds-avatar, .ds-user-name", "mouseenter", function(t) {
                var n = this;
                if (bubbleOutTimer && Q.owner == n)
                    clearTimeout(bubbleOutTimer), bubbleOutTimer = 0;
                else {
                    var r = i(n);
                    et = setTimeout(function() {
                        et = 0, Q.owner = n, pt();
                        var t = r.offset(), i = e.el.offset(), s = r.innerWidth() / 2, o = e.el.innerHeight() - (t.top - i.top) + 6, u = t.left - i.left - 35 + (s > 35 ? 35 : s);
                        try {
                            if (r.hasClass("ds-comment-context"))
                                G.attr("id", "ds-ctx-bubble").attr("data-post-id", r.attr("data-post-id")).html('<ul id="ds-ctx">' + $.ctxPost(st[r.attr("data-parent-id")].data) + "</ul>" + '<div class="ds-bubble-footer"><a class="ds-ctx-open" href="javascript:void(0);">\u67e5\u770b\u5bf9\u8bdd</a></div>');
                            else if (r.hasClass("ds-avatar") || r.hasClass("ds-user-name")) {
                                var a = {}, f = a.user_id = r.attr("data-user-id");
                                if (!f)
                                    throw "no info";
                                G.attr("id", "ds-user-card").attr("data-user-id", f).empty(), ot[f] ? G.html($.userInfo(ot[f].data)) : k("/api/users/profile", bt(a), function(e) {
                                    var t = e.response;
                                    ot[f] ? ot[f].set(t) : ot[f] = new Z(t), Q.owner == n && G.html($.userInfo(t))
                                })
                            }
                            Q.css({bottom: o,left: u}).appendTo(e.innerEl)
                        } catch (l) {
                            Q.detach()
                        }
                    }, 200)
                }
            }).delegate("a.ds-comment-context, .ds-avatar, .ds-user-name", "mouseleave", function() {
                et ? (clearTimeout(et), et = 0) : bubbleOutTimer || bubbleOut()
            })
        }
        function mt(e) {
            var t = $[lt() ? "loginUrl" : "bindUrl"](e);
            S.authInWin && O(e, t) || (r.href = t)
        }
        function gt() {
            var e = B("<h2>\u793e\u4ea4\u5e10\u53f7\u767b\u5f55</h2>" + $.serviceList() + $.additionalServices()).el.find(".ds-dialog").css("width", "300px");
            M(e)
        }
        function bt(e) {
            var n = {require: "site,visitor,nonce,serverTime,lang" + (yt++ ? "" : ",unread,log,extraCss"),site_ims: o && o["ds_site_" + U.short_name + ":timestamp"],lang_ims: o && o["ds_lang_" + U.short_name + ":timestamp"],referer: t.referrer};
            U.stylePatch && (n.style_patch = U.stylePatch);
            for (var r in n)
                n[r] && (!E || encodeURIComponent(n[r]).length < 200) && (e[r] = n[r]);
            return e
        }
        var i = b.jQuery, s = i(e), a = i(t), c = b.loadRequire = function(e) {
            e.serverTime && (l = (new Date).getTime() - e.serverTime * 1e3), e.visitor && (!nt.data && e.visitor.user_id && u && !u.checkPermission() && _({logged_user_id: e.visitor.user_id}), nt.reset(e.visitor)), e.site && (tt.reset(e.site), ct("ds_site_" + U.short_name, e.site, e.serverTime)), !b.theme && tt.data.theme && ht(tt.data.theme), e.lang && (at(C, e.lang), ct("ds_lang_" + U.short_name, e.lang, e.serverTime));
            if (e.stylesheets)
                for (var t = 0; t < e.stylesheets.length; t++)
                    b.injectStylesheet(e.stylesheets[t]);
            e.nonce && (b.nonce = e.nonce), e.style && b.setCustomStyle((e.style || "") + b.compileStyle(U.component_style)), e.unread && rt.reset(e.unread)
        }, m = function(e) {
            e.stopPropagation()
        }, g = function(e) {
            (e.ctrlKey && e.which == 13 || e.which == 10) && i(this.form).trigger("submit")
        }, A = function(e) {
            var t = i(this);
            t.height(Math.max(54, t.next(".ds-hidden-text").text(this.value).height() + 27))
        }, O = function(t, n) {
            var i = {weibo: [760, 600],renren: [420, 322],qq: [504, 445],netease: [810, 645],sohu: [972, 600],google: [600, 440],taobao: [480, 585]}[t] || [550, 400];
            return e.open(n + (n.indexOf("?") == -1 ? "?" : "&") + b.param({origin: r.origin || "http://" + r.host}), "_blank", "width=" + i[0] + ",height=" + i[1] + ",toolbar=no,menubar=no,location=yes")
        }, M = function(e, t) {
            S.authInWin && e.find(t || "a.ds-service-link").click(function(e) {
                var t = this.href.match(/\/(login|bind)\/(\w+)\//i);
                if (!t || !b.serviceNames[t[2]])
                    return;
                return !O(t[2], this.href)
            })
        }, H = function(e) {
            return S.touch && e.addClass("ds-touch"), x("transition") || e.addClass("ds-no-transition"), E && e.addClass("ds-ie6"), i.support.opacity || e.addClass("ds-no-opacity"), e
        }, j = function(e) {
            if (!S.placeholder) {
                var t = e.attr("placeholder");
                e.val(t).focus(function() {
                    this.value === t && (this.value = "")
                }).blur(function() {
                    this.value === "" && (this.value = t)
                })
            }
            return e
        };
        if (e.postMessage) {
            var q = function(e) {
                if (e.origin === "http://duoshuo.com")
                    switch (e.data.type) {
                        case "login":
                            r.href = e.data.redirectUrl;
                            break;
                        default:
                    }
            };
            e.addEventListener ? e.addEventListener("message", q, !1) : e.attachEvent && e.attachEvent("onmessage", q)
        }
        b.scrollTo = function(e) {
            var t = e.offset().top;
            (t < s.scrollTop() || t > s.scrollTop() + s.height()) && i("html, body").animate({scrollTop: t - 40}, 200, "swing")
        }, b.toJSON = function(e) {
            var t = /\r?\n/g, n = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, r = /^(?:select|textarea)/i, s = e.map(function() {
                return this.elements ? i.makeArray(this.elements) : this
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || r.test(this.nodeName) || n.test(this.type))
            }).map(function(e, n) {
                var r = i(this).val();
                return r == null ? null : i.isArray(r) ? i.map(r, function(e, r) {
                    return {name: n.name,value: e.replace(t, "\r\n")}
                }) : {name: n.name,value: r.replace(t, "\r\n")}
            }).toArray(), o = {};
            return i.each(s, function() {
                o[this.name] = this.value
            }), o
        };
        var R = b.Widget = Y.extend({init: function(e, t) {
                this.el = e, this.options = t || {}, this.render()
            },render: function() {
            },reset: function() {
            },load: function(e) {
                switch (e.code) {
                    case 0:
                        c(e), this.onload(e);
                        break;
                    default:
                        this.onError(e)
                }
            },onload: function(e) {
                this.el.html($[this.tmpl].call($, e.response, i.extend(this.options, e.options)))
            },onMessage: function() {
            },onError: function(e) {
                F("\u51fa\u9519\u5566(" + e.code + "): " + e.errorMessage), e.errorTrace && F(e.errorTrace)
            }}), V = function(e) {
            var t = {"unread-comments": {title: "\u65b0\u7559\u8a00\u53ca\u56de\u590d",apiUrl: "/api/users/unreadComments",tmpl: function(e) {
                        return '<li data-thread-id="' + e.thread.thread_id + '">' + i.map(e.authors, $.userAnchor).join("\u3001") + ' \u5728 <a class="ds-read" href="' + e.thread.url + '#comments" target="_blank">' + h(e.thread.title || "\u65e0\u6807\u9898") + '</a> \u4e2d\u56de\u590d\u4e86\u4f60 <a class="ds-delete ds-read" title="\u77e5\u9053\u4e86" href="javascript:void(0)">\u77e5\u9053\u4e86</a></li>'
                    },read: function(e) {
                        var t = e.attr("data-thread-id");
                        L("/api/threads/read", {thread_id: t}), rt.data.comments--
                    }},"unread-notifications": {title: "\u7cfb\u7edf\u6d88\u606f",apiUrl: "/api/users/unreadNotifications",tmpl: function(e) {
                        return '<li data-notification-id="' + e.notification_id + '" data-notification-type="' + e.type + '">' + e.content + ' <a class="ds-delete ds-read" title="\u77e5\u9053\u4e86" href="javascript:void(0)">\u77e5\u9053\u4e86</a></li>'
                    },read: function(e) {
                        var t = e.attr("data-notification-id");
                        L("/api/notifications/read", {notification_id: t}), rt.data.notifications--
                    }}}[e], n = B("<h2>" + t.title + "</h2>" + '<ul class="ds-unread-list"></ul>');
            n.on("close", b.resetNotify);
            var r = n.el.find(".ds-unread-list").delegate(".ds-delete", "click", function(e) {
                return i(this).parent().remove(), r.children().length === 0 && n.close(), !1
            }).delegate(".ds-read", "click", function(e) {
                t.read(i(this).parent())
            });
            i("#ds-notify").hide(), k(t.apiUrl, {}, function(e) {
                n.el.find(".ds-unread-list").html(i.map(e.response, t.tmpl).join("\n"))
            }), u && u.checkPermission() && u.requestPermission(ft)
        };
        b.resetNotify = function() {
            var e = i("#ds-notify"), n = rt.data;
            e[0] || (e = i('<div id="ds-notify"></div>').css({hidden: {display: "none"},"top-right": {top: "24px",right: "24px"},"bottom-right": {bottom: "24px",right: "24px"}}[tt.data.notify_position]).delegate(".ds-notify-unread a", "click", function(e) {
                return V(i(this).data("type")), !1
            }).appendTo(t.body)), e.html('<div id="ds-reset"><a class="ds-logo" href="http://duoshuo.com/" target="_blank" title="\u591a\u8bf4"></a><ul class="ds-notify-unread"><li' + (n.comments ? "" : ' style="display:none;"') + '><a data-type="unread-comments" href="javascript:void(0);">\u4f60\u6709' + n.comments + "\u6761\u65b0\u56de\u590d</a></li><li" + (n.notifications ? "" : ' style="display:none;"') + '><a data-type="unread-notifications" href="javascript:void(0);">\u4f60\u6709' + n.notifications + "\u6761\u7cfb\u7edf\u6d88\u606f</a></li></ul></div>")[(n.comments || n.notifications) && tt.data.notify_position !== "hidden" && !i(".ds-dialog")[0] ? "show" : "hide"]()
        }, rt.on("reset", b.resetNotify), $.replybox = function(e, t) {
            var n = e.options, r = nt.data, i = [], s = "", o, u = {thread_id: e.threadId,parent_id: "",nonce: b.nonce};
            for (var a in r.repostOptions)
                r.repostOptions[a] && (i.push(a), o = 1), s += $.serviceIcon(a, !r.repostOptions[a]);
            return '<div class="ds-replybox"><a class="ds-avatar"' + (lt() ? ' href="javascript:void(0);" onclick="return false"' : ' href="' + b.REMOTE + "/settings/avatar/" + z(W()) + '" target="_blank" title="\u8bbe\u7f6e\u5934\u50cf"') + ">" + $.avatarImg(r) + "</a>" + '<form method="post">' + K(u) + '<div class="ds-textarea-wrapper ds-rounded-top">' + '<textarea name="message" title="Ctrl+Enter\u5feb\u6377\u63d0\u4ea4" placeholder="' + h(C.leave_a_message) + '"></textarea>' + '<pre class="ds-hidden-text"></pre>' + "</div>" + '<div class="ds-post-toolbar">' + '<div class="ds-post-options ds-gradient-bg">' + '<span class="ds-sync">' + (!lt() && s ? '<input id="ds-sync-checkbox' + (t ? "-inline" : "") + '" type="checkbox" name="repost" ' + (o ? 'checked="checked" ' : "") + 'value="' + i.join(",") + '"> <label for="ds-sync-checkbox' + (t ? "-inline" : "") + '">' + C.share_to + "</label>" + s : "") + "</span>" + "</div>" + '<button class="ds-post-button" type="submit">' + h(C.post) + "</button>" + '<div class="ds-toolbar-buttons">' + (n.use_smilies ? '<a class="ds-toolbar-button ds-add-emote" title="\u63d2\u5165\u8868\u60c5"></a>' : "") + (n.use_images && n.parse_html_enabled ? '<a class="ds-toolbar-button ds-add-image" title="\u63d2\u5165\u56fe\u7247"></a>' : "") + "</div>" + "</div>" + "</form>" + "</div>"
        }, P.Replybox = function(e) {
            this.embedThread = e
        }, P.Replybox.prototype = {render: function(e) {
                function x(e) {
                    e.data("submitting", !0), e.find(".ds-post-button").addClass("ds-waiting").html(C.posting)[0].disabled = !0
                }
                function T(e) {
                    e.data("submitting", !1), e.find(".ds-post-button").removeClass("ds-waiting").html(C.post)[0].disabled = !1
                }
                var n = this, r = n.embedThread, s = r.options, u = function(e) {
                    b.require("smilies", function() {
                    })
                }, a = n.el = i($.replybox(r, e)).click(u), f = a.find("form"), l = f.find("input[type=checkbox]")[0], c = f.find("a.ds-service-icon, a.ds-service-icon-grey"), p = j(f.find("textarea")).focus(u).keyup(g).keyup(A).bind("focus mousedown mouseup keyup", v), m = a.find(".ds-add-emote").click(function(e) {
                    var r = b.smiliesTooltip;
                    return m.toggleClass("ds-expanded").hasClass("ds-expanded") ? (r || (r = b.smiliesTooltip = new P.SmiliesTooltip, r.render(), b.require("smilies", function() {
                        r.reset("\u5fae\u535a-\u9ed8\u8ba4")
                    })), r.replybox = n, r.el.appendTo(t.body).css({top: n.el.offset().top + n.el.outerHeight() + 4 + "px",left: n.el.find(".ds-textarea-wrapper").offset().left + "px"}), i(t.body).click(w)) : w(e), !1
                }), y = a.find(".ds-add-image").click(function(e) {
                    var n = p[0], r = n.value, i = "\u8bf7\u8f93\u5165\u56fe\u7247\u5730\u5740", s = '<img src="' + i + '" />';
                    if (t.selection) {
                        n.value = r.substring(0, d.start) + s + r.substring(d.end, r.length), n.value = n.value.replace("\u8bf4\u70b9\u4ec0\u4e48\u5427 ...", ""), n.focus();
                        var o = t.selection.createRange();
                        o.collapse(), o.findText(i), o.select()
                    } else {
                        n.value = r.substring(0, n.selectionStart) + s + r.substring(n.selectionEnd);
                        var u = n.value.search(i);
                        n.setSelectionRange(u, u + i.length), n.focus()
                    }
                    e.preventDefault()
                }), w = n.hideSmilies = function(e) {
                    m.removeClass("ds-expanded"), b.smiliesTooltip.el.detach(), i(t.body).unbind("click", w)
                }, E = function(e, t) {
                    var n = B('<h2>\u793e\u4ea4\u5e10\u53f7\u767b\u5f55</h2><div class="ds-icons-32">' + i.map(["weibo", "qq", "renren", "kaixin", "douban", "netease", "sohu"], function(e) {
                        return '<a class="ds-' + e + '" href="' + $.loginUrl(e) + '">' + b.sourceName[e] + "</a>"
                    }).join("") + "</div>" + (s.deny_anonymous ? "" : '<h2>\u4f5c\u4e3a\u6e38\u5ba2\u7559\u8a00</h2><form><div class="ds-control-group"><input type="text" name="author_name" id="ds-dialog-name" value="' + h(nt.data.name) + '" required />' + '<label for="ds-dialog-name">\u540d\u5b57(\u5fc5\u586b)</label>' + "</div>" + (s.require_guest_email ? '<div class="ds-control-group"><input type="email" name="author_email" id="ds-dialog-email" value="' + h(nt.data.email) + '" required />' + '<label for="ds-dialog-email">\u90ae\u7bb1(\u5fc5\u586b)</label>' + "</div>" : "") + (s.require_guest_url ? '<div class="ds-control-group"><input type="url" name="author_url" id="ds-dialog-url" placeholder="http://" value="' + h(nt.data.url || "") + '" />' + '<label for="ds-dialog-url">\u7f51\u5740(\u53ef\u9009)</label>' + "</div>" : "") + '<button type="submit">\u53d1\u5e03</button>' + "</form>")), r = n.el.find(".ds-dialog").css("width", "320px");
                    M(r, ".ds-icons-32 a");
                    if (!s.deny_anonymous) {
                        var o = n.el.find("form");
                        o.submit(function(e) {
                            var r = o.find("input[name=author_email]").val();
                            return (r || s.require_guest_email) && !r.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ? (alert("\u8bf7\u8f93\u5165\u4e00\u4e2a\u6709\u6548\u7684email\u5730\u5740."), !1) : (t(b.toJSON(o)), n.close(), !1)
                        }), o.find("input[name=author_name]")[0].focus()
                    }
                };
                s.deny_anonymous && p.focus(function(e) {
                    if (lt()) {
                        E(f, N);
                        var t = function(e) {
                            e.stopPropagation(), p.unbind("click", t)
                        };
                        p.click(t)
                    }
                    return !1
                });
                var N = function(e) {
                    x(f), L("/api/posts/create", i.extend(b.toJSON(f), e), function(e) {
                        var t = e.response, i = dt(n.postList, t, s);
                        s.order == "asc" == (s.formPosition == "top") && b.scrollTo(i), st[t.post_id] = new Z(t), r.data.comments++, r.updateCounter("duoshuo"), p.val("").trigger("keyup"), T(f), a.hasClass("ds-inline-replybox") && (a.detach(), n.actionsBar.removeClass("ds-reply-active"));
                        if (o)
                            try {
                                o.removeItem("ds_draft_" + r.threadId)
                            } catch (u) {
                            }
                    }, function(e) {
                        T(f), alert(e.errorMessage)
                    })
                };
                f.submit(function(e) {
                    if (f.data("submitting"))
                        return !1;
                    var t = i.trim(f[0].message.value);
                    return t == "" || !S.placeholder && t == p.attr("placeholder") ? (alert("\u60a8\u8fd8\u6ca1\u5199\u5185\u5bb9\u5462"), !1) : (lt() ? E(f, N) : N(), !1)
                });
                var k = function(e) {
                    return i(e).hasClass("ds-service-icon-grey") ? null : i(e).attr("data-service")
                };
                return c.click(function() {
                    return i(this).toggleClass("ds-service-icon-grey").toggleClass("ds-service-icon"), l.value = i.map(c, k).join(","), l.checked = l.value != "", !1
                }), i(l).change(function() {
                    var e = this.checked;
                    c[e ? "removeClass" : "addClass"]("ds-service-icon-grey"
                    )[e ? "addClass" : "removeClass"]("ds-service-icon"), this.value = i.map(c, k).join(",")
                }), this
            }}, P.Dialog = Y.extend({init: function(e, t) {
                (this.el = i("#ds-wrapper"))[0] || (this.el = H(i('<div id="ds-wrapper"></div>'))), this.options = i.extend({width: 600}, t), e !== n && i(e).attr("id", "ds-reset").appendTo(this.el)
            },open: function() {
                var e = this;
                e.el.hide().appendTo(t.body).fadeIn(200), E && e.el.css("top", s.scrollTop() + 100), e.el.show().find(".ds-dialog").delegate("a.ds-dialog-close", "click", function(t) {
                    return e.close(), !1
                }).click(m);
                var n = function(t) {
                    if (t.which == 27)
                        return e.close(), !1
                }, r = function(t) {
                    return e.close(), !1
                };
                return a.keydown(n), i(t.body).click(r), e.close = function(s) {
                    a.unbind("keydown", n), i(t.body).unbind("click", r), e.el.fadeOut(200, function() {
                        i(this).remove()
                    }), e.trigger("close")
                }, e
            }}), $.likePanel = function(e) {
            return e.likes ? '<span class="ds-highlight">' + e.likes + "</span> \u4eba\u559c\u6b22" : ""
        }, $.likeTooltip = function(e) {
            var t = {qzone: "QQ\u7a7a\u95f4",weibo: "\u65b0\u6d6a\u5fae\u535a",qqt: "\u817e\u8baf\u5fae\u535a",renren: "\u4eba\u4eba\u7f51",kaixin: "\u5f00\u5fc3\u7f51",douban: "\u8c46\u74e3\u7f51",baidu: "\u767e\u5ea6\u641c\u85cf",netease: "\u7f51\u6613\u5fae\u535a",sohu: "\u641c\u72d0\u5fae\u535a"}, n = [];
            for (var r in t)
                n.push('<li><a class="ds-share-to-' + r + " ds-service-link ds-" + r + '" href="' + b.hostUrl + "/share-proxy/?" + b.param({service: r,thread_id: e.thread_id}) + '">' + t[r] + "</a></li>");
            var i = Math.ceil(n.length / 2);
            return '<div class="ds-like-tooltip ds-rounded"><p>\u5f88\u9ad8\u5174\u4f60\u80fd\u559c\u6b22\uff0c\u5206\u4eab\u4e00\u4e0b\u5427\uff1a</p><ul>' + n.slice(0, i).join("") + "</ul><ul>" + n.slice(i).join("") + '</ul><p class="ds-like-tooltip-footer"><a class="ds-like-tooltip-close">\u7b97\u4e86</a></p></div>'
        }, P.Meta = function(e) {
            this.embedThread = e
        }, P.Meta.prototype = {render: function() {
                var r = this, s = r.embedThread, o = s.data, u = r.el = i('<div class="ds-meta"><a href="javascript:void(0)" class="ds-like-thread-button ds-rounded' + (o.user_vote > 0 ? " ds-thread-liked" : "") + '"><span class="ds-icon ds-icon-heart"></span>' + ' <span class="ds-thread-like-text">' + (o.user_vote > 0 ? "\u5df2\u559c\u6b22" : "\u559c\u6b22") + '</span><span class="ds-thread-cancel-like">\u53d6\u6d88\u559c\u6b22</span></a><span class="ds-like-panel"></span></div>'), a = u.find(".ds-like-thread-button").click(function(f) {
                    var l = a.hasClass("ds-thread-liked");
                    L("/api/threads/vote", {thread_id: s.threadId,vote: l ? 0 : 1}, function(e) {
                        i.each(e.response.thread, function(e, t) {
                            o[e] = t
                        }), r.resetLikePanel()
                    }), a.toggleClass("ds-thread-liked"), a.find(".ds-thread-like-text").text(l ? "\u559c\u6b22" : "\u5df2\u559c\u6b22");
                    var c = function(e) {
                        r.tooltip.detach(), i(t.body).unbind("click", c)
                    };
                    return l ? r.tooltip && c(f) : (r.tooltip === n && (r.tooltip = i($.likeTooltip(o)).click(m).delegate("a", "click", function(t) {
                        switch (this.className) {
                            case "ds-like-tooltip-close":
                                c(t);
                                break;
                            default:
                                if (!e.open(this.href, "_blank", "height=500,width=600,top=0,left=0,toolbar=no,menubar=no,resizable=yes,location=yes,status=no"))
                                    return
                        }
                        return !1
                    })), r.tooltip.appendTo(s.innerEl).css({top: u.position().top + u.outerHeight() - 4 + "px",left: 0}), i(t.body).click(c)), !1
                });
                return r.resetLikePanel(), lt() && u.hide(), r
            },resetLikePanel: function() {
                this.el.find(".ds-like-panel").html($.likePanel(this.embedThread.data))
            }}, $.postListHead = function(e) {
            var t = e.data, n = e.options;
            return '<div class="ds-comments-info"><div class="ds-sort"><a class="ds-order-desc">' + C.latest + '</a><a class="ds-order-asc">' + C.earliest + '</a><a class="ds-order-hot">' + C.hottest + '</a></div><ul class="ds-comments-tabs"><li class="ds-tab"><a class="ds-comments-tab-duoshuo ds-current" href="javascript:void(0);"></a></li>' + (n.show_reposts && t.reposts ? '<li class="ds-tab"><a class="ds-comments-tab-repost" href="javascript:void(0);"></a></li>' : "") + (n.show_weibo && t.weibo_reposts ? '<li class="ds-tab"><a class="ds-comments-tab-weibo" href="javascript:void(0);"></a></li>' : "") + (n.show_qqt && t.qqt_reposts ? '<li class="ds-tab"><a class="ds-comments-tab-qqt" href="javascript:void(0);"></a></li>' : "") + "</ul>" + "</div>"
        }, P.PostListHead = function(e) {
            this.embedThread = e
        }, P.PostListHead.prototype = {render: function() {
                var e = this.embedThread, t = e.options, n = e.postList, r = this.el = i($.postListHead(e)), s = r.find("ul.ds-comments-tabs").delegate(".ds-tab a", "click", function(t) {
                    s.find("a.ds-current").removeClass("ds-current"), n.params.page = 1;
                    var r = t.currentTarget;
                    switch (r.className) {
                        case "ds-comments-tab-duoshuo":
                            n.params.source = "duoshuo", e.replybox.el.show();
                            break;
                        case "ds-comments-tab-repost":
                            n.params.source = "repost", e.replybox.el.hide();
                            break;
                        case "ds-comments-tab-weibo":
                            n.params.source = "weibo", e.replybox.el.hide();
                            break;
                        case "ds-comments-tab-qqt":
                            n.params.source = "qqt", e.replybox.el.hide();
                            break;
                        default:
                    }
                    return i(r).addClass("ds-current"), n.refetch(), !1
                }), o = r.find(".ds-sort").delegate("a", "click", function(e) {
                    return o.find("a.ds-current").removeClass("ds-current"), n.params.order = t.order = this.className.replace("ds-order-", ""), n.params.page = 1, n.refetch(), i(this).addClass("ds-current"), !1
                });
                return o.find(".ds-order-" + n.params.order).addClass("ds-current"), this
            }}, P.Paginator = function(e) {
            e = e || {};
            var t = this, n = t.el = e.el || i('<div class="ds-paginator"></div>'), r = t.collection = e.collection;
            n.delegate("a", "click", function(e) {
                return r.params.page = parseInt(this.innerHTML), r.refetch(), n.find(".ds-current").removeClass("ds-current"), i(this).addClass("ds-current"), !1
            })
        }, P.Paginator.prototype = {reset: function(e) {
                function i(e) {
                    r.push('<a data-page="' + e + '" href="javascript:void(0);">' + e + "</a>")
                }
                var t = this.collection.params.page || 1, n, r = [];
                if (t > 1) {
                    i(1), n = t > 4 ? t - 2 : 2, n > 2 && r.push('<span class="page-break">...</span>');
                    for (; n < t; n++)
                        i(n)
                }
                r.push('<a data-page="' + t + '" href="javascript:void(0);" class="ds-current">' + t + "</a>");
                if (t < e.pages) {
                    for (n = t + 1; n <= t + 4 && n < e.pages; n++)
                        i(n);
                    n < e.pages && r.push('<span class="page-break">...</span>'), i(e.pages)
                }
                this.el.html('<div class="ds-border"></div>' + r.join(" "))[e.pages > 1 ? "show" : "hide"]()
            }}, 












            $.smiliesTooltip = function(e) {
            var t = '<div id="ds-smilies-tooltip"><ul class="ds-smilies-tabs">';
            for (var n in e)
                t += "<li><a>" + n + "</a></li>";
            return t + '</ul><div class="ds-smilies-container"></div></div>'
        }, b.addSmilies = function(e, t) {
            var n = b.smiliesTooltip;
            n && n.el.find("ul.ds-smilies-tabs").append("<li><a>" + e + "</a></li>"), b.smilies[e] = t
        }, P.SmiliesTooltip = function() {
        }, P.SmiliesTooltip.prototype = {render: function() {
                var e = this, n = e.el = i($.smiliesTooltip(I));
                return n.click(m).find("ul.ds-smilies-tabs").delegate("a", "click", function(t) {
                    e.reset(this.innerHTML)
                }), n.find(".ds-smilies-container").delegate("img", "click", function(n) {
                    var r = e.replybox, i = r.el.find("textarea")[0], s = i.value;
                    if (t.selection) {
                        i.value = s.substring(0, d.start) + this.title + s.substring(d.end, s.length), i.value = i.value.replace(C.leave_a_message, ""), i.focus();
                        var o = t.selection.createRange();
                        o.moveStart("character", d.start + this.title.length), o.collapse(), o.select()
                    } else {
                        var u = i.selectionStart + this.title.length;
                        i.value = s.substring(0, i.selectionStart) + this.title + s.substring(i.selectionEnd), i.setSelectionRange(u, u)
                    }
                    r.hideSmilies(), i.focus()
                }), this
            },reset: function(e) {
                var t = this.el.find("ul.ds-smilies-tabs");
                t.find("a.ds-current").removeClass("ds-current"), t.find("a").filter(function() {
                    return this.innerHTML == e
                }).addClass("ds-current");
                var n = "<ul>";
                return i.each(I[e], function(t, r) {
                    var i = e.indexOf("\u5fae\u535a") === 0 ? "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/" + r.replace("_org", "_thumb") : y + "/images/smilies/" + r;
                    e === "WordPress" && (t = " " + t + " "), n += '<li><img src="' + i + '" title="' + h(t) + '" /></li>'
                }), n += "</ul>", this.el.find(".ds-smilies-container").html(n), this
            }}, 







            $.postPlaceholder = function() {
            return '<li class="ds-post ds-post-placeholder">' + C.no_comments_yet + "</li>"
        }, 










        $.post = function(e, t) {
            var n = J(e), r = n.user_id ? ' data-user-id="' + n.user_id + '"' : "", s = n.qqt_account || "", o = $.timeHtml(e.created_at, e.url), u = e.parents || [];
            switch (e.source) {
                case "duoshuo":
                    o += '<a class="ds-post-reply" href="javascript:void(0);"><span class="ds-icon ds-icon-reply"></span>' + C.reply + "</a>" + $.likePost(e) + '<a class="ds-post-repost" href="javascript:void(0);"><span class="ds-icon ds-icon-share"></span>' + C.repost + "</a>" + '<a class="ds-post-report" href="javascript:void(0);"><span class="ds-icon ds-icon-report"></span>' + C.report + "</a>" + (e.privileges["delete"] ? '<a class="ds-post-delete" href="javascript:void(0);"><span class="ds-icon ds-icon-delete"></span>' + C["delete"] + "</a>" : "");
                    break;
                case "qqt":
                case "weibo":
                    o += '<a class="ds-weibo-comments" href="javascript:void(0);">' + C.comments + (e.type.match(/\-comment$/) ? "" : '(<span class="ds-count">' + e.comments + "</span>)") + "</a>" + '<a class="ds-weibo-reposts" href="javascript:void(0);">' + C.reposts + (e.type.match(/\-comment$/) ? "" : '(<span class="ds-count">' + e.reposts + "</span>)") + "</a>";
                    break;
                default:
            }
            return '<li class="ds-post" data-post-id="' + e.post_id + '"><div class="ds-post-self" data-post-id="' + e.post_id + '" data-thread-id="' + e.thread_id + '" data-root-id="' + e.root_id + '" data-source="' + e.source + '"><div class="ds-avatar"' + r + ">" + $.avatar(n) + (b.sourceName[e.source] ? $.serviceIcon(e.source) : "") + '</div><div class="ds-comment-body"><div class="ds-comment-header">' + (n.url ? '<a class="ds-user-name ds-highlight" data-qqt-account="' + s + '" href="' + h(n.url) + '" ' + (n.user_id ? " onclick=\"this.href='" + b.hostUrl + "/user-url/?user_id=" + n.user_id + "';\"" : "") + ' rel="nofollow" target="_blank"' + r + ">" + h(n.name) + "</a>" : '<span class="ds-user-name"' + r + ' data-qqt-account="' + s + '">' + h(n.name) + "</span>") + "</div>" + (t.max_depth == 1 && t.show_context && u.length ? '<ol id="ds-ctx">' + i.map(u, function(e, t) {
                return (t == 1 && u.length > 2 ? '<li class="ds-ctx-entry"><a href="javascript:void(0);" class="ds-expand">\u8fd8\u6709' + (u.length - 2) + "\u6761\u8bc4\u8bba</a></li>" : "") + (st[e] ? $.ctxPost(st[e].data, t, t && t < u.length - 1) : "")
            }).join("") + "</ol>" : "") + "<p>" + (u.length >= t.max_depth && (!t.show_context || t.max_depth > 1) && e.parent_id && st[e.parent_id] ? '<a class="ds-comment-context" data-post-id="' + e.post_id + '" data-parent-id="' + e.parent_id + '">' + C.reply_to + h(J(st[e.parent_id].data).name) + ": </a>" : "") + e.message + '</p><div class="ds-comment-footer ds-comment-actions' + (e.vote > 0 ? " ds-post-liked" : "") + '">' + o + "</div></div></div>" + (t.max_depth > 1 && (e.childrenArray || e.children) && e.source != "weibo" && e.source != "qqt" ? '<ul class="ds-children">' + i.map(e.childrenArray || e.children, function(e) {
                return st[e] ? $.post(st[e].data, t) : ""
            }).join("") + "</ul>" : "") + "</li>"
        };
        var Q = i('<div id="ds-bubble"><div class="ds-bubble-content"></div><div class="ds-arrow ds-arrow-down ds-arrow-border"></div><div class="ds-arrow ds-arrow-down"></div></div>'), G = Q.find(".ds-bubble-content").delegate("a.ds-ctx-open", "click", function(e) {
            k("/api/posts/conversation", {post_id: G.attr("data-post-id")}, function(e) {
                t.el.find("ol").html(i.map(e.response, $.ctxPost).join("\n"))
            });
            var t = B('<h2>\u67e5\u770b\u5bf9\u8bdd</h2><ol id="ds-ctx"></ol>');
            return t.el.find(".ds-dialog").css("width", "600px"), t.el.find(".ds-dialog-body").css({"max-height": "350px",_height: "350px","overflow-y": "auto","padding-top": "10px"}), !1
        }), et = bubbleOutTimer = 0, pt = function() {
            bubbleOutTimer && (clearTimeout(bubbleOutTimer), bubbleOutTimer = 0)
        };
        bubbleOut = function() {
            bubbleOutTimer = setTimeout(function() {
                bubbleOutTimer = 0, Q.detach()
            }, 400)
        }, Q.mouseenter(pt).mouseleave(bubbleOut), $.userInfo = function(e) {
            var t = [];
            return i.each(e.social_uid, function(e, n) {
                t.push('<a href="' + b.REMOTE + "/user-proxy/" + e + "/" + n + '/" target="_blank" class="ds-service-icon ds-' + e + '" title="' + b.sourceName[e] + '"></a>')
            }), '<a href="' + h(e.url) + '" class="ds-avatar" target="_blank">' + $.avatarImg(e) + '</a><a href="' + h(e.url) + '" class="ds-user-name ds-highlight" target="_blank">' + h(e.name) + "</a>" + t.join("") + '<p class="ds-user-card-meta"><a href="' + b.REMOTE + "/profile/" + e.user_id + '/" target="_blank"><span class="ds-highlight">' + e.comments + "</span>\u6761\u8bc4\u8bba</a></p>" + (e.description ? '<p class="ds-user-description">' + h(e.description) + "</p>" : "")
        }, D.PostList = function(e) {
            e && (e.params && (this.params = e.params), e.embedThread && (this.embedThread = e.embedThread)), this.el = i('<ul class="ds-comments"></ul>')
        }, D.PostList.prototype = {url: "/api/threads/listPosts",render: function() {
                return vt.call(this.el, this.embedThread, this.embedThread.options), this
            },reset: function(e) {
                var t = this.embedThread.options;
                this.el.html(e[0] ? i.map(e, function(e) {
                    return st[e] ? $.post(st[e].data, t) : ""
                }).join("") : $.postPlaceholder())
            },refetch: function() {
                var e = this, n = i($.indicator()).appendTo(t.body).fadeIn(200);
                e.el.fadeTo(200, .5), k(e.url, e.params, function(t) {
                    ut(st, t.parentPosts || t.relatedPosts), ut(ot, t.users), e.reset(t.response), e.embedThread.paginator.reset(t.cursor), e.el.fadeTo(200, 1), b.scrollTo(e.el), n.remove()
                })
            }}, b.repostDialog = function(e, t, n, r) {
            var i = B('<h2>\u8f6c\u53d1\u5230\u5fae\u535a</h2><div class="ds-quote"><strong>@' + h(J(e.data).name) + "</strong>: " + e.data.message + "</div>" + "<form>" + K({post_id: e.data.post_id}) + '<div class="ds-textarea-wrapper">' + '<textarea name="message" title="Ctrl+Enter\u5feb\u6377\u63d0\u4ea4" placeholder="' + h(C.repost_reason) + '">' + h(t) + "</textarea>" + '<pre class="ds-hidden-text"></pre>' + "</div>" + '<div class="ds-actions">' + (r ? K({"service[]": r}) : '<label><input type="checkbox" name="service[]" value="weibo"' + (nt.data.social_uid.weibo ? ' checked="checked"' : "") + ' /><span class="ds-service-icon ds-weibo"></span>\u65b0\u6d6a\u5fae\u535a</label>  ' + '<label><input type="checkbox" name="service[]" value="qqt"' + (nt.data.social_uid.qq ? ' checked="checked"' : "") + ' /><span class="ds-service-icon ds-qqt"></span>\u817e\u8baf\u5fae\u535a</label>') + '<button type="submit">' + C.repost + "</button>" + "</div>" + "</form>"), s = i.el.find("form").submit(function(e) {
                return !r && !s.find("[type=checkbox]:checked")[0] ? (alert("\u8fd8\u6ca1\u6709\u9009\u53d1\u5e03\u5230\u54ea\u513f\u5462"), !1) : (L("/api/posts/repost", b.toJSON(s), function(e) {
                    if (n && r) {
                        var t = n.options, i = dt(n.postList.el, e.response[r], t);
                        t.order == "asc" == (t.formPosition == "top") && b.scrollTo(i);
                        var s = n.el.find(".ds-comments-tab-" + r + " span.ds-highlight");
                        s.html(parseInt(s.html()) + 1)
                    }
                }), i.close(), !1)
            });
            return s.find(".ds-actions [type=checkbox]").change(function(e) {
                var t = this.value;
                if (this.checked && !nt.data.social_uid[t == "qqt" ? "qq" : t]) {
                    mt(t);
                    return
                }
            }), j(s.find("textarea")).keyup(g).keyup(A).focus(), !1
        }, $.toolbar = function(e) {
            var t = $.logoutUrl();
            return '<div class="ds-toolbar"><div class="ds-account-control"><span class="ds-icon ds-icon-settings"></span> <span>\u5e10\u53f7\u7ba1\u7406</span><ul><li><a class="ds-bind-more" href="javascript:void(0);" style="border-top: none">\u7ed1\u5b9a\u66f4\u591a</a></li><li><a target="_blank" href="' + b.REMOTE + "/settings/" + z(W()) + '">' + h(C.settings) + "</a></li>" + '<li><a rel="nofollow" href="' + t + '" style="border-bottom: none">\u767b\u51fa</a></li>' + "</ul>" + "</div>" + '<div class="ds-visitor">' + (nt.data.url ? '<a class="ds-visitor-name" href="' + h(nt.data.url) + '" target="_blank">' + h(nt.data.name) + "</a>" : '<span class="ds-visitor-name">' + h(nt.data.name) + "</span>") + '<a class="ds-unread-comments-count" href="javascript:void(0);" title="\u65b0\u56de\u590d"></a>' + "</div>" + "</div>"
        }, P.EmbedThread = R.extend({uri: "/api/threads/listPosts",params: "thread-id local-thread-id source-thread-id thread-key category channel-key author-key author-id url limit order max-depth form-position container-url" + (f.match(/MSIE 6\.0/) ? "" : " title image thumbnail"),render: function() {
                var e = this.el.attr("id", "ds-thread").append($.waitingImg()), t = e.width(), n = e.data("url") || !e.attr("data-thread-id") && i("link[rel=canonical]").attr("href");
                n ? e.data("url", p(n)) : e.data("container-url", r.href), t && t <= 400 && e.addClass("ds-narrow").data("max-depth", 1)
            },updateCounter: function(e) {
                var t = {duoshuo: ["comments", "\u8bc4\u8bba"],repost: ["reposts", "\u8f6c\u8f7d"],weibo: ["weibo_reposts", "\u65b0\u6d6a\u5fae\u535a"],qqt: ["qqt_reposts", "\u817e\u8baf\u5fae\u535a"]};
                for (var n in t)
                    if (!e || e == n) {
                        var r = this.data[t[n][0]];
                        this.el.find(".ds-comments-tab-" + n).html(this.el.hasClass("ds-narrow") ? '<span class="ds-service-icon ds-' + n + '"></span>' + r : (r ? '<span class="ds-highlight">' + r + "</span>\u6761" : "") + t[n][1])
                    }
            },onError: function(e) {
                this.el.html("\u8bc4\u8bba\u6846\u51fa\u9519\u5566(" + e.code + "): " + e.errorMessage)
            },onload: function(t) {
                var r = this, s = r.threadId = t.thread.thread_id, u = t.cursor, a = r.options = t.options, f = r.innerEl = H(i('<div id="ds-reset"></div>').appendTo(r.el));
                r.data = t.thread, ut(st, t.parentPosts || t.relatedPosts), ut(ot, t.users), r.el.find("#ds-waiting").remove(), a.like_thread_enabled && (r.meta = new P.Meta(r), r.meta.render().el.appendTo(f)), a.hot_posts && t.hotPosts && t.hotPosts.length && (r.hotPosts = new P.HotPosts(i('<div class="ds-rounded"></div>'), {max_depth: 1,show_context: a.show_context}), r.hotPosts.thread = r, r.hotPosts.el.appendTo(f), r.hotPosts.onload({response: t.hotPosts,options: {}})), r.postListHead = new P.PostListHead(r), r.postList = new D.PostList({embedThread: r,params: {source: "duoshuo",thread_id: s,max_depth: a.max_depth,order: a.order,limit: a.limit}}), r.postList.render().reset(t.response), r.paginator = new P.Paginator({collection: r.postList}), r.paginator.reset(u);
                var l = r.replybox = new P.Replybox(r), c = l.render().el.find("textarea");
                l.postList = r.postList.el;
                if (o) {
                    var h = "ds_draft_" + s;
                    c.bind("focus blur keyup", function(e) {
                        var t = i(e.currentTarget).val();
                        try {
                            o[h] = t
                        } catch (e) {
                        }
                    }), o[h] && c.val(o[h])
                }
                if (lt()) {
                    var p = i($.loginButtons()).delegate("a.ds-more-services", "click", function() {
                        return p.find(".ds-additional-services").toggle(), !1
                    });
                    M(p)
                } else
                    r.toolbar = i($.toolbar()).delegate(".ds-account-control", "mouseenter", function() {
                        i(this).addClass("ds-active")
                    }).delegate(".ds-account-control", "mouseleave", function() {
                        i(this).removeClass("ds-active")
                    }).delegate("a.ds-bind-more", "click", function() {
                        var e = B("<h2>\u7ed1\u5b9a\u66f4\u591a\u5e10\u53f7</h2>" + $.serviceList(1) + $.additionalServices(1) + '<div style="clear:both"></div>').el.find(".ds-dialog").addClass("ds-dialog-bind-more").css("width", "300px");
                        return M(e), !1
                    }).delegate("a.ds-unread-comments-count", "click", function(e) {
                        return V("unread-comments"), !1
                    });
                r.postListHead.render().el.appendTo(f)[a.formPosition == "top" ? "before" : "after"]('<a name="respond"></a>', r.toolbar || p, l.el).after(r.postList.el, r.paginator.el), r.updateCounter(), t.alerts && i.each(t.alerts, function(e, t) {
                    i('<div class="ds-alert">' + t + "</div>").insertBefore(r.toolbar || p)
                }), a.message && c.val(a.message).focus(), i($.poweredBy(a.poweredby_text)).appendTo(f), rt.on("reset", function() {
                    var e = rt.data.comments || 0;
                    f.find("a.ds-unread-comments-count").html(e).attr("title", e ? "\u4f60\u6709" + e + "\u6761\u65b0\u56de\u590d" : "\u4f60\u6ca1\u6709\u65b0\u56de\u590d").css("display", e ? "inline" : "none")
                }), a.mzadx_id && (b.require("mzadxN", function() {
                }), i('<div id="MZADX_' + a.mzadx_id + '" style="margin:0 auto;"></div>').appendTo(f), __mz_rpq = e.__mz_rpq || [], __mz_rpq.push({l: [a.mzadx_id],r: "1",_srv: "MZADX",_callback: function(e, t) {
                    }})), b.thread = r, rt.data !== n && rt.trigger("reset"), lt() || _({visit_thread_id: r.threadId})
            },onMessage: function(e) {
                dt(this.postList.el, e, this.options)
            }}), $.hotPosts = function(e, t) {
            return '<div class="ds-header ds-gradient-bg">' + C.hot_posts_title + "</div><ul>" + i.map(e, function(e) {
                return st[e] ? $.post(st[e].data, t) : ""
            }).join("") + "</ul>"
        }, P.HotPosts = R.extend({params: "show-quote",tmpl: "hotPosts",render: function() {
                return this.el.attr("id", "ds-hot-posts"), this
            },onload: function(e) {
                R.prototype.onload.call(this, e), vt.call(this.el.find("ul"), this.thread, this.options)
            }}), $.commentList = function(e, t) {
            return i.map(e, function(e) {
                var n = J(e);
                return '<li class="ds-comment' + (t.show_avatars ? " ds-show-avatars" : "") + '" data-post-id="' + e.post_id + '">' + (t.show_avatars ? '<div class="ds-avatar">' + $.avatar(n, t.avatar_size) + "</div>" : "") + '<div class="ds-meta">' + $.userAnchor(n) + (t.show_time ? $.timeHtml(e.created_at) : "") + "</div>" + (t.show_title ? '<div class="ds-thread-title">\u5728 <a href="' + h(e.thread.url + "#comments") + '">' + h(e.thread.title) + '</a> \u4e2d\u8bc4\u8bba</div><div class="ds-excerpt">' + e.message + "</div>" : '<a class="ds-excerpt" title="' + h(e.thread.title) + ' \u4e2d\u7684\u8bc4\u8bba" href="' + h(e.thread.url + "#comments") + '">' + e.message + "</a>") + "</li>"
            }).join("")
        }, P.RecentComments = R.extend({uri: "/api/sites/listRecentPosts",params: "show-avatars show-time show-title avatar-size show-admin excerpt-length num-items channel-key",tmpl: "commentList",render: function() {
                this.el.attr("id", "ds-recent-comments")
            }}), $.recentVisitors = function(e, t) {
            return i.map(e, function(e) {
                return '<div class="ds-avatar">' + $.avatar(e, t.avatar_size) + "</div>"
            }).join("")
        }, P.RecentVisitors = R.extend({uri: "/api/sites/listVisitors",params: "show-time avatar-size num-items channel-key",tmpl: "recentVisitors",render: function() {
                this.el.children().detach(), this.el.attr("id", "ds-recent-visitors").append(this.waitingEl = i($.waitingImg()))
            }}), $.topUsers = function(e, t) {
            return i.map(e, function(e) {
                return '<div class="ds-avatar">' + $.avatar(e, t.avatar_size) + "<h4>" + e.name + "</h4>" + "</div>"
            }).join("")
        }, P.TopUsers = R.extend({uri: "/api/sites/listTopUsers",params: "show-time avatar-size num-items channel-key",tmpl: "topUsers",render: function() {
                this.el.children().detach(), this.el.attr("id", "ds-top-users").append(this.waitingEl = i($.waitingImg()))
            }}), $.topThreads = function(e, t) {
            return i.map(e, function(e) {
                return '<li><a target="_blank" href="' + h(e.url) + '" title="' + e.title + '">' + e.title + "</a>" + "</li>"
            }).join("")
        }, P.TopThreads = R.extend({uri: "/api/sites/listTopThreads",params: "range num-items channel-key",tmpl: "topThreads",render: function() {
                this.el.children().detach(), this.el.attr("id", "ds-top-threads").append(this.waitingEl = i($.waitingImg()))
            }}), $.loginWidget = function() {
            var e = '<div class="ds-icons-32">';
            return i.each(["weibo", "qq", "renren", "kaixin", "douban", "netease", "sohu"], function(t, n) {
                e += '<a class="ds-' + n + '" href="' + $.loginUrl(n) + '">' + b.sourceName[n] + "</a>"
            }), e + "</div>"
        }, P.LoginWidget = R.extend({tmpl: "loginWidget",render: function() {
                var e = this.el;
                e.attr("id", "ds-login").html($.loginWidget()), M(e, "a"), e.find("a.ds-logout").attr("href", $.logoutUrl())
            }}), P.ThreadCount = R.extend({onload: function(e) {
                var t = this.el, n = t.data("count-type") || "comments", r = e.data[n];
                t[t.data("replace") ? "replaceWith" : "html"](C[n + "_" + (r ? r > 1 ? "multiple" : "one" : "zero")].replace("{num}", r))
            }});
        var yt = 0;
        b.initSelector = function(e, t) {
            var n = [];
            X() && (i.isReady || !w) && i(e).each(function(e, r) {
                var s = i(r);
                if (s.data("initialized"))
                    return;
                s.data("initialized", !0);
                var o = new P[t.type](s, t);
                N.push(o);
                if (t.type === "ThreadCount") {
                    var u = s.attr("data-thread-key");
                    s.attr("data-channel-key") && (u = s.attr("data-channel-key") + ":" + u), n.push(u), it[u] || (it[u] = new Z({})), it[u].on("reset", function() {
                        o.onload(this)
                    })
                } else if (o.uri) {
                    var a = {};
                    i.each(o.params.split(" "), function(e, t) {
                        a[t.replace(/-/g, "_")] = s.attr("data-" + t) || s.data(t)
                    }), k(o.uri, bt(a), function(e) {
                        o.load(e)
                    })
                }
            }), n.length && k("/api/threads/counts", bt({threads: n.join(",")}), function(e) {
                c(e), at(C, e.options), ut(it, e.response)
            })
        }, (b.initView = function() {
            i.each(T, b.initSelector)
        })(), i(function() {
            if (!X())
                return F("\u7f3a\u5c11duoshuoQuery\u7684\u5b9a\u4e49");
            setInterval(function() {
                i(".ds-time").each(function() {
                    var e = i(this).attr("datetime");
                    e && (this.innerHTML = b.elapsedTime(e))
                })
            }, 2e4), U.ondomready && U.ondomready(), b.initView(), !yt && U.short_name && k("/api/analytics/ping", bt({}), c)
        })
    })
})(window, document);
