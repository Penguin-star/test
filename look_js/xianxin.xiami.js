/** 
 
 @Name: Ϻ������Win�� v2.0
 @Date: 2013.10.21
 @Author: ����
 @blog�� sentsin.com
 @Emial: xinjian.xxj@alibaba-inc.com
 
**/


!function(window, undefined) {


this.XMWindow = window.XiaMiWB ? XiaMiWB :{};


/****************************************************

Ԥ����ӿ�

****************************************************/


this.xiami = {
    v: "v2",
    XMWindow:XMWindow,
    
    //��ȡ��ǰ��
    hosts:function() {
        var dk = location.href.match(/\:\d+/);
        dk = dk ? dk[0] :"";
        return "http://" + document.domain + dk + "/";
    }(),
    
    //��ֹð��
    stopMP:function(e) {
        e ? e.stopPropagation() :e.cancelBubble = true;
    },
    
    //�������Ÿ���
    play: function(type, id, obj, from) {
        var param = JSON.stringify({
            type: String(type),
            id: String(id).split(","),
            from: from,
            pos: String(obj.pos),
            play: String(obj.play)
        });
        return XMWindow.invokeApp("play", param);
    },
    
    //�ղظ���
    collect:function(is, type, id, from) {
        var param = JSON.stringify({
            type:String(type),
            id:String(id).split(","),
            from:String(from)
        }), iscoll;
        is === -1 ? iscoll = "removecollect" :iscoll = "collect";
        return XMWindow.invokeApp(iscoll, param);
    },
    
    //��ȡ�ղ�����
    getCollect:function(type, limit, page) {
        var param = JSON.stringify({
            type:String(type),
            limit:String(limit),
            page:String(page)
        });
        return XMWindow.invokeApp("loadcollectdata", param);
    },
    
    //��ȡ��ѡ���б�
    getPlaylist:function(page, limit) {
        var param = JSON.stringify({
            page:String(page),
            limit:String(limit)
        });
        return XMWindow.invokeApp("playlist", param);
    },
    
    //��Ӹ������б�
    addSong:function(type, id, list_id, from) {
        var param = JSON.stringify({
            type:String(type),
            id:String(id).split(","),
            list_id:String(list_id),
            from:from
        });
        return XMWindow.invokeApp("addsong", param);
    },
    
    //������ѡ��
    creatPlaylist:function(type, name, id) {
        var param = JSON.stringify({
            type:String(type),
            name:name,
            id:String(id).split(",")
        });
        XMWindow.invokeApp("newlist", param);
    },
    
    //���ظ���
    download:function(type, id) {
        var data = {
            type:String(type),
            id:String(id).split(",")
        };
        return XMWindow.invokeApp("download", JSON.stringify(data));
    },
    
    //���߸���
    offline:function(type, id) {
        var param = JSON.stringify({
            type: String(type),
            id: String(id).split(",")
        });
        return XMWindow.invokeApp("offlinesong", param);
    },
    
    //�������
    share:function(obj) {
        var param = JSON.stringify(obj);
        return XMWindow.invokeApp("share", param);
    },
    
    //ͬ����ѡ��
    updateCollect:function(listid) {
        var param = JSON.stringify({list_id: String(listid)});
        return XMWindow.invokeApp("updatecollect", param);
    },
    
    //ɾ���ҵľ�ѡ������
    deletes:function(type, ids, list_id, callback) {
        var param = JSON.stringify({
            type:String(type),
            ids:String(ids),
            list_id:String(list_id)
        });
        XMWindow.invokeApp("remove", param);
        callback && callback();
    },
    
    //��ȡ�û�����δ��¼��ѡ��
    getLocalCollect:function(id) {
        var param = JSON.stringify({
            id:String(id)
        });
        return XMWindow.invokeApp("getlocalcollect", param);
    },
    
    //copy�����а�
    copy:function(urls) {
        return XMWindow.invokeApp("copytoclipboard", urls);
    },
    
    //������ҳ
    openwin:function(url) {
        var param = JSON.stringify({
            url:url
        });
        return XMWindow.invokeApp("openWebPage", param);
    },
    
    //��ת��ҳ��
    jump: function(url) {
        return XMWindow.invokeApp("jumpurl", JSON.stringify({url: url}));
    },
    
    //���ذ�ť״̬(type: 1������������ 2��������(����δѡ�и���֮��))
    downbtn:function(type, notice) {
        var param = JSON.stringify({
            type:String(type),
            notice:String(notice)
        });
        return XMWindow.invokeApp("changbutton", param);
    },
    
    //�Ҽ����
    popmenu:function(param) {
        return XMWindow.invokeApp("popmenu", JSON.stringify(param));
    },
    
    //��ȡ�Ƽ�����
    getMine:function(type, limit, update) {
        var param = JSON.stringify({
            type:String(type),
            limit:String(limit),
            update:String(update)
        });
        return XMWindow.invokeApp("recommend", param);
    },
    
    //��ȡ����
    getOrder:function(order_id, my_gift, my_xb) {
        var param = JSON.stringify({
            order_id:String(order_id),
            my_gift:String(my_gift),
            my_xb:String(my_xb)
        });
        XMWindow.invokeApp("getorder", param);
    },
    
    //��ȡ��ǰ������
    today:function() {
        var date = new Date();
        return date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate();
    },
    
    //ƴװ����(start��ʾ��ƴװ��ĳ��������-1��ʾƴװ����)
    toArr:function(classs, start) {
        var classs = classs || [], allCheck = M(classs[0]), arr = [], start = start || 0;
        M.each(allCheck, function(i) {
            var othis = M(this);
            if (othis.attr("id") !== "check-label") {
                if (othis.hasClass(classs[1])) {
                    var id = M(this).attr("rel");
                    arr.push(id);
                }
            }
        });
        return arr;
    }
};


/****************************************************

��ͻ��˱�¶�ӿ�

****************************************************/


this.InvokeWeb = function(name, param) {
    var param, conf = {
        storeGroup:M(".icon_store"),
        storeList:M(".list_store"),
        storeImg:M(".img_store")
    };
    try {
        param = JSON.parse(param || "{}");
    } catch (e) {
        param = param;
    }

    //�����Ҽ��˵�
    if (name === "popmenu") {
        switch (param.name) {
            //��������
            case "play":
                xiami.play(param.parme.type, param.parme.id, {pos: 0, play: 1}, xiami.play.from);
            break;

            //���Ų���
            case "nextplay":
                xiami.play(param.parme.type, param.parme.id, {pos: 1, play: 0}, xiami.play.from);
            break;
            
            //���Ų���
            case "endplay":
                xiami.play(param.parme.type, param.parme.id, {pos: 0, play: 0}, xiami.play.from);
            break;

            //�ղ�
            case "collect":
            xiami.collect(1, param.parme.type, param.parme.id);
            break;

            //ȡ���ղ�
            case "delcollect":
            xiami.collect(-1, param.parme.type, param.parme.id);
            break;

            //������ѡ��
            case "creatPlaylist":
            xiami.creatPlaylist(4, param.parme.name, param.parme.id);
            break;

            //��Ӹ�������ѡ��
            case "addSong":
            xiami.addSong(4, param.parme.id, param.parme.list_id, xiami.play.from);
            break;

            //����
            case "download":
            xiami.download(param.parme.type, param.parme.id);
            break;

            //����
            case "share":
            xiami.share({
                id:String(param.parme.id),
                type:String(param.parme.type),
                name:param.parme.name,
                labelName:param.parme.labelName,
                logo:param.parme.logo
            });
            break;

            //���߸���
            case "offline":
                xiami.offline(param.parme.type, param.parme.id);
            break;

            //�鿴ר����Ϣ
            case "album":
            if(param.parme.ishome){
                xiami.jump(xiami.hosts + param.parme.url);
            } else {
                location.href =  param.parme.url;
            }
            break;

            //�鿴��ѡ����Ϣ
            case "showCollect":
            if(param.parme.ishome){
                xiami.jump(xiami.hosts + param.parme.url);
            } else {
                location.href =  param.parme.url;
            }
            break;

            //�鿴������Ϣ
            case "artist":
            if(param.parme.ishome){
                xiami.jump(xiami.hosts + param.parme.artistUrl);
            } else {
                location.href = param.parme.artistUrl;
            }
            break;

            //�鿴������Ϣ
            case "seeSongs":
            if(param.parme.ishome){
                xiami.jump(xiami.hosts + param.parme.songUrl);
            } else {
                location.href = param.parme.songUrl;
            }
            break;

            //������ҳ��ַ
            case "copyurl":
            if (param.parme.type == 1) {
                conf.thisType = "album/";
            } else if (param.parme.type == 2) {
                conf.thisType = "song/showcollect/id/";
            } else if (param.parme.type == 3) {
                conf.thisType = "artist/";
            } else if (param.parme.type == 4) {
                conf.thisType = "song/";
            }
            xiami.copy(xiami.hosts + conf.thisType + param.parme.id);
            break;
        }
    }
    
    //��ѯ�ղ�
    if (name === "collect" || name === "querycollect") {
        //ר��/��ѡ��/����/��������ҳ�ղر��
        if (conf.storeGroup[0]) {
            conf.detailSet = conf.storeGroup.parents(".detail_set");
            if (param.id.indexOf(conf.detailSet.attr("listid")) != -1) {
                conf.storeGroup.addClass("icon_store0").siblings("span").html("ȡ���ղ�");
            }
        }
        //playlist�����ղر��
        if (conf.storeList[0]) {
            M.each(conf.storeList, function() {
                var othis = M(this), listli = othis.parents(".listli"), id = listli.attr("rel");
                if (param.id.indexOf(id) !== -1) {
                    othis.addClass("list_store0").attr("title", "ȡ���ղ�");
                }
            });
        }
        //imglist����ģʽ�ղر��
        if (conf.storeImg[0]) {
            M.each(M(".imglist"), function() {
                conf.storeImg = M(this).find(".img_store");
                M.each(conf.storeImg, function() {
                    var othis = M(this), imgli = othis.parents("li"), id = imgli.attr("rel");
                    if (param.id.indexOf(id) !== -1) {
                        othis.addClass("img_store0").attr("title", "ȡ���ղ�");
                    }
                });
            });
        }
    }
    //ȡ���ղ�
    if (name === "removecollect") {
        //ȡ���ղ� ר��/��ѡ��/����/��������ҳ
        if (conf.storeGroup[0]) {
            conf.detailSet = conf.storeGroup.parents(".detail_set");
            if (param.id.indexOf(conf.detailSet.attr("listid")) != -1) {
                conf.storeGroup.removeClass("icon_store0").siblings("span").html("�ղ�");
            }
        }
        //ȡ���ղ� playlist����
        if (conf.storeList[0]) {
            M.each(conf.storeList, function() {
                var othis = M(this), listli = othis.parents(".listli"), id = listli.attr("rel");
                if (param.id.indexOf(id) !== -1) {
                    othis.removeClass("list_store0").attr("title", "�ղ�");
                }
            });
        }
        //ȡ���ղ� imglist����ģʽ
        if (conf.storeImg[0]) {
            M.each(conf.storeImg, function() {
                var othis = M(this), imgli = othis.parents("li"), id = imgli.attr("rel");
                if (param.id.indexOf(id) !== -1) {
                    othis.removeClass("img_store0").attr("title", "�ղ�");
                }
            });
        }
    }
    //���ض���
    if (name === "xtdownload") {
        xiami.xtdownload();
    }
};


/****************************************************

����ҵ���

****************************************************/


var Xiami = function() {};
Xiami.pt = Xiami.prototype;

//����
Xiami.pt.ease = {
    ball:function(x, t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * 7.5625 * t * t + b;
        } else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
        } else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
        }
    }
};

