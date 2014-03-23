/**
 weibo jquery ��׼�ӿ�

    author      : comger 
    createdate  : 2011-08-10
    History 
        
**/

var Weibo = Weibo || { Version:'dev' };


/**
 ������
 cookie�����������֤������ת����**/
Weibo.Common = Weibo.Common || ((function(){
    
    var Common  = {
        // ��������̳�,����������Ϊ����
        extend: function(base, obj) {
            for (var i in base) {
                obj[i] = base[i];}
            return obj;
        },
        //��base��ԭ�͸��Ƹ�obj,������ ��ԭ�ͼ̳У���������Ϊ����
        Inheritance: function(base, obj) {
            for (var i in base.prototype) {
                obj.prototype[i] = base.prototype[i];}
            return obj;
        },
        Keys:function(object){ //��ȡ����ԭ������
            var keys = [];
            for (var property in object)
              keys.push(property);
            return keys;
        },
        Values: function(object) {//��ȡ����ֵ
            var values = [];
            for (var property in object)
              values.push(object[property]);
            return values;
        },
        Clone:function(object){ 
            return $.extend({}, object);
        },
        // cookie ����������ȡ
        Cookie:function(name,value,opts){
            if(jQuery.cookie !=null && typeof(jQuery.cookie) == "function"){
                return jQuery.cookie(name,value,opts); 
            }else{// to do somethings
                return false;
            }
        },
        CookieStartWith:function(key,keyflag){
            var _cookies = {};
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    var kv = cookie.split('=');
                    if(kv[0].indexOf(key)==0){
                        if(keyflag){
                            _cookies[kv[0].replace(key,"")]=kv[1]
                        }else{
                            _cookies[kv[0]]=kv[1]}
                    }
                }
            }
            return _cookies;
        },
        LocalStorage:function(key,val){
            // to do
        },
        // �Ƿ�Ϊhtml5 ֧�������
        // write html5_flag_cookie when first visited
        IsHtml5:function(){
            return false;
        },
        LoadScript:function(src){
            var script = $("<script>").attr("type","text/javascript").attr("src",src);
            $("head")[0].appendChild(script[0]);
        },
        CustomDict:function(dict,key,val){ //�Զ����ֵ�
           if(val){
                dict[key]=val;
           }else{
                if(typeof(key)=="string"){
                    return dict[key];
                }else if(typeof(key)=="object"){
                    dict = $.extend(dict,key);}
           }
        },
        ToArray: function(iterable) { 
            if (!iterable) return [];
            var length = iterable.length, results = [];
            while (length--) results[length] = iterable[length];
            return results;
        },
        Filter:function(fn,arr){ //���� �������� fn �ģ�arr ������
            var rs =[];
            for(var i=0;i<arr.length;i++){
                if(fn(arr[i]))
                    rs.push(arr[i]);
            }
            return rs;
        },
        Map:function(fn,arr){ // ӳ�� map����fn �����ڸ������е�ÿ��Ԫ�أ�����һ���б����ṩ����ֵ��
            var rs = [];
            for(var i=0;i<arr.length;i++){
                rs.push(fn(arr[i]));
            }
            return rs;
        },
        //fnΪ��Ԫ��������fn������arr �����Ԫ�أ�ÿ��Я��һ�ԣ���ǰ�Ľ���Լ���һ�����е�Ԫ�أ���
        //�����Ľ����еĽ������һ��ֵ�����ڻ�õ����Ľ���ϣ����������ǵ�����Ϊһ����һ�ķ���ֵ
        Reduce:function(fn,arr,initial){ // ����           
            if(typeof initial === 'undefined'){
                initial = arr.shift();
            }
            for(var i=0;i<arr.length;i++){
                 initial = fn(initial,arr[i]);
            }
            return  initial;
        },
        Round:function(num,dec){ // ȡ�����num ,decΪС�����λ�� Ĭ��Ϊ0
            if(typeof dec === 'undefined')
                dec =0;
            return Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
        },
        GetRandomInt:function(max){ //��ȡ max ���ڵ��������
            return this.Round(Math.random() * max);
        },
        Timeout:function(fn,time){ //����������fn�Ż�timeִ�У�����������ƶ���obj.set() ��� obj.clear() ��� 
            var flag = false;
            return { set : function(){ 
                if(!flag){
                    flag = setTimeout(function(){
                        fn();
                        flag = false;
                    }, time);
                }}, clear : function(){
                    if(flag){
                        clearTimeout(flag);
                        flag = false;
                    }
            }}
        }
    };
    
    //ע��ҳ����ײ����� Weibo.Common.extend(a,b) = Co.extend(a,b)
    //Weibo.Common.Method = M
    //Weibo = W
    window.Co = Common; 
    window.W = Weibo;
    return Common;
})());

