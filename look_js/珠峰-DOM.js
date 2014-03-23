var DOM={}//单例模式
//一个实例，单个实例，命名空间。分类的作用，归类的作用
/*TOOL={};
TOOL.DOM={};

"TOOL.DOM.ABCD";

TOOL.DOM.ABCD.index=function(){}
function createNameSpace(str){
	var a=str.split('.')
	var obj=null;
	for(var i=0;i<a.length;i++){
		if(obj==null){
			obj=window[a[i]]={};				
		}else{
			obj[a[i]]={};
		}
	}
		
}*/

DOM.listToArray=function (eles){
	try{
		var a=[].slice.call(eles,0);//DOM
	}catch(e){
		var a=[];
		for(var i=0;i<eles.length;i++){
				a.push(eles[i]);
		}
	}
	return a;
}
DOM.getIndex=function(ele){
	var index=0;
	
	for(var p=ele.previousSibling;p;){
		if(p.nodeType==1){
			index++;	
		}
		p=p.previousSibling;
	}
	return index;	
}

DOM.getElesByClass=function (strClass,context){	
	context=context||document;	
	if(context.getElementsByClassName){
		return context.getElementsByClassName(strClass);	
	}
	
	var aClass=strClass.split(/ +/);
	var eles=context.getElementsByTagName("*");
	for(var i=0;i<aClass.length;i++){
		eles=byClass(aClass[i],eles);
	}	
	return eles;
	
	//把byClass定义在里面
	function byClass(className,eles){
		var reg=new RegExp("(?:^| +)"+className+"(?: +|$)");
		var a=[];
		for(var i=0;i<eles.length;i++){
			var ele=eles[i];
			if(reg.test(ele.className)){
				a.push(ele);
			}		
		}	
		return a;
		}
}
//option a option b aoptionb
DOM.addClass=function(ele,strClass){	
	var reg=new RegExp("(?:^| +)"+strClass+"(?: +|$)");
	if(!reg.test(ele.className))
		ele.className+=" "+strClass;
}

DOM.removeClass=function(ele,strClass){
	var reg=new RegExp("(?:^| +)"+strClass+"(?: +|$)","g");
	//ele.className=="option option option";
	ele.className=ele.className.replace(reg,"");
}


DOM.assertElement=function (ele){
	try{
		ele.cloneNode(true);
		if(ele.nodeType!=1&&ele.nodeType!=9){
			throw new Error("");			
		}		
	}catch(e){
		throw new Error("ele参数不合法");
	}
}
DOM.children=function (ele,tagName){
	DOM.assertElement(ele);	
	var childNodes=ele.childNodes;
	var a=[];
	if(typeof tagName=="undefined"){//如果没有传第二个参数，则表示获得所有的子元素
		for(var i=0;i<childNodes.length;i++){
			var child=childNodes[i];
			if(child.nodeType==1){
				a.push(child);	
			}
		}
	}else if(typeof tagName=="string"){//如果正确的传了第二个参数
		tagName=tagName.toUpperCase();
		for(var i=0;i<childNodes.length;i++){
			var child=childNodes[i];
			if(child.nodeType==1&&child.nodeName==tagName){
				a.push(child);
			}		
		}		
	}else{
		throw new Error("tagName类型错误！");		
	}
	return a;
}

//得到ele元素的兄弟节点，ele的相邻节点，ele的哥哥节点，ele的弟弟节点
DOM.preSiblings=function(ele){
	var p=ele.previousSibling;
	var a=[];
	while(p){
		if(p.nodeType===1){
				a.push(p);
		}
		p=p.previousSibling;		
	}
	a.reverse();
	return a;//321
}
DOM.nextSibling=function(ele){
	var a=[];
	var n=ele.nextSibling;
	while(n){
		if(n.nodeType==1){
			a.push(n);
		}
		n=n.nextSibling;
	}
	return a;
}
DOM.siblings=function(ele){	
	return DOM.preSiblings(ele).concat(DOM.nextSibling(ele));	
}
DOM.closet=function(ele){
	var a=[];
	var p=ele.previousElementSibling
	if(typeof p =="object"){//如果支持previousElementSibling
		if(p){
			a.push(p)
		};
		var n=ele.nextElementSibling
		if(ele.nextElementSibling){
			a.push(n);
		}
		return a;
	}
	var p=ele.previousSibling;	
	//ele.firstChild;
	//ele.firstElementChild;
	var n=ele.nextSibling;
	while(p){
		if(p.nodeType==1){
			a.push(p);
			break;
		}
		p=p.previousSibling;
	}	
	while(n){
		if(n.nodeType==1){
			a.push(n);
			break;	
		}
		n=n.nextSibling;		
	}
}
