/**
 * 美化select
 * @todo 键盘事件,事件委托,添加focus,blur等操作, 多选
 * @description 这一版存在诸多的bug,且没有优化
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
            defaultValue: false//默认文本, 如果 为false则为请选择, 如果为fn则call下, 如果为true则拿option的第一个当
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
            this._dom.wrap.addClass("ui-select-disabled");
            return this;
        },
        enabled: function(){
            this._dom.wrap.removeClass("ui-select-disabled");
            this._disabled = false;
            return this;
        },
        _update: function(){
            var dom = this._dom,
                defa = this._runCall(this.config.defaultValue),
                value = dom.ele.val(),
                selectedValue = dom.ele.find("option:selected").text(),
                str = "";

            

            if(selectedValue){
                defa = selectedValue;
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

            dom.ele.find("option").each(function(){
                if(value == this.value){
                    str += '<div class="ui-select-li-on ui-select-item" data-value="'+ this.value +'">'+ this.text +'</div>';
                } else {
                    str += '<div class="ui-select-item" data-value="'+ this.value +'">'+ this.text +'</div>';
                }
            });

           
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


                $document.on("click", ".ui-select-tit", function(){
                    if(this !== dom.title[0]){
                        self.hide();
                    }
                    return false;
                });

                $document.on("click", function(){
                    self._visible && self.hide();
                });
            }



            //委托列表
            dom.list.on("click", ".ui-select-item", function(){
                dom.span.html( this.innerHTML );
                dom.ele.val( this.getAttribute("data-value") ).change();
                dom.list.find(".ui-select-item").removeClass("ui-select-li-on");
                this.className += ' ui-select-li-on';
                self.hide();
                return false;
            });

        },
        show: function(){
            if(! this._visible){
                this._visible = true;
                this._dom.list.show();
                this._dom.wrap.addClass("ui-select-hover");
            }
            return this;
        },
        hide: function(){
            if( this._visible ){
                this._visible = false;
                this._dom.list.hide();
                this._dom.wrap.removeClass("ui-select-hover");
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
                str =   '<div class="ui-select">'+
                            '<div class="ui-select-tit">'+
                                '<a href="javascript:;">'+
                                    '<span>...</span>'+
                                    '<b></b><i></i>'+
                                '</a>'+
                            '</div>'+
                            '<div class="ui-select-ul"></div>'+
                        '</div>';
            dom.wrap = $(str).insertAfter(dom.ele);

            str = this._runCall(config.width);

            dom.wrap.width(str);

            dom.title = dom.wrap.find(".ui-select-tit");
            dom.span = dom.title.find("span");
            dom.list = dom.wrap.find(".ui-select-ul").css(isIe6? 'width' : "maxWidth", this._runCall(config.maxWidth));
            dom.list.css(isIe6? 'height' : "maxHeight", this._runCall(config.maxHeight));
            !isIe6 && (dom.list.css("minWidth", str-2));
            dom.ele.hide();
        }
    }

}(jQuery, msc));