//Co.Dates ���߿�ʱ�������չ��
Weibo.Common.Dates ={
        Convert:function(d) {//תָ������ת�����ڶ��� ���ɽ��ܲ���Ϊ���飬���ڣ��������ַ���������
            return (
                d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0],d[1],d[2]) :
                d.constructor === Number ? new Date(d) :
                d.constructor === String ? new Date(d.replace(/-/g,"/")) :
                typeof d === "object" ? new Date(d.year,d.month,d.date) :
                NaN
            );
        },
        Compare:function(a,b) {//a,b��ʱ��Աȣ�-1 : if a < b��0 : if a = b��1 : if a > b��ʱ���ʽ����ʱ���� NaN 
            return (
                isFinite(a=this.Convert(a).valueOf()) &&
                isFinite(b=this.Convert(b).valueOf()) ?
                (a>b)-(a<b) :
                NaN
            );
        },
        InRange:function(d,start,end) { //���ʱ���Ƿ���ָ����Χ�� ʱ���ʽ����ʱ���� NaN 
           return (
                isFinite(d=this.Convert(d).valueOf()) &&
                isFinite(start=this.Convert(start).valueOf()) &&
                isFinite(end=this.Convert(end).valueOf()) ?
                start <= d && d <= end :
                NaN
            );
        },
        Now:function(){ //��ȡ��ǰʱ���
            var d = new Date();
            return Math.floor(+d / 1000);
        }
}


//Co.Html html ���߿������չ��
Weibo.Common.Html ={
        Count:function(html){//��� a ��ǩͳ��ҳ��ɼ�����
            var _div = $("<div>").append(html);
            var count=0;
            Co.Map(function(item){
                count +=$(item).html().length;
            },$(_div).find("a"));
            $(_div).find("a").remove();
            return $(_div).html().length+count
        },
        BackRemove:function(html,step){//�Ӻ�ʼstep���֣�������� a ��ǩ����ɾ��������ǩ
            var delChars = html.substring(html.length-step,html.length);
            var start,end;
            
            if(delChars.indexOf(">")>=0){
                start = html.lastIndexOf(">");
                end =html.lastIndexOf("<a");
                var _div = $("<div>").append(html);
                $(_div).find("a").last().remove();
                html=$(_div).html();
            }
            var _temp= html.substring(0,html.length-step);
            return [_temp,start,end];
        },
        ClearTag:function(html,tag){//���html�� tag ��ǩ������������,���쳣 innerhtml
            var _div = $("<div>").append(html);
            Co.Map(function(item){
                _div.html(_div.html().replace(/<a[^>].*?>/g,""));
            },$(_div).find("a"));
            return _div.html();
        },
        ReplaceTag:function(html,tag,attrname){
            var r, re; // ����������           
            re = new RegExp("<"+tag+".*?"+tag+">","ig"); // ����������ʽ����
            r = html.match(re); // ���ַ��� s �в���ƥ�䡣
            if(r || r!=null)
                for(var i=0;i<r.length;i++){
                    if(attrname)
                        html = html.replace(r[i],$(r[i]).attr(attrname))
                    else
                        html = html.replace(r[i],$(r[i]).html())
                }
            return html;
        }
}