//��ѯ�ղ�
Xiami.pt.querycollect = function() {
    var that = this, conf = {
        storeGroup:M(".icon_store"),
        playlist:M(".playlist"),
        imglist:M(".imglist"),
        STORE:{}
    };
    try {
        //��ѯר��/��ѡ��/����/���� ����ҳͷ��
        if (conf.storeGroup[0]) {
            conf.detailSet = conf.storeGroup.parents(".detail_set");
            conf.STORE.type0 = conf.detailSet.attr("type");
            conf.STORE.ids0 = conf.detailSet.attr("listid");
            XMWindow.invokeApp("querycollect", JSON.stringify({
                type:conf.STORE.type0,
                id:[ conf.STORE.ids0 ],
                from:"0"
            }));
        }
        //��ѯplaylist�ĸ���
        if (conf.playlist[0]) {
            conf.playlistLi = conf.playlist.children("li");
            conf.STORE.ids1 = [];
            M.each(conf.playlistLi, function() {
                conf.STORE.ids1.push(M(this).attr("rel"));
            });
            XMWindow.invokeApp("querycollect", JSON.stringify({
                type:"4",
                id:conf.STORE.ids1,
                from:"1"
            }));
        }
        //��ѯimglist�����棩
        if (conf.imglist[0]) {
            M.each(conf.imglist, function() {
                conf.imglistLi = M(this).children("li");
                conf.STORE.type2 = conf.imglistLi.attr("type");
                conf.STORE.ids2 = [];
                M.each(conf.imglistLi, function() {
                    conf.STORE.ids2.push(M(this).attr("rel"));
                });
                XMWindow.invokeApp("querycollect", JSON.stringify({
                    type:conf.STORE.type2,
                    id:conf.STORE.ids2,
                    from:"2"
                }));
            });
        }
    } catch (e) {
        console.log(e.message);
    }
};

