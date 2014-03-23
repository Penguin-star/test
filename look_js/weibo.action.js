/**
 前端页面初始化，效果及交互
    author comger
**/
//前端常量配置
var Weibo = Weibo || { Version:'dev' };
var so = new Weibo.StaticObjs();
so.Dict("UserCards",{}); //新建用户名片缓存

var UserCardCache = so.Dict("UserCards");

var cancelUploaderImgFlag = "0";
var cancelUploaderImgFlagG = "0";
var defaultThemeUrl = "/theme/default";


$(function(){
    
    $.ReturnTop();

    $(".mblog_item").DelBlogStyle();

	$(".nicknameSubStr").XN_CheckAllCnText();

	$(".input_f_m").change(function(){
		var file = $(this);
		var inputParent = $(".uploaderbtnm");
		
		$("#div_bolg_push_img .uploadinfo").html(file.val());
        $("#div_bolg_push_img").show();

        if (!checkImgType(file.val())) {  
			Ui.Alerter("fail","上传文件格式错误,请上传：gif|jpeg|jpg|png|bmp格式的文件");
            return false;
        } 

		var myform = document.createElement("form");  
		myform.action = "/v5/uploadimgie";  
		myform.method = "post";  
		myform.enctype = "multipart/form-data";  
		myform.style.display = "none";  

		document.body.appendChild(myform); 
		var form = $(myform); 

		var fu = file.clone(true).val(""); 
		file.appendTo(form); 
		form.ajaxSubmit({  
		    success: function (data) {  
                $("#div_bolg_push_img").attr("fid",data);
                $("#div_bolg_push_img").hide();
				inputParent.append(fu);
				if(cancelUploaderImgFlag === "1"){
					$("#div_bolg_push_img").attr("fid","");
					cancelUploaderImgFlag = "0";
					return;
				}
                Ui.Alerter("success","图片上传成功");
		    }  
		}); 
	});

	//判断注册昵称是否重复
	$(".nicknamecheckbox_input").blur(function(){
		var self = $(this);
		var nickname = self.val();
		$(self.parent()).parent().find(".nicknamecheck").html("");
		$.post("/account/nicknamecheck",{"nickname":nickname},function(data){
			if(data === "1"){
				$(self.parent()).parent().find(".Validform_checktip").remove();				
				$(self.parent()).parent().find(".nicknamecheck").html("该昵称已被使用");
			}
		});
	});

	$(".nicknamecheckbox_input").focus(function(){
		var self = $(this);
		$(self.parent()).parent().find(".nicknamecheck").html("");
		if(!$(self.parent()).parent().find(".Validform_checktip")[0]){
			$(self.parent()).parent().find(".personal_name_tips").append('<div class="Validform_checktip"></div>');
		}
	});

	function checkImgType(filename) {  
		var pos = filename.lastIndexOf(".");  
		var str = filename.substring(pos, filename.length)  
		var str1 = str.toLowerCase();  
		if (!/\.(gif|jpg|jpeg|png|bmp)$/.test(str1)) {  
		    return false;  
		}  
		return true;  
	}

	$("#headimg_submit").click(function(){
		if(!$("#headimg_submit_input").val()){
			Ui.Alerter("fail","请选择上传图片");
			return;
		}
		$("#headimg_submit_form").submit();
	});

	$("#cancel_uploader_img").click(function(){
		cancelUploaderImgFlag = "1";
        $("#div_bolg_push_img").hide();
	});

	$("#cancel_uploader_img_g").click(function(){
		cancelUploaderImgFlagG = "1";
        $("#div_bolg_push_img_g").hide();
	});

	$(".input_f_g").change(function(){
		var file = $(this);
		var fileParent = $(".uploaderbtng");
		
		$("#div_bolg_push_img_g .uploadinfo").html(file.val());
        $("#div_bolg_push_img_g").show();

        if (!checkImgType(file.val())) {  
			Ui.Alerter("fail","上传文件格式错误,请上传：gif|jpeg|jpg|png|bmp格式的文件");
            return false;
        } 

		var myform = document.createElement("form");  
		myform.action = "/v5/uploadimgie";  
		myform.method = "post";  
		myform.enctype = "multipart/form-data";  
		myform.style.display = "none";  

		document.body.appendChild(myform); 
		var form = $(myform); 
		var fu = file.clone(true).val(""); 

		var fu = file.clone(true).val(""); 
		file.appendTo(form); 
	  
		form.ajaxSubmit({  
		    success: function (data) {  
				$("#div_bolg_push_img_g").attr("fid",data);
                $("#div_bolg_push_img_g").hide();
				inputParent.append(fu);
				if(cancelUploaderImgFlagG === "1"){
					$("#div_bolg_push_img_g").attr("fid","");
					cancelUploaderImgFlagG = "0";
					return;
				}
                Ui.Alerter("success","图片上传成功");
		    }  
		}); 
	});

    //$(".uploaderbtnm").Uploader();
    //$(".uploaderbtng").Uploaderg();

	$(".government_friend").GovernmentFirend();
	$(".government_fans").GovernmentFirend();
    
    
    $(".dialogbox").hide();
    $(".dialogbox").find(".blog_forward_title_right,.blog_forward_button2").click(function(){ $(this).parents(".dialogbox").hide(); })
    
	$(".orderby").OrderByClass();

	$(".government_box_p").addProvinceu();
	
	//状态追踪
	$(".stateTrack").StateTrack();

	//加为好友
	$(".add_friend_a").AddFriends();
    
    $(".search_page_follow").MyFans();

    
    //注册添加好友事件
    $(".input_add_friend_no").AddFans();

    //打开计数器更新
    if(location.pathname == "/" || location.pathname.indexOf("index")>=0){
        var interval = 1000 * 30;
    }
    else{
        var interval = false;
    }
    var countrender = new Ui.CountRender(new Weibo.Data.DataSource("/count/all"), interval);
    if(location.pathname.indexOf("/account/login")!= 0){
        countrender.Start();
    }

    /**
	$("#fileSelect").click(function(){
		$("#uploaderbtn").Uploader();
	});
    **/
     $(".img_send").live("click",function(){
        $(this).parents(".mblog_item").find(".img_center_send").show();
        $(this).hide();
     });

    $(".img_center_send").live("click",function(){
        $(this).parents(".mblog_item").find(".img_send").show();
        $(this).hide();
    });
    
    
    
	$("#selectuser").click(function(){
		$("#div_government_box").show();
	});

	$(".push_input_gray_float").click(function(){
		$("#div_government_box").hide();
	});

	$(".push_input_float").click(function(){
		var mid = $(this).attr("mid");
		var text="";  
		$("input[name=governmentName]").each(function() {  
		    if ($(this).attr("checked")) {  
		        text += ","+$(this).attr("nickname");  
		    }  
		});
		$("#input_blog_c").val(text.substr(1));
		$("#div_government_box").hide();
	});
    
    $(".dropselect").DropSelect();

    //发布加载字数检测
    $("#pubeditor").InputCounter({
        MaxSize:500,//最大字符数
        Render:"#countmsger",  //信息显示控件
        SuccessFormat:'您还可以输入<span class="gray_font_big">{0}</span>字',
        FailFormat:'超出<span class="gray_font_big">{0}</span>字',
        Fail:function(count){ $("#ole.logubmblog").attr("disabled","true")},
        Success:function(count){ $("#pubmblog").removeAttr("disabled")}
    });

    //评论加载字数检测
    $("#commentEditor").InputCounter({
        MaxSize:300,//最大字符数
        Render:"#countmsger",  //信息显示控件
        SuccessFormat:'您还可以输入<span class="gray_font_big">{0}</span>字',
        FailFormat:'超出<span class="gray_font_big">{0}</span>字',
        Fail:function(count){ $("#commentblog").attr("disabled","true") },
        Success:function(count){ $("#commentblog").removeAttr("disabled") }
    });
    
     $('#PrintBox').FacesDiv(); //初始化表情插件

     $('#PrintBoxwz').FacesDiv(); //初始化表情插件
     
     //隐藏失去焦点的表情层
    $("body").click(function(){
        if($("#layerBoxCon").is(":visible")){
            $("#layerBoxCon").hide();
        }

        $(".ShowFaceDiv,#layerBoxCon").live("click", function(){
            $("#layerBoxCon").show();
            
            $("#layerBoxCon img").live("click", function(){
                $("#layerBoxCon").hide();
                return false;
            });
        });

    });
    
    //初始化,绑定发布,发布新mblog
    $("#pubmblog").click(function(){
        var mblog={
            body:$("#pubeditor").val(),
            page:$("#pubmblog").attr("page"),
            images:$("#div_bolg_push_img").attr("fid")
        };
        if(mblog.body.length==0){//空值
            Ui.Alerter("fail","至少得说些什么吧？");
        }else{
            $("#pubeditor").val("");
            $.post('/mblog/create',mblog,function(result){
                if(result.code=="1"){ //发布成功，返回信息
                    var item = $(result.data);
                    item.MBlog();
                    $('#div_bolg_push_img').attr('fid','');
                    $("#mbloglist").prepend(item);
                    $(".gray_font_big").html(500);
                }else{ //失败，提示信息
                    Ui.Alerter("fail",result.data);
                }
            })
        }
    });   
    
    
    $("#selectuser").click(function(){
        $("#wzuserlist").toggle("slow");
    })
    
	$("#wzuserselect").click(function(){
		var wzuser = "";
		$(":checkbox[name='wzuser']").each(function(i){
		   if($(this).attr("checked")) {  
				wzuser += $(this).val() + ",";
				console.log($(this).val());
			}
    	});
		console.log(wzuser);
	});

    //初始化,绑定发布,发布新问政
    $("#pubwz").click(function(){
		var text="";  
		$("input[name=governmentName]").each(function() {  
		    if ($(this).attr("checked")) {  
		        text += ","+$(this).val();  
		    }  
		});
		$("input[name=governmentName]").each(function() {  
		    if ($(this).attr("checked")) {  
		        $(this).attr("checked",false);
		    }  
		});
		var to_uids = text.substr(1);

        var mblog={
            body:$("#pubeditorwz").val(),
            page:$("#pubmblog").attr("page"),
            to_uid:to_uids,
            title:$("#title").val(),
            type:"p",
            images:$("#div_bolg_push_img_g").attr("fid")
        };
        if(mblog.body.length==0){//空值
            Ui.Alerter("fail","至少得说些什么吧？");		
		}else if(to_uids.length==0){
            Ui.Alerter("fail","请选择问政对象");
        }else{
            $("#pubeditor").val("");
            $.post('/mblog/create',mblog,function(result){
                if(result.code=="1"){ //发布成功，返回信息
                    var item = $(result.data);
                    item.MBlog();
                    $("#mbloglist").prepend(item);

                    $(".gray_font_big").html(500);
                    Ui.Alerter("success","发布成功");
                }else{ //失败，提示信息
                    Ui.Alerter("fail",result.data);
                }
				$(".p_text").attr("value","");
                $("#title").val("");
            })
        }
    });   


    $("#commentblog").click(function(){//回复评论
        var comment={
            body:$("#commentEditor").val(),
            m_uid:$("#mblog").attr("m_uid"),
            m_id:$("#mblog").attr("m_id")
        };
        $.post('comment/add',comment,function(result){
            if(result.code=="1"){ //发布成功，返回信息
                var item = $(result.data);
                //todo
            }else{ //失败，提示信息
                Ui.Alerter("fail",result.data);
            }
        })
    })

	$("#comment_all").click(function(){
		if ($(this).attr("checked")) {  
			console.log("true");
            $("input[name=_id]").each(function() {  
                $(this).attr("checked", true);  
            });  
        } else {  
			console.log("false");
            $("input[name=_id]").each(function() {  
                $(this).attr("checked", false);  
            });  
        } 
	});

     //删除评论全选
    $("#delcomment").click(function(){
        $.delcheckall("/comment/delete", "_id");
    });

    //全选/反选
    $("#all").click(function(){
        $(".recommend").each(function(){$(this).attr("checked",true);});
    });

	$("#invert").click(function(){
        $(".recommend").each(function(){$(this).attr("checked",false);});
	});
    
    //格式化时间
    $(".pub_time").WeiboDate();

    $(".mblog_item").MBlog();
    
    $(".CardRemind").UserCard();



    //微博详情页转发加载字数检测
    $("#detail_comment").InputCounter({
        MaxSize:300,
        Render:$(".detail_countmsger"),  //信息显示控件
        Fail:function(count){
            $("#blogCommentBtn").attr("disabled","true");
        },
        Success:function(count){
            $("#blogCommentBtn").removeAttr("disabled");
        }
   });

    // 微博详细页转发，评论切换
    $(".b_d_rsend, .b_d_comment").live("click", function(){
        $("#detail_comment").focus();
        if($(this).attr("class").indexOf("b_d_rsend")>-1){
            $(".rsendops").show();
            $(".commentops").hide();
        }
        else{
            $(".commentops").show();
            $(".rsendops").hide();
        }
    });
    //微博详细页转发
    $(".rsendbtn").live("click", function(){
        var f_mblog = {
            body:$("#detail_comment").val().Trim(),
            mid:$(this).attr("m_id"),
            sourceid:$(this).attr("sourceid")
        }
        $.post("/mblog/create",f_mblog,function(result){
            if(result.code==0){
                Ui.Alerter("fail",result.data);
            }else if(result.code==1){ //新blog 添加到列表
                Ui.Alerter("success","转发成功！");
                location.reload();
            }

        });
    });
    
   //微博详情页回复
   $(".detailreply").live("click", function(){
        $("#detail_comment").focus();
        $("#detail_comment").val("回复@["+$(this).attr("rep_name")+"]:");
        $("#blogCommentBtn").attr("r_id", $(this).attr("rep_id"));//被回复评论ID
        $("#blogCommentBtn").attr("r_uid", $(this).attr("rep_uid"));//被回复人ID
       
        //把转发/评论切换
        $(".commentops").show();
        $(".rsendops").hide();
    });

    $(".detail_cbody").emotions();
    
    //微博详细页评论
    $(".commentbtn").live("click", function(){
         var comment ={
            body:$(".blog_textarea_big").val(),
            m_id:$(this).attr("m_id"),
            m_uid:$(this).attr("m_uid")
        }
        if($(this).attr("r_id")!=undefined)
            comment["r_id"] = $(this).attr("r_id");
        if($(this).attr("r_uid")!=undefined)
            comment["r_uid"] = $(this).attr("r_uid");

        $.post("/comment/add",comment,function(result){
               if(result.code==0){//失败
                   Ui.Alerter("fail",result.data);
               }else{
                   Ui.Alerter("success","评论成功");
                   $(".blog_textarea_big").val("");
                   $.get("/comment/one/details/"+result.data, {}, function(data){
						console.log(data);
                       $(".blog_class_comment_reply").prepend(data);
                        $(".blog_class_comment_reply").find("div:first").emotions();
                        $(".detail_countmsger .gray_font_big").text("300");
						//TODO:返回html标签
                   });

               }
        })
    })

    //我的评论页面绑定操作
    $(".comment_more").MoreComment();

    if(location.pathname.indexOf("detail")>=0){
        //微博详细页面删除评论回复
        $(".del_replay").live("click", function(){
           var obj = $(this);
           $.post("/comment/delete", {"ids": $(this).attr("commentid")}, function(result){
                if(result.code==0){
                    Ui.Alerter("fail",result.data);
                }else{
                    obj.parents(".comment_item").remove();
                }
            })
        })
    }

    $.fn.SendBox = function(){
        return this.each(function(){
            var self = $(this);
            var btns = self.find(".tabbtn");
            var tabs = $(".sendtab");
            
            change(0);
            
            if(self.attr("tabtype")=="0"){
               tabs.hide();
            }
             
            btns.click(function(){
                var _index = btns.index(this);
                change(_index);
            })
            
            function change(i){
                tabs.hide();
                tabs.eq(i).show();
                btns.removeClass("send_blog_blue");
                btns.addClass("send_blog_gray"); 
                
                btns.eq(i).removeClass("send_blog_gray");
                btns.eq(i).addClass("send_blog_blue");
            }
            
        })
    }
    
    $(".sendbox").SendBox();

    //加载新blog
    $("#feed_msg_new").click(function(){
         $.getJSON("/mblog/new",{ref:$(this).attr("ref")},function(result){
            if(result.code=="1"){ //发布成功，返回信息
                var item = $(result.data);
                //$("#mbloglist").prepend(item);
                //item.MBlog();
                $("#feed_msg_new").hide();

                if($(".mblog_item").length>30){
                    //todo 从后移除去
                }
            }else{ //失败，提示信息
                Ui.Alerter("fail",result.data);
            }
         })
    })

    //页面分类搜索微博
    $("#m_searchbtn").click(function(){
        var args = {};
        args["searchbody"] = $("#m_searchbody").val();
        if($("#m_searchbody").attr("uid")!=undefined)
            args["uid"] = $("#m_searchbody").attr("uid");
        if($(this).attr("mtype")!=undefined)
            args["type"] = $(this).attr("mtype");
        if($(this).attr("ref")!=undefined)
            args["ref"] = $(this).attr("ref");
        
        $.get("/mblog/find", args, function(result){
            if(result.code=="1"){ //发布成功，返回信息
                var item = $(result.data);
                $("#mbloglist").html(item);
                item.MBlog();
                $("#feed_msg_new").hide();
                $("#morepage").hide();
            }else{ //失败，提示信息
                Ui.Alerter("fail","无所需信息");
            }
         })
    });
    
    //top微博搜索
    $("#searchbtn").click(function(){
        location.href="/search/people?searchbody="+encodeURI($("#searchbody").val());
    });
    $("#searchbody").keydown(function(e){
        if(e.which == 13){
            location.href="/search/people?searchbody="+encodeURI($("#searchbody").val());
        }
    });

    $("#searchbtn2").click(function(){
        location.href = location.pathname + "?searchbody=" + encodeURI($("#searchbody2").val());
    });
    $("#searchbody2").keydown(function(e){
        if(e.which == 13){
            location.href = location.pathname + "?searchbody=" + encodeURI($("#searchbody2").val());
        }
    });


   $("#ftpage li").click(function(){  //收藏分页
        var fturl ="/favorite/list?page="+$(this).attr("pageid");
        $.getJSON(fturl,function(result){
            if(result.code=="1"){
                $("#ftlist").html(result.data);
            }else{  Ui.Alerter("fail",result.data);}
        })
    })
    
     //加好友
    $('.addfriend').click(function(){
        var customer_uid = $(this).attr('uid');
        var curr_friend = $(this).parentsUntil(".friendid").parent();
        $.post('/friend/add',{customer_uid : customer_uid}, function(){
            if(curr_friend)curr_friend.hide();
            //Cache[customer_uid] = undefined;
        });
    });
    

    //搜人页面，加好友，和取消关注
    $('.search_add_friend').click(function(){
        var customer_uid = $(this).attr('uid');
        var self = this;
        $.post('/friend/add',{customer_uid : customer_uid}, function(){
            $(".search_cancel_"+customer_uid).show();
            $(".search_add_"+customer_uid).hide();
        });
    });
    $('.search_cancel_friend').click(function(){
        var customer_uid = $(this).attr('uid');
        var self = this;
        $.post('/friend/cancel',{customer_uid : customer_uid}, function(){
            $(".search_cancel_"+customer_uid).hide();
            $(".search_add_"+customer_uid).show();
        });
    });


    $(".DelGroup").click(function(){//删除分组，打开提示
        $("#deldiv").show();
        Ui.InCenter($("#deldiv"));
        var gid = $(this).attr("gid");
        $("#deldiv .blog_forward_button1").click(function(){
            $.post("/group/delete",{groupid:gid},function(result){
                if(result.code=="1"){ //删除成功，返回信息
                    Ui.Alerter("success","删除分组成功");
                    location.href="/myfriend/";
                }else{ //失败，提示信息
                    Ui.Alerter("fail",result.data);
                }
            })
        })
    })

    $(".SaveGroup").click(function(){ $("#groupdiv").groupbox($(this).attr("gid"));})  //保存分组

    
    $(".btn_privacy").ClickToggle("#mygroupdiv") //启用打开和显示方案

    $(".btn_privacy").click(function(){ //加载分组数据
        var gids = $(this).attr("groupids").split(",");
        Co.Map(function(item){
            for(var i=0;i<gids.length;i++){
                if(gids[i]==$(item).val()){
                    $(item).attr("checked","true");
                    break;}
                else{
                    $(item).removeAttr("checked");}
            }     
        },$("#mygroupdiv input"))
    })

    
    $("#mygroupdiv input").click(function(){//修改用户分组信息
        var item ={
            groupid:$(this).val(),
            friendid:$(this).parents("#mygroupdiv").attr("uid")
        }
        var act ;
        if($(this).attr("checked")==true)
            act ="adduser"
        else
            act ="deluser"

        $.post("/group/"+act,item,function(result){
               if(result.code==0){//失败
                   Ui.Alerter("fail",result.data);
               }else{
                   Ui.Alerter("success","成功保存用户分组"); }
        })

        var gids=[];
        var titles =[];
        Co.Map(function(input){
            if($(input).attr("checked")==true){
                gids.push($(input).val())
                titles.push($(input).attr("title"))}
        },$("#mygroupdiv input"))

        Co.Map(function(a){
            if($(a).attr("uid")==item.friendid){
                $(a).attr("groupids",gids.join(','));
                if(titles.length==0)
                    $(a).html("未分组");
                else
                    $(a).html(titles.join(','));
            }
        },$(".btn_privacy"))
    })
    
    

    $(".mymail").MyMail(); //初始化私信功能
    $(".myfansitem").MyFans();  //初始化我的粉丝功能
     
    //发送私信
    $(".sendmsgbn").click(function(){ $("#mymessage").SendMsg();})
    
    $.fn.InitWzUser = function(){
        return this.each(function(){
            var self = $(this);
            
            $.get('/account/wzuserlist',function(data){
                if(data.code!="1"){
                    Ui.Alerter("fail","未能加载数据!");
                }else{
                    self.empty();
                    var lst = data.lst;
                    for(var i=0;i<lst.length;i++){
                        self.append($("<option>").html(lst[i].nickname).val(lst[i].uid));
                    }
                }
            })
        })
    }
    
    $("#wzusers").InitWzUser();

    //删除全选数据
    $.delcheckall = function(url, checkname){
        var checkids =[];
        $("[name="+ checkname +"]:checkbox:checked").each(function(){
            checkids.push($(this).val());
        });

        $.post(url, {"ids": checkids.join(",")}, function(data){
            if(data.code == 1)
                {
                    Ui.Alerter("success","成功！");
                    location.reload();
                }
            else
                Ui.Alerter("fail", data.data);
        });
    }

    //点击查看更多获取数据
    $(".viewMoreMblog").click(function(){
        var self = $(this);
        var endmid = $("ul#mbloglist>li:last-child").attr("mid");
        var page = self.attr("_page");
        var condition = {endmid:endmid, type: self.attr("_type"), page : page, ref : self.attr("_ref")};
        
        var url;
        var method;
        if(location.pathname.indexOf("person") >= 0){
            //个人页面
            url = location.pathname;
            method = $.post;
        }else{
            //首页
            url = "/mblog/find";
            method = $.get;
        }

        method(url, condition,function(data){
            self.attr("_page", parseInt(page) + 1);
            if(data.code == 1){
                $("ul#mbloglist").append(data.data);
                $(".mblog_item").MBlog();
                if(data.end == true){
                    $(".viewMoreMblog").parent().hide()
                }
            }
            if(!data.any_more){
                $(".bolg_bottom_input").hide();
            }
        });
    });


    //搜索页面点击查看更多获取数据
    $("#viewMoreSearch").click(function(){
        var self = $(this);
        var page = self.attr("_page")
        var searchbody = self.attr("_searchbody")
        var condition = {index:page, searchbody:searchbody}
        $.post("", condition, function(data){
            self.attr("_page", parseInt(page) +1);
            if(data.code == 1){
                $("ul#mbloglist").append(data.data);
                $(".mblog_item").MBlog();
                if(!data.more){
                    $(".more_search_box").hide();
                }
            }
        });
    });

    //微博详细页, 评论和问政状态跟踪切换
    $(".detailtab").click(function(){
        $(".detail_commentlist").show();
        $(".detail_tracelist").hide();
        if($(this).attr("tab").indexOf("detail_commentlist") == -1)
        {
            $.get("/g/politics/status", {"mid":$(this).attr("mid")}, function(data){
                var str_ = '<p class="blue_white_title">'+data.lst[0].nickname+'</p><div class="blog_politics11"><ul><!--wz status -->';
                var status = "";
                for(var i=0;i<data.lst.length;i++)
                {
                    switch(data.lst[i].o_status){
                        case "1":
                            status = "已受理";
                            break;
                        case "2":
                            status = "已解决";
                            break;
                        default:
                            status = "未受理";
                            break;
                    }

                    str_ += "<li>"+data.lst[i].addon+" "+ status +"。</li>";
                }
                str_ += "</ul></div>";
                
                $("#politics_status").html(str_);
            });
            $(".detail_commentlist").hide();
            $(".detail_tracelist").show();
        }
    });

})