//Co.Files ���߿��ļ������չ��
Weibo.Common.Files = {
        FormatSizes:function(size){ //��ȡ�Ѻõ�size ��� eg 102400 byte ==> 10 KB
            var byteSize = Math.round(size / 1024 * 100) * .01;
		    var suffix = 'KB';
		    if (byteSize > 1000) {
			    byteSize = Math.round(byteSize *.001 * 100) * .01;
			    suffix = 'MB';}
		    return byteSize + suffix;
        },
        GetExtension:function(filename){//��ȡ�ļ���չ��
            return ""
        }
}

/**
�¼�ί��
**/
Weibo.Delegate = Weibo.Delegate || ((function() {
    var Delegate = function() { this.Init();}
    Delegate.prototype = {
        fns: [],
        Init: function() {
            this.fns = [];},
        Add: function(fn, self) {
            for (var i = 0; i < this.fns.length; i++) {
                if (this.fns[i][0] === fn) {
                    return;}
            }
            this.fns.push([fn, self]);
        },
        One: function(fn, self) {
            this.Add((function() {
                fn.apply(self, arguments);
                this.Remove(fn);
            }).bind(this));
        },
        Remove:function(fn) {
            if(fn){
                for (var i = 0; i < this.fns.length; i++) {
                    if (this.fns[i][0] === fn) {
                        this.fns.Remove(i);
                        return;}
                }
            }else{
                this.fns = [];
            }
        },
        Call: function() { //ִ��ί�з���
            var result;
            for (var i = 0; i < this.fns.length; i++) {
                var ret = this.fns[i][0].apply(this.fns[i][1], arguments);
                result = ret == undefined ? result : ret;
            }
            return result;
        }
    };
    return Delegate;
})());

/**
 weibo ui ͨ�÷���
**/
Weibo.UI = Weibo.UI || ((function(){
    var UI ={
        InPosition:function(exp,InExp,x,y){  //��exp ���󣬸����� InExp �����λ�ã�������,x ,y ƫ��
            var offset = $(InExp).offset();
            var left = 300 ;
            var top = 300;
            if(offset!=null){
            left = offset.left + x ;
            top = offset.top + y;}
            $(exp).addClass("weibo-floatDiv");
            $(exp).css({ left: left, top: top });
        },
        MoveTo:function(exp,left,top){ //��exp ���󣬸����� left ,top ��λ��
            $(exp).addClass("weibo-floatDiv");
            $(exp).css({ left: left, top: top });
        },
        InCenter:function(exp){//��exp ���󣬸�����ҳ������
            $(exp).addClass("weibo-floatDiv");
            var left = $(window).width()/2-$(exp).width()/2;
            var top = $(document).scrollTop() + $(window).height()/2 -$(exp).height()/2;
            $(exp).css({ left: left, top: top });
        },
        AddZindex:function(exp,index){ //���z-index ��
            index = index || 1;
            index +=$(exp).css("z-index");
            $(exp).css("z-index",index);
        },
        SetCaretPosition:function(ctrl,pos){ //���ù��λ�ú���,�������쳣
            //todo 
            if(ctrl.setSelectionRange) { 
                $(ctrl).focus(); 
                ctrl.setSelectionRange(pos,pos); 
            } else if (ctrl.createTextRange) { 
                var range = ctrl.createTextRange(); 
                range.collapse(true); 
                range.moveEnd('character', pos); 
                range.moveStart('character', pos); 
                range.select(); 
           }
        }
    };
    window.Ui = UI;
    return UI;
})())

/**
 UI ���࣬ʵ�ֻ�����ʾ,���ӣ����ؼ�����**/
Weibo.UI.Base = Weibo.UI.Base ||((function(){
    var Base = function(){}
    Base.prototype = {
        Element: null,
        AddTo: function(exp) {
            $(exp).append(this.Element);},
        Show: function() {
            this.Element.show();},
        Hide: function() {
            this.Element.hide();},
        Destroy: function() {
            this.Element.remove();
            for (var i in this) {
                this[i] = undefined;
            }
            if (CollectGarbage) CollectGarbage();
        }
    }
    return Base;
})())

/**
   Init the framework
   ��д������� prototype
**/

//��չString
Co.extend({
    toArray: function() {//���ַ���ת���ַ�����
        return this.toString().split('');
    },
    Format:function(){ //��ʽ���ַ���
        var str = this.toString();
        for(var i=0;i<arguments.length;i++){
            str = str.replace("{"+i+"}",arguments[i]);}
        return str;
    },
    Trim:function(){
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    }
},String.prototype);


