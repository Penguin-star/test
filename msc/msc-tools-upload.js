/**
 * @name ajax上传插件
 * 请配合 css 完成
 * @todo 将要换成 prototype 来实例
 * 窗口resize的时候只会修改 left,top
 */
(function($, msc) {
    var count = 0;
    msc.tools.upload = function(config){
        config = $.extend({
            id: '',//选择器
            name:'msc_upload',//后端php接收的name值
            mouseover: $.noop,//滑过
            mouseout: $.noop,//滑出
            url: "/testUpload/ajaxUpload.php",//后端url
            className: "",//这个表单的类名
            success: $.noop,//成功回调
            error: $.noop,//错误回调
            change: $.noop//改变回调
        }, config || {});

        //如果没有id 或者 选择器空
        if (!config.id || !(config.id = $(config.id)).length) {
            return this;
        }

        $.each(config.id, function() {
            var that = this,
                id,
                $iframe,
                $form,
                $file,
                $that,
                _resize;
            if(!that._upload){
                that._upload = 1;

                _resize = function(){
                    var offset = $that.offset();
                    $form.css({
                        left: offset.left,
                        top: offset.top
                    });
                    offset = null;
                }

                $that = $(that);

                id = "msc_upload_"+ (count++);

                //用iframe模拟
                $iframe = $('<iframe name="' + id + '" style="display:none;"></iframe>').appendTo(document.body);

                //表单
                $form = $('<form action="' + config.url + '" class="' + config.className + ' ui-upload" target="' + id + '" title="点击选择文件" method="post" enctype="multipart/form-data"><input type="file" name="'+ config.name +'" /></form>').appendTo(document.body).css({width: $that.outerWidth(true), height: $that.outerHeight(true)});

                //绑定事件
                _resize();
                msc.event.resize.add(_resize);

                //模拟上传按钮
                $file = $form.find("input")
                    .mouseenter($.proxy(config.mouseover, that))
                    .mouseleave($.proxy(config.mouseout, that))
                    .change(function() {
                        if ($file.val() && config.change.call(that, $file.val()) !== false) {//如果change的事件返回false则不上传
                            $form.submit();
                            var parames,
                                timer;
                            if (!-[1, ] && !window.XMLHttpRequest) { //解决ie6iframe上传bug， 摘自 贤心
                                timer = setInterval(function() {
                                    try {
                                        parames = $.parseJSON($iframe.contents().find('body').text());
                                    } catch (e) {}
                                    if (parames) {
                                        clearInterval(timer);
                                        timer = null;
                                        if (parames.error === 0) {
                                            config.success.call(that, parames);
                                        } else {
                                            config.error.call(that, parames);
                                        }
                                    }
                                }, 200);
                            } else {
                                $iframe[0].onload = function() {
                                    try {
                                        parames = $.parseJSON($iframe.contents().find('body').text());
                                    } catch (e) {
                                        parames = {
                                            error: -1,
                                            msg: "返回值错误"
                                        }
                                    }
                                    if (parames.error === 0) {
                                        config.success.call(that, parames);
                                    } else {
                                        config.error.call(that, parames);
                                    }

                                    $iframe[0].onload = null;
                                };
                            }

                        }

                    });
            }
        });


        return this;
    }


}(jQuery, window.msc));