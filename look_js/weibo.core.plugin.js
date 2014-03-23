/**
 jQuery UI 插件集

    author      : comger 
    createdate  : 2011-08-10
    History 

    功能
        1.Blog 发送，转发，评论
        2.字数统计提醒
        3.＠提醒，自动输入
        4.插入话题,插入表情
        6.照片上传，视频上传
**/



(function($){

    //下拉栏处理
    $.fn.DropSelect = function(){
        return this.each(function(){
            var self = $(this);
            var popdiv = self.find(".bolg_bottom_select");
            pophide();

            self.click(function(){
                self.addClass("hover_line");
                //$("#newicon").hide();
                popdiv.show();
				var show_popdiv = true;
				function _hide(){
					show_popdiv = false;
					setTimeout(function(){
						if(!show_popdiv){
							pophide();
						}
					}, 1);
				}
				function _show(){
					show_popdiv = true;
				}
				self.mouseout(_hide);
				self.mouseover(_show);
				popdiv.mouseout(_hide);
				popdiv.mouseover(_show);       


/*
                popdiv.mouseout(pophide);
                
                popdiv.mouseover(function(){
                    self.addClass("hover_line");
                    popdiv.show();
					return;
                });

				self.mouseout(pophide);     */
            })
            
           function pophide(){
                self.removeClass("hover_line");
                popdiv.css("display","none");
           }
        })
    }
    
    
    $.fn.DelBlogStyle = function(){
        //鼠标放上去显示删除
        //author:           llq<llq17501@gmail.com>
        //time :
        if ($(".DelBlog",this).length != 0){
            $(".DelBlog", this).hide();
            $(this).mouseover(function(){
                $(".DelBlog", this).show();
            });
            $(this).mouseout(function(){
                $(".DelBlog", this).hide();
            });
        }
    };

    $.ReturnTop = function(){
        //页面没有下拉时不显示“到顶部”
        //author:           llq<llq17501@gmail.com>
        //time :            2012-05-07
        var $window = $(window);
        function isShowReturnTop(){
            if($window.scrollTop() == 0){
                $(".return_top").hide();
            }else{
                $(".return_top").show();
            }
        }
        isShowReturnTop();
        $window.scroll(isShowReturnTop);
    };

    //在光标位置插入内容
    // eg : $(textarea).insertAtCaret("value");
    $.fn.extend({ 
        insertAtCaret: function(myValue){ 
            var $t=$(this)[0]; 
            if (document.selection) { 
                this.focus(); 
                sel = document.selection.createRange(); 
                sel.text = myValue; 
                this.focus(); 
            } 
            else if ($t.selectionStart || $t.selectionStart == '0') { 
                var startPos = $t.selectionStart; 
                var endPos = $t.selectionEnd; 
                var scrollTop = $t.scrollTop; 
                $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length); 
                this.focus(); 
                $t.selectionStart = startPos + myValue.length; 
                $t.selectionEnd = startPos + myValue.length; 
                $t.scrollTop = scrollTop; 
            } 
            else { 
                this.value += myValue;
                this.focus(); 
            } 
        } 
    });

	//状态追踪
	$.fn.StateTrack = function(){
	    return this.each(function(){
	        var self = $(this);
	        var mid = self.attr('mid');
			var uid = self.attr('uid');
	        
	        self.mouseover(function(){
	            Ui.InPosition($("#expression_all"),self,-450,15);
				status(uid,mid);
	        })
	        
	        self.mouseout(function(){
				setTimeout(function(){
					$("#expression_all").hide();
				} ,3000);	            
	        })
			$("#expression_all").click(function(){
				setTimeout(function(){
					$("#expression_all").hide();
				} ,400);
			});

			function status(uid,mid){
				$.get("/politics/status",{"mid":mid},function(data){
					var result = data.ret;
					$("#div_politics").empty();
					for(var k in data.ret){
						var ret = result[k];					

						var status = "";
						var nickname = "";
						var group = "";
						for(var i=0;i<ret.length;i++){
							nickname = ret[i].nickname;
							var data = ret[i].addon;
							var to_nickname = "";
							if(ret[i].o_status==="0"){
								status = "未受理";
							}else if(ret[i].o_status==="1"){
								status = "已受理";
							}else if(ret[i].o_status==="2"){
								status = "受理完成";
							}else if(ret[i].o_status==="3"){
								to_nickname = ret[i].to_nickname;
								status = "增加处理对象:";
							}else if(ret[i].o_status==="4"){
								to_nickname = ret[i].to_nickname;
								status = "转交";
							}else if(ret[i].o_status==="5"){
								status = "屏蔽";
							}
							group += "<p>" + data + status + to_nickname + "</p>"

						}
						var html ='<div class="expression_center_content">'
						  +'<p><span class="font_blue">'+ nickname +'</span></p>'
						  +'<div class="process_accepted">'
						  + group
						  +'</div>'
						  +'</div>'
						$("#div_politics").append(html);
				        $("#expression_all").show();
					}
				});
			}
	        
	    })
	}; 
    

})(jQuery);