//��չNumber
Co.extend({
    Pad:function(length){ //ǰ��0ֱ������ָ�����ȣ��������ֲ�0
        if (!length) 
            length = 2;
        var str = '' + this;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }
},Number.prototype);

//��չDate
Co.extend({
    SetDate:function(n){ //��ȡ��ǰ��+ NСʱ������
        var cur = new Date();
        cur.setHours(cur.getHours()+n);
        return cur;
    },
    ToDayLine:function(){ //��ȡ��ǰʱ���� ��ǰ0��
        var cur = new Date();
        cur.setHours(0),cur.setMinutes(0),cur.setSeconds(0),cur.setMilliseconds(0);
        return cur;
    },
    TimeSpan:function(){ //��ȡʱ���
        return Math.floor(+this / 1000);
    },
    ToWeiboDate:function(){ //ת��΢������ʱ���ʽ
        var t = Co.Dates.Now() - this.TimeSpan();
        var n = this.TimeSpan() - this.ToDayLine() / 1000;
        if (n > 0){
            if (t <=0) return "�ո�";
            if (t < 60) return t + '��ǰ';
            if (t < 3600) return Co.Round( t / 60, 0) + '����ǰ';
            if (t < 86400) return "���� {0}:{1}".Format(this.getHours().Pad(2),this.getMinutes().Pad(2));
        }
        return "{0}��{1}�� {2}:{3}".Format(this.getMonth()+1,this.getDate(),this.getHours().Pad(2),this.getMinutes().Pad(2));
    }
},Date.prototype);

// ��չFunction
Co.extend({
    Bind:function(){ //��һ��������ָ���Ķ����ϣ��ڷ�������ʱ����ִ�����󶨵����󶨶���ķ�������
        var __method = this, args = Array.prototype.slice.call(arguments), object = args.shift();
        return function() {
            return __method.apply(object, args.concat(Array.prototype.slice.call(arguments)));
        }
    },
    BindAsEventListener:function(object){ //����������ָ�������ϣ����ṩ���ü���
        var __method = this, args = Array.prototype.slice.call(arguments), object = args.shift();
        return function(event) {
            return __method.apply(object, [( event || window.event)].concat(args).concat(Array.prototype.slice.call(arguments)));
        }
    },
    Param:function(){ //��ȡ��������
       var names = this.toString().match(/^[\s\(]*function[^(]*\((.*?)\)/)[1].replace(/ /gm, '').split(',');
       return names.length == 1 && !names[0] ? [] : names;
    }

},Function.prototype);

//��չ Array 
Co.extend({
    Remove:function(index,count){ //�Ƴ�index ��ʼ��ָ��������Ĭ�ϸ���Ϊ1
        if(count){
            if (isNaN(index) || index > this.length)
                return false
            this.splice(index, count);
            return this;
        }else{
            return this.Remove(index, 1);
        }
    },
    RemoveKey:function(key){ //��ָ��key �Ƴ�
       for (var i = 0; i < this.length; i++) {
            if (this[i] === value || this[i] == value)
                return this.Remove(i);
       }
       return this;
    },
    IndexOf:function(value){ //���� val ������� index
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value || this[i] == value)
               return i
        }
        return NaN;
    }
},Array.prototype);


/**
  ���ݽ�����
**/

Weibo.Data = Weibo.Data ||{};
//����Դ��
Weibo.Data.DataSource = Weibo.Data.DataSource || ((function(){
    var Datasource = function(url){ this.Init(url);}
    Datasource.prototype = {
        Params: {}, //����
        ServerUrl:'null',
        Changes:null, //�仯�У�����Ԥ��������
        OnChanging:null, // �仯ǰ
        OnChanged:null,//�仯���¼�
        Init:function(url){
            this.ServerUrl = url || '#';
            this.Params = {};
            this.OnChanged = new W.Delegate();
            this.Changes = new W.Delegate();
            this.OnChanging = new W.Delegate();
        },
        Load:function(p){
            this.OnChanging.Call();
            for (var i in p) {
                this.Params[i] = p[i];
            }
            var self = this;
            $.ajax({
                type: 'GET',
                url: self.ServerUrl,
                data: self.Params,
                cache: false,
                success: function(data) { // �����ؽ����֪ͨ���쳣
                    var d = self.Changes.Call(data);
                    self.OnChanged.Call(d || data);
                },
                error: function(xhr) {
                    // to do 
                }
            });
        }
    }
   
    return Datasource;
})())

