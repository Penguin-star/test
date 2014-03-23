/**
 * v-js框架是一个微型JavaScript框架.
 * http://www.vohyo.com
 * Copyright 2011, YongWang
 * Released under the MIT, BSD, and GPL Licenses.
 * v@vohyo.com
 * author: vohyo
 * version: 2012-6-14 v1.4.1
 * **********************************
 * 注意，度量单位为px，body为浏览可视区
 */

(function (win) {

    win.v || (function v(doc) {
        var _this = this, v = function (q) {return _this.$(q);};
        var gDiv = doc.createElement('div'), gCano = typeof (gDiv.style.opacity) == 'string';
        var rQuery = /(?:^([#\.]?)([\w-]*?))(?:\[([\w-]+)(?:=['"]([^'"]+)['"])?\])?(?:\.([\w-]+))?$/;
        var rAlpha = /alpha\s*\(\s*opacity\s*=\s*(\d+)\s*\)/i;

        // element对象
        this.elexts = {};
        this.elements = {
            addEvent: function (type, fn, ctx) {
                var types = typeof (type) == 'string' ? type.split(',') : type, i = 0, fe, fs, nfn, _ctx = this;ctx = ctx || this;
                while (type = types[i++]) {
                    type = type.trim();fe = 'e' + type;fs = this[fe] || (this[fe] = [[], []]);
                    if (fs[0].indexOf(fn) < 0) {
                        if (type == 'enter') this.addEvent('keyup', (nfn = function (event) {event.keyCode != 13 || fn.call(ctx, event, _ctx);}));
                        else if (type == 'mouseenter') this.addEvent('mouseover', (nfn = function (event) {var related = event.relatedTarget || event.fromElement;this.contains(related) || fn.call(ctx, event, _ctx);}));
                        else if (type == 'mouseleave') this.addEvent('mouseout', (nfn = function (event) {var related = event.relatedTarget || event.toElement;this.contains(related) || fn.call(ctx, event, _ctx);}));
                        else {
                            nfn = function (event) {
                                event = event || win.event;
                                event.stop || _this.extend(event, _this.events);
                                fn.call(ctx, event.fix(), _ctx);
                            }
                            if (this.addEventListener) this.addEventListener(type, nfn, false); else this.attachEvent('on' + type, nfn);
                        }
                        fs[0].push(fn);fs[1].push(nfn);
                    }
                }
                return this;
            },
            rmvEvent: function (type, fn) {
                var types = typeof (type) == 'string' ? type.split(',') : type, i = 0, j, fe, fs;
                while (type = types[i++]) {
                    type = type.trim();fe = 'e' + type;fs = this[fe];
                    if (fs && (j = fs[0].indexOf(fn)) >= 0) {
                        if (type == 'enter') this.rmvEvent('keyup', fs[1][j]);
                        else if (type == 'mouseenter') this.rmvEvent('mouseover', fs[1][j]);
                        else if (type == 'mouseleave') this.rmvEvent('mouseout', fs[1][j]);
                        else if (this.removeEventListener) this.removeEventListener(type, fs[1][j], false);
                        else this.detachEvent('on' + type, fs[1][j]);
                        fs[0][j] = fs[1][j] = undefined;
                    }
                }
                return this;
            },
            hasClass: function (cls) {
                return (' ' + this.className + ' ').indexOf(' ' + cls + ' ') > -1;
            },
            addClass: function (cls) {
                this.hasClass(cls) || (this.className = (this.className + ' ' + cls).trim());
                return this;
            },
            rmvClass: function (cls) {
                this.className = (' ' + this.className + ' ').replace(' ' + cls + ' ', ' ').trim();
                return this;
            },
            css: function (css, value) {
                if (typeof (css) == 'string') {
                    if (value === undefined) {
                        if (!(value = this.style[css]) && css == 'opacity' && !gCano && (value = rAlpha.exec(this.style.filter))) value = value[1] / 100;
                        return value;
                    } else css = _this.extend(css, value);
                }
                if (css.opacity !== undefined && !gCano) {
                    var filter = this.style.filter;value = 'alpha(opacity=' + Math.floor(css.opacity * 100) + ')';
                    this.style.filter = rAlpha.test(filter) ? filter.replace(rAlpha, value) : (filter + ' ' + value).trim();
                }
                for (var k in css) this.style[k] = (typeof (css[k]) == "number" && !/zIndex|fontWeight|opacity|zoom/i.test(k) ? css[k] + 'px' : css[k]);
                return this;
            },
            attr: function (attr, value) {
                if (typeof (attr) == 'string')
                    if (value === undefined) return this.getAttribute(attr, 2); else attr = _this.extend(attr, value);
                if (attr.text) {this.text = attr.text;attr.text = undefined;}
                if (attr.checked != undefined) {this.checked = attr.checked;attr.checked = undefined;}
                if (attr.v) {this.v = attr.v;attr.v = undefined;}
                for (var k in attr) attr[k] == undefined || this.setAttribute(k, attr[k]);
                return this;
            },
            html: function (value) {
                if (value !== undefined) {
                    this.empty();
                    if (typeof (value) != 'object') this.innerHTML = value; else this.appendChild(value);
                    return this;
                } else return this.innerHTML;
            },
            remove: function () {
                return this.parentNode.removeChild(this);
            },
            empty: function () {
                while (this.firstChild)
                    this.removeChild(this.firstChild);
                return this;
            },
            addin: function (child, ref) {
                this.insertBefore(child, ref || null);
                return this;
            },
            addto: function (parent, ref) {
                _this.$(parent).insertBefore(this, ref || null);
                return this;
            },
            // 是否包含某个子元素
            contains: function (child) {
                if (this.compareDocumentPosition) return (this == child || !!(this.compareDocumentPosition(child) & 16));
                else return !!v.$(child).$p(this);
            },
            // 向上（父）获取满足条件的元素, tag .class #id
            $p: function (s, ctx) {
                var node = this, q = typeof (s) == 'string' ? rQuery.exec(s) : s;ctx = _this.$(ctx || 'body');
                while (node && node.nodeName && node != ctx) {
                    if (q.nodeName) {if (q == node) return node;}
                    else if (q[1] == '#') {if (q[2] == node.id) return node;}
                    else if (q[1] == '.') {if (node.hasClass(q[2])) return node;}
                    else if (!q[1] && q[2] && (node.nodeName == q[2].toUpperCase())) return node;
                    node = _this.$(node.parentNode);
                }
                return null;
            },
            // 向下继承筛选多个
            $s: function (q) {
                return _this.$s(q, this);
            },
            // 向下继承筛选单个
            $: function (q) {
                return _this.$(q, this);
            },
            // 把元素内数据转换成json
            json: function () {
                var els = _this.$s('*', this), i = 0, el, data = {}, name;
                var types = ['text', 'hidden', 'select-one', 'textarea', 'password', 'button', 'submit'];
                while (el = els[i++]) if (name = el.name) {
                    if (types.indexOf(el.type) >= 0) data[name] = el.value;
                    else if (el.type == 'checkbox') data[name] = (data[name] && el.checked ? (data[name] + ',' + el.value) : (el.checked ? el.value : data[name] || ''));
                    else if (el.type == 'radio') data[name] = el.checked ? el.value : data[name] || ''
                }
                return data;
            },
            // 获得元素在框内的坐标位置
            offset: function (box) {
                if (this.nodeName == 'BODY') return this.clnset();
                var left = 0, top = 0, el = this;box = _this.$(box || el.offsetParent);
                while (el && el != box) {
                    left += el.offsetLeft - el.scrollLeft; top += el.offsetTop - el.scrollTop;
                    el = el.offsetParent;
                }
                return {'left': left, 'top': top, 'width': this.offsetWidth, 'height': this.offsetHeight};
            },
            // 获得scroll位移与宽高
            clnset: function() {
                if (this.nodeName == 'BODY') {
                    var b = doc.body, e = doc.documentElement, width = e.clientWidth || b.clientWidth, height = e.clientHeight || b.clientHeight;
                    return {
                        'left': Math.max(b.scrollLeft, e.scrollLeft), 'top': Math.max(b.scrollTop, e.scrollTop),
                        'width': width, 'swidth': Math.max(b.scrollWidth, e.scrollWidth, width), 'height': height, 'sheight': Math.max(b.scrollHeight, e.scrollHeight, height)
                    };
                }
                return {'left': this.scrollLeft, 'top': this.scrollTop, 'width': this.clientWidth, 'swidth': this.scrollWidth, 'height': this.clientHeight, 'sheight': this.scrollHeight};
            },
            // 载入完毕
            ready: function (fn, ctx) {
                ctx = ctx || this;
                if (this.complete) fn.call(ctx, this);
                else if (_this.isIE()) this.addEvent('readystatechange', function () { // ie
                    if (this.readyState == 'loaded' || this.readyState == 'complete') {
                        this.rmvEvent('readystatechange', arguments.callee);
                        fn.call(ctx, this);
                    }
                }); else this.addEvent('load', function () {
                    this.rmvEvent('load', arguments.callee);
                    fn.call(ctx, this);
                });
                return this;
            },
            // 渐变大小动画，以中心为原点，速度为1-100，对象不能有padding
            size: function (wh, speed, fn, ctx) {
                !this.clearSize || this.clearSize();
                var clnset = this.clnset(), offset = this.offset(), wCut = (clnset.width - (wh.width || clnset.width)) / 2, hCut = (clnset.height - (wh.height || clnset.height)) / 2;wh.left = offset.left + wCut;wh.top = offset.top + hCut; 
                if (speed) {
                    var wStep = wCut * speed / 100, hStep = hCut * speed / 100, wStop = wStep == 0, hStop = hStep == 0, _this = this; 
                    this.clearSize = function () {clearInterval(_this.sizeTimer);_this.css(wh);_this.clearSize = undefined;};
                    this.sizeTimer = setInterval(function(){
                        if (!wStop) if (wStep > 0 && clnset.width > wh.width || wStep < 0 && clnset.width < wh.width) _this.css({'width': clnset.width -= wStep * 2, 'left': offset.left += wStep}); else wStop = true;
                        if (!hStop) if (hStep > 0 && clnset.height > wh.height || hStep < 0 && clnset.height < wh.height) _this.css({'height': clnset.height -= hStep * 2, 'top': offset.top += hStep}); else hStop = true;
                        if (wStop && hStop) {_this.clearSize();if (fn) fn.call(ctx || _this);}
                    }, 25);
                } else {this.css(wh); if (fn) fn.call(ctx || _this);}
            },
            // 渐移动画，左上角为原点，速度为1-100,对象不能有margin
            move: function (lt, speed, fn, ctx) {
                !this.clearMove || this.clearMove();
                if (speed) {
                    var offset = this.offset(), xStep = (offset.left - (lt.left == undefined ? offset.left : lt.left)) * speed / 100, yStep = (offset.top - (lt.top == undefined ? offset.top : lt.top)) * speed / 100;
                    var xStop = xStep == 0, yStop = yStep == 0, _this = this;
                    this.clearMove = function () {clearInterval(_this.moveTimer);_this.css(lt);_this.clearMove = undefined;};
                    this.moveTimer = setInterval(function () {
                        if (!xStop) if (xStep > 0 && offset.left > lt.left || xStep < 0 && offset.left < lt.left) _this.style.left = (offset.left -= xStep) + 'px'; else xStop = true;
                        if (!yStop) if (yStep > 0 && offset.top > lt.top || yStep < 0 && offset.top < lt.top) _this.style.top = (offset.top -= yStep) + 'px'; else yStop = true;
                        if (xStop && yStop) {_this.clearMove(); if (fn) fn.call(ctx || _this);}
                    }, 25);
                } else {this.css(lt); if (fn) fn.call(ctx || _this);}
            },
            // 渐显渐隐动画1-100
            show: function (sh, speed, fn, ctx) {
                !this.clearShow || this.clearShow();
                var display = sh ? 'block' : 'none';
                if (speed) {
                    var opacity = Number(this.css('opacity')) || 1, step = (opacity * speed / 100) * (sh ? 1 : -1), start = (sh ? 0 : opacity), _this = this.css({'opacity': start, 'display': 'block'});
                    this.clearShow = function () {clearInterval(_this.showTimer);_this.css({'opacity': opacity, 'display': display});_this.clearShow = undefined;}
                    this.showTimer = setInterval(function () {
                        start = parseFloat((start + step).toFixed(2));
                        if (sh && start < opacity || !sh && start > 0) _this.css({'opacity': start});else {_this.clearShow();if (fn) fn.call(ctx || _this);}
                    }, 25);
                } else {this.style.display = display; if (fn) fn.call(ctx || _this);}
                return this;
            }
        };
        // 事件
        this.events = {
            stop: function () {
                if (this.preventDefault) {this.preventDefault();this.stopPropagation();}
                else {this.returnValue = false;this.cancelBubble = true;}
                return this;
            },
            fix: function () {
                this.target !== undefined || (this.target = _this.$(this.srcElement));
                this.offsetX !== undefined || (this.offsetX = this.layerX, this.offsetY = this.layerY);
                return this;
            }
        };
        // 数组
        this.arrays = {
            indexOf: function (item, from) {
                for (var len = this.length, i = (from < 0) ? Math.max(0, len + from) : from || 0; i < len; i++)
                    if (this[i] === item) return i;
                return -1;
            },
            forEach: function (fn, bind) {
                for (var i = 0, len = this.length; i < len; i++)
                    fn.call(bind, this[i], i, this);
                return this;
            },
            addEvent: function (type, fn, ctx) {
                this.forEach(function (el) {el.addEvent(type, fn, ctx);});
                return this;
            },
            rmvEvent: function (type, fn) {
                this.forEach(function (el) {el.rmvEvent(type, fn);});
                return this;
            }
        };
        // 字符串
        this.strings = {
            trim: function () {
                return this.replace(/^\s+|\s+$/g, '');
            },
            exec: function (fn, ctx) {
                var js1 = [], js2 = [], css1 = [], css2 = [], text, i, len;
                text = this.replace(/<script[^>]*src=['"](.*?)['"][^>]*>\s*<\/script>/gi, function (all, src) {js1.push(src);return '';}); // 外部js
                text = text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function (all, code) {js2.push(code);return '';}); // 内部js
                text = text.replace(/<link[^>]*href=['"](.*?)['"][^>]*>\s*<\/link>/gi, function (all, src) {css1.push(src);return '';}); // 外部样式
                text = text.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, function (all, code) {css2.push(code);return '';}); // 内部样式
                for (i = 0, len = css1.length; i < len; i++) _this.load(css1[i]); // 外联样式处理
                for (i = 0, len = css2.length; i < len; i++) _this.isIE() ? win.document.createStyleSheet().cssText = css2[i] : _this.$('<style>').attr({'type': 'text/css'}).addto('head').innerHTML = css2[i]; // 内联样式处理
                if (fn) fn.call(ctx, text);
                for (i = 0, len = js1.length; i < len; i++) _this.load(js1[i]); // 外联js处理
                for (i = 0, len = js2.length; i < len; i++) _this.$('<script>').attr({'type': 'text/javascript', 'text': js2[i]}).addto('body'); // 内联js处理
                return text;
            }
        };
        // 选择class
        this.$cls = function (s, ctx) {
            if (ctx.nodeName && ctx.getElementsByClassName) return ctx.getElementsByClassName(s);
            else {
                var i = 0, node, ret = [], nodes = ctx.nodeName ? ctx.getElementsByTagName('*') : ctx;
                while (node = nodes[i++]) (' ' + node.className + ' ').indexOf(' ' + s + ' ') < 0 || ret.push(node);
                return ret;
            }
        };
        // 正则匹配选择
        this.$regx = function (s, ctx) {
            var q = rQuery.exec(s), els = [];
            
            if (q[1] == '#') els = [doc.getElementById(q[2])];  // id
            else if (q[1] == '.') els = _this.$cls(q[2], ctx);  // class
            else if (q[2]) els = ctx.getElementsByTagName(q[2]);  // tag
            if (q[3]) if (!q[2] && q[3] == 'name' && ctx == doc) els = ctx.getElementsByName(q[4]); // attribute
            else { // 属性辅助
                var i = 0, node, attr, ret = [];q[2] || (els = ctx.getElementsByTagName('*'));
                while (node = els[i++]) {
                    attr = node.getAttribute(q[3], 2);
                    if (attr != null && (!q[4] || attr == q[4])) ret.push(node);
                }
                els = ret;
            }
            if (q[5]) els = _this.$cls(q[5], els);
            // 转换成数组
            for (var nodes = els, len = els.length, els = [], i = 0; i < len; i++) els[i] = nodes[i];
            return els;
        };
        // 选择元素
        this.$query = function (s, ctx) {
            var els, ret;ctx = ctx || doc;
            if (s == null) return [];
            else if (typeof (s) != 'string') {if (s.nodeName == undefined) return s;else if (s.$) return [s]; else els = [s];}
            else if (s == 'body') els = [doc.body];
            else if (s == '*') els = ctx.getElementsByTagName('*');
            else if (s.charAt(0) == '<') if (ret = /^<(\w+)\s*\/?>(?:<\/\1>)?$/.exec(s)) els = [doc.createElement(ret[1])];else {gDiv.innerHTML = s;els = gDiv.childNodes;}
            else if (ctx.querySelectorAll) els = ctx.querySelectorAll(s);
            else {  // 解析选择器进行选择
                // ,号多选解析
                var s1s = s.split(','), els1 = [], ctx1, ctxs, i, j, ss, len;els = []
                for (var i1 = 0, len1 = s1s.length; i1 < len1; i1++) {
                    // 子选择解析
                    ss = s1s[i1].split(' ');len = ss.length;ctxs = [ctx]
                    for (i = 0; i < len; i++) if (ss[i]) {
                        j = 0;els1 = [];
                        while (ctx1 = ctxs[j++]) els1 = els1.concat(_this.$regx(ss[i], ctx1));
                        ctxs = els1;
                    }
                    els = els.concat(els1);
                }
            }
            return els;
        };
        // 单选择器
        this.$ = v.$ = function (s, ctx) {
            var el = _this.$query(s, ctx)[0];
            if (el) {
                el.$ || _this.extend(el, _this.elements);
                _this.extend(el, _this.elexts);
            }
            return el;
        };
        // 多选择器
        this.$s = v.$s = function (s, ctx) {
            var els = _this.$query(s, ctx), ret = [], len = els.length;
            for (var i = 0; i < len; i++) if (els[i].nodeType == 1 || els[i].nodeType == 9) {
                els[i].$ || _this.extend(els[i], _this.elements);
                ret.push(_this.extend(els[i], _this.elexts));
            }
            return ret;
        };
        // 对象合并
        this.extend = v.extend = function (dst, src) {
            if (typeof (dst) == 'string') {
                if (typeof (src) == 'function') {
                    _this.elexts[dst] = src;
                    if (win.Element) Element.prototype[dst] = src;
                } else {var json = new Object();json[dst] = src;return json;}
            } else for (var key in src) if (dst[key] === undefined && src.hasOwnProperty(key)) dst[key] = src[key];
            return dst;
        };
        // 构造url查询,支持url模板与排序
        this.urlQrs = v.urlQrs = function (data, url) {
            var qrs = [], qrs1={}, pos, split = '?', nill = (url == undefined); url = url || '';
            if (typeof (data) == 'string') {url = (url ? url.replace(/[\?#&]+$/g, '') + '&' + data : data);data = {}}
            else {data = _this.extend({}, data);url = this.urlTpl(data, url);};
            if ((pos = url.indexOf('#')) > -1) split = '#';
            else if ((pos = url.indexOf('?')) < 0) pos = url.indexOf('&');
            if (pos > -1) {
                var urs = url.substr(pos + 1).split('&'), key, value; url = url.substr(0, pos);
                for (var i = urs.length; i--;) {
                    if ((pos = urs[i].indexOf('=')) > -1) {key = urs[i].substr(0, pos);value = decodeURIComponent(urs[i].substr(pos + 1));} else {key = urs[i];value = '';}
                    if (data[key] != undefined) {value = data[key];data[key] = undefined;}
                    if (value && qrs1[key] === undefined) {qrs.push(key + '=' + encodeURIComponent(value)), qrs1[key] = value;}
                }
            }
            for (var key in data) if ((nill ? data[key] != undefined : data[key])) qrs.push(key + '=' + encodeURIComponent(data[key]));
            qrs.sort();
            return (url + split + qrs.join('&')).replace(/^[\?#]+|[\?#]+$/g, '');
        };
        // 解析URL占位符模板
        this.urlTpl = v.urlTpl = function(data, url) {
            var tpls = url.match(/{\w+}/g);
            if (tpls) for (var tpl, i = tpls.length; i--;) {
                tpl = tpls[i].replace(/[{}]/g, '');
                if (data[tpl]) {url = url.replace(tpls[i], data[tpl]);data[tpl] = undefined;}
            }
            return url;
        };
        // 获得url查询参数值,key为空则将url转为json
        this.qrsUrl = v.qrsUrl = function (key, url) {
            url = url || win.location.href;
            if (key) {
                var qrs = url.match(new RegExp('[\\?#&]' + key + '=([^&#]*)'));
                return qrs ? decodeURIComponent(qrs[1]) : '';
            } else {
                var qrs1 = url.split('&'), qrs2, qrs = {};
                for (var i = 0, len = qrs1.length; i < len; i++) {
                    qrs2 = qrs1[i].split('=');
                    qrs[qrs2[0]] = (qrs2[1] === undefined ? '' : decodeURIComponent(qrs2[1]));
                }
                return qrs;
            }
        };
        // 是否数组
        this.isArray = v.isArray = function (obj) {
            return Object.prototype.toString.apply(obj) === '[object Array]';
        };
        // ajax调用, fn为空时同步调用,mth为JSR时为跨域请求
        this.xhr = v.xhr = function (mth, url, data, fmt, fn, ctx) {
            if (data && typeof(data) != 'object') {ctx = fn;fn = fmt;fmt = data;data = {};}
            if (fmt && typeof(fmt) != 'string') {ctx = fn;fn = fmt;fmt = null;}
            mth = mth.toUpperCase();data = data || {};
            // JavaScript Cross Domain Request跨域，需服务器端支持，并返回一变量，变量的值则为数据
            if (mth == 'JSR') {
                var pn = _this.xhr.jsr || 'xhr', vn = fmt || _this.uniqid(pn);data[pn] = vn;
                _this.$('<script>').ready(function () {
                    if (fn) if (win[vn] !== undefined) {
                        win[vn].exec(fn, ctx);
                        win[vn] = undefined;
                    } else fn.call(ctx);
                    this.remove();
                }).attr({'type': 'text/javascript', 'src': _this.urlQrs(data, url)}).addto('head');
                return _this;
            }
            // XMLHttpRequest AJAX请求
            var req, cmp = false;
            try {req = win.XMLHttpRequest ? new win.XMLHttpRequest() : new win.ActiveXObject('MSXML2.XMLHTTP.6.0');} catch (e) {return false;}
            try {
                var fmts = {'*': 'text/html, */*', 'xml': 'application/xml', 'json': 'application/json'};
                fmt = (fmt || _this.xhr.fmt || '*').toLowerCase();
                if (mth == 'POST' || mth == 'PUT') {
                    req.open(mth, _this.urlTpl(data, url), !!fn);
                    req.setRequestHeader('method', mth + ' ' + url + ' HTTP/1.1');
                    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                } else {req.open(mth, _this.urlQrs(data, url), !!fn);data = '';}
                req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                req.setRequestHeader('Accept', fmts[fmt] || fmt);
                if (fn && typeof (fn) == 'function') req.onreadystatechange = function () {
                    if (req.readyState == 4 && !cmp) {
                        cmp = true;
                        if (fmt == 'xml' || fmt == 'json') {
                            fmt == 'xml' ? data = req.responseXML : eval('data=' + req.responseText);
                            fn.call(ctx, data, req);
                        } else req.responseText.exec(function (data) {fn.call(ctx, data, req);});
                    }
                }
                req.send(_this.urlQrs(data));
            } catch (e) {return false;}
            return (fn ? _this : req.responseText);
        };
        // 配置xhr参数(fmt, jsr)
        this.xhr.set = v.xhr.set = function (attr, value) {
            if (typeof (attr) == 'string')
                if (value === undefined) return _this.xhr[attr] || ''; else attr = _this.extend(attr, value);
            for (var k in attr) _this.xhr[k] = attr[k];
            return _this;
        };
        // 载入javascript或css
        this.load = v.load = function (url, fn, ctx) {
            if (url.substr(0, 1) != '/' && url.substr(0, 7) != 'http://') {  // 相对(v.js)路径解析
                if (!_this.baseUrl) for (var scrs = _this.$s('script'), len = scrs.length, qs, i = 0; i < len; i++)
                    if (qs = scrs[i].src.match(/.*\/(v(\.[-\.\d\w]*)?\.js)$/i)) {_this.baseUrl = scrs[i].attr('src').replace(qs[1], '');break;}
                url = _this.baseUrl + url;
            }
            if (url.substr(url.length - 4) == '.css') {
                if (_this.$s('link[href="' + url + '"]').length <= 0) _this.$('<link>').attr({'type': 'text/css', 'rel': 'stylesheet', 'media': fn || 'all', 'href': url}).addto('head');
            } else if (_this.$s('script[src="' + url + '"]').length <= 0) {
                var el = _this.$('<script>');
                if (fn) el.ready(fn, ctx);
                el.attr({'type': 'text/javascript', 'src': url}).addto('head');
            } else if (fn) fn.call(ctx);
            return _this;
        };
        // 页面准备好，可延迟执行回调
        this.ready = v.ready = function (fn, delay, ctx) {
            if (delay && typeof(delay) != 'number') {ctx = delay;delay = undefined;}
            if (delay) win.addEvent('load', function(){setTimeout(function(){fn.call(ctx);}, delay);});
            else win.addEvent('load', fn, ctx);
            return _this;
        };
        // 设置与获取cookie, expire为0时当前进程，未传递时为永久,value为0|false时删除cookie
        this.cookie = v.cookie = function (name, value, expire, domain) {
            if (value !== undefined) {
                if (typeof (expire) == 'string') {var temp = expire;expire = domain;domain = temp;}
                if (value == false) expire = -1;
                doc.cookie = name + '=' + encodeURIComponent(value) + ';path=/' + (domain ? ';domain=' + domain : '')
                       + (expire != 0 ? ';expires=' + (new Date((new Date()).getTime() + (expire == undefined ? 86400000000 : expire * 1000))).toGMTString() : '');
            } else {
                var cks = doc.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
                return cks ? decodeURIComponent(cks[2]) : '';
            }
        };
        // 生成唯一标识，16位
        this.uniqid = v.uniqid = function (prefix) {
            var uid = new Date().getTime().toString(16);
            uid += Math.floor((1 + Math.random()) * Math.pow(16, (16 - uid.length))).toString(16).substr(1);
            return (prefix || '') + uid;
        };
        // 判断是否IE或某版本IE
        this.isIE = v.isIE = function (edn) {
            if (win.attachEvent) {
                var agent = win.navigator.userAgent;
                return edn ? agent.indexOf('MSIE ' + edn) > -1 : agent.indexOf('Opera') === -1;
            }
            return false;
        };

        //************************************** 语言扩展 **********************************//
        this.extend(Array.prototype, this.arrays); // 数组
        this.extend(String.prototype, this.strings); // 字符串
        win.addEvent = doc.addEvent = this.elements.addEvent; // window添加事件
        win.rmvEvent = doc.rmvEvent = this.elements.rmvEvent;  // window移除事件
        if (win.Event) this.extend(Event.prototype, this.events); // event事件对象
        if (win.Element) this.extend(Element.prototype, this.elements); // element
        win.v = v;
    })(win.document);

})(window);