//ģ��ѡ���
Xiami.pt.check = function() {
    var that = this, conf = {
        checkbtn:M(".checkbtn")
    };
    //��ѡ
    conf.checkbtn.off("click").on("click", function() {
        var othis = M(this), input = othis.siblings("input");
        if (othis.hasClass("checked")) {
            othis.removeClass("checked");
            input[0].checked = false;
        } else {
            othis.addClass("checked");
            input[0].checked = true;
        }
    });
};

//ͼƬ�Զ�����
Xiami.pt.imgAuto = function(lines, margin) {
    var that = this, conf = {
        list:M(".imglist")
    };
    conf.list.css({
        visibility:"visible"
    });
    conf.li = conf.list.children("li");
    that.setAuto = function() {
        var parwidth = conf.list.parent().innerWidth();
        conf.width = (parwidth - (lines-1)*margin)/lines;
        conf.li.css({
            width:conf.width
        });
        conf.li.find("img").css({
            width:conf.width,
            height:conf.width
        });
        return arguments.callee;
    }();
    that.win.on("resize", that.setAuto);
};

//��ק
Xiami.pt.moveToPlay = function() {
    var that = this, conf = {
        imglist: M(".imglist"),
        playlist: M(".playlist"),
        cailist: M('.cailist>ul')
    };
    conf.mousedown = function(othis) {
        conf.ids = [];
        
        M.each(othis, function(){
            conf.ids.push(M(this).attr("rel"));
        });
        
        conf.type = othis.attr("type");
        
        if (conf.type == 2) {
            conf.name = othis.find("p").eq(0).find("a").attr("title");
        } else if (conf.type == undefined) {
            conf.name = othis.attr('name') + '-' + othis.attr('labelname');
            conf.type = 4;
        } else {
            conf.name = othis.find("p").eq(0).find("a").attr("title");
        }
        conf.ismove = true;
        conf.moveing = true;
    };
    
    //�϶�ͼƬģʽ
    conf.imglist.on("mousedown", ">li", function(e) {
        var othis = M(this);
        conf.mousedown(othis);
    });
    
    //�϶������б�
    conf.playlist.on("mousedown", ">li", function(e) {
        var othis = M(this);
        if(M('.list_check').length > 1){
            conf.mousedown(M('.list_check'));
        } else {
            conf.mousedown(othis);
        }
    });
    
    //��ҳ
    conf.cailist.on("mousedown", ">li", function(e) {
        var othis = M(this);
        conf.mousedown(othis);
    });
    
    that.doc.on("mousemove", function(e) {
        if (conf.ismove) {
            if (conf.moveing) {
                var parme = JSON.stringify({
                    type:conf.type,
                    id:conf.ids,
                    name:conf.name
                });
                XMWindow.invokeApp("moveToPlay", parme);
            }
            conf.moveing = false;
        }
    }).on("mouseup", function() {
        conf.ismove = false;
    });
};

