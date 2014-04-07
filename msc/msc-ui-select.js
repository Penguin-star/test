/**
 * 美化select
 * @todo 键盘事件,事件委托,添加focus,blur等操作, 多选
 */
(function($, msc){
    var isIe6 = msc.tools.browser.isIe6,
        $document = $(document);
    var select = msc.ui.select =  function(config){
        if(! $.isPlainObject(config)) {
            config = {
                id: config
            }
        }

        //默认参数
        config = $.extend({
            width: 80,//框的宽
            maxWidth: 160,//下拉最大宽
            maxHeight: 200,//下拉最大高
            event: "click",//事件
            defaultValue: false//默认文本, 如果 为false则为 "请选择", 如果为fn则call下, 如果为true则拿option的第一个当
        }, config);

        //如果没有id 或者 选择器空
        if (!config.id || !(config.id = $(config.id)).length || config.id[0].nodeName !== "SELECT") {
            return select;
        }

        $.each(config.id, function(){
            if(! this._select){
                this._select = 1;
                new Class(this, config);
            }
        });

        return select;
    }

    function Class ( ele, config ){
        this.config = config;
        this._dom = {
            ele: $(ele)
        };
        this._init();
    }

    Class.prototype = {
        _init: function(){
            this._append();
            this._bind();
            this._visible = false;
            this._disabled = true;
        },
        empty: function(){
            this._dom.list.empty();
            return this;
        },
        disabled: function(){
            this._disabled = true;
            this._dom.wrap.addClass("ui_select_disabled");
            return this;
        },
        enabled: function(){
            this._dom.wrap.removeClass("ui_select_disabled");
            this._disabled = false;
            return this;
        },
        _update: function(){
            console.log(1)
            var dom = this._dom,
                defa = this._runCall(this.config.defaultValue),
                value = dom.ele.val(),
                str = "",
                optionHeight;

            

            if(value){
                defa = value;
            }

            if(defa === true){
                defa = dom.ele.find("option").eq(0).text();
            } else if(false === defa){
                defa = '请选择';
            }

            defa && dom.span.html(defa);


            if(dom.ele.prop("disabled")){
                return this.hide().disabled().empty();
            } else {
                this.enabled();
            }

            optionHeight = dom.ele.find("option").each(function(){
                if(value == this.value){
                    str += '<div class="ui_select_li_on ui_select_item" data-value="'+ this.value +'">'+ this.text +'</div>';
                } else {
                    str += '<div class="ui_select_item" data-value="'+ this.value +'">'+ this.text +'</div>';
                }
            }).length * 28;

            if(isIe6 && optionHeight > this.config.maxHeight){
                dom.list.height(this.config.maxHeight);
            }

           
            dom.list.html(str);
        },
        _bind: function(){
            var self = this,
                dom = this._dom;
            this._update();
            dom.ele.on("change", function(){
                setTimeout($.proxy(self._update, self));
            });

            if(this.config.event === "click"){
                dom.title.click(function(){
                    if(!self._dom.ele.prop("disabled")){
                        if(self._visible){
                            self.hide();
                        } else {
                            self.show();
                        }
                    }
                });


                $document.on("click", ".ui_select_tit", function(){
                    if(this !== dom.title[0]){
                        self.hide();
                    }
                    return false;
                });

                $document.on("click", function(){
                    self._visible && self.hide();
                });
            }



            //委托列表点击事件
            dom.list.on("click", ".ui_select_item", function(){
                dom.span.html( this.innerHTML );
                dom.ele.val( this.getAttribute("data-value") ).change();
                dom.list.find(".ui_select_item").removeClass("ui_select_li_on");
                this.className += ' ui_select_li_on';
                self.hide();
                return false;
            });

        },
        show: function(){
            if(! this._visible){
                this._visible = true;
                this._dom.list.stop().slideDown(200);
                this._dom.wrap.addClass("ui_select_hover");
            }
            return this;
        },
        hide: function(){
            if( this._visible ){
                this._visible = false;
                this._dom.list.hide();
                this._dom.wrap.removeClass("ui_select_hover");
            }
            return this;
        },
        _runCall: function(mod){
            if("function" === typeof mod){
                mod = mod.call(this._dom.ele[0]);
            }
            return mod;
        },
        _append: function(){
            var dom = this._dom,
                config = this.config,
                str =   '<div class="ui_select">'+
                            '<div class="ui_select_tit">'+
                                '<a href="javascript:;">'+
                                    '<span>...</span>'+
                                    '<b></b><i></i>'+
                                '</a>'+
                            '</div>'+
                            '<div class="ui_select_ul"></div>'+
                        '</div>';
            dom.wrap = $(str).insertAfter(dom.ele);

            str = this._runCall(config.width);

            dom.wrap.width(str);

            dom.title = dom.wrap.find(".ui_select_tit");
            dom.span = dom.title.find("span");
            dom.list = dom.wrap.find(".ui_select_ul").css(isIe6? 'width' : "maxWidth", this._runCall(config.maxWidth));
            !isIe6 && (dom.list.css("maxHeight", this._runCall(config.maxHeight)));
            !isIe6 && (dom.list.css("minWidth", str-2));
            dom.ele.hide();
        }
    }

}(jQuery, msc));