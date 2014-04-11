/**
 * @name 图片懒加载插件
 * @description jQuery扩展插件,可制作滚动加载,点击加载等,依赖msc,jQuery,msc.event,目前只对window上操作
 * @copyright 美食天下
 * @version 1.0
 * @author xieliang
 * @email xieyaowu@meishichina.com
 * @example
 *     1, 延迟加载
 *         $("#id img.imgLoad").imgLoad();//默认真实图片路径在 data-src 里, 默认为淡入
 *     2, 修改真实图片路径
 *         $("img.imgLoad").imgLoad({attr:"data-img-src"});
 *     3, 修改淡入效果
 *         $("img").imgLoad({effect:"show"});//没有淡入效果
 *     4, 自定义事件
 *         $("img").imgLoad({event:"xieliang"});//定义事件名
 *         在需要的地方 $("img").trigger("xieliang");//触发加载
 *     5, 设置屏幕偏移, 支持 正，负
 *         $("img").imgLoad({threshold:-100});
 */
;(function($, nameSpace) {
    "use strict";
    var count = 0;

    $.fn[nameSpace] = function(config) {
        var self = this,
            conf,
            cache = {},
            imgLength,
            imgI,
            id,//解决一个页面重复引用问题
            handle;
        
        if (!self.length || self[0].nodeName.toLowerCase() !== "img") {//如果选择器没有 或者 不是图片则返回自己
            return self;
        };
        id = nameSpace + (++count);
        conf = $.extend({}, $.fn[nameSpace].defaults, config || {});//合并
        cache = {};//存放图片对象
        imgLength = self.length,//总图片个数
        imgI = 0;//已加载的图片个数
        if ("scroll" === conf.event) {//如果是滚动事件
            handle = function(obj){
                var item;
                for (item in cache) {//运行图片对象缓存
                    // if (obj.scrollTop + obj.height >= (cache[item].offset().top + conf.threshold)) {//如果该图片可见
                    if (obj.scrollTop + obj.height >= (cache[item].offset().top + conf.threshold) && (cache[item].offset().top+cache[item].height() >= obj.scrollTop)) {//高级可见
                        cache[item].triggerHandler(nameSpace);//触发当前图片的加载事件
                    }
                }
                item = null;
                if (imgI >= imgLength) {//如果已加载大于等于总数
                    imgLength = imgI = cache = null;//清
                    msc.event.resize.remove(id);//移除resize事件
                    return false;//返回false移除scroll事件
                }
            }
            msc.event.scroll.add(id, handle);
            msc.event.resize.add(id, function(obj) { //设置resize时触发事件
                handle(obj);
            });
            setTimeout(function() {
                msc.event.scroll.trigger(id); //默认加载触发下,解决可能滚动条加载完成时不在顶部而不加载图片
            }, 100);
        } else {
            self.one(conf.event, function(){
                $(this).triggerHandler(nameSpace);
            });
        }
        return self.each(function(i) {//遍历所有图片
            var $img = $(this);
            if($img.data(nameSpace) || !$img.attr(conf.attr)){//如果已经加载过 或者 没有占位符
                imgI++;
            } else {
                cache[i] = $img;//把图片填进缓存
                $img.data(nameSpace, 1).one(nameSpace,//绑定一次性事件
                    function() {
                        $("<img />").bind("load",//创建个img来预加载
                        function() {
                            $img.hide().attr("src", $img.attr(conf.attr))[conf.effect]().removeAttr(conf.attr);//显示该图片
                        }).attr("src", $img.attr(conf.attr));
                        delete cache[i];//删除缓存里的
                        imgI++;//让已加载数自增下
                    });
            }
            
        });
    };

    $.fn[nameSpace].defaults = { //默认配置
        attr: "data-src",//连接占位
        effect: "fadeIn",//效果
        event: "scroll",//事件
        threshold:0//偏移,可为正/负数
    };
}(jQuery, 'imgLoad'));