(function($){ 

    /**
        输入字数查询插件
        eg : $(textarea).InputCounter({
            MaxSize:500,
            Render:null,  //信息显示控件
            SuccessFormat:'还能输入{0}字',
            FailFormat:'超出{0}字',
            Fail:fucntion(count){
                //处理字数超出提示
            },
            Reset:null
        });
    **/
    $.fn.InputCounter = function(opts){
        var Opt = {
            Input:null, //字符容器
            MaxSize:500,//最大字符数
            InitSize:0,
            Render:null,  //信息显示控件
            SuccessFormat:'您还可以输入<span class="gray_font_big">{0}</span>字',
            FailFormat:'超出<span class="gray_font_big">{0}</span>字',
            Fail:null,//注册失败事件方法
            Delete:null,//删除事件方法
            Success:null, //
            Reset:null
        }

        function OnKey(e){
            var count = Opt.MaxSize - Opt.Input.val().length +Opt.InitSize;
            if(count>=Opt.InitSize){
                Opt.Input.removeClass("failvaloid");
                $(Opt.Render).html(Opt.SuccessFormat.replace("{0}",count));
                if(Opt.Success)
                    Opt.Success(count);
            }else if(Opt.InitSize > count&& count>=0 ){
                $(Opt.Render).html(Opt.SuccessFormat.replace("{0}",count));
                if(Opt.Success)
                    Opt.Success(count);
                if(Opt.Delete)
                    Opt.Delete(count);
            }else if(count<0){
                Opt.Input.addClass("failvaloid");
                $(Opt.Render).html(Opt.FailFormat.replace("{0}",-count));
                if(Opt.Fail)
                    Opt.Fail(count);
            }
        }

        Opt = $.extend(Opt,opts);
        
        return this.each(function(){
            var input = Opt.Input =  $(this);
            OnKey();
            input.keydown(onkey).keyup(onkey).keypress(onkey).change(onkey).focus(onkey).blur(onkey)
            var time;
            function onkey(e) {
                clearTimeout(time);
                var argus = arguments;
                var keyCode = e.keyCode;
                if (keyCode != 13 && keyCode != 38 && keyCode != 40) {  // 非上下键及回车 延迟300毫秒执行
                    time = setTimeout(function() {
                        OnKey.apply(this, argus);
                    }, 10);
                }
            }
        })
    }

    $.fn.InputCounter.Methods ={
        Reset:function(){
            
        }
    }
    
	//添加地区
    
    $.fn.addProvince = function(type){ 
        return this.each(function(){
            var self = $(this);

            $.get("/province",function(data){
                var result = data.msg;
                root = "/mblog/govaffairs"
                if (type =='c'){
                    root = "/mblog/common"
                }
                for(var i = 0;i<result.length;i++){
                    $(self).append(" | <Li id='"+result[i].val+"' p_name='"+ result[i].name +"'><a href='" + root + "?p_id="+result[i].val+ "&type=" + type + "' class='provinceLi'>"+result[i].name+"</a></Li>");
                }
				if($("#province_display").attr("value") != ""){
	                $("#"+$("#province_display").attr("value")).addClass("province_click");
					var p_name = $("#"+$("#province_display").attr("value")).attr("p_name");
				}
                $(".hover_area .province_title").html(p_name);
                $(".hover_area .province_title").attr("href",root + "?p_id="+$("#province_display").attr("value")+ "&p_name="+p_name +"&type=" + type);
            });
        })
    }

	//发表问政添加地区
    $.fn.addProvinceu = function(){ 
		return this.each(function(){
			var self = $(this);

			$.get("/province",function(data){
				var result = data.msg;
				var html = $("<li></li>");
				html.attr("class","province");
				html.attr("val","");
				html.html("全部");
				html.click(function(){
					govffairs($(this).attr("val"),"全部");
				});

				$(self).append(html);
				for(var i = 0;i<result.length;i++){
					var _li = $("<li></li>");
					_li.attr("class","province");
					_li.attr("val",result[i].val);
					_li.attr("name",result[i].name);
					_li.html(result[i].name);
					_li.click(function(){
						$("#div_government_fri").children().hide();
						govffairs($(this).attr("val"),$(this).attr("name"));
					});
					$(self).append(_li);
				}
				govffairs("");
			});

			function govffairs(p_id,name){
				$("#province_title").html(name);
				$.get("/mblog/govlist",{"province_id":p_id,"type":"g"},function(data){
					var result = data.result;
					if("" != p_id){
						if($("."+p_id).length != 0){
							$("."+p_id).show();
							return;
						}
					}

					for(var i = 0 ; i < result.length; i++){
						if($("."+result[i].id).length > 0){
							$("."+result[i].id).show();
							continue;
						}
						var html = '<div class="img_myfri_head '+ result[i].id +'">'
                    		+'<div class="gover_img"><img src="/static/web'+ defaultThemeUrl + '/images/blog_head.jpg">'
   			              +'<div class="input_gover">'
							+'<input name="governmentName" type="checkbox" nickname="'+ result[i].nickname+'" value="'+ result[i].id+'">'
        		              +'</div>'
        		            +'</div>'
        		            +'<p class="gray_font"><a href="#">'+result[i].nickname+'</a></p>'
        		          +'</div>';

						$("#div_government_fri").append(html);
					}
				});
			}

		})
	}

    /**
     * 地区选择插件
    **/
    $.fn.AreaSelect = function(){
        return this.each(function(){
            var self = $(this);
            var p = self.find("#province");
            var c = self.find("#city");

	        $.get("/v5/province",function(data){
		        var result = data.msg;
		        p.empty();
		        for(var i = 0;i < result.length;i++){
		            var op = $("<option>");
			        op.html(result[i].name).val(result[i].val);
			        if(result[i].val==p.attr("values")){
			            op.attr("selected","selected");
			        }
			        p.append(op);
		        }
                
                var vals = result[0].val;
                if(p.attr("values")!=undefined)
                    vals = p.attr("values");
		        select_city(vals);

		        p.change(function(){
			        select_city($(this).val());
		        })

		        function select_city(province){
			        $.get("/v5/city",{"p_id":province},function(data){
				        c.empty();
				        var result = data.msg;
				        for(var i = 0;i < result.length;i++){
					        var op = $("<option>");
					        op.html(result[i].name).val(result[i].val);
					        if(result[i].val == c.attr("values")){
					            op.attr("selected","selected");
					        }
					        c.append(op);
				        }
				        //c.val(c.val());
			        });
		        }
	        });
        })
    }

    
    //生日日期选择插件
    $.fn.DateSelecter = function(){
        function fillSelect(exp,start,end,val){//填充选择数据,val 为默认值
            $(exp).empty();
			val = val || $(exp).attr("values");
            for(var i=start; i<=end;i++){
				$(exp).append($("<option>").html(i).val(i));
            }
            if(val)
                $(exp).val(val);
                
        }
        
        function dayNumOfMonth(year,month){//选择指定年月的天数
            return 32-new Date(year,month-1,32).getDate();
        }
        
        return this.each(function(){
            var self = $(this);
	    	
            var y = self.find(".years");
            var m = self.find(".months");
            var d = self.find(".days");
            
            var now = new Date();
            
            fillSelect(y,now.getFullYear()-100,now.getFullYear()-18);// fill year
            fillSelect(m,1,12); //fill month
            
            function loadDays(){
                fillSelect(d,1,dayNumOfMonth(y.val(),m.val()));
            }
            
            loadDays(); // fill day
            self.find(".years,.months").change(loadDays);
        })
        
    }
    $.fn.SearchHighlight = function(searchbody){
        $(".search_text:contains(" + searchbody + ")", this).each(function(){
            var text = $(this).html();
            text = text.replace(searchbody, "<span class='red_font'>" + searchbody + "</span>");
            $(this).html(text);
        });
    }

    /**
     名片显示插件
     demo 
     $(".showcard").UserCard();
     #todo 可以添另名片卡缓存，这版未设计
    **/
    $.fn.UserCard = function(){

        function InitCard(Opt,customer_uid){ // 按传入uid 加载数据，并填充名片卡 Dom
            Opt.Card.attr("uid",customer_uid);
            if(UserCardCache[customer_uid]){
                bindData(Opt, UserCardCache[customer_uid]);
            }else{
                $.get('/card',{customer_uid : customer_uid},function(data){
                    UserCardCache[customer_uid]= data;
                    bindData(Opt, data);
                });
            }
        }
        function bindData(Opt, data){
            Opt.Card.html(data);
            $(Opt.Card).find(".arrow_icon").hide();
            $('#ucard .add_friend').click(function(){
                var customer_uid = $(this).parents('#ucard').attr('uid');
                $.post('/friend/add',{customer_uid : customer_uid});
                $('#ucard .not_friend').hide();
                $('#ucard .friend').show();
                UserCardCache[customer_uid] = undefined;
            });
            $('#ucard .cancel_friend').click(function(){
                var customer_uid = $(this).parents('#ucard').attr('uid');
                $.post('/friend/cancel',{customer_uid : customer_uid});
                $('#ucard .friend').hide();
                $('#ucard .not_friend').show();
                UserCardCache[customer_uid] = undefined;
            });

            Opt.Card.find(".SendMgs").click(function(){
                customer_uid = Opt.Card.attr("uid");
                customer_name = Opt.Card.find("#nickname").html();
                $("#mymessage").SendMsg(customer_uid,customer_name);
            })
            
        }

        function rePos(Opt,alink){
            $(".arrow_icon").hide();
            if(alink.attr("side")){
                $("."+alink.attr("side")).show();
            }else{
                $(".arrow_bottom").show();
            }

            var h = 159 ;//Opt.Card.offset().height();//199 卡片高度
            if(Opt.Card.find(".blog_forward_content_delete_fri3").height()>0)
                h = Opt.Card.find(".blog_forward_content_delete_fri3").height()+15;
            var x=0;
            if(alink.attr("side")=="arrow_right"){
                x -=Opt.Card.find(".blog_forward_content_delete_fri3").width()+20;
                h =0;
            }
            if((alink.offset().top-h)<0){
                h = -alink.height()   
            }
            Ui.InPosition(Opt.Card,alink,x,-h);
        }
        
        
        return this.each(function(){
            
            var Opt = {
                Alink:null, //解发容器
                Card:null //名片
            }

            var alink = Opt.Alink = $(this);
            var card =  Opt.Card = $('#ucard');

            if(card.length==0){
                // to do 创建名片卡 Dom 结构
                var el = $('<div id="ucard">');
                //to do
                $("body").append(el);
                card =  Opt.Card = $('#ucard');
                //开始注册上下移动位置
                function onscroll_() {
                    rePos(Opt,alink);
                }
                $(window).scroll(onscroll_);
                $('body').scroll(onscroll_);
            }
            function showcard(){
                Opt.Card.show();
            }

            var showcard_timeout = Co.Timeout(showcard,1000);

            alink.bind("mouseover",function(){
                showcard_timeout.set();
                var uid = $(this).attr("uid");
                InitCard(Opt,uid);
                rePos(Opt,$(this));
                //Opt.Card.show();
            })
            
            alink.mouseout(function(){ 
                showcard_timeout.clear();
                setTimeout((function(){
                    $(this).hide();
                }).Bind(Opt.Card),2000)
            })

            card.mouseover(function(){
                alink.unbind("mouseout");
                $(this).show();
            })

            card.mouseout(function(){
                $(this).hide();
            })
            
        })

        
    }
    
    // Forward 转发插件
    // $(selecter).BlogForward(mblog);
    $.fn.BlogForward = function(mblog){
		function locatePoint(){ 
			if (tea.setSelectionRange) { 
				setTimeout(function() { 
				tea.setSelectionRange(0, 0);
				tea.focus(); 
			}, 0); 
			}else if (tea.createTextRange) { 
				var txt=tea.createTextRange(); 
				txt.moveEnd("character",0-txt.text.length); 
				txt.select(); 
			} 
		}
        function InitDialogData(Opt){ // 按传入mid 加载数据，并填充Blog Dom
            $(".blog_forward_content_font").remove();
            $("#blog_forward_textarea_big").val("");
            var forward_blod = Opt.Mblog.find(".blog_class_people_name").clone();
            var source_blog = Opt.Mblog.find(".blog_class_people_name1,.blog_class_people_name2").clone();
            
            var source_user, forward_user;
            // READY DIV
            var block = $('<div class="blog_forward_content_font blog_forward_content_box">');
			var count =0;
            Co.Map(function(item){
				if(count===1)return;
               	$(item).html("@[{0}]".Format($(item).html()));
				count +=1;
            },forward_blod.find("a"))

            if(source_blog.length>0){
                //处理表情 及 atme
                
                var html = Co.Html.ReplaceTag(forward_blod.html(),"span");
                html = Co.Html.ReplaceTag(html,"a");
				

                html =decodeURIComponent(Co.Html.ReplaceTag(html,"strong"));
				html =decodeURIComponent(Co.Html.ReplaceTag(html,"span"));
				var html = html.split("\n");
				var htmlc = "";
				for(var i = 0;i<html.length;i++){
					htmlc += html[i]; 
				}
                $("#blog_forward_textarea_big").val(htmlc.Trim());

				var tea = document.getElementById("blog_forward_textarea_big"); 			
				if (tea.setSelectionRange) { 
					setTimeout(function() { 
						tea.setSelectionRange(0, 0);
						tea.focus(); 
					}, 0); 
				}else if (tea.createTextRange) { 
					var txt = tea.createTextRange();
					txt.moveEnd("character",0-txt.text.length);
					txt.select(); 
				} 
                
                block.append(source_blog.html());
                Opt.block = source_blog.html();
                source_user = $(source_blog).find("a").eq(0).html();
                forward_user = $(forward_blod).find("a").eq(0).html();
                if(!forward_user)
                    forward_user = $(forward_blod).attr("nickname");
                if(source_user){
                    $("#sourceuser span").html(source_user.replace(/@\[|\]/g,""));
                }

                if(forward_user)
                    $("#forwarduser span").html(forward_user.replace(/@\[|\]/g,""));
                if(source_user==forward_user){
                    $("#forwarduser").hide();
                }else{
                    $("#forwarduser").show();
                }

            }else{
                block.append(forward_blod.html());
                Opt.block = forward_blod.html();
                source_user = $(forward_blod).find("a").eq(0).html();
                if(!source_user)
                    source_user = $(forward_blod).attr("nickname");
                $("#sourceuser span").html(source_user.replace(/@\[|\]/g,""));
                $("#forwarduser").hide();
            }

            
            $("#blog_forward_content").prepend(block);

            //转发加载字数检测
            $("#blog_forward_textarea_big").InputCounter({
                Render:"#f_countmsger",  //信息显示控件
                MaxSize:300,
                Fail:function(count){
                    $("#button_blue_head").attr("disabled","true");
                },
                Success:function(count){
                    $("#button_blue_head").removeAttr("disabled");
                }
            });
        }

        function submitDialog(Opt){  //提交转发
            var f_mblog = {
                body:$("#blog_forward_textarea_big").val().Trim(),
                to_owner:$("#to_owner").attr("checked"),
                to_resender:$("#to_resender").attr("checked"),
                mid:Opt.Dialog.attr("mid"),
                sourceid:Opt.Dialog.attr("sourceid"),
                page:Opt.Dialog.attr("page")
            }
            if($("#blog_forward_textarea_big").val().Trim() == "" && ($("#to_owner").attr("checked") || $("#to_resender").attr("checked")) ){
                Ui.Alerter("fail", "评论不能为空!")
            }else if(Opt.block =="\n此微博已被原文作者删除\n"){
                Opt.Dialog.hide();
                Ui.Alerter("fail", "该微博/问政已删除");
                
            }else{
                $.post("/mblog/create",f_mblog,function(result){
                    if(result.code==0){
                        Ui.Alerter("fail",result.data);
                    }else if(result.code==1){ //新blog 添加到列表
                        var item = $(result.data);
                        item.MBlog();
                        $("#mbloglist").prepend(item);
                        var farward_count = /\d+/.exec(Opt.Alink.html())
                        Opt.Alink.html("转发({0})".Format(parseInt(farward_count)+1));
                    }
                    Opt.Dialog.hide();
					setTimeout(function(){
						location.reload();
					} ,500);
                })
                
                if($("#to_owner").attr("checked")){
                    var f_comment = {
                        body:$("#blog_forward_textarea_big").val().Trim(),
                        m_id:Opt.Dialog.attr("sourceid"),
                        m_uid:Opt.Dialog.attr("m_uid"),
                    }

                    $.post("/comment/add",f_comment,function(result){
                        if(result.code==0){
                            Ui.Alerter("fail",result.data);
                        }
                    })
                } 

                if($("#to_resender").attr("checked")){
                    var f_comment = {
                        body:$("#blog_forward_textarea_big").val().Trim(),
                        m_id:Opt.Dialog.attr("mid"),
                        m_uid:Opt.Dialog.attr("r_uid"),
                    }

                    $.post("/comment/add",f_comment,function(result){
                        if(result.code==0){
                            Ui.Alerter("fail",result.data);
                        }
                    })
                }
            }
            
        }

        function InitDialog(Opt){ //初始化
            var dialog =Opt.Dialog;
            dialog.find(".button_blue_head").click(function(){
               $("#button_blue_head").removeAttr("disabled");
               submitDialog(Opt);
               $("#blog_forward_textarea_big").val("");
               $("#to_owner").removeAttr("checked");
               $("#to_resender").removeAttr("checked");
            });

			dialog.find(".button_gray_head").click(function(){//取消
				dialog.hide();
			})
            //dialog.FacesDiv();
            dialog.attr("ready","true");
        }



        return this.each(function(){

            var Opt = {
                Alink:null, //解发容器
                Dialog:null,
                Mblog:null
            }

            var alink = Opt.Alink = $(this);
            var dialog =  Opt.Dialog = $('#ForwardDialog');
            Opt.Mblog = mblog;
            

            alink.bind("click",function(){
                var mid = Opt.Mblog.attr("mid");
                dialog.attr("mid",mid);
                dialog.attr("sourceid",Opt.Mblog.attr("sourceid"));
                dialog.attr("m_uid",Opt.Mblog.attr("m_uid"));
                dialog.attr("r_uid",Opt.Mblog.attr("r_uid"));
                dialog.attr("page",Opt.Mblog.attr("page"));
                dialog.show();
                InitDialogData(Opt); 
                Ui.InCenter(dialog);
                
                if(typeof dialog.attr("ready")==="undefined")
                    InitDialog(Opt);
                })
        })


    }

    // More Comment 插件
    $.fn.CommentReply = function(comment){

        function InitDialogData(Opt){ // 按传入mid 加载数据，并填充Blog Dom
            $.get("/comment/reply/"+ Opt.Comment.attr("mid"), {}, function(data){
                Opt.Comment.find("#Fold").html(data);
                //绑定表情插件
                Opt.Comment.find("#Fold").FacesDiv();
                //转发加载字数检测
                Opt.Comment.find(".comment_content").InputCounter({
                    MaxSize:300,
                    Render:Opt.Comment.find(".c_countmsger"),  //信息显示控件
                    Fail:function(count){
                        Opt.Comment.find(".comment_submit").attr("disabled","true");
                    },
                    Success:function(count){
                        Opt.Comment.find(".comment_submit").removeAttr("disabled");
                    }
               }); 
            });
        }

        //回复评论
        function submitDialog(formobj, Opt){  
            var args = formobj.serializeArray();
            formobj.find("textarea").val("");
            $.post("/comment/add", args, function(result){
                if(result.code==1){
                    Ui.Alerter("success", "回复成功！");

                    //formobj.find("textarea").val("");
                    Opt.Comment.find(".gray_font_big").text("300");
                }
                else Ui.Alerter("fail",result.data);
            });
        }

        //初始化
        function InitDialog(Opt){ 
            var dialog = Opt.Dialog;
            dialog.find(".comment_submit").live("click", function(){
                   submitDialog(dialog.find(".commentform"), Opt);
            });
        }

        var Opt = {
            Alink:null,
            Dialog:null,
            Mblog:null
        }

        return this.each(function(){
            var alink = Opt.Alink = $(this);
            var dialog = Opt.Dialog = comment.find('#Fold');
            Opt.Comment = comment;
            InitDialog(Opt);

            alink.bind("click", function(){
                if(Opt.Comment.find("#Fold").is(":hidden")){
                    Opt.Comment.find("#Fold").show();
                    Opt.Comment.find("#Fold").html("<div class='blog_class_comment'><div class='blog_class_comment_bottom1' id='PrintBox'><div class='blog_class_comment_box'></div><div class='blog_class_comment_box' style='text-align:center;'><img src='/static/web"+defaultThemeUrl+"/images/loading.gif'/></div></div></div>");

                    InitDialogData(Opt);
                }
                else
                    Opt.Comment.find("#Fold").hide();
            });
        });
    }

    //MORE COMMENT
    //$(".comment_more").MoreComment();
    $.fn.MoreComment = function(){
        function InitFns(self){
            self.find(".CommentReply").CommentReply(self); //reply
            
            self.find(".DelReply").click(function(){ //删除
                var ids = [];
                ids.push(self.attr("mid"));
                $.post("/comment/delete", {"ids": ids.join(",")}, function(result){
                    if(result.code==0){
                        Ui.Alerter("fail",result.data);
                    }else{
                        Ui.Alerter("success","删除成功"); 
                        //TODO 删除评论
                        self.remove();
                    }
                }, "json");

            });
            //初始化用户名片卡
            self.find(".CardRemind").UserCard();
            //绑定表情
            self.find('.cbody').emotions();
        }
        return this.each(function(){
            InitFns($(this));
        });
    }


    // Comment 插件
    $.fn.CommentBlog = function(mblog){
        // 按传入mid 加载评论列表
        function InitDialogData(Opt){
            $.get("/comment/mbloglist/"+ Opt.Mblog.attr("mid"), {}, function(data){
                Opt.Mblog.find("#Fold").html(data);
                // 若被转发的原文已删除，当前微博不可评论给原作者且不能转发
                if(Opt.Mblog.attr("refdel")=="true"){
                    $(".comm_omblog, .foward_omblog").hide();
                }                  
                //绑定表情插件
                mblog.find("#Fold").find("#PrintBox").FacesDiv();
                //将表情符号显示为图片
                mblog.find('.cbody').emotions();
                //个人卡片
                mblog.find(".CardRemind").UserCard();
                //格式化时间
                mblog.find(".pub_time").WeiboDate();

                //转发加载字数检测
                mblog.find(".comment_content").InputCounter({
                    MaxSize:300,
                    Render:mblog.find(".c_countmsger"),  //信息显示控件
                    Fail:function(count){
                        mblog.find(".comment_submit").attr("disabled","true");
                    },
                    Success:function(count){
                        mblog.find(".comment_submit").removeAttr("disabled");
                    }
               });
            });  
        }


        function submitDialog(formobj, Opt){  
            var args = formobj.serializeArray();
            //提交评论
            formobj.find("textarea").val("");
            $.post("/comment/add", args, function(result){
                if(result.code==1){
                    $.get("/comment/one/index/"+result.data, {}, function(data){
                        Opt.Mblog.find(".replylist").prepend(data);
                        Opt.Mblog.find('.cbody').emotions();
                        Opt.Mblog.find(".CardRemind").UserCard();
                        //格式化时间
                        Opt.Mblog.find(".pub_time").WeiboDate(); 
                    });
                    //formobj.find("textarea").val("");
                    Opt.Mblog.find(".gray_font_big").text("300");
                    var comment_count = /\d+/.exec(Opt.Alink.html())
                    Opt.Alink.html("评论({0})".Format(parseInt(comment_count)+1));
                }
                else Ui.Alerter("fail",result.data);
            });
            
            //转发微博
            if(formobj.find("input[name='isforward']").attr("checked")){
                var mblog={};
                mblog["sourceid"] = Opt.Mblog.attr("sourceid");
                mblog["body"] = formobj.find("textarea").val();
                mblog["page"] = Opt.Mblog.attr("page");
                $.post("/mblog/create", mblog, function(data){
                    if(data.code == 1){
                        $("#mbloglist").prepend(data.data);
                        //绑定转发的那条微博的各事件
                        $("#mbloglist").find("li:first").MBlog();
                    }
                });
            }
        }

        function InitDialog(Opt){ //初始化
            var dialog = Opt.Dialog;
            dialog.find(".comment_submit").live("click", function(){
                   submitDialog(dialog.find(".commentform"),Opt);
            });

            dialog.find("#layerBoxCon").find("img").live("click",function(){
                   dialog.find(".comment_content").insertAtCaret($(this).attr("alt"));
            });

            dialog.find(".comment_replay").live("click", function(){
                   dialog.find("textarea").val("").insertAtCaret("回复@["+$(this).attr("repname")+"]:");
                   dialog.find("#r_uid").val($(this).attr("repid"));//被回复人ID
                   dialog.find("#r_id").val($(this).attr("rep_comment_id"));//被回复评论ID
            });

            dialog.find(".del_replay").live("click", function(){
                   var curr_comment = $(this).parentsUntil(".bolg_content_comment_line").parent();
                   $.post("/comment/delete", {"ids": $(this).attr("commentid")}, function(result){
                    if(result.code==0){
                        Ui.Alerter("fail",result.data);
                    }else{
                        //删除评论
                        curr_comment.remove();
                    }
                });
            });

        }

        var Opt = {
            Alink:null, //解发容器
            Dialog:null,
            Mblog:null
        }
        
        return this.each(function(){
            var alink = Opt.Alink = $(this);
            var dialog = Opt.Dialog = mblog.find('#Fold');
            Opt.Mblog = mblog;
            InitDialog(Opt);

            alink.bind("click", function(){
                
                if(Opt.Mblog.find("#Fold").is(":hidden")){
                    Opt.Mblog.find("#Fold").show();
                    Opt.Mblog.find("#Fold").html("<div class='blog_class_comment'><div class='blog_class_comment_bottom1' id='PrintBox'><div class='blog_class_comment_box'></div><div class='blog_class_comment_box' style='text-align:center;'><img src='/static/web"+defaultThemeUrl+"/images/loading.gif'/></div></div></div>");
                    
                    InitDialogData(Opt);
                }
                else
                    Opt.Mblog.find("#Fold").hide();
            });
        })

    }



    //初始化微博各种功能 
    //$(selecter).MBlog();
    $.fn.MBlog = function(){
           
        function InitFns(self){ //初始化Blog功能

            var mid =self.attr("mid");
            var atmeid = self.attr("atmeid");
            var favoriteid = self.attr("favoriteid");

            self.find(".ForwardBlog").BlogForward(self); //转发

            self.find(".HasDeleteBlog").click(function(){
                Ui.Alerter("warning","原微薄已经删除，无法转发/评论.");
            });

            self.find(".CommentBlog").CommentBlog(self); //评论
            self.find(".CollectionBlog").live("click",function(){
                var _CollectionBlog = $(this);
                $.post("/favorite/create",{mid:mid},function(result){
                    if(result.code==0){//失败
                        Ui.Alerter("fail",result.data);
                    }else{ 
                        Ui.Alerter("success","收藏成功");
                        _CollectionBlog.html("取消收藏").attr("class","CancelCollection");
                        
                    }
                });
            });
            

            self.find(".CancelCollection").live("click",function(){
            	var _CancelCollectionBlog = $(this);
                $.post("/favorite/delete",{mid:mid},function(result){
                    if(result.code==0){//失败
                        Ui.Alerter("fail",result.data);
                    }else{ 
                        Ui.Alerter("success","取消收藏成功");
                        _CancelCollectionBlog.html("收藏").attr("class","CollectionBlog");
                    }
                });
            });

             self.find(".SupportMblog").click(function(){ // 支持
                var _SupportMblog = $(this);
                $.post("/mblog/blogupdate",{mid:mid},function(result){
                    if(result.code==0){//失败
                        Ui.Alerter("fail",result.data);
                    }else{ 
                        Ui.Alerter("success","支持成功");
                        _SupportMblog.removeClass("SupportMblog").unbind("click");
                        var support_count = /\d+/.exec(_SupportMblog.html())
                        _SupportMblog.html("已支持({0})".Format(parseInt(support_count)+1));
                        
                    }
                })
            });
            
            self.find(".DelBlog").click(function(){ //删除微博
                $.post("/mblog/delete",{mid:mid},function(result){
                    if(result.code==0){//失败
                        Ui.Alerter("fail",result.data);
                    }else{
                        Ui.Alerter("success","删除成功"); 
                        self.remove();
                        if($(".mblog_item").length==0){
                            location.href= "/person";
                        }
                    }
                })
            });
            
            self.find(".CardRemind").UserCard();//初始化用户名片卡

            self.find(".pub_time").WeiboDate(); //格式化时间

            self.find(".CancelCollectionBlog").click(function(){//取消收藏
                $.post("/favorite/delete",{mid:mid},function(result){
                    if(result.code==0){//失败
                        Ui.Alerter("fail",result.data);
                    }else{
                        Ui.Alerter("success","取消收藏成功"); 
                        $(self).remove();
                    }
                })
            })
            
            //格式化表情
            self.find(".mbody").emotions();

            self.find(".DelAtme").click(function(){
                $.post("/atme/del/",{atmeid:atmeid},function(result){
                    if(result.code==0){//失败
                        Ui.Alerter("fail",result.data);
                    }else{
                        Ui.Alerter("success","屏蔽成功"); 
                        $(self).remove();
                    }
                })
            })
        }

        return this.each(function(){
            if(!this._has_init_fns){
                InitFns($(this));
                this._has_init_fns = true;
                //标志，每个只初始化一次
            }
        })
    }


    //MoreToggle 
    // $(selecter).MoreToggle(target);
    $.fn.MoreToggle = function(target,floatto){
        return this.each(function(){
            target = $(target);
            $(this).mouseover(function(){
                if(floatto) //需要浮动支触发位置
                    Ui.InPosition(target,this,0,0);
                target.show();
            })

            $(target).mouseover(function(){  target.show(); target.attr("show","true")})
            $(target).mouseout(function(){  target.hide(); target.removeAttr("show")})

            $(this).mouseout(function(){
                setTimeout((function(){
                    if(typeof $(target).attr("show")=== "undefined")
                        target.hide();
                }).Bind(this),1000);
            })
        })
    }

    //点击打开新层，点击其它地方，关闭层
    $.fn.ClickToggle = function(target){
        return this.each(function(){
            target = $(target);
            $(this).click(function(){
                Ui.InPosition(target,this,0,25);
                target.attr("uid",$(this).attr("uid"));
                target.show();
            })
        })
    }

    //转成微博时间 
    // $(selecter).WeiboDate();
    $.fn.WeiboDate = function(){
        return this.each(function(){
            $(this).html(Co.Dates.Convert($(this).attr("truetime")).ToWeiboDate());
        })
    }

    //添加用户为好友插件
    // $(selecter).AddFans();
    $.fn.AddFans = function(){
        $(this).click(function(){
            var self = $(this);
            var params = {//参数表
                customer_uid:self.attr("uid")
            }
            $.post("/friend/add",params,function(result){
                if(result.code==1){
//                    self.html("已加为好友");
//                    self.attr("class","input_add_fri_ok");
                    Ui.Alerter("success","添加成功");
					if($(".government_friend"))
						$(".government_friend").empty();
						$(".government_friend").GovernmentFirend();
					if($(".government_fans"))
						$(".government_fans").empty();
						$(".government_fans").GovernmentFirend();
                }else{
                    Ui.Alerter("fail",result.data);
                }
            })
        });
    }

    //<img textarea="ssss">  过期
    // $(".PrintBox").FacePlugin()
    $.fn.FacePlugin = function(){
        return this.each(function(){
            $(this).find(".ShowFaceDiv").ShowFaces($(this)); 
        });
    }

    //dailogbox close
    $.fn.dialogbox = function(){  // 对话框的关闭事件注册
        return this.each(function(){
            var eml = $(this);
            elm.find(".blog_forward_title_right,.blog_forward_button1").click(function(){ elm.hide(); })
        })
    }

    $.fn.SendMsg = function(customer_uid,customer_name,fn){ //发私信
        function InitDailog(eml){
            var customer = $(eml.find(".email_input_text")[0]);
            eml.find(".blog_forward_button1").click(function(){
                if(customer.val().length==0 || customer.val().indexOf('对方姓名')>=0){
                    Ui.Alerter("fail","请输入收信人");
                    return false;
                }
                var mymsg ={
                    body:$($(".email_input_textarea")[0]).val(),
                    customer_uid:customer_uid,
                    customer_name:customer.val()
                }

                $.post("/mail/send",mymsg,function(result){
                    if(result.code==1){
                        Ui.Alerter("success","发送成功");
                        if(fn)
                            fn()
                        $($(".email_input_textarea")[0]).val("");
                        customer.val("")
                        eml.hide();
                        window.location.reload(); 
                    }else{
                        Ui.Alerter("fail",result.data);
                    }
                })
            })
            
            customer.click(function(){
                if(customer.val().indexOf('对方姓名')>=0)
                    customer.val("");
            })

            eml.find(".email_input_textarea").InputCounter({
                MaxSize:500,//最大字符数
                Render:".my_email_right",  //信息显示控件
                Fail:function(count){ eml.find(".blog_forward_button1").attr("disabled","true")},
                Success:function(count){ eml.find(".blog_forward_button1").removeAttr("disabled")}
            });
            eml.attr("ready","true");
        }
        return this.each(function(){
            var eml = $(this);
            Ui.InCenter(eml);
            eml.show();
            $(".email_input_textarea").val("");

            var customer = $(eml.find(".email_input_text")[0]);
            if(customer_name){
                customer.val(customer_name).attr("disabled","true");
            }else{
                eml.find(".email_input_text").removeAttr("disabled");
                customer.val("请输入对方姓名，多个用户之间用逗号隔开");
            }

            if(typeof eml.attr("ready")==="undefined")
                InitDailog(eml);
        })
    }

    //分组管理
    $.fn.groupbox = function(gid){ 
        
        return this.each(function(){
            var eml = $(this);
            Ui.InCenter(eml);
            eml.show();
            if(typeof gid === "undefined"){
                eml.find(".blog_forward_title_left").html("新建分组");
            }else{
                eml.find(".blog_forward_title_left").html("修改分组");
            }
            var group = eml.find(".email_input_text");
            
            eml.find(".blog_forward_button1").click(function(){
                if(group.val().length==0){
                    Ui.Alerter("fail","请输入分组名称");
                    return false;
                }

                $.post("/group/save",{group:group.val(),groupid:gid},function(result){
                    if(result.code==1){
                        Ui.Alerter("success","保存分组成功");
                        group.val("");
                        eml.hide();
                    }else{
                        Ui.Alerter("fail",result.data);
                    }
                })
                
                $(this).unbind("click");
            })
        })
    }

    //私信管理
    $.fn.MyMail = function(){
        return this.each(function(){
            var eml = $(this);
            eml.find(".backmail").click(function(){//初始化私信对话框
                $("#mymessage").SendMsg(eml.attr("uid"),eml.attr("nickname"),function(){
                    location.href ="/mymail"
                })
            })

            eml.find(".delallmail").click(function(){//删除单条私信
                $.post("/mail/delall",{uid:eml.attr("uid")},function(result){
                    if(result.code==1){
                        Ui.Alerter("success","删除私信成功");
                        eml.remove();
                    }else{
                        Ui.Alerter("fail",result.data);
                    }
                })
            })

            eml.find(".delmail").click(function(){//删除对话
                $.post("/mail/delete",{mailid:eml.attr("mailid"), owner:eml.attr("uid")},function(result){
                    if(result.code==1){
                        Ui.Alerter("success","成功删除对话");
                        eml.remove();
                    }else{
                        Ui.Alerter("fail",result.data);
                    }
                })
            })
        })
    }

    //粉丝管理
    $.fn.MyFans = function(){

        return this.each(function(){
            var eml = $(this);
            
            eml.find(".rmfans").click(function(){//移除粉丝
                $.post("/fans/rm",{uid:eml.attr("uid")},function(result){
                    if(result.code==1){
                        Ui.Alerter("success","移除粉丝成功");
                        eml.remove();
                    }else{
                        Ui.Alerter("fail",result.data);
                    }
                })
            })

            eml.find(".sendmsg").click(function(){//发私信
                $("#mymessage").SendMsg(eml.attr("uid"),eml.attr("nickname"))
            })

            eml.find(".CancelFriend").click(function(){//取消好友
                $.post("/friend/Cancel",{customer_uid:eml.attr("uid")},function(result){
                    if(result.code==1){
                        Ui.Alerter("success","取消成功");
						setTimeout(function(){
							location.reload();
						} ,500);
                    }else{
                        Ui.Alerter("fail",result.data);
                    }
                })
            })

            eml.find(".addfriend").click(function(){//加为好友
                $.post("/friend/add",{customer_uid:eml.attr("uid")},function(result){
                    if(result.code==1){
                        //todo
                        Ui.Alerter("success","添加成功");
						setTimeout(function(){
							location.reload();
						} ,500);
                    }else{
                        Ui.Alerter("fail",result.data);
                    }
                })
            })
        })
    }
    
    //好友管理 ,移除好友
    $.fn.FriendItem = function(){
        return this.each(function(){
            var eml = $(this);
            
            eml.find(".CancelFriend").click(function(){
                $.post("/friend/cancel",{customer_uid:eml.attr("uid")},function(result){
                        if(result.code==1){
                            Ui.Alerter("success","移除成功");
                            eml.remove();
                        }else{
                            Ui.Alerter("fail",result.data);
                        }
                })
            })
        })
    }
    
    //上传
	/**
	 * $("#uploadimg").Uploader()
	 *
	**/
    $.fn.Uploader = function(){
        return this.each(function(){
            var self = $(this);
            $("#div_bolg_push_img").hide();
            self.SizeLimit = 22220000;
            self.Msg = "";
            self.FileExt = "*.jpg,*.txt,*.png";
            self.FileDesc = "jpg 文件或 png 文件";
            
            var elm = $("#uploadformm");
            var input = elm.find(".input_f");
            
            self.Form = elm.find("#pic_uploadm");

            self.Form.ajaxForm({
                 success: function(data) {
                     data = eval('(' + $(data).html() + ')');
                     if(data.status){
                        self.attr("fid",data.fid);
                        $("#div_bolg_push_img").hide();
		                Ui.Alerter("success","图片上传成功");
                     }
                 }
            });
            
            self.click(function(){
                input.click();
            });

			if ($.browser.msie)
			{
				// IE suspends timeouts until after the file dialog closes
				input.get(0).onpropertychange = function(){

				};
			}
			else
			{
				// All other browsers behave
				input.change(function(){
		            var _file =this.files[0];
		            $("#div_bolg_push_img .uploadinfo").html(_file.name);
		            $("#div_bolg_push_img .uploadstatus").show();
		            $("#div_bolg_push_img").show();
		            
		            if(checkfile(_file)){
		                self.Form.submit();
		            }else{
		                console.log(self.Msg);
		            }
		        })

			}
            
            
            
            function checkfile(file){
                var flag =true,count=0;
                self.Msg= new Array();
                self.filename = file.name;
                if(self.SizeLimit<file.size){
					Ui.Alerter("fail","上传文件超出单个文件限制");
	                $("#div_bolg_push_img").hide();
                    count ++,self.Msg.push(file.fileName+"上传文件超出单个文件限制"); 
				}
                    
                if(self.FileExt){
                    var _ext= file.name.split(".")[1];
                    if(self.FileExt.indexOf(_ext)<0){
		                Ui.Alerter("fail","上传文件格式错误,请上传："+self.FileDesc);
		                $("#div_bolg_push_img").hide();
                        count ++, self.Msg.push(file.name+"上传文件格式错误,请上传："+self.FileDesc); 
					}
                }
                if(count>0) flag =false;
                return flag;
            };


        })
    };

    $.fn.Uploaderg = function(){
        return this.each(function(){
            var self = $(this);
            $("#div_bolg_push_img_g").hide();
            self.SizeLimit = 22220000;
            self.Msg = "";
            self.FileExt = "*.jpg,*.txt,*.png";
            self.FileDesc = "jpg 文件或 png 文件";
            
            var elm = $("#uploadformg");
            var input = elm.find(".input_f");
            
            self.Form = elm.find("#pic_uploadg");

            self.Form.ajaxForm({
                 success: function(data) {
                     data = eval('(' + $(data).html() + ')');
                     if(data.status){
                        self.attr("fid",data.fid);
                        $("#div_bolg_push_img_g").hide();
		                Ui.Alerter("success","图片上传成功");
                     }
                 }
            });
            
            self.click(function(){
                input.click();
            });
            input.change(function(){
                var _file =this.files[0];
                $("#div_bolg_push_img_g .uploadinfo").html(_file.name);
                $("#div_bolg_push_img_g .uploadstatus").show();
                $("#div_bolg_push_img_g").show();
                
                if(checkfile(_file)){
                    self.Form.submit();
                }else{
                    console.log(self.Msg);
                }
                
            })
            
            
            function checkfile(file){
                var flag =true,count=0;
                self.Msg= new Array();
                self.filename = file.name;
                if(self.SizeLimit<file.size){
					Ui.Alerter("fail","上传文件超出单个文件限制");
                    count ++,self.Msg.push(file.fileName+"上传文件超出单个文件限制"); 
	                $("#div_bolg_push_img_g").hide();
				}
                    
                if(self.FileExt){
                    var _ext= file.name.split(".")[1];
                    if(self.FileExt.indexOf(_ext)<0){
						Ui.Alerter("fail","上传文件格式错误,请上传："+self.FileDesc);
		                $("#div_bolg_push_img_g").hide();
                        count ++, self.Msg.push(file.name+"上传文件格式错误,请上传："+self.FileDesc); 
					}
                }
                if(count>0) flag =false;
                return flag;
            };


        })
    };


    $.fn.GovernmentFirend = function(){
        return this.each(function(){
            var self = $(this);
			var type = self.attr("type");
			
			$.get("/account/userbyfans/"+type,function(data){
				
				var result = data.result;
				for(var i=0;i < result.length;i++){
					var html = '<li>'
				      +'<div class="no_fri_head CardRemind"><img src=/headimg/50/"'+ result[i].uid +'" width="50" height="50"></div>'
				      +'  <div class="no_fri_name">'
				      +'    <ul>'
                      +'      <li>'+(result[i].companyid || "")+'&nbsp;&nbsp;'+ result[i].nickname +'</li>'
				      +'      <li>'
				      +'        <div class="add_fri_right_no"><a href="javascript:void(0)" uid="'+ result[i].uid +'" class="input_add_friend_no">加为好友</a></div>'
				      +'      </li>'
				      +'    </ul>'
				      +'  </div>'
				      +'  <div  style="clear:both"></div>'
				      +'</li>';
					self.append(html);
				}

			    $(".input_add_friend_no").AddFans();

			});
        })
    };

    $.fn.GovernmentFans = function(){
        return this.each(function(){
            var self = $(this);
			var type = self.attr("type");
			
			$.get("/account/userbyfans/"+type,function(data){
				
				var result = data.result;
				for(var i=0;i < result.length;i++){
					var html = '<li>'
				      +'<div class="no_fri_head CardRemind"><img src=/headimg/50/"'+ result[i].uid +'" width="50" height="50"></div>'
				      +'  <div class="no_fri_name">'
				      +'    <ul>'
				      +'      <li>'+result[i].companyid+'&nbsp;&nbsp;'+ result[i].nickname +'</li>'
				      +'      <li>'
				      +'        <div class="add_fri_right_no"><a href="javascript:void(0)" uid="'+ result[i].uid +'" class="input_add_friend_no">加为好友</a></div>'
				      +'      </li>'
				      +'    </ul>'
				      +'  </div>'
				      +'  <div  style="clear:both"></div>'
				      +'</li>';
					self.append(html);
				}
			    $(".input_add_friend_no").AddFans();
			});
        })
    };


    $.fn.AddFriends = function(){
        return this.each(function(){
            var self = $(this);
			var type = self.attr("value");

			self.click(function(){
				var text="";  
				$("input[name="+ type +"]").each(function() {  
				    if ($(this).attr("checked")) {  
				        text += ","+$(this).val();  
				    }  
				}); 
				$.post("/friend/add",{"customer_uid":text.substr(1)},function(result){
					if(result.code === 1){
		                Ui.Alerter("success","添加好友成功");

						$("input[name="+ type +"]").each(function() {  
							if ($(this).attr("checked")) {  
								$(this).parent().parent().parent().remove();
							}  
						}); 
					}else{
		                Ui.Alerter("fail",result.data);
					}
				});
			})
			
        })
    };

    $.fn.OrderByClass = function(){
        return this.each(function(){
            var self = $(this);
			var order = self.attr("order");

			$(".orderby").attr("class","orderby");
			$("li[name="+order+"]").attr("class","order label2");
			
        })
    };

	$.fn.XN_CheckAllCnText = function(){ 
		return this.each(function(){
			var self = $(this);
			var nickname = self.html();
			var reg=/[\u4E00-\u9FA5]/g 
			if (reg.test(nickname)){
				if(nickname.length > 4)
					self.html(nickname.substr(0,4)+"..");
			} 
			else{
				if(nickname.length > 6)
					self.html(nickname.substr(0,6)+"..");
			} 
		})
	};



})(jQuery); 