//����
Xiami.pt.select = function() {
    var that = this, conf = {
        select: M('.select>span').eq(0)
    };
    
    M('.select').on('click', function(e){
        var othis = M(this), opation = othis.find('.opation');
        opation.show();
        xiami.stopMP(e);
    });
    
    that.doc.on('click', function(){
        M('.opation').hide();
    });
}

//ͼƬģʽ����
Xiami.pt.imgset = function() {
    var that = this, conf = {
        imglist:M(".imglist"),
        seter:".img_seter>i",
        store:".img_store",
        play:".img_play",
        more:".img_more"
    };
    
    conf.imglist.on("click", conf.seter, function(e) {
        var othis = M(this), li = othis.parents("li");
        e.preventDefault();
        conf.type = li.attr("type");
        conf.rel = li.attr("rel");
    });
    
    //�ղ�
    conf.imglist.on("click", conf.store, function() {
        var othis = M(this);
        if (othis.hasClass("img_store0")) {
            xiami.collect(-1, conf.type, conf.rel);
            othis.removeClass("img_store0").attr("title", "�ղ�");
        } else {
            xiami.collect(1, conf.type, conf.rel);
            othis.addClass("img_store0").attr("title", "ȡ���ղ�");
        }
    });
    
    //����
    conf.imglist.on("click", conf.play, function() {
        xiami.play(conf.type, conf.rel, {pos: 0, play: 1}, xiami.play.from);
    });
    
    //����
    conf.popmore = function(e, li) {
        var X = e.pageX, Y = e.pageY - that.win.scrollTop();
        var store = li.find('.img_store').hasClass("img_store0") ? -1 :1;
        conf.name = li.find("p").eq(0).find("a").attr("title");
        conf.ishome = li.attr('ishome');
        conf.logo = li.find(">a>img").attr("src");
        conf.url = li.find(">a").attr("href");
        if (conf.type == 2) {
            conf.labelName = li.attr("maker");
        } else {
            conf.labelName = li.find("p").eq(1).text().replace(/\s/g,'');
        }
        if (conf.type == 3) {
            conf.artistUrl = li.find(">a").attr("href");
        } else if (conf.type == 1) {
            conf.artistUrl = li.find("p").eq(1).find("a").attr("href");
        }
        that.menu([ X, Y ], {
            store:store,
            type:conf.type,
            id:conf.rel,
            name:conf.name,
            labelName:conf.labelName,
            logo:conf.logo,
            url:conf.url,
            artistUrl:conf.artistUrl,
            ishome: conf.ishome,
            hasnone: li.hasClass('listnone')
        });
    };
    conf.imglist.on("click", conf.more, function(e) {
        conf.popmore(e, M(this).parents('li'));
    });
    
    //�Ҽ�
    conf.imglist.on("contextmenu", ">li", function(e) {
        var othis = M(this), store = othis.find(".img_store");
        conf.type = othis.attr("type");
        conf.rel = othis.attr("rel");
        conf.popmore(e, othis);
        return false;
    });
    
};

