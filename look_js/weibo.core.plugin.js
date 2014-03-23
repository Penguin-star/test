/**
 jQuery UI �����

    author      : comger 
    createdate  : 2011-08-10
    History 

    ����
        1.Blog ���ͣ�ת��������
        2.����ͳ������
        3.�����ѣ��Զ�����
        4.���뻰��,�������
        6.��Ƭ�ϴ�����Ƶ�ϴ�
**/



(function($){

    //����������
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
        //������ȥ��ʾɾ��
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
        //ҳ��û������ʱ����ʾ����������
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

    //�ڹ��λ�ò�������
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

	//״̬׷��
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
								status = "δ����";
							}else if(ret[i].o_status==="1"){
								status = "������";
							}else if(ret[i].o_status==="2"){
								status = "�������";
							}else if(ret[i].o_status==="3"){
								to_nickname = ret[i].to_nickname;
								status = "���Ӵ������:";
							}else if(ret[i].o_status==="4"){
								to_nickname = ret[i].to_nickname;
								status = "ת��";
							}else if(ret[i].o_status==="5"){
								status = "����";
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
        ����������ѯ���
        eg : $(textarea).InputCounter({
            MaxSize:500,
            Render:null,  //��Ϣ��ʾ�ؼ�
            SuccessFormat:'��������{0}��',
            FailFormat:'����{0}��',
            Fail:fucntion(count){
                //��������������ʾ
            },
            Reset:null
        });
    **/
    $.fn.InputCounter = function(opts){
        var Opt = {
            Input:null, //�ַ�����
            MaxSize:500,//����ַ���
            InitSize:0,
            Render:null,  //��Ϣ��ʾ�ؼ�
            SuccessFormat:'������������<span class="gray_font_big">{0}</span>��',
            FailFormat:'����<span class="gray_font_big">{0}</span>��',
            Fail:null,//ע��ʧ���¼�����
            Delete:null,//ɾ���¼�����
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
                if (keyCode != 13 && keyCode != 38 && keyCode != 40) {  // �����¼����س� �ӳ�300����ִ��
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
    
	//��ӵ���
    
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

	//����������ӵ���
    $.fn.addProvinceu = function(){ 
		return this.each(function(){
			var self = $(this);

			$.get("/province",function(data){
				var result = data.msg;
				var html = $("<li></li>");
				html.attr("class","province");
				html.attr("val","");
				html.html("ȫ��");
				html.click(function(){
					govffairs($(this).attr("val"),"ȫ��");
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
     * ����ѡ����
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

    
    //��������ѡ����
    $.fn.DateSelecter = function(){
        function fillSelect(exp,start,end,val){//���ѡ������,val ΪĬ��ֵ
            $(exp).empty();
			val = val || $(exp).attr("values");
            for(var i=start; i<=end;i++){
				$(exp).append($("<option>").html(i).val(i));
            }
            if(val)
                $(exp).val(val);
                
        }
        
        function dayNumOfMonth(year,month){//ѡ��ָ�����µ�����
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
     ��Ƭ��ʾ���
     demo 
     $(".showcard").UserCard();
     #todo ����������Ƭ�����棬���δ���
    **/
    $.fn.UserCard = function(){

        function InitCard(Opt,customer_uid){ // ������uid �������ݣ��������Ƭ�� Dom
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

            var h = 159 ;//Opt.Card.offset().height();//199 ��Ƭ�߶�
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
                Alink:null, //�ⷢ����
                Card:null //��Ƭ
            }

            var alink = Opt.Alink = $(this);
            var card =  Opt.Card = $('#ucard');

            if(card.length==0){
                // to do ������Ƭ�� Dom �ṹ
                var el = $('<div id="ucard">');
                //to do
                $("body").append(el);
                card =  Opt.Card = $('#ucard');
                //��ʼע�������ƶ�λ��
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
    
    // Forward ת�����
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
        function InitDialogData(Opt){ // ������mid �������ݣ������Blog Dom
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
                //������� �� atme
                
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

            //ת�������������
            $("#blog_forward_textarea_big").InputCounter({
                Render:"#f_countmsger",  //��Ϣ��ʾ�ؼ�
                MaxSize:300,
                Fail:function(count){
                    $("#button_blue_head").attr("disabled","true");
                },
                Success:function(count){
                    $("#button_blue_head").removeAttr("disabled");
                }
            });
        }

        function submitDialog(Opt){  //�ύת��
            var f_mblog = {
                body:$("#blog_forward_textarea_big").val().Trim(),
                to_owner:$("#to_owner").attr("checked"),
                to_resender:$("#to_resender").attr("checked"),
                mid:Opt.Dialog.attr("mid"),
                sourceid:Opt.Dialog.attr("sourceid"),
                page:Opt.Dialog.attr("page")
            }
            if($("#blog_forward_textarea_big").val().Trim() == "" && ($("#to_owner").attr("checked") || $("#to_resender").attr("checked")) ){
                Ui.Alerter("fail", "���۲���Ϊ��!")
            }else if(Opt.block =="\n��΢���ѱ�ԭ������ɾ��\n"){
                Opt.Dialog.hide();
                Ui.Alerter("fail", "��΢��/������ɾ��");
                
            }else{
                $.post("/mblog/create",f_mblog,function(result){
                    if(result.code==0){
                        Ui.Alerter("fail",result.data);
                    }else if(result.code==1){ //��blog ��ӵ��б�
                        var item = $(result.data);
                        item.MBlog();
                        $("#mbloglist").prepend(item);
                        var farward_count = /\d+/.exec(Opt.Alink.html())
                        Opt.Alink.html("ת��({0})".Format(parseInt(farward_count)+1));
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

        function InitDialog(Opt){ //��ʼ��
            var dialog =Opt.Dialog;
            dialog.find(".button_blue_head").click(function(){
               $("#button_blue_head").removeAttr("disabled");
               submitDialog(Opt);
               $("#blog_forward_textarea_big").val("");
               $("#to_owner").removeAttr("checked");
               $("#to_resender").removeAttr("checked");
            });

			dialog.find(".button_gray_head").click(function(){//ȡ��
				dialog.hide();
			})
            //dialog.FacesDiv();
            dialog.attr("ready","true");
        }



        return this.each(function(){

            var Opt = {
                Alink:null, //�ⷢ����
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

    // More Comment ���
    $.fn.CommentReply = function(comment){

        function InitDialogData(Opt){ // ������mid �������ݣ������Blog Dom
            $.get("/comment/reply/"+ Opt.Comment.attr("mid"), {}, function(data){
                Opt.Comment.find("#Fold").html(data);
                //�󶨱�����
                Opt.Comment.find("#Fold").FacesDiv();
                //ת�������������
                Opt.Comment.find(".comment_content").InputCounter({
                    MaxSize:300,
                    Render:Opt.Comment.find(".c_countmsger"),  //��Ϣ��ʾ�ؼ�
                    Fail:function(count){
                        Opt.Comment.find(".comment_submit").attr("disabled","true");
                    },
                    Success:function(count){
                        Opt.Comment.find(".comment_submit").removeAttr("disabled");
                    }
               }); 
            });
        }

        //�ظ�����
        function submitDialog(formobj, Opt){  
            var args = formobj.serializeArray();
            formobj.find("textarea").val("");
            $.post("/comment/add", args, function(result){
                if(result.code==1){
                    Ui.Alerter("success", "�ظ��ɹ���");

                    //formobj.find("textarea").val("");
                    Opt.Comment.find(".gray_font_big").text("300");
                }
                else Ui.Alerter("fail",result.data);
            });
        }

        //��ʼ��
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
            
            self.find(".DelReply").click(function(){ //ɾ��
                var ids = [];
                ids.push(self.attr("mid"));
                $.post("/comment/delete", {"ids": ids.join(",")}, function(result){
                    if(result.code==0){
                        Ui.Alerter("fail",result.data);
                    }else{
                        Ui.Alerter("success","ɾ���ɹ�"); 
                        //TODO ɾ������
                        self.remove();
                    }
                }, "json");

            });
            //��ʼ���û���Ƭ��
            self.find(".CardRemind").UserCard();
            //�󶨱���
            self.find('.cbody').emotions();
        }
        return this.each(function(){
            InitFns($(this));
        });
    }


    // Comment ���
    $.fn.CommentBlog = function(mblog){
        // ������mid ���������б�
        function InitDialogData(Opt){
            $.get("/comment/mbloglist/"+ Opt.Mblog.attr("mid"), {}, function(data){
                Opt.Mblog.find("#Fold").html(data);
                // ����ת����ԭ����ɾ������ǰ΢���������۸�ԭ�����Ҳ���ת��
                if(Opt.Mblog.attr("refdel")=="true"){
                    $(".comm_omblog, .foward_omblog").hide();
                }                  
                //�󶨱�����
                mblog.find("#Fold").find("#PrintBox").FacesDiv();
                //�����������ʾΪͼƬ
                mblog.find('.cbody').emotions();
                //���˿�Ƭ
                mblog.find(".CardRemind").UserCard();
                //��ʽ��ʱ��
                mblog.find(".pub_time").WeiboDate();

                //ת�������������
                mblog.find(".comment_content").InputCounter({
                    MaxSize:300,
                    Render:mblog.find(".c_countmsger"),  //��Ϣ��ʾ�ؼ�
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
            //�ύ����
            formobj.find("textarea").val("");
            $.post("/comment/add", args, function(result){
                if(result.code==1){
                    $.get("/comment/one/index/"+result.data, {}, function(data){
                        Opt.Mblog.find(".replylist").prepend(data);
                        Opt.Mblog.find('.cbody').emotions();
                        Opt.Mblog.find(".CardRemind").UserCard();
                        //��ʽ��ʱ��
                        Opt.Mblog.find(".pub_time").WeiboDate(); 
                    });
                    //formobj.find("textarea").val("");
                    Opt.Mblog.find(".gray_font_big").text("300");
                    var comment_count = /\d+/.exec(Opt.Alink.html())
                    Opt.Alink.html("����({0})".Format(parseInt(comment_count)+1));
                }
                else Ui.Alerter("fail",result.data);
            });
            
            //ת��΢��
            if(formobj.find("input[name='isforward']").attr("checked")){
                var mblog={};
                mblog["sourceid"] = Opt.Mblog.attr("sourceid");
                mblog["body"] = formobj.find("textarea").val();
                mblog["page"] = Opt.Mblog.attr("page");
                $.post("/mblog/create", mblog, function(data){
                    if(data.code == 1){
                        $("#mbloglist").prepend(data.data);
                        //��ת��������΢���ĸ��¼�
                        $("#mbloglist").find("li:first").MBlog();
                    }
                });
            }
        }

        function InitDialog(Opt){ //��ʼ��
            var dialog = Opt.Dialog;
            dialog.find(".comment_submit").live("click", function(){
                   submitDialog(dialog.find(".commentform"),Opt);
            });

            dialog.find("#layerBoxCon").find("img").live("click",function(){
                   dialog.find(".comment_content").insertAtCaret($(this).attr("alt"));
            });

            dialog.find(".comment_replay").live("click", function(){
                   dialog.find("textarea").val("").insertAtCaret("�ظ�@["+$(this).attr("repname")+"]:");
                   dialog.find("#r_uid").val($(this).attr("repid"));//���ظ���ID
                   dialog.find("#r_id").val($(this).attr("rep_comment_id"));//���ظ�����ID
            });

            dialog.find(".del_replay").live("click", function(){
                   var curr_comment = $(this).parentsUntil(".bolg_content_comment_line").parent();
                   $.post("/comment/delete", {"ids": $(this).attr("commentid")}, function(result){
                    if(result.code==0){
                        Ui.Alerter("fail",result.data);
                    }else{
                        //ɾ������
                        curr_comment.remove();
                    }
                });
            });

        }

        var Opt = {
            Alink:null, //�ⷢ����
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



    //��ʼ��΢�����ֹ��� 
    //$(selecter).MBlog();
    $.fn.MBlog = function(){
           
        function InitFns(self){ //��ʼ��Blog����

            var mid =self.attr("mid");
            var atmeid = self.attr("atmeid");
            var favoriteid = self.attr("favoriteid");

            self.find(".ForwardBlog").BlogForward(self); //ת��

            self.find(".HasDeleteBlog").click(function(){
                Ui.Alerter("warning","ԭ΢���Ѿ�ɾ�����޷�ת��/����.");
            });

            self.find(".CommentBlog").CommentBlog(self); //����
            self.find(".CollectionBlog").live("click",function(){
                var _CollectionBlog = $(this);
                $.post("/favorite/create",{mid:mid},function(result){
                    if(result.code==0){//ʧ��
                        Ui.Alerter("fail",result.data);
                    }else{ 
                        Ui.Alerter("success","�ղسɹ�");
                        _CollectionBlog.html("ȡ���ղ�").attr("class","CancelCollection");
                        
                    }
                });
            });
            

            self.find(".CancelCollection").live("click",function(){
            	var _CancelCollectionBlog = $(this);
                $.post("/favorite/delete",{mid:mid},function(result){
                    if(result.code==0){//ʧ��
                        Ui.Alerter("fail",result.data);
                    }else{ 
                        Ui.Alerter("success","ȡ���ղسɹ�");
                        _CancelCollectionBlog.html("�ղ�").attr("class","CollectionBlog");
                    }
                });
            });

             self.find(".SupportMblog").click(function(){ // ֧��
                var _SupportMblog = $(this);
                $.post("/mblog/blogupdate",{mid:mid},function(result){
                    if(result.code==0){//ʧ��
                        Ui.Alerter("fail",result.data);
                    }else{ 
                        Ui.Alerter("success","֧�ֳɹ�");
                        _SupportMblog.removeClass("SupportMblog").unbind("click");
                        var support_count = /\d+/.exec(_SupportMblog.html())
                        _SupportMblog.html("��֧��({0})".Format(parseInt(support_count)+1));
                        
                    }
                })
            });
            
            self.find(".DelBlog").click(function(){ //ɾ��΢��
                $.post("/mblog/delete",{mid:mid},function(result){
                    if(result.code==0){//ʧ��
                        Ui.Alerter("fail",result.data);
                    }else{
                        Ui.Alerter("success","ɾ���ɹ�"); 
                        self.remove();
                        if($(".mblog_item").length==0){
                            location.href= "/person";
                        }
                    }
                })
            });
            
            self.find(".CardRemind").UserCard();//��ʼ���û���Ƭ��

            self.find(".pub_time").WeiboDate(); //��ʽ��ʱ��

            self.find(".CancelCollectionBlog").click(function(){//ȡ���ղ�
                $.post("/favorite/delete",{mid:mid},function(result){
                    if(result.code==0){//ʧ��
                        Ui.Alerter("fail",result.data);
                    }else{
                        Ui.Alerter("success","ȡ���ղسɹ�"); 
                        $(self).remove();
                    }
                })
            })
            
            //��ʽ������
            self.find(".mbody").emotions();

            self.find(".DelAtme").click(function(){
                $.post("/atme/del/",{atmeid:atmeid},function(result){
                    if(result.code==0){//ʧ��
                        Ui.Alerter("fail",result.data);
                    }else{
                        Ui.Alerter("success","���γɹ�"); 
                        $(self).remove();
                    }
                })
            })
        }

        return this.each(function(){
            if(!this._has_init_fns){
                InitFns($(this));
                this._has_init_fns = true;
                //��־��ÿ��ֻ��ʼ��һ��
            }
        })
    }


    //MoreToggle 
    // $(selecter).MoreToggle(target);
    $.fn.MoreToggle = function(target,floatto){
        return this.each(function(){
            target = $(target);
            $(this).mouseover(function(){
                if(floatto) //��Ҫ����֧����λ��
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

    //������²㣬��������ط����رղ�
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

    //ת��΢��ʱ�� 
    // $(selecter).WeiboDate();
    $.fn.WeiboDate = function(){
        return this.each(function(){
            $(this).html(Co.Dates.Convert($(this).attr("truetime")).ToWeiboDate());
        })
    }

    //����û�Ϊ���Ѳ��
    // $(selecter).AddFans();
    $.fn.AddFans = function(){
        $(this).click(function(){
            var self = $(this);
            var params = {//������
                customer_uid:self.attr("uid")
            }
            $.post("/friend/add",params,function(result){
                if(result.code==1){
//                    self.html("�Ѽ�Ϊ����");
//                    self.attr("class","input_add_fri_ok");
                    Ui.Alerter("success","��ӳɹ�");
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

    //<img textarea="ssss">  ����
    // $(".PrintBox").FacePlugin()
    $.fn.FacePlugin = function(){
        return this.each(function(){
            $(this).find(".ShowFaceDiv").ShowFaces($(this)); 
        });
    }

    //dailogbox close
    $.fn.dialogbox = function(){  // �Ի���Ĺر��¼�ע��
        return this.each(function(){
            var eml = $(this);
            elm.find(".blog_forward_title_right,.blog_forward_button1").click(function(){ elm.hide(); })
        })
    }

    $.fn.SendMsg = function(customer_uid,customer_name,fn){ //��˽��
        function InitDailog(eml){
            var customer = $(eml.find(".email_input_text")[0]);
            eml.find(".blog_forward_button1").click(function(){
                if(customer.val().length==0 || customer.val().indexOf('�Է�����')>=0){
                    Ui.Alerter("fail","������������");
                    return false;
                }
                var mymsg ={
                    body:$($(".email_input_textarea")[0]).val(),
                    customer_uid:customer_uid,
                    customer_name:customer.val()
                }

                $.post("/mail/send",mymsg,function(result){
                    if(result.code==1){
                        Ui.Alerter("success","���ͳɹ�");
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
                if(customer.val().indexOf('�Է�����')>=0)
                    customer.val("");
            })

            eml.find(".email_input_textarea").InputCounter({
                MaxSize:500,//����ַ���
                Render:".my_email_right",  //��Ϣ��ʾ�ؼ�
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
                customer.val("������Է�����������û�֮���ö��Ÿ���");
            }

            if(typeof eml.attr("ready")==="undefined")
                InitDailog(eml);
        })
    }

    //�������
    $.fn.groupbox = function(gid){ 
        
        return this.each(function(){
            var eml = $(this);
            Ui.InCenter(eml);
            eml.show();
            if(typeof gid === "undefined"){
                eml.find(".blog_forward_title_left").html("�½�����");
            }else{
                eml.find(".blog_forward_title_left").html("�޸ķ���");
            }
            var group = eml.find(".email_input_text");
            
            eml.find(".blog_forward_button1").click(function(){
                if(group.val().length==0){
                    Ui.Alerter("fail","�������������");
                    return false;
                }

                $.post("/group/save",{group:group.val(),groupid:gid},function(result){
                    if(result.code==1){
                        Ui.Alerter("success","�������ɹ�");
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

    //˽�Ź���
    $.fn.MyMail = function(){
        return this.each(function(){
            var eml = $(this);
            eml.find(".backmail").click(function(){//��ʼ��˽�ŶԻ���
                $("#mymessage").SendMsg(eml.attr("uid"),eml.attr("nickname"),function(){
                    location.href ="/mymail"
                })
            })

            eml.find(".delallmail").click(function(){//ɾ������˽��
                $.post("/mail/delall",{uid:eml.attr("uid")},function(result){
                    if(result.code==1){
                        Ui.Alerter("success","ɾ��˽�ųɹ�");
                        eml.remove();
                    }else{
                        Ui.Alerter("fail",result.data);
                    }
                })
            })

            eml.find(".delmail").click(function(){//ɾ���Ի�
                $.post("/mail/delete",{mailid:eml.attr("mailid"), owner:eml.attr("uid")},function(result){
                    if(result.code==1){
                        Ui.Alerter("success","�ɹ�ɾ���Ի�");
                        eml.remove();
                    }else{
                        Ui.Alerter("fail",result.data);
                    }
                })
            })
        })
    }

    //��˿����
    $.fn.MyFans = function(){

        return this.each(function(){
            var eml = $(this);
            
            eml.find(".rmfans").click(function(){//�Ƴ���˿
                $.post("/fans/rm",{uid:eml.attr("uid")},function(result){
                    if(result.code==1){
                        Ui.Alerter("success","�Ƴ���˿�ɹ�");
                        eml.remove();
                    }else{
                        Ui.Alerter("fail",result.data);
                    }
                })
            })

            eml.find(".sendmsg").click(function(){//��˽��
                $("#mymessage").SendMsg(eml.attr("uid"),eml.attr("nickname"))
            })

            eml.find(".CancelFriend").click(function(){//ȡ������
                $.post("/friend/Cancel",{customer_uid:eml.attr("uid")},function(result){
                    if(result.code==1){
                        Ui.Alerter("success","ȡ���ɹ�");
						setTimeout(function(){
							location.reload();
						} ,500);
                    }else{
                        Ui.Alerter("fail",result.data);
                    }
                })
            })

            eml.find(".addfriend").click(function(){//��Ϊ����
                $.post("/friend/add",{customer_uid:eml.attr("uid")},function(result){
                    if(result.code==1){
                        //todo
                        Ui.Alerter("success","��ӳɹ�");
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
    
    //���ѹ��� ,�Ƴ�����
    $.fn.FriendItem = function(){
        return this.each(function(){
            var eml = $(this);
            
            eml.find(".CancelFriend").click(function(){
                $.post("/friend/cancel",{customer_uid:eml.attr("uid")},function(result){
                        if(result.code==1){
                            Ui.Alerter("success","�Ƴ��ɹ�");
                            eml.remove();
                        }else{
                            Ui.Alerter("fail",result.data);
                        }
                })
            })
        })
    }
    
    //�ϴ�
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
            self.FileDesc = "jpg �ļ��� png �ļ�";
            
            var elm = $("#uploadformm");
            var input = elm.find(".input_f");
            
            self.Form = elm.find("#pic_uploadm");

            self.Form.ajaxForm({
                 success: function(data) {
                     data = eval('(' + $(data).html() + ')');
                     if(data.status){
                        self.attr("fid",data.fid);
                        $("#div_bolg_push_img").hide();
		                Ui.Alerter("success","ͼƬ�ϴ��ɹ�");
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
					Ui.Alerter("fail","�ϴ��ļ����������ļ�����");
	                $("#div_bolg_push_img").hide();
                    count ++,self.Msg.push(file.fileName+"�ϴ��ļ����������ļ�����"); 
				}
                    
                if(self.FileExt){
                    var _ext= file.name.split(".")[1];
                    if(self.FileExt.indexOf(_ext)<0){
		                Ui.Alerter("fail","�ϴ��ļ���ʽ����,���ϴ���"+self.FileDesc);
		                $("#div_bolg_push_img").hide();
                        count ++, self.Msg.push(file.name+"�ϴ��ļ���ʽ����,���ϴ���"+self.FileDesc); 
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
            self.FileDesc = "jpg �ļ��� png �ļ�";
            
            var elm = $("#uploadformg");
            var input = elm.find(".input_f");
            
            self.Form = elm.find("#pic_uploadg");

            self.Form.ajaxForm({
                 success: function(data) {
                     data = eval('(' + $(data).html() + ')');
                     if(data.status){
                        self.attr("fid",data.fid);
                        $("#div_bolg_push_img_g").hide();
		                Ui.Alerter("success","ͼƬ�ϴ��ɹ�");
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
					Ui.Alerter("fail","�ϴ��ļ����������ļ�����");
                    count ++,self.Msg.push(file.fileName+"�ϴ��ļ����������ļ�����"); 
	                $("#div_bolg_push_img_g").hide();
				}
                    
                if(self.FileExt){
                    var _ext= file.name.split(".")[1];
                    if(self.FileExt.indexOf(_ext)<0){
						Ui.Alerter("fail","�ϴ��ļ���ʽ����,���ϴ���"+self.FileDesc);
		                $("#div_bolg_push_img_g").hide();
                        count ++, self.Msg.push(file.name+"�ϴ��ļ���ʽ����,���ϴ���"+self.FileDesc); 
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
				      +'        <div class="add_fri_right_no"><a href="javascript:void(0)" uid="'+ result[i].uid +'" class="input_add_friend_no">��Ϊ����</a></div>'
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
				      +'        <div class="add_fri_right_no"><a href="javascript:void(0)" uid="'+ result[i].uid +'" class="input_add_friend_no">��Ϊ����</a></div>'
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
		                Ui.Alerter("success","��Ӻ��ѳɹ�");

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
    //������
    //$("div").FacesDiv() div ��Ӧ���� �����ؼ����� textarea 
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
               faces = Opt.Faces = $('<div class="expression_all divFaces" id="layerBoxCon"><div class="expression_top"></div><div class="expression_center"><div class="expression_center_content"><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/0.gif" title="[΢Ц]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/1.gif" title="[��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/2.gif" title="[ɫ��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/3.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/4.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/5.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/6.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/7.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/8.gif" title="[˯]"/></div>	<div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/9.gif" title="[���]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/10.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/11.gif" title="[��ŭ]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/12.gif" title="[��Ƥ]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/13.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/14.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/15.gif" title="[�ѹ�]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/16.gif" title="[װ��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/17.gif" title="[�亹]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/18.gif" title="[ץ��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/19.gif" title="[Ż��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/20.gif" title="[͵Ц]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/21.gif" title="[�ɰ�]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/22.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/23.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/24.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/25.gif" title="[��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/26.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/27.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/28.gif" title="[��Ц]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/29.gif" title="[ʿ��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/30.gif" title="[�ܶ�]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/31.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/32.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/33.gif" title="[��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/34.gif" title="[��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/35.gif" title="[��ĥ]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/36.gif" title="[˥]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/37.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/38.gif" title="[�ô�]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/39.gif" title="[�ټ�]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/40.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/41.gif" title="[�۱ǿ�]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/42.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/43.gif" title="[�ܴ���]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/44.gif" title="[��Ц]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/45.gif" title="[��ߺ�]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/46.gif" title="[�Һߺ�]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/47.gif" title="[���Ƿ]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/48.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/49.gif" title="[ί��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/50.gif" title="[�����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/51.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/52.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/53.gif" title="[��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/54.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/55.gif" title="[�˵�]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/56.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/57.gif" title="[ơ��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/58.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/59.gif" title="[ƹ����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/60.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/61.gif" title="[��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/62.gif" title="[��ͷ]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/63.gif" title="[õ��]"/></div>	<div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/64.gif" title="[��л]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/65.gif" title="[ʾ��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/66.gif" title="[��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/67.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/68.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/69.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/70.gif" title="[ը��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/71.gif" title="[��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/72.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/73.gif" title="[ư��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/74.gif" title="[���]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/75.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/76.gif" title="[̫��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/77.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/78.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/79.gif" title="[ǿ]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/80.gif" title="[��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/81.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/82.gif" title="[ʤ��]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/83.gif" title="[��ȭ]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/84.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/85.gif" title="[ȭͷ]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/86.gif" title="[�]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/87.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/88.gif" title="[NO]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/89.gif" title="[OK]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/90.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/91.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/92.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/93.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/94.gif" title="[���]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/95.gif" title="[תȦ]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/96.gif" title="[��ͷ]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/97.gif" title="[��ͷ]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/98.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/99.gif" title="[����]"/></div><div class="expression_center_content_img"><img src="/static/web/js/face/sysemotions/100.gif" title="[����]"/></div><div style="clear:both"></div></div></div><div class="expression_bottom"></div></div>');
                    $("body").append(faces.hide());
            

            faces.find("img").bind("click", function(){
                //��Ҫ�ж�һ���ǲ��ǵ�ǰ�༭��
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
                //��ʾ�����ʱ����ϴ�LIVE�¼�ί��
                $(".ShowFaceDiv,#layerBoxCon").die();
            });
        });

    }
})(jQuery);

//�õ�/����textarea�й���λ��
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