(function($){
    //表情插件
    //$("div").FacesDiv() div 里应包含 触发控件，及 textarea 
    $.fn.FacesDiv = function(){

        var Opt={
            Element:null,
            Faces:null,
            TextArea:null
        }

        return this.each(function(){
            var eml = Opt.Element = $(this).find(".ShowFaceDiv");
            Opt.TextArea = $(this).find("textarea");
            var faces = Opt.Faces = $("#layerBoxCon");
            if(faces.length==0)
               faces = Opt.Faces = $('<div class="expression_all divFaces" id="layerBoxCon"><div class="expression_top"></div><div class="expression_center"><div class="expression_center_content"><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/0.gif" title="[微笑]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/1.gif" title="[冷]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/2.gif" title="[色狼]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/3.gif" title="[发呆]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/4.gif" title="[得意]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/5.gif" title="[流泪]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/6.gif" title="[害羞]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/7.gif" title="[闭嘴]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/8.gif" title="[睡]"/></div>	<div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/9.gif" title="[大哭]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/10.gif" title="[尴尬]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/11.gif" title="[发怒]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/12.gif" title="[调皮]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/13.gif" title="[呲牙]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/14.gif" title="[惊讶]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/15.gif" title="[难过]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/16.gif" title="[装酷]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/17.gif" title="[冷汗]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/18.gif" title="[抓狂]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/19.gif" title="[呕吐]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/20.gif" title="[偷笑]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/21.gif" title="[可爱]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/22.gif" title="[白眼]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/23.gif" title="[傲慢]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/24.gif" title="[饥饿]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/25.gif" title="[困]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/26.gif" title="[惊恐]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/27.gif" title="[流汗]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/28.gif" title="[大笑]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/29.gif" title="[士兵]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/30.gif" title="[奋斗]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/31.gif" title="[咒骂]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/32.gif" title="[疑问]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/33.gif" title="[嘘]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/34.gif" title="[晕]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/35.gif" title="[折磨]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/36.gif" title="[衰]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/37.gif" title="[骷髅]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/38.gif" title="[敲打]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/39.gif" title="[再见]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/40.gif" title="[擦汗]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/41.gif" title="[扣鼻孔]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/42.gif" title="[鼓掌]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/43.gif" title="[糗大了]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/44.gif" title="[坏笑]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/45.gif" title="[左哼哼]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/46.gif" title="[右哼哼]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/47.gif" title="[打哈欠]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/48.gif" title="[鄙视]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/49.gif" title="[委屈]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/50.gif" title="[快哭了]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/51.gif" title="[阴险]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/52.gif" title="[亲亲]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/53.gif" title="[吓]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/54.gif" title="[可怜]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/55.gif" title="[菜刀]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/56.gif" title="[西瓜]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/57.gif" title="[啤酒]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/58.gif" title="[篮球]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/59.gif" title="[乒乓球]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/60.gif" title="[咖啡]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/61.gif" title="[饭]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/62.gif" title="[猪头]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/63.gif" title="[玫瑰]"/></div>	<div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/64.gif" title="[凋谢]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/65.gif" title="[示爱]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/66.gif" title="[心]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/67.gif" title="[心碎]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/68.gif" title="[蛋糕]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/69.gif" title="[闪电]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/70.gif" title="[炸弹]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/71.gif" title="[刀]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/72.gif" title="[足球]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/73.gif" title="[瓢虫]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/74.gif" title="[便便]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/75.gif" title="[月亮]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/76.gif" title="[太阳]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/77.gif" title="[礼物]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/78.gif" title="[抱抱]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/79.gif" title="[强]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/80.gif" title="[弱]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/81.gif" title="[握手]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/82.gif" title="[胜利]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/83.gif" title="[抱拳]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/84.gif" title="[勾引]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/85.gif" title="[拳头]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/86.gif" title="[差劲]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/87.gif" title="[爱你]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/88.gif" title="[NO]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/89.gif" title="[OK]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/90.gif" title="[爱情]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/91.gif" title="[飞吻]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/92.gif" title="[跳跳]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/93.gif" title="[发抖]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/94.gif" title="[怄火]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/95.gif" title="[转圈]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/96.gif" title="[磕头]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/97.gif" title="[回头]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/98.gif" title="[跳绳]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/99.gif" title="[挥手]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/100.gif" title="[激动]"/></div><div style="clear:both"></div></div></div><div class="expression_bottom"></div></div>');
                    $("body").append(faces.hide());
            

            faces.find("img").bind("click", function(){
                //需要判断一下是不是当前编辑器
                if(Opt.TextArea.attr("id") == faces.attr("textarea"))
                    Opt.TextArea.insertAtCaret($(this).attr("title"));
                    faces.hide();
            });

            eml.click(function(){
                faces.attr("textarea", Opt.TextArea.attr("id"));
                Ui.InPosition(Opt.Faces, eml, 10, 10);
                
                function onscroll_() {
                    Ui.InPosition(Opt.Faces, eml, 10, 10); 
                }
                $(window).scroll(onscroll_);
                $('body').scroll(onscroll_);
                faces.show("fast");
                //显示表情层时清除上次LIVE事件委托
                $(".ShowFaceDiv,#layerBoxCon").die();
            });
        });

    }
})(jQuery);

//得到/设置textarea中光标的位置
jQuery.fn.extend({  
    getCurPos: function(){  
        var e=$(this).get(0);  
        e.focus();  
        if(e.selectionStart){    //FF  
            return e.selectionStart;  
        }  
        if(document.selection){    //IE  
            var r = document.selection.createRange();  
            if (r == null) {  
                return e.value.length;  
            }  
            var re = e.createTextRange();  
            var rc = re.duplicate();  
            re.moveToBookmark(r.getBookmark());  
            rc.setEndPoint('EndToStart', re);  
            return rc.text.length;  
        }  
        return e.value.length;  
    },  
    setCurPos: function(pos) {  
        var e=$(this).get(0);  
        e.focus();  
        if (e.setSelectionRange) {  
            e.setSelectionRange(pos, pos);  
        } else if (e.createTextRange) {  
            var range = e.createTextRange();  
            range.collapse(true);  
            range.moveEnd('character', pos);  
            range.moveStart('character', pos);  
            range.select();  
        }  
    }          
});