//��ϸҳ��������
Xiami.pt.allset = function() {
    var that = this, conf = {
        set:M(".detail_set"),
        play:M(".play"),
        store:M(".all_store"),
        offline:M(".all_offline"),
        share:M(".all_share"),
        down:M(".all_down"),
        logo:M(".detail_logo"),
        songer:M(".detail_songer")
    };
    conf.type = conf.set.attr("type");
    conf.listid = conf.set.attr("listid");
    conf.name = M("h1").attr('title');
    conf.imgsrc = conf.logo.attr("src");
    conf.laberDom = M(".detail_msg>li").eq(0);
    if (conf.type == 1) {
        conf.laberName = conf.laberDom.find("a").html();
    } else if (conf.type == 2 || conf.type == 3) {
        conf.laberName = conf.laberDom.find("em").html();
    } else if (conf.type == 4) {
        conf.laberName = M(".detail_msg>li").eq(1).find("a").html();
    }
    //ȫ������
    conf.play.on("click", function() {
        xiami.play(conf.type, conf.listid, {pos: 0, play: 1}, xiami.play.from);
    });
    //ȫ���ղ�
    conf.store.on("click", function() {
        var othis = M(this), idom = othis.find("i"), span = othis.find("span");
        if (idom.hasClass("icon_store0")) {
            xiami.collect(-1, conf.type, conf.listid);
            idom.removeClass("icon_store0");
            span.text("�ղ�");
        } else {
            xiami.collect(1, conf.type, conf.listid);
            idom.addClass("icon_store0");
            span.text("ȡ���ղ�");
        }
    });
    conf.offline.on("click", function() {
        xiami.offline(conf.type, conf.listid);
    });
    //����
    conf.share.on("click", function() {
        var obj = {
            id:String(conf.listid),
            type:String(conf.type),
            name:conf.name,
            labelName:conf.laberName,
            logo:conf.imgsrc
        };
        xiami.share(obj);
    });
    conf.down.on("click", function() {
        xiami.download(conf.type, conf.listid);
    });
};

//�Ҽ��˵�
Xiami.pt.menu = function(pos, parme) {
    var store, conf = {};
    if (parme.store === 1) {
        store = {
            itemName:"�ղ�",
            itemId:JSON.stringify({
                name:"collect",
                parme:parme
            })
        };
    } else {
        store = {
            itemName:"ȡ���ղ�",
            itemId:JSON.stringify({
                name:"delcollect",
                parme:parme
            })
        };
    }
    var json = {
        pos:pos,
        data:[ {
            itemName:"��������",
            itemId:JSON.stringify({
                name:"play",
                parme:parme
            })
        }, {
            itemName:"���Ų���",
            itemId:JSON.stringify({
                name:"nextplay",
                parme:parme
            })
        }, {
            itemName:"��󲥷�",
            itemId:JSON.stringify({
                name:"endplay",
                parme:parme
            })
        }, {
            itemName:"separator"
        }, store, "5-��ӵ�", "6-����", {
            itemName:"����",
            itemId:JSON.stringify({
                name:"share",
                parme:parme
            })
        }, {
            itemName:"���͵��ֻ�",
            itemId:JSON.stringify({
                name:"offline",
                parme:parme
            })
        }, {
            itemName:"separator"
        }, "10-������Ϣ", "11-ר��", "12-����/��ѡ��",  {
            itemName:"������ҳ����",
            itemId:JSON.stringify({
                name:"copyurl",
                parme:parme
            })
        } ]
    };
    if (parme.type == 4) {
        //��ȡ��ѡ���б�
        conf.collectChild = [ {
            itemName:"�½���ѡ���б�",
            itemId:JSON.stringify({
                name:"creatPlaylist",
                parme:parme
            })
        } ];
        conf.collectList = JSON.parse(xiami.getPlaylist() || "{}");
        conf.collectList.data = conf.collectList.data || {};
        conf.collectData = conf.collectList.data.collects || [];
        for (var i = 0; i < conf.collectData.length; i++) {
            conf.collectChild.push({
                itemName:conf.collectData[i].collect_name,
                itemId:JSON.stringify({
                    name:"addSong",
                    parme:{
                        id:parme.id,
                        list_id:conf.collectData[i].list_id
                    }
                })
            });
        }
        json.data[5] = {
            itemName:"��ӵ�",
            itemId:"add",
            data:conf.collectChild
        };
        json.data[6] = {
            itemName:"����",
            itemId:JSON.stringify({
                name:"download",
                parme:parme
            })
        };
        json.data[10] = {
            itemName:"�鿴������Ϣ",
            itemId:JSON.stringify({
                name:"seeSongs",
                parme:parme
            })
        };
        json.data[11] = {
            itemName:"�鿴ר����Ϣ",
            itemId:JSON.stringify({
                name:"album",
                parme:parme
            })
        };
        json.data[12] = {
            itemName:"�鿴������Ϣ",
            itemId:JSON.stringify({
                name:"artist",
                parme:parme
            })
        };
        
        
        //����Ƕ�ѡģʽ
        if(parme.id.length > 1){
             json.data.splice(4, 1);
             json.data.splice(6, 7);
        }
        
        //������¼ܻ�δ�����ĸ���
        if(parme.hasnone){
            json.data.splice(0, 4);
            json.data.splice(2, 1);
            json.data.splice(3, 1);
        }
        
    } else if (parme.type == 3) {
        json.data[11] = {
            itemName:"�鿴������Ϣ",
            itemId:JSON.stringify({
                name:"artist",
                parme:parme
            })
        };
        json.data.splice(5, 2);
        json.data.splice(6, 1);
        json.data.splice(7, 1);
        json.data.splice(8, 1);
    } else if (parme.type == 2) {
        json.data[6] = {
            itemName:"����",
            itemId:JSON.stringify({
                name:"download",
                parme:parme
            })
        };
        json.data[11] = {
            itemName:"�鿴��ѡ����Ϣ",
            itemId:JSON.stringify({
                name:"showCollect",
                parme:parme
            })
        };
        json.data.splice(5, 1);
        json.data.splice(9, 1);
        json.data.splice(10, 1);
    } else if (parme.type == 1) {
        json.data[6] = {
            itemName:"����",
            itemId:JSON.stringify({
                name:"download",
                parme:parme
            })
        };
        json.data[10] = {
            itemName:"�鿴ר����Ϣ",
            itemId:JSON.stringify({
                name:"album",
                parme:parme
            })
        };
        json.data[11] = {
            itemName:"�鿴������Ϣ",
            itemId:JSON.stringify({
                name:"artist",
                parme:parme
            })
        };
        json.data.splice(5, 1);
        json.data.splice(11, 1);
        
        //������¼ܻ�δ������ר��
        if(parme.hasnone){
            json.data.splice(0, 4);
            json.data.splice(1, 1);
            json.data.splice(2, 1);
        }
        
    }
    xiami.popmenu(json);
};

