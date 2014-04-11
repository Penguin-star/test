/**
 * 美化复选框
 * @description ie9+直接使用css解决,必须符合结构 input.ui-checkbox[id=J_test]+label.ui-checkbox-for.icon1[for=J_test]
 * @function
 * @memberOf msc.ui
 * @param  {(string|HTMLElement|jQuery)} id 选择器
 * @example
 *     1, msc.ui.checkbox("#id .checkbox");
 *     2, msc.ui.checkbox($("#test"));
 *     3, 选择:
 *         msc.ui.checkbox.checked("#id", true);
 */
(function($, msc) {
    var CLASSNAME = 'ui-checkbox-for-on',
        isMedia = msc.tools.browser.isMedia;

    /**
     * 获取jQuery对象
     */
    function getJquery(id){
        if(!(id instanceof jQuery)){
            id = $(id);
        }
        return id;
    }

    
    msc.ui.checkbox = isMedia ? 
        $.noop : 
        function(id){
            id = getJquery(id);

            if(!id.length){
                return;
            }
            
            $.each(id, function(){
                var that = this,
                    $label = $(that).next();

                //给label绑定事件
                $label.on("click", function(){
                    if(that.checked){
                        that.checked = false;
                        $(this).removeClass(CLASSNAME);
                    } else {
                        $(this).addClass(CLASSNAME);
                        that.checked = true;
                    }

                    //让点label也触发点击input事件
                    $(that).triggerHandler("click");
                });

                //模拟初始化
                if(that.checked){
                    $label.addClass(CLASSNAME);
                }

                $label = null;
            });
        }

    msc.ui.checkbox.checked = isMedia ? 
        function (id, mark) {
            getJquery(id).prop("checked", !!mark);
        } :
        function (id, mark){
            id = getJquery(id);

            $.each(id, function(){
                var $label = $(this).next();
                if(mark){
                    this.checked = true;
                    $label.addClass(CLASSNAME);
                } else {
                    this.checked = false;
                    $label.removeClass(CLASSNAME);
                }
                $label = null;
            });
        }


}(jQuery, msc));