/**
 * 弹出层插件
 * @name msc.ui.dialog
 * @memberOf msc.ui
 * @description 支持弹出层，扩展有成功，错误，警告简单tips，loading等待层，不支持吸附元素，吸附请用 $.fn.tips，优雅的采用糖饼内核, 细节用法请看 https://github.com/aui/artDialog
 * @date 20131227
 * @function
 * @copyright 美食天下
 * @by 20140220     去操作用户焦点
 *                  优化代码
 * @by 20140225     优化 msc.ui.dialog.success,error,warning
 *
 *
 * @example
 *     1, 模拟alert
 *         msc.ui.dialog.alert("你好，这里是美食天下", function(){alert("已经关闭")});
 *     2, 复杂alert
 *         msc.ui.dialog.alert({
 *             content:["您确定删除这篇日志吗？","删除后相关照片也会删除"],//如果为array则0为大标题，1为副标题
 *             ok:function(){
 *                 //确定按钮回调
 *             },
 *             cancel:function(){},//取消回调
 *             title:"警告"//标题，如果没有则不显示标题
 *         });
 *      3, 支持各种复杂alert，各种按钮，各种显示，各种事件
 *      4, 简单提示
 *          msc.ui.dialog.success  成功
 *          msc.ui.dialog.error    错误
 *          msc.ui.dialog.warning  警告
 *          三个方法用法相同：
 *              msc.ui.dialog.success("操作已成功",3000);//提示文字，3秒后消失
 *              msc.ui.dialog.error("操作已成功");//默认为2秒
 *              msc.ui.dialog.success("操作成功",function(){alert(1)});//提示文字，关闭后回调
 *       5, loading层
 *           msc.ui.dialog.loading();//该层会遮罩起屏幕，并不可用户手动关闭
 *           msc.ui.dialog.loading.close();//关闭loading层，不管是否存在都不会报错
 *       6,  msc.ui.dialog.alert("这是我的时候",function(){
 *               msc.ui.dialog.alert({
 *                   content:["标题","这里注掉是因为下面还是会判断的，这里是如果为<br>字符串就让其fixed，但项目中用不到，so"],
 *                   cancel:function(){
 *                       msc.ui.dialog.error("失败")
 *                   },
 *               cancelValue:"测试",
 *               ok:function(){
 *                   msc.ui.dialog.success("成功",function(){
 *                       msc.ui.dialog.alert({
 *                           width:"auto",
 *                           button:[
 *                               {
 *                                   id:"ce",
 *                                   value:"你好",
 *                                   disabled:!0
 *                               },
 *                               {
 *                                   id:"ce2",
 *                                   value:"我好",
 *                                   focus:!0,
 *                                   highlight:!0
 *                               },
 *                               {
 *                                   id:"ce42",
 *                                   value:"大家好",
 *                                   focus:!0,
 *                                   highlight:!0
 *                               },
 *                               {
 *                                   id:"ce424",
 *                                   value:"大家好",
 *                                   focus:!0,
 *                                   disabled:!0
 *                               },
 *                               {
 *                                   id:"ce4d24",
 *                                   value:"大家好",
 *                                   focus:!0,
 *                                   highlight:!0
 *                               },
 *                               {
 *                                   id:"ce3",
 *                                   value:"取消",
 *                                   callback:function(){
 *                                       var self = this;
 *                                       msc.ui.dialog.loading();
 *                                       setTimeout(function(){
 *                                           msc.ui.dialog.loading.close();
 *                                           msc.ui.dialog.success("关闭成功",function(){
 *                                               self && self.close();
 *                                           });
 *                                       },3000)
 *                                       return false;
 *                                   }
 *                               }
 *                           ],
 *                           ok:false
 *                      });
 *                 });
 *              }
 *          });
 *      });
*/

 