//playlist�Ĳ���
Xiami.pt.playlist = function() {
    var that = this, conf = {
        playlist:M(".playlist"),
        list:".listli",
        store:".list_store",
        play:".list_play",
        more:".list_more",
        delSong:".list_delete"
    };
    //�ղ�
    conf.playlist.on("click", conf.store, function(e) {
        var othis = M(this), li = othis.parents(".listli"), rel = li.attr("rel");
        xiami.stopMP(e);
        if (othis.hasClass("list_store0")) {
            xiami.collect(-1, 4, rel);
            othis.removeClass("list_store0").attr("title", "�ղ�");
        } else {
            xiami.collect(1, 4, rel);
            othis.addClass("list_store0").attr("title", "ȡ���ղ�");
        }
    }).on("dblclick", conf.store, function(e) {
        xiami.stopMP(e);
    });
    
    //����
    conf.playlist.on("click", conf.play, function(e) {
        var othis = M(this), li = othis.parents(".listli"), rel = li.attr("rel");
        xiami.stopMP(e);
        xiami.play(4, rel, {pos: 0, play: 1}, xiami.play.from);
    });
    //����
    conf.popmore = function(e, li) {
        var X = e.pageX, Y = e.pageY - that.win.scrollTop(), ids = [];
        var store = li.find(".list_store ").hasClass("list_store0") ? -1 :1;
        M.each(li, function(){
            var othis = M(this);
            ids.push(othis.attr('rel'));
        });
        that.menu([ X, Y ], {
            store:store,
            type:4,
            id: ids,
            name: li.attr("name"),
            labelName: li.attr("labelName"),
            logo: li.attr("logo"),
            url: li.attr("url"),
            artistUrl: li.attr("artistUrl"),
            songUrl: li.attr("songUrl"),
            ishome: li.attr('ishome'),
            hasnone: li.hasClass('listnone')
        });
        
        
    };
    
    conf.playlist.on("click", conf.more, function(e) {
        var othis = M(this), li = othis.parents(".listli"), rel = li.attr("rel");
        xiami.stopMP(e);
        conf.popmore(e, li);
    });
    //ctrl/shift  ѡ��
    conf.playlist.on("click", conf.list, function(e) {
        var othis = M(this), index = othis.index(".listli"), start, end;
        xiami.stopMP(e);
        if (!conf.ctrl) {
            M(conf.list).removeClass("list_check");
        }
        !conf.index && (conf.index = [ index, index ]);
        if (index <= conf.index[0]) {
            start = index;
            end = conf.index[1];
        } else {
            start = conf.index[0];
            end = index;
        }
        if (conf.shift) {
            M(conf.list).removeClass("list_check");
            for (;start <= end; start++) {
                M(conf.list).eq(start).addClass("list_check");
            }
        } else {
            if (othis.hasClass("list_check")) {
                othis.removeClass("list_check");
            } else {
                othis.addClass("list_check");
            }
        }
        conf.index = [ start, end ];
    }).on("contextmenu", conf.list, function(e) {
        var othis = M(this);
        if (othis.hasClass("list_check")) {} else {
            M(conf.list).removeClass("list_check");
            othis.addClass("list_check");
        }
        if(M('.list_check').length > 1){
            conf.popmore(e, M('.list_check'));
        } else {
            conf.popmore(e, othis);
        }
        return false;
    }).on("dblclick", conf.list, function(e) {
        var othis = M(this);
        if(!othis.hasClass('listnone')){
            xiami.play(othis.attr('type'), othis.attr('rel'), {pos: 0, play: 1}, xiami.play.from);
        }
    });
    
    that.doc.off("keydown,keyup,click").on({
        keydown:function(e) {
            var code = this.code = e.keyCode;
            code === 16 && (conf.shift = !0);
            code === 17 && (conf.ctrl = !0);
        },
        keyup:function(e) {
            this.code === 16 && (conf.shift = !1);
            this.code === 17 && (conf.ctrl = !1);
        },
        click:function() {
            M(conf.list).removeClass("list_check");
        }
    });
};

