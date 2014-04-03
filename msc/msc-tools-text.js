(function(window, $, msc) {
    /**
     * 文本框相关操作
     * @namespace msc.tools.text
     * @memberOf msc.tools
     */
    var text = msc.register("msc.tools.text");


    /**
     * 获取字符串的长度
     * @param  {string}  str    要获取的字符
     * @param  {Boolean} isByte 是否计算字节,如果为true则把中文算成2个字节
     * @return {number}         字符长度
     *
     * @memberOf msc.tools.text
     * @function
     */
    text.getStrLength = function(str, isByte) {
        str += "";
        if (isByte) {
            str = str.replace(/(?:[^\x00-\xff])/g, "**"); //思路来自田想兵
        }
        // console.log(str.length)
        return str.length;
    }

    /**
     * 根据length获取字符串
     * @param  {sgring}  str    目标字符串
     * @param  {number}  length 要获取的位数
     * @param  {Boolean} isByte 是否转换中文为2字符
     * @return {string}         最终字符串
     *
     * @function
     * @memberOf msc.tools.text
     */
    text.getStr = function(str, length, isByte) {
        var i,
            len,
            num,
            temp;
        str += "";
        if (isByte) {
            num = i = 0;
            len = str.length;
            for (; i < len; i++) {
                // if(/(?:[^\x00-\xff])/.test(result[i])){
                // 不用正则判断是否中文
                temp = str.charCodeAt(i);
                num += temp > 0 && temp < 255 ? 1 : 2;

                if (num > length) {
                    break;
                }
            }
            // console.log(i)
            length = i;
        }
        return str.substr(0, length);
    }



    /**
     * 时实监听计算文本框内的字符
     * @param  {(object|string)}            config                  对象配置或者id
     * @param  {number}                     maxLength               如果为数字则是最大数
     * @param  {Function}                   callback                回调
     *
     * config采用{}方式,更利于以后的扩展
     * @param  {(string|element)}           config.id               要绑定的id
     * @param  {number}                     config.maxLength        如果为数字则为最大数,如果为fn,则拿call(ele)执行,如果为false则不强行设置他的输入只触发回调
     * @param  {function}                   config.callback         触发后的回调
     * @param  {boolean}                    [config.isByte=true]    是否把中文计算为2个字符
     *
     * @return {object}                     msc.tools.text
     *
     * @function
     * @memberOf msc.tools.text
     *
     * @example
     *     1, 不限制输入
     *             msc.tools.text.computeNumber("#J_wordme", false, function(e, len){
     *                 J_wordme_hit[0].innerHTML = len;//计算输入了多少个
     *             });
     *             上面代码相当于:
     *             msc.tools.text.computeNumber({
     *                 id:"#J_wordme",
     *                 maxLength:false,//只要不是数字或者小于0, 都视为不计算
     *                 callback: fn
     *             });
     *      2, 限制输入100个字符
     *              msc.tools.text.computeNumber("#id", 100, function(e, len){
     *                  console.log(100 - len);
     *              });
     *      3, 不计算中文
     *              msc.tools.text.computeNumber({
     *                  id:$("#id"),//我支持DOM和$哦
     *                  isByte:false,//不管中文
     *                  callback: fn,
     *                  maxLength: 100
     *              });
     */
    text.computeNumber = function(config, maxLength, callback) {
        if (!$.isPlainObject(config)) { //如果第一个参数不是{}
            config = {
                id: config,
                maxLength: maxLength,
                callback: callback
            }
        }

        //默认参数
        config = $.extend({
            id: null, //id
            maxLength: 280, //最大数
            callback: $.noop, //回调
            isByte: true //是否把中文计算为2字节
        }, config);

        //如果没有id 或者 选择器空
        if (!config.id || !(config.id = $(config.id)).length) {
            return text;
        }


        //遍历所有id
        $.each(config.id, function() {
            var $this = $(this),
                maxLength = ("function" === typeof(config.maxLength) ?
                    config.maxLength.call(this) :
                    config.maxLength) | 0; //call的时候总是拿dom而不是jQuery


            //监听事件
            //失去焦点
            //获得焦点
            //粘贴?
            //按下
            //blur.msc是为了不给别的事件冲突, 害怕该元素在别的地方绑定有blur
            $this.on("blur.msc focus parse keyup", function(e) {
                var value;

                //如果要求输入最大数时才计算
                if (maxLength > 0 && text.getStrLength((value = this.value), !! config.isByte) > maxLength) {
                    this.value = text.getStr(value, maxLength, !! config.isByte);
                }

                //执行回调
                config.callback.call(this, e, text.getStrLength(this.value, !! config.isByte));

            })

            //默认触发下,相当与初始化, 不能写在each外,因为 triggerHandler 只触发第一个元素
            .triggerHandler("blur.msc");

        }); 


        return text;
    }
}(window, jQuery, msc));