;(function($, window, msc) {
    "use strict";//严格模式



    var //_singleton,//?单例？ 咱项目不用
        _count = 0,//一个标识，为了不重复
        $window = $(window),//存到这一劳永逸
        $document = $(document),//同上
        _expando = 'artDialog' + (+new Date),//记录一个一辈子不重复的标识名，其实直接artDialog也是可以的
        // _isMobile = 'createTouch' in document && !('onmousemove' in document) || /(iPhone|iPad|iPod)/i.test(navigator.userAgent),//判断是否为移动设备
        _isFixed = !msc.tools.browser.isIe6/* && !_isMobile*/;//,//如果不为ie6或者不为移动设备则为true
        // 去操作屏幕焦点
        // _getActive = function() {//焦点操作
        //     try {
        //         // bug: ie8~9, iframe #26
        //         return document.activeElement;
        //     } catch (e) {}
        // },
        // _activeElement = _getActive();//获取焦点

    /**
     * 弹出层构架函数
     */
    var artDialog = function(config, ok, cancel) {

        config = config || {};//如果没有配置参数

        if (typeof config === 'string') {//如果第一个参数为字符串，解决 dialog("谢亮翻译") 的时候
            config = {
                content: config/*, 
                fixed: !_isMobile*/ //这里注掉是因为下面还是会判断的，这里是如果为字符串就让其fixed，但项目中用不到，so
            };
        };


        var api, defaults = artDialog.defaults;//引用默认参数 和定义是否已经弹出的变量
        // var elem = config.follow = this && this.nodeType === 1 && this || config.follow;//取消吸附


        // 合并默认配置
        for (var i in defaults) {
            if (config[i] === undefined) {//如果配置里没有默认里的就拿默认里的
                config[i] = defaults[i];
            };
        };


        config.id = /*elem && elem[_expando + 'follow'] ||*/ config.id || _expando + _count;//取消吸附 // 分配一个id，如果参数里没有id则使用标识来定一个id
        api = artDialog.list[config.id];//查找缓存里是否有这个弹出层实例，list可视为内部缓存



        if (api) {//如果缓存里有
            // if (elem) {//取消吸附
            //     api.follow(elem)
            // };
            // api.zIndex().focus();
            return api.zIndex();//去操作焦点.focus();//置顶该实例并返回
        };



        // 目前主流移动设备对fixed支持不好，禁用此特性
        if (!_isFixed) {//如果为ie6或者移动端强制让其不用fixed定位
            config.fixed = false;
        };

        // !$.isArray(config.button)
        if (!$.isArray(config.button)) {//如果参数的button不是数组则让其为数组，因为后面要进行push操作追加
            config.button = [];
        };


        // 确定按钮
        if (ok !== undefined) {
            config.ok = ok;
        };

        if (config.ok) {//如果有确认按钮则追加到button数组里
            config.button.push({
                id: 'ok',
                value: config.okValue,
                callback: config.ok,
                focus: true,//确认按钮默认为聚焦状态
                highlight: true//高亮
            });
        };


        // 取消按钮
        if (cancel !== undefined) {
            config.cancel = cancel;
        };

        if (config.cancel) {//如果有取消按钮则追加到button数组里
            config.button.push({
                id: 'cancel',
                value: config.cancelValue,
                callback: config.cancel
            });
        };

        // 更新 zIndex 全局配置
        artDialog.defaults.zIndex = config.zIndex;//把参数里的zindex更新到全局对象里

        _count++;//让标识+1，防止重复

        return artDialog.list[config.id] =
        /* _singleton ?  //单例？干掉
        _singleton._create(config) : */
        new artDialog.fn._create(config);//缓存下对象并返回
    };

    artDialog.version = '5.0.4 for meishichina';//版本

    artDialog.fn = artDialog.prototype = {//采用jQuery无需new返回新实例

        _create: function(config) {
            var self = this;
            self.closed = false;//设置关闭标识
            self.config = config;//把参数引用到对象上
            self._innerHTML(config);//输出html

            config.skin && self._$('wrap').addClass(config.skin);//设置皮肤
            self._$('wrap').css('position', config.fixed ? 'fixed' : 'absolute');//定位
            self._$('close')[config.cancel === false ? 'hide' : 'show']();//如果cancel为false对不显示关闭小叉号

            self.button.apply(self, config.button);//处理按钮组

            self.title(config.title)//设置标题
                .content(config.content)//设置内容
                .size(config.width, config.height)//设置宽高
                .time(config.time)//设置自动关闭
                .position()//重置位置
                .zIndex()//置顶
                ._addEvent();//绑定事件
            config.lock && self.lock();//如果有遮罩

            self[config.visible ? 'visible' : 'hidden']();//去焦点.focus();//是否显示

            // _singleton = 1//null;

            config.initialize && config.initialize.call(self);//如果有初始化参数则call下
            return self;//返回实例
        },


        /**
         * 设置内容
         * @param {String} 内容 (可选)
         */
        content: function(message) {
            this._$('content').html(message);//设置内容不解释
            // this._reset();//重置下位置
            return this.position();
        },


        /**
         * 设置标题
         * @param {(String|Boolean)} 标题内容. 为 false 则隐藏标题栏
         */
        title: function(content) {

            var className = 'ui-dialog-noTitle';//没有标题时的class

            if (content === false) {//如果参数为false才不显示标题
                this._$('title').hide().html('');
                this._$('outer').addClass(className);
            } else {
                this._$('title').show().html(content);
                this._$('outer').removeClass(className);
            };

            return this;
        },


        /** @inner 位置居中 */
        position: function() {

            var /*dom = this.dom,*/
                wrap = this._$('wrap')[0],
                // $window = dom.window,
                // $document = dom.document,
                fixed = this.config.fixed,//判断是否为fixed定位
                dl = fixed ? 0 : $document.scrollLeft(),//如果不是则找到滚动条
                dt = fixed ? 0 : $document.scrollTop(),//同上
                ww = $window.width(),//窗口的宽
                wh = $window.height(),//窗口的高
                ow = wrap.offsetWidth,//当前弹层的宽
                oh = wrap.offsetHeight,//同上
                left = (ww - ow) / 2 + dl,
                top = (wh - oh)/2 + dt;//(wh - oh) * 382 / 1000 + dt;//项目不让使用黄金比例

            wrap.style.left = Math.max(parseInt(left), dl) + 'px';
            wrap.style.top = Math.max(parseInt(top), dt) + 'px';

            // if (this._follow) {//去掉吸附
            //     this._follow.removeAttribute(_expando + 'follow');
            //     this._follow = null;
            // }

            return this;
        },


        /**
         * 尺寸
         * @param {(Number|String)} 宽度
         * @param {(Number|String)} 高度
         */
        size: function(width, height) {

            var main = this._$('main')[0].style;

            if (typeof width === 'number') {//如果为纯数字则加上单位，这里有auto的时候，所以要判断，必须纯。。。
                width = width + 'px';
            };

            if (typeof height === 'number') {
                height = height + 'px';
            };

            main.width = width;
            main.height = height;
            main = null;
            return this.position();
        },


        /**
         * 跟随元素..  // 去掉吸附
         * @param {HTMLElement}
         */
        /*follow: function(elem) {

            var $elem = $(elem),
                config = this.config;


            // 隐藏元素不可用
            if (!elem || !elem.offsetWidth && !elem.offsetHeight) {

                return this.position(this._left, this._top);
            };

            var fixed = config.fixed,
                expando = _expando + 'follow',
                // dom = this.dom,
                // $window = dom.window,
                // $document = dom.document,

                winWidth = $window.width(),
                winHeight = $window.height(),
                docLeft = $document.scrollLeft(),
                docTop = $document.scrollTop(),
                offset = $elem.offset(),

                width = elem.offsetWidth,
                height = elem.offsetHeight,
                left = fixed ? offset.left - docLeft : offset.left,
                top = fixed ? offset.top - docTop : offset.top,

                wrap = this._$('wrap')[0],
                style = wrap.style,
                wrapWidth = wrap.offsetWidth,
                wrapHeight = wrap.offsetHeight,
                setLeft = left - (wrapWidth - width) / 2,
                setTop = top + height,

                dl = fixed ? 0 : docLeft,
                dt = fixed ? 0 : docTop;


            setLeft = setLeft < dl ? left :
                (setLeft + wrapWidth > winWidth) && (left - wrapWidth > dl) ? left - wrapWidth + width : setLeft;


            setTop = (setTop + wrapHeight > winHeight + dt) && (top - wrapHeight > dt) ? top - wrapHeight : setTop;


            style.left = parseInt(setLeft) + 'px';
            style.top = parseInt(setTop) + 'px';


            this._follow && this._follow.removeAttribute(expando);
            this._follow = elem;
            elem[expando] = config.id;

            return this;
        },*/


        /**
        * 自定义按钮
        * @example
        button({
        value: 'login',
        callback: function () {},
        disabled: false,
        focus: true
        }, .., ..)
        */
        button: function() {


            var self = this,
                $buttons = self._$('buttons'),//找到元素
                elem = $buttons[0],//dom下
                strongButton = 'ui-dialog-button-focus',//高亮的class
                listeners = self._listeners = self._listeners || {},//事件空间
                ags = [].slice.call(arguments);//得到匿名参数的数组

            var i = 0,
                val, value, id, isNewButton, button;

            for (; i < ags.length; i++) {

                val = ags[i];//当前的按钮对象

                value = val.value || "确定";//如果没有设置value
                id = val.id || value;//找到id
                isNewButton = !listeners[id];//是否已经存在
                button = !isNewButton ? listeners[id].elem : document.createElement('a');//如果已存在则拿dom，否则创建dom
                button.href = 'javascript:;';//你懂的
                button.className = 'ui-dialog-button';//按钮class

                if (isNewButton) {//如果为新按钮
                    listeners[id] = {};
                };

                button.innerHTML = value;
                if (val.width) {
                    button.style.width = "number" === typeof (val.width) ? (val.width+"px") : val.width;
                };

                if ( !! val.disabled) { //如果禁用
                    button.className += ' ui-dialog-button-disabled';//禁用的class
                    if (!val.callback) {//如果已禁用且没有回调则设置return false
                        val.callback = function() {
                            return false;
                        };
                    };
                };


                if (val.callback) {//如果有回调
                    listeners[id].callback = val.callback;
                };

                if (val.focus) {//如果为聚焦
                    self._focus && self._focus.removeClass(strongButton);//移除老聚焦的按钮
                    self._focus = $(button).addClass(strongButton);//给当前添加聚焦
                    // self.focus();
                };

                if(val.highlight){//如果高亮
                    button.className += ' ui-dialog-button-on';
                };

                if(val.className){//如果配置的按钮有class则追加下
                    button.className += ' '+ val.className;
                };


                button[_expando + 'callback'] = id;//把标识追加到这个按钮的dom上，让委托按钮事件可以找到



                if (isNewButton) {//如果为新按钮则追加到dom
                    listeners[id].elem = button;
                    elem.appendChild(button);
                };
            };

            $buttons[0].style.display = ags.length ? '' : 'none';

            self._focus && self._focus.focus();//只操作按钮的焦点，而不管窗口的焦点，否则ie6有严重bug

            return self;
        },


        /** 显示对话框 */
        visible: function() {
            //this.dom.wrap.show();
            this._$('wrap').css('visibility', 'visible');
            this._$('outer').addClass('ui-dialog-visible');

            if (this._isLock) {
                this._lockMask.show();
            };

            return this;
        },


        /** 隐藏对话框 */
        hidden: function() {
            //this.dom.wrap.hide();
            this._$('wrap').css('visibility', 'hidden');
            this._$('outer').removeClass('ui-dialog-visible');

            if (this._isLock) {
                this._lockMask.hide();
            };

            return this;
        },


        /** 关闭对话框 */
        close: function() {
            var self = this;
            if (self.closed) {
                return self;
            };

            var /*dom = self.dom,*/
                // $wrap = self._$('wrap'),
                beforeunload = self.config.beforeunload;

            if (beforeunload && beforeunload.call(self) === false) {
                return self;
            };


            if (artDialog.focus === self) {
                artDialog.focus = null;
            };


            // if (self._follow) {//去掉吸附
            //     self._follow.removeAttribute(_expando + 'follow');
            // }




            self.time().unlock();//._removeEvent();//jQuery会自己卸载
            delete artDialog.list[self.config.id];
            self._$('wrap').remove();
            



            //采用v6的删除方法，减少资源
            for(var i in self){
                delete self[i];
            };

            self.closed = true;

            // if (_singleton) {

            

            // 使用单例模式
            // } else {

            //     _singleton = self;

            //     dom.title.html('');
            //     dom.content.html('');
            //     dom.buttons.html('');

            //     $wrap[0].className = $wrap[0].style.cssText = '';
            //     dom.outer[0].className = 'ui-dialog-outer';

            //     $wrap.css({
            //         left: 0,
            //         top: 0,
            //         position: _isFixed ? 'fixed' : 'absolute'
            //     });

            //     for (var i in this) {
            //         if (this.hasOwnProperty(i) && i !== 'dom') {
            //             delete this[i];
            //         };
            //     };

            //     this.hidden();

            // };

            // 恢复焦点，照顾键盘操作的用户
            // 去焦点
            // if (_activeElement) {
            //     try{
            //         setTimeout(function(){
            //             _activeElement.focus();
            //         },100);
            //     } catch(e){}
            // }

            
            return self;
        },


        /**
         * 定时关闭
         * @param {Number} 单位毫秒, 无参数则停止计时器
         */
        time: function(time) {

            var that = this,
                timer = this._timer;

            timer && clearTimeout(timer);

            if (time) {
                that._timer = setTimeout(function() {
                    that._click('cancel');
                }, time);
            };


            return that;
        },

        /** @inner 设置焦点 */
        // 去焦点
        // focus: function() {

        //     var that = this,
        //         isFocus = function() {
        //             var activeElement = _getActive();
        //             return activeElement && that._$('wrap')[0].contains(activeElement);
        //         };

        //     if (!isFocus()) {
        //         _activeElement = _getActive();
        //     }

        //     setTimeout(function() {
        //         if (!isFocus()) {
        //             try {
        //                 var elem = that._focus || that._$('close') || taht._$('wrap');
        //                 elem[0].focus();
        //                 // IE对不可见元素设置焦点会报错
        //             } catch (e) {};
        //         }
        //     }, 16);

        //     return this;
        // },


        /** 置顶对话框 */
        zIndex: function() {

            var /*dom = this.dom,*/
                top = artDialog.focus,
                index = artDialog.defaults.zIndex++;

            // 设置叠加高度
            this._$('wrap').css('zIndex', index);
            this._lockMask && this._lockMask.css('zIndex', index - 1);

            // 设置最高层的样式
            top && top._$('outer').removeClass('ui-dialog-focus');
            artDialog.focus = this;
            this._$('outer').addClass('ui-dialog-focus');

            return this;
        },


        /** 设置屏锁 */
        lock: function() {

            if (this._isLock) {
                return this;
            };

            var that = this,
                config = that.config,
                /*dom = that.dom,*/
                div = document.createElement('div'),
                $div = $(div),
                index = artDialog.defaults.zIndex - 1;

            that.zIndex()._$('outer').addClass('ui-dialog-lock');

            $div.css({
                zIndex: index,
                position: 'fixed',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            }).addClass('ui-dialog-mask');

            config.backgroundColor && $div.css("backgroundColor", config.backgroundColor);
            config.backgroundOpacity && $div.css("opacity", config.backgroundOpacity);

            if (!_isFixed) {
                $div.css({
                    position: 'absolute',
                    width: $window.width() + 'px',
                    height: $document.height() + 'px'
                });
            };


            $div.bind('dblclick', function() {
                that._click('cancel');
            });

            document.body.appendChild(div);

            that._lockMask = $div;
            that._isLock = true;

            return that;
        },


        /** 解开屏锁 */
        unlock: function() {

            if (!this._isLock) {
                return this;
            };

            // this._lockMask.unbind();
            // this._lockMask.hide();
            this._lockMask.fadeOut(300,function(){
                $(this).remove();
            });

            this._$('outer').removeClass('ui-dialoge-lock');
            this._isLock = false;

            return this;
        },


        // 获取元素
        _innerHTML: function(data) {
            var wrap = document.createElement('div');
            wrap.style.cssText = 'position:absolute;left:0;top:0';
            wrap.innerHTML = artDialog._templates
                .replace(/{([^}]+)}/g, function($0, $1) {
                    var value = data[$1];
                    return typeof value === 'string' ? value : '';
                });
            document.body.appendChild(wrap);//插入到前面ie67有问题
            // document.body.insertBefore(wrap, document.body.firstChild);
            this.dom = {
                wrap:$(wrap)
            };
            return this;
        },

        //获取jQuery对象
        _$: function(i){
            var dom = this.dom;
            return dom[i] ? dom[i] : (dom[i] = dom.wrap.find('[data-dom=' + i + ']'));
        },


        // 按钮回调函数触发
        _click: function(id) {

            var fn = this._listeners[id] && this._listeners[id].callback;

            return typeof fn !== 'function' || fn.call(this) !== false ?
                this.close() : this;
        },


        // 重置位置
        // _reset: function() {
        //     var elem = this.config.follow || this._follow;//去掉吸附
        //     elem ? this.follow(elem) : 
        //     return this.position();
        // },


        // 事件代理
        _addEvent: function() {

            var that = this/*,
                dom = this.dom;*/


            // 监听点击
            that._$('wrap')
                .bind('click', function(event) {

                    var target = event.target,
                        callbackID;

                    // IE BUG
                    if (target.disabled) {
                        return false;
                    };

                    if (target === that._$('close')[0]) {
                        that._click('cancel');
                        return false;
                    } else {
                        callbackID = target[_expando + 'callback'];
                        callbackID && that._click(callbackID);
                    };

                })
                .bind('mousedown', function() {
                    that.zIndex();
                });

        }/*,


        // 卸载事件代理
        _removeEvent: function() {
            this._$('wrap').unbind();
        }*/

    };

    artDialog.fn._create.prototype = artDialog.fn;



    // 快捷方式绑定触发元素
    // $.fn.dialog = $.fn.artDialog = function() {
    //     var config = arguments;
    //     this[this.live ? 'live' : 'bind']('click', function() {
    //         artDialog.apply(this, config);
    //         return false;
    //     });
    //     return this;
    // };



    /** 最顶层的对话框API */
    artDialog.focus = null;



    /**
     * 根据 ID 获取某对话框 API
     * @param {String} 对话框 ID
     * @return {Object} 对话框 API (实例)
     */
    artDialog.get = function(id) {
        return id === undefined ? artDialog.list : artDialog.list[id];
    };

    artDialog.list = {};



    //// 全局快捷键
    //$(document).bind('keydown', function (event) {
    //    var target = event.target,
    //        nodeName = target.nodeName,
    //        rinput = /^input|textarea$/i,
    //        api = artDialog.focus,
    //        keyCode = event.keyCode;

    //    if (!api || rinput.test(nodeName) && target.type !== 'button') {
    //        return;
    //    };
    //    
    //    // ESC
    //    keyCode === 27 && api._click('cancel');
    //});


    // 锁屏限制tab
    // function focusin(event) {
    //     var api = artDialog.focus;
    //     if (api && api._isLock && !api.dom.wrap[0].contains(event.target)) {
    //         event.stopPropagation();
    //         api.dom.outer[0].focus();
    //     }
    // }

    // if ($.fn.live) {
    //     $('body').live('focus', focusin);
    // } else if (document.addEventListener) {
    //     document.addEventListener('focus', focusin, true);
    // } else {
    //     $(document).bind('focusin', focusin);
    // }



    // 浏览器窗口改变后重置对话框位置
    $(window).bind('resize', function() {
        var dialogs = artDialog.list;
        for (var id in dialogs) {
            dialogs[id].position();
        };
        dialogs = null;
    });



// 可用 dialog._$(name) 获取 data-dom 的jQuery对象
// 已知dom:  outer,inner,title,close,main,content,footer,buttons,header
artDialog._templates =
    '<div class="ui-dialog-outer" data-dom="outer" role="dialog" tabindex="-1" aria-labelledby="ui-dialog-title-{id}" aria-describedby="ui-dialog-content-{id}">' 
        + '<table class="ui-dialog-border">' 
            + '<tbody>' 
                + '<tr>' 
                    + '<td>' 
                        + '<div class="ui-dialog-inner" data-dom="inner">'
                            + '<div class="ui-dialog-header" data-dom="header">'
                                + '<div class="ui-dialog-title-outer">'
                                    + '<div id="ui-dialog-title-{id}" data-dom="title" class="ui-dialog-title"></div>'
                                    + '<a class="ui-dialog-close" href="javascript:;" data-dom="close" title="{cancelValue}"></a>'
                                + '</div>'
                            + '</div>'
                            + '<div class="ui-dialog-main" data-dom="main">'
                                + '<div id="ui-dialog-content-{id}" data-dom="content" class="ui-dialog-content"></div>'
                            + '</div>'
                            + '<div class="ui-dialog-footer" data-dom="footer">'
                                + '<div class="ui-dialog-buttons" data-dom="buttons"></div>'
                            + '</div>'
                        + '</div>' 
                     + '</td>' 
                + '</tr>' 
            + '</tbody>' 
        + '</table>' 
    + '</div>';



    /**
     * 默认配置
     */
    artDialog.defaults = {

        // 消息内容
        content: '<div class="ui-dialog-loading" title="努力加载中..."></div>',

        // 标题
        title: '\u63D0\u793A',

        // 自定义按钮
        button: null,

        // 确定按钮回调函数
        ok: null,

        // 取消按钮回调函数
        cancel: null,

        // 对话框初始化后执行的函数
        initialize: null,

        // 对话框关闭前执行的函数
        beforeunload: null,

        // 确定按钮文本
        okValue: '\u786E\u5B9A',

        // 取消按钮文本
        cancelValue: '\u53D6\u6D88',

        // 内容宽度
        width: 'auto',

        // 内容高度
        height: 'auto',

        // 皮肤名(多皮肤共存预留接口)
        skin: "",

        // 自动关闭时间(毫秒)
        time: 0,

        // 初始化后是否显示对话框
        visible: true,

        // 让对话框跟随某元素
        // follow: null, //去掉吸附

        // 是否锁屏
        lock: false,

        // 是否固定定位
        fixed: false,

        // 对话框叠加高度值(重要：此值不能超过浏览器最大限制)
        zIndex: 3e5,

        backgroundColor:"",

        backgroundOpacity:""

    };



    /**
     * 通用弹出层提示
     * @param   {(object | array | string)}         options     dialog参数对象或数组或者字符串
     * @param   {(function| empty)}                 fn          确定按钮回调或者空
     * @example
     *     1: msc.ui.dialog.alert("操作成功");
     *     2: msc.ui.dialog.alert("请求失败",function(){});
     *     3: msc.ui.dialog.alert(["您不是VIP用户，无权操作","现在开通还有好礼相送哦"],function(){});
     *     4: msc.ui.dialog.alert({
     *            content:["确定要删除该日志吗？","删除后该日志下的评论也将删除，且不能恢复"],
     *            ok:function(){
     *            },
     *            okValue:"删除",
     *            cancel:1,
     *            title:"警告"
     *        });
     */
    artDialog.alert = function(options,fn,cancel) {
        if ("string" === typeof options || $.isArray(options)) {
            options = {
                content: options,
                ok:fn,
                cancel:cancel
            };
        };
        options = options || {};

        // if (!options.title) { //如果没有标题则加上关闭按钮
        //     options.title = false;
        // };
        if ($.isArray(options.content)) { //如果内容为数组
            options.content = ['<h3>' + options.content[0] + '</h3>','<p>' + options.content[1] + '</p>'].join("");
        } else {
            options.content = '<h3>'+ (options.content || "请稍等") +'</h3>';
        };
        // options.skin = "msc-dialog-alert";
        // options.width = options.width || 380;
        // options.fixed = options.fixed || 1;
        // options.lock = 1;
        // options.ok = options.ok === undefined ? 1 : options.ok;
        return artDialog($.extend({
            skin : 'msc-dialog-alert',
            width : 380,
            fixed : 1,
            lock : 1,
            ok : 1,
            title: !1
        },options));
    };


    /**
     * 成功、错误、警告
     * @param   {(object | string)}    options    dialog参数对象或者字符串
     * @param   {number}              num        自动关闭的倒计时， ms
     * @return  {object}                         dialog对象
     * @example
     * 
     *     1: msc.ui.dialog.success("删除成功");
     *     2: msc.ui.dialog.error("分类不存在",4000);
     *     3: msc.ui.dialog.warning("您不是管理员");
     */
    $.each(['success', 'error', 'warning'], function(i, that) {
        artDialog[that] = function(options, num) {
            if ("string" === typeof options) {
                options = {
                    content: options,
                    time: "function" === typeof num ? 0 : num,
                    beforeunload: "function" === typeof num ? num : 0
                };
            };
            options = options || {};
            options.content = '<p>' + options.content + '</p><i class="msc-dialog-tips-icon msc-dialog-tips-'+ that +'-icon"></i>';
            options.skin = "msc-dialog-tips";
            options.time = options.time || 2*1e3;
            options.fixed = 1;
            options.title = options.cancel = false;
            return artDialog(options);
        };
    });


    /**
     * loading等待层，不可关闭，只有 msc.ui.dialog.loading.close() 才能关闭这个层
     * @example
     * 
     *     msc.ui.dialog.loading();//会遮罩起屏幕，且不能关闭
     */
    artDialog.loading = function() {
        return artDialog({
            title:false,
            cancel:false,
            lock:1,
            backgroundColor:"#fff",
            backgroundOpacity:0.1,
            beforeunload:function(){
                return false;
            },
            skin: "msc-dialog-loading",
            id: "msc-loading",
            fixed: 1
        });
    }

    /**
     * 关闭等待层，只关闭，你懂的 *_*
     * @example
     * 
     *     msc.ui.dialog.loading.clsoe();//删除等待层
     */
    artDialog.loading.close = function(){
        var api = artDialog.get("msc-loading");
        if(api){
            api.config.beforeunload = null;
            api.close();
        }
        api = null;
    }


    //把第一次给命名空间
    msc.register("msc.ui");
    msc.ui.dialog = artDialog;
}(jQuery, window, window.msc));







