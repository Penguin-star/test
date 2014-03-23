/**
    weibo ui 类库
    从 Weibo.UI.Base 中继出来

    author      : comger 
    createdate  : 2011-08-10
    History 
**/

var Weibo = Weibo || { Version:'dev' };
Weibo.UI = Weibo.UI || {};

/**
 计数器管理控件（添加计数器）  
    var countrender = new Ui.CountRender(datasource,interval);
    countrender.Start();
**/
Weibo.UI.CountRender = Weibo.UI.CountRender || ((function(){
    var CountRender = function(datasource,interval){ this.Init(datasource,interval);}

    CountRender.prototype = {
        Interval:1000, //更新时间间隔
        DataSource:null,
        TimerID:null,
        Init:function(datasource,interval){//   启动更新定时器
            if(datasource)
                this.DataSource = datasource;
            this.Interval = interval;
            this.Databind();
            $(".Messager").hide();
        },
        Start:function(){
            this.DataSource.Load();
            if(this.Interval){
                TimerID = setInterval((function(){
                    this.DataSource.Load();
                    $(".pub_time").WeiboDate(); //格式化时间
                }).Bind(this),this.Interval);
            }
        },
        Databind:function(){
            if (this.DataSource.Load){ //为动态数据源
                    this.DataSource.OnChanged.Add((function(e) {
                    if (e.constructor !== Array) {
                        e = e.data;}
                    this.Render(e);
                }).Bind(this), this);
            }else { //直接提供数据集的时候
                this.Render(self.DataSource);
            }
        },
        Render:function(data){
            var all_count = 0;
            Co.Map(function(msg){
                var CountName = $(msg).attr("CountName");
                var Count = data[CountName] || 0;
                if(CountName != "newfans")
                    $(msg).html("("+Count+")");
                else{
                    $(msg).html(Count);
                }
                if(Count>0){
                    $(msg).show();
                    if(CountName != "newfans"){
                        all_count += Count;
                        $("#newicon").show();
                    }
                }else{
                    $(msg).hide();
                }
            },$(".Messager"));
            if(all_count == 0){
                $("#newicon").hide();
            }
			if(!data)return;
            var newcount =parseInt(data["newmsg"] || "0")+parseInt(data["newpolicy"] || "0");
            
            if(newcount>0){
                $("#feed_msg_new span").html(newcount);
                $("#feed_msg_new").show()
            }
            
            var fricount = parseInt(data["gfriend"])+parseInt(data["cfriend"]);
            var fanscount = parseInt(data["fans"]);
			var mcount = parseInt(data["message"]);
			var pcount = parseInt(data["policy"]);
            
			if(fricount>0) $("#friendcount").html(fricount);
			if(fanscount>0) $("#fcount").html(fanscount);
			if(mcount>0) $("#mcount").html(mcount);
			if(pcount>0) $("#pcount").html(+pcount);
        }
    };
    return CountRender;
})());

/**
 Alerter 提示信息
**/
Weibo.UI.Alerter = function(alerttype,errorcode){

    var elm = $("#alerter");
    if(alerttype=="success")
        $("#msgcontent").attr("class","blog_forward_content_right")
    else if(alerttype=="fail")
        $("#msgcontent").attr("class","blog_forward_content_wrong")
    else if(alerttype=="warning")
        $("#msgcontent").attr("class","blog_forward_content_tips")

    Ui.InCenter(elm);
    Ui.AddZindex(elm);

    if(errorcode){
 
        if(typeof errorconfig === 'undefined')
            errorconfig ={
                LOGINFAIL:'登录失败',
                QUESTERROR:'请求异常',
                DeleteSuccess:'删除成功',
                CancelSuccess:"取消成功",
                CollectionSuccess:"收藏成功",
                savegroupsuccess:"分组保存成功",
		"-14": "无权限访问",
                "-13": "数量超出限制",
                "-12": "已存在",
                "-11": "内容不能为空",
                "-10": "不能给自己发送私信",
                "-9": "用户未登录",
                "-8": "密码错误",
                "-7": "图片上传格式错误",
                "-6": "字数超出范围",
                "-5": "用户或密码错误",
                "-4": "密码太短",
                "-3": "密码不相同",
                "-2": "已存在此用户",
                "-1": "必填字段为空"
            }
            

        if(errorconfig[errorcode]){
            elm.find("#msgcontent").html(errorconfig[errorcode]);
        }else{
            if(alerttype=="success") 
                elm.find("#msgcontent").html(errorcode);
            else
                elm.find("#msgcontent").html(errorcode);
        }
        elm.show();
        setTimeout((function(){
            $(this).hide()
        }).Bind(elm),3000);
    }
}