//json�첽Э��
Xiami.pt.json = function(url, data, callback, error) {
    return M.ajax({
        type:"POST",
        url:xiami.hosts + url,
        data:data,
        dataType:"json",
        success:callback,
        error:error
    });
};
//����������ĸ߶�
Xiami.pt.barHeight = function() {
    return M("html")[0].scrollHeight;
};

//�ϴ��ļ�
Xiami.pt.uploader = function(dom, callback, error) {
    var that = this, conf = {}, ifname = "iframe_upload" + Math.floor(Math.random() * 100);
    conf.iframe = M('<iframe name="' + ifname + '"></iframe>');
    dom.form.attr("target", ifname).append(conf.iframe);
    conf.iframe.css({
        width:0,
        height:0,
        border:0,
        visibility:"hidden"
    });
    dom.file.off("change").on("change", function() {
        var othis = M(this), val = othis.val();
        if (!/\w\.(jpg|png|gif|bmp)$/.test(escape(val))) {
            layer.hdmsg("ͼƬ��ʽ����");
            conf.isupload || othis.val("");
        } else {
            dom.form.submit();
            dom.before && dom.before();
            conf.iframe[0].onload = function() {
                try{
                    var parames = JSON.parse(conf.iframe.contents().find("body").html());
                }catch(e){
                    var parames = {};
                }
                if (parames.static === 0) {
                    layer.error(parames.msg, 2);
                    error && error();
                } else if (parames.static === 1) {
                    callback && callback(parames);
                } else {
                    layer.error("�ϴ�ʧ�ܣ�������", 2, 8);
                    error && error();
                }
            };
        }
        othis.val("");
    });
};

//��Ϣ��
Xiami.pt.falling = function(deliver, othis, index) {
    var that = this, conf = {
        key:false
    }, config = M.extend({
        child:"",
        more:"Ŭ�������С�",
        heg:200,
        //����������ײ��ĸ߶�
        maxPage:200,
        //��������ҳ
        url:"",
        data:{},
        page:2,
        //��ʼ����ҳ
        dataType:"json"
    }, deliver);
    othis.after('<div class="falling" id="falling_' + index + '">' + config.more + "</div>");
    conf.more = M(".falling");
    //��Ⱦ
    conf.view = function(datas, callback) {
        var datas = datas || [], i = 0, len = datas.length, html = "";
        if (len > 0) {
            for (;i < len; i++) {
                html += config.model(datas[i]);
            }
            othis.append(html);
            callback();
        } else {
            conf.more.addClass("falling_none").html("��ȫ���������");
            conf.key = true;
        }
    };
    config.data.callback = "xiami";
    config.data.page = config.page;
    //ajax����
    that.clickFall = conf.post = function(call) {
        that.json(config.url, config.data, function(datas) {
            var data = datas.data;
            if (datas.static === 1) {
                conf.view(data, function() {
                    var page = config.data.page++;
                    config.reset && config.reset({
                        page:page
                    });
                    conf.key = false;
                    //�ﵽ���ҳ������������
                    if (page >= config.maxPage) {
                        conf.key = true;
                    }
                    call && call();
                });
            } else {
                conf.error();
            }
        }, conf.error);
    };
    //�쳣
    conf.error = function() {
        conf.more.show().html('���������쳣, ��<a href="javascript:;">�������</a>');
        conf.more.find("a").off("click").on("click", function() {
            conf.more.html(config.more);
            conf.post();
        });
    };
    //����
    that.win.on("scroll", function() {
        var winheg = that.win.height(), top = that.win.scrollTop();
        var bottom = that.barHeight() - winheg - top;
        if (bottom <= config.heg && !conf.key) {
            conf.more.show().html("���ڼ����С�");
            setTimeout(conf.post, 200);
            conf.key = true;
        }
    });
};