//��ʱ���ص�����Դ
Weibo.Data.TimingDataSource = Weibo.Data.TimingDataSource ||((function(){
    var TimingDataSource = function(url) { this.Init_(url);}
    Co.Inheritance(Weibo.Data.DataSource, TimingDataSource);
    Co.extend({
            Time: 60, //��ʱ����ʱ�䣨�룩
            _t: null,
            IsUptate: true,
            Init_: function(url) {
                this.Init(url);
                this.Load__ = this.Load;
                this.Load = this.Load_;
                this.Destroy__ = this.Destroy;
                this.Destroy = this.Destroy_;
            },
            Load_: function(obj) {
                obj = obj || {};
                if (this.IsUptate) {
                    this.Load__(obj);
                }
                clearTimeout(this._t);
            },
            Destroy_: function() {
                this.Destroy__();
                clearTimeout(this._t);
            }
        }, TimingDataSource.prototype);
    return TimingDataSource;
})())

//�����������
Weibo.Data.BaseRender = Weibo.Data.BaseRender || ((function(){
    var BaseRender = function(){}
    BaseRender.prototype = {
        Self:{
            DataSource:null, //����Դ�����Ϊ���ݼ�
            OnChanging:null,
            Changes:null
        },
        Databind:function(){
            var self = this.Self;
            if (self.DataSource.Load) {//Ϊ��̬����Դ
                self.DataSource.OnChanging.Add(function() {
                    if(OnChanging && typeof(OnChanging)=="function"){
                         self.OnChanging();}
                }, this);
                self.DataSource.Changes.Add((function(e){
                    if(Changes && typeof(Changes)=="function"){
                         self.Changes(e);}
                }).bind(this),this);
                self.DataSource.OnChanged.Add((function(e) {
                    if (e.constructor !== Array) {
                        e = e.Data;}
                    this.Render(e);
                }).bind(this), this);
            }else {
                //ֱ���ṩ���ݼ���ʱ��
                this.Render(self.DataSource);
            }
        },
        Render:function(data){

        }
    };
    return BaseRender;
})())


/**
    �ͻ����ڴ����ݹ�������Ϊҳ���ṩ��̬���ݣ�����̻�����
    ҳ��ˢ��ʱ�����ݳ�ʼ��
**/
Weibo.StaticObjs = Weibo.StaticObjs || ((function(){
    var StaticObjs = function(){ this.Init()}
    StaticObjs.prototype = {
        LConfig:{
            domain:'weibo.com', //��ǰ��
            skin:null, //��ǰƤ��
            uid:null, //��ǰ�û�ID
            nickname:null
        },
        DataDict:{}, //������
        Model:"cookie",
        BaseKey:"bf_",
        Expre:"1000*60*60*24",
        Init:function(){
            this.Restore();
            //window.onbeforeunload = this.Curing();
        },
        Config:function(key,val){ //����Ϊ��ȡ����ֵ,�ɱ��̻�
            return Co.CustomDict(this.LConfig,key,val);
        },
        Curing:function(){//�̻�����
            if(this.Model=="cookie"){
                for(var i in this.LConfig){
                    try{
                        Co.Cookie(this.BaseKey+i,this.LConfig[i],this.Expre);
                    }catch(exp){//����ʧ��
                    }
                }}
        },
        Restore:function(){//��ԭ������cookie���������Ϣ
            this.LConfig = $.extend(this.LConfig,Co.CookieStartWith("bf_",true));
        },
        Dict:function(key,val){ //�����ֵ�
            return Co.CustomDict(this.DataDict,key,val);
        }
    };
    
    return StaticObjs;
})())





