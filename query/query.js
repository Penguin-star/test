(function(window, undefined) {
	var query,
		_rword = /[^, ]+/g, //切割字符串为一个个小块，以空格或豆号分开它们，结合replace实现字符串的forEach  by司徒
		_class2type = {}, //存放类型
		_hasOwn = Object.prototype.hasOwnProperty, //找原型
		_toString = Object.prototype.toString,
		document = window.document,
		domReg = /^#([\w\-]+$)|^(\w+$)|^(([\w\-]+)?\.([\w\-]+$))/;

	"Boolean Number String Function Array Date RegExp Object Error".replace(_rword, function(name) {
		_class2type["[object " + name + "]"] = name.toLowerCase()
	});

	


	query = function(selector, context) {
		return new query.fn.init(selector, context);
	}

	query.fn = query.prototype = {
		constructor: query, //为了以后判断
		init: function(selector, context) {
			// console.log(selector, context)

			var results,
				match;

			if (!selector) {
				return this;
			}


			//只要有nodeType则为一个dom对象,因为nodeList的nodeType为undefined
			if ( selector.nodeType ) {
				this.context = this[0] = selector;
				this.length = 1;
				return this;
			}


			//如果为string
			if ( typeof selector === "string" ) {
				selector = query.trim( selector );

				if(selector.indexOf("<") === 0){//如果创建标签

				} else {
					context = context && context instanceof query ? context[0] : document;
					match = selector.match(domReg) || [];

					if(match[1]){// #id
						this[0] = document.getElementById(match[1]);
						this.length = 1;
						return this;
					} else if (match[2]){// div
						results = query_find(context, match[2]);
					} else if (match[3]){//div.class || .class
						results = query_find(context, match[4], match[5]);
					}
				}
			}

			if(results){//如果有结果则把 fn 里的方法合并上
				return query.merge( this, results );
			}
			return this;
		},
		length: 0,
		size: function() {
			return this.length;
		},
		html: function( str ){
			if(str === undefined){
				return this.length ? this[0].innerHTML : "";
			} else {
				return query.each(this, function(){
					this.innerHTML = str;
				});
			}
		},
		children: function( selector ){
			var arr = [];
			query.each(this, function(){
				if(this.nodeType){
					query.each(query_next(this.firstChild), function(i){
						arr.push(this);
					});
				}
			});
			this.length = 0;
			return query.merge( this, arr );
		},
		find: function(selector){
		},
		each: function(callback){
			return query.each(this, callback);
		}
	}

	query.fn.init.prototype = query.prototype;


	/**
	 * 多个合并
	 * 1, extend({1},{2},{3}); => {1,2,3}
	 * 2, extend({1}) => 合并到 query 对象上
	 */
	query.extend = query.fn.extend = function() {
		var target = arguments[0] || {},
			length = arguments.length,
			options,
			copy,
			i;

		// extend({a:1,b:2}); 直接合并到$上;
		if (length === 1) {
			target = this;
		}

		//合并多个的时候, 合并到第一个上
		for (i = 0; i < length; i++) {
			if ("object" === typeof(options = arguments[i])) {
				for (name in options) {
					copy = options[name]; //复制目标
					if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
		return target; //如果是合并到$上则返回$,否则返回第一个对象
	};

	query.extend({
		isFunction: function(fn) {
			return getType(fn) === "function";
		},
		isNumber: function(num) {
			return getType(num) === "number";
		},
		isArray: function(array) {
			return getType(array) === "array";
		},
		isWindow: function(obj) {
			return /^\[object (Window|DOMWindow|global)\]$/.test(_toString.call(obj))
		},

		//是否为{}对象
		isPlainObject: function(obj) {
			if (getType(obj) !== "object" || obj.nodeType || query.isWindow(obj)) { //如果不是obj 或 有nodeType的dom 或 win
				return false
			}
			try {
				if (obj.constructor && !_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) { //如果有构造器 并且 原型里有 isPrototypeOf才是对象,当然你可以去伪装,但这里太二了吧
					return false
				}
			} catch (e) {
				return false
			}
			return true
		},
		type: getType,
		noop: function() {}, //别无他想,就是一个空fn
		isEmptyObject: function(obj) { //本来我还想先判断下isPlainObject,但妹的发现根本不用 *_*
			var name;
			for (name in obj) {
				return false;
			}
			return true;
		},

		/**
		 * array indexOf
		 */
		inArray: function(elem, arr, i) {
			var len;

			if (arr) {
				if (Array.prototype.indexOf) {
					return Array.prototype.indexOf.call(arr, elem, i);
				}

				len = arr.length;
				i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

				for (; i < len; i++) {
					// i in arr 是索引必须在[].length内
					if (i in arr && arr[i] === elem) {
						return i;
					}
				}
			}

			return -1;
		},
		each: function(obj, callback) { //添加遍历方法,可遍历{}和[];
			var value,
				length = obj.length,
				isObj = length === undefined,
				i;
			if (isObj) { //如果为{};
				for (i in obj) {
					if (value = obj[i], callback.call(value, i, value) === false) {
						break;
					}
				}
			} else {
				for (i = 0; i < length; i++) {
					if (value = obj[i], callback.call(value, i, value) === false) {
						break;
					}
				}
			}
			return obj;
		},
		browser: function() {
			var obj = {},
				d = function(ua) {
					ua = ua.toLowerCase();
					var b = /(chrome|version)[ \/]([\w.]+)/.exec(ua) ||
						/(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||
						/(msie) ([\w.]+)/.exec(ua) ||
						ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) || [];
					return {
						browser: b[1] || "",
						version: b[2] || "0"
					}
				}(window.navigator.userAgent);
			if (d.browser) {
				obj[d.browser] = true;
				obj.version = d.version;
			};
			if (obj.webkit) {
				obj.safari = true;
			};

			//判断ie6
			obj.isIe6 = !-[1, ] && !window.XMLHttpRequest;

			//判断是否支持media, ie6 7 8不支持
			obj.isMedia = !! -[1, ];

			//判断是否支持css3等属性 ie6789不支持
			obj.isCss3 = !! (obj.isMedia ? (obj.msie && parseInt(obj.version, 10) <= 9 ? 0 : 1) : 0);

			return obj;
		}(),
		merge: function(first, second) {
			var l = second.length,
				i = first.length,
				j = 0;

			if (typeof l === "number") {
				for (; j < l; j++) {
					first[i++] = second[j];
				}

			} else {
				while (second[j] !== undefined) {
					first[i++] = second[j++];
				}
			}

			first.length = i;

			return first;
		},


		//空格为什么要这样替换
		//https://www.imququ.com/post/bom-and-javascript-trim.html
		trim: function(text){
			return text === null ?//解决null的问题
				"" :
				( text + "" ).replace( /^[\s\uFEFF\xa0\u3000]+|[\uFEFF\xa0\u3000\s]+$/g, "" );
		}
	});



	//内部的了
	
	/**
	 * 获取类型
	 */
	function getType(obj) { //取得类型
		if (obj === null) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			_class2type[_toString.call(obj)] || "object" :
			typeof obj;
	}

	/**
	 * 判断是否有className
	 */
	function hasClass ( ele, className ){
		if(ele.classList){
			return ele.classList.contains(className);
		}
		return !!ele.className && (" " + ele.className + " ").indexOf(" " + className + " ") > -1;
	}


	/**
	 * 查找下面所有元素
	 */
	function query_find( ele, tagName, className){
            var arr = [],
                element,
                i,
                len;
            
            if(ele && ele.nodeType){
            	element = ele.getElementsByTagName( tagName || "*");
            }

            if(element){
            	if(className){
            		for(i=0,len=element.length; i<len; i++){
            			if(hasClass(element[i], className)){
            				arr.push(element[i]);
            			}
            		}
            	} else {
            		arr = element;
            	}
            }

            return arr;
    }

    /**
     * 查找下一个元素
     */
    function query_next( ele, type, target, tagName){
            var arr = [],
                element = ele && ele.nodeType && ele.nextSibling,
                m;
            if(tagName){
                tagName = tagName.toUpperCase();
            }
            while(element){
                if(element.nodeType === 1 && (!tagName || element.nodeName === tagName) && element !== target){
                    arr.push(element);
                    if(type === "one"){
                        m = true;
                        element = null;
                    }
                }
                !m && (element = element.nextSibling);
            }
            return arr;
        }



	/**
     * 用于验证dom是否符合selector条件
			object: tagName attrName attrValue
     */
// 	function validateSelector(dom, object) {
// 		/*
// 			验证属性
// 		*/
// 		var attributeFun = function(dom, object) {
// 			var n, v;

// 			if (object.attrName) {
// 				if (!dom.getAttribute(object.attrName)) {
// 					return false;
// 				}
// 			}

// 			if (object.attrValue) {
// 				/*
// 					当属性为href的时候IE下会自动补全
// 				*/
// 				v = dom.getAttribute(object.attrName);
// 				if (object.attrName == "href") {
// 					v = dom.getAttribute(object.attrName);
// 					if (v.indexOf("#") != -1) {
// 						v = "#" + v.split("#")[1];
// 					}
// 				}
// 				if (v != object.attrValue) {
// 					return false;
// 				}
// 			}

// 			if (object.className) {

// 				if (!DMIMI.hasClass(object.classValue, dom.className)) {
// 					return false;
// 				}
// 			}

// 			return true;
// 		};

// 		/*
// 			先验证tagName因为是唯一的
// 		*/
// 		if (object.tagName) {
// 			if (dom.tagName !== object.tagName.toUpperCase()) {
// 				return false;
// 			}
// 		}

// 		/*
// 			验证属性需要多个
// 		*/

// 		var arr = object.arr;
// 		var bool = true;
// 		for (var j = 0; j < arr.length; j++) {
// 			bool = attributeFun(dom, arr[j]);
// 			/*
// 				只要一个不通过直接就返回false
// 			*/
// 			if (!bool) {
// 				break;
// 			}
// 		}
// 		return bool;
// 	}


// console.log(testSelector(document.body, "div.xl[xielaing=1]"))
// 	/**
// 	 * 把text转成对象验证
// 	 * @param  {[type]} name [description]
// 	 * @param  {[type]} text [description]
// 	 * @return {[type]}      [description]
// 	 */
// 	function testSelector(element, selector) {
// 		var match,
// 			result = false,
// 			attrStr;

// 		if(!element || !element.nodeType){
// 			console.log(element)
// 			return result;
// 		}

// 		if((selector = query.trim(selector))){
// 			//如果有 attr 属性
// 			if(selector.indexOf("[") > -1){
// 				attrStr = selector.slice(selector.indexOf("["));
// 				selector = selector.slice(0, selector.indexOf("["));
// 			}

// 			match = selector.match(domReg) || [];

// 			if(match[1]){// #id
// 				result = element.id === match[1];
// 			} else if (match[2]){// div
// 				results = element.nodeName === match[2];
// 			} else if (match[3]){//div.class || .class
// 				results = element.nodeName === match[4] && element.className === match[5];
// 			}

// 			//必须是 [i] 以上才算真的 /cy
// 			if(attrStr && attrStr.length > 3){
// 				match = attrStr.match(domAttrReg);
// 				console.log(match)
// 			}
// 			return results
// 		}

// 		return results;
// 	}

	window.query = query;
}(window));