//����չ������
Xiami.pt.descMore = function() {
    var that = this, conf = {
        texMore:M(".album_texMore"),
        detailFr:M("#detail_fr")
    };
    that.seemores = function(othis){
        var par = othis.parent();
        if (par.hasClass("album_descMore")) {
            par.removeClass("album_descMore");
            conf.detailFr.removeClass("detail_frAuto");
            othis.html("[չ��]");
        } else {
            par.addClass("album_descMore");
            conf.detailFr.addClass("detail_frAuto");
            othis.html("[����]");
        }
        that.imgAuto();
    };
    conf.texMore.on("click", function() {
         that.seemores(M(this));
    });
};

//�Ի���ģʽ
Xiami.pt.popmsg = function(options){
    var that = this, conf = {};
    conf.ii = M.layer({
        type: 1,
        area: options.area || ['420px', 'auto'],
        offset: options.offset || ['100px', ''],
        border: [!0],
        title: [!0],
        closeBtn: false,
        shade: [0.2 , '#000' , true],
        page: {
            html: '<div class="popboxs"><div class="poptitle">'+ options.title +'<span title="�ر�" class="popclose">��</span></div>'
                  +'<div class="popmsgs">'+ options.msg +'</div>'
                  +'<div class="popbtn">'+ options.btn +'</div></div>'
        }, success: function(){
           M('.popclose').on('click', function(){
                layer.close(conf.ii);
           });
           options.ok && options.ok();
        }
    });
    return conf.ii;
};

//detailҳ��������
Xiami.pt.detailCom = function() {
    this.allset();
    this.imgset();
    this.playlist();
    this.descMore();
};

//ר��detailҳ
Xiami.pt.album = function() {
    var that = this, conf = {
        playnums: M("#playnums")
    };
    xiami.play.from = "from_web_album_detail";
    
    this.detailCom();
    this.imgAuto(5, 50);
    
    conf.contPlays = 0;
    M.each(M(".playlist>li"), function() {
        var li = M(this), plays = li.attr("plays");
        conf.contPlays += plays | 0;
    });
    conf.playnums.text(conf.contPlays);
};

//��ѡ��detailҳ
Xiami.pt.collect = function() {
    var that = this;
    seajs.use(xiami.v + "/collect", function(exports) {
        exports.run(that);
    });
};

//��ѡ����ҳ
Xiami.pt.collectHome = function() {
    var that = this;
    seajs.use(xiami.v + "/collecthome", function(exports) {
        exports.run(that);
    });
};

//����detailҳ
Xiami.pt.artist = function() {
    var that = this;
    seajs.use(xiami.v + "/artist", function(exports) {
        exports.run(that);
    });
};

//��������ҳ
Xiami.pt.showsong = function() {
    var that = this, conf = {};
    xiami.play.from = "from_web_song_detail";
    this.allset();
    this.imgset();
    this.descMore();
    that.imgAuto(5, 50);
};

//����ҳ
Xiami.pt.search = function() {
    var that = this;
    seajs.use(xiami.v + "/search", function(exports) {
        exports.run(that);
    });
};

//���а�ҳ
Xiami.pt.hot = function() {
    var that = this;
    seajs.use(xiami.v + "/hot", function(exports) {
        exports.run(that);
    });
};

//֧������ҳ
Xiami.pt.pay = function() {
    var that = this;
    seajs.use(xiami.v + "/pay", function(exports) {
        exports.payRun(that);
    });
};

//��ҳ/�Ƽ�
Xiami.pt.home = function() {
    var that = this;
    seajs.use(xiami.v + '/home', function(exports){
        exports.run(that);
    });
};

//��������
Xiami.pt.public = function() {
    var that = this, conf = {};
    
    //��ѯ�ղ�
    that.querycollect();
    
    that.moveToPlay();
};

//Ѱ·
Xiami.pt.run = function() {
    var that = this, chche = {};
    this.win = M(window);
    this.doc = M(document);
    M.extend(M.easing, this.ease);
    
    //��Ϣ��
    M.fn.falling = function(options) {
        return this.each(function(i) {
            that.falling(options, M(this), i);
        });
    };
    
    //ִ�б��ٻ��ķ���
    if (xiami.run) {
        chche.loop = 0;
        chche.loopLen = xiami.run.length;
        for (;chche.loop < chche.loopLen; chche.loop++) {
            try {
                this[xiami.run[chche.loop]]();
            } catch (e) {
                console.log(e.message || e.description);
            }
        }
    }
};

var _xiami = new Xiami();

xiami.site = xiami.site || 'http://res.xiami.net/';

//�Ƿ�ģ�黯����
var require = [ "layer/layer.min" ];
seajs.use(require, function() {
    window.M = jQuery;
    _xiami.run();
});
define(function(require, exports, module) {
    exports._xiami = _xiami;
});

}(this);