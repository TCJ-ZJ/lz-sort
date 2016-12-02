;(function($){

	// 给加入排序的元素添加独特的class

	var lzexpando = 'lz-sort'+new Date().getTime();

	$.extend({

		// 判断参数是否为array对象，是返回true，否则返回false

		isArray: function(v) {

			return Object.prototype.toString.call(v) === '[object Array]';

		},

		// 判断参数是否为object对象，是返回true，否则返回false

		isObject: function(v) {

			return Object.prototype.toString.call(v) === '[object Object]';

		},

		// 检测浏览器版本，如果低于ie11返回true，否则返回false

		checkkit: function(){

			var flag = false,

			sear = new RegExp('IE'),

			arr = (function(){

				var ua= navigator.userAgent, 

				tem, 

				M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

				if(/trident/i.test(M[1])){

					tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];

					return ['IE ',(tem[1] || '')];

				}

				if(M[1]=== 'Chrome'){

					tem= ua.match(/\b(OPR|Edge)\/(\d+)/);

					if(tem!= null) return tem.slice(1);

				}

				M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];

				if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);

				return M;

			})();

			if(sear.test(arr[0])){

				+arr[1] < 11 && (flag = true);

			}else if(arr[0]=='Chrome'){

				+arr[1] < 43 && (flag=true)

			}else if(arr[0]=='Firefox'){

				+arr[1] < 43 && (flag=true)

			}else if(arr[0]=='OPR'){

				+arr[1] < 40 && (flag=true)

			}else if(arr[0]=='Safari'){

				+arr[1] < 8 && (flag=true)

			}

			return flag;

		}

	});

/*！
* 定义构造函数--事件函数
*
* 初始化该对象上的各类参数
*
* 设置各类prototype的方法设置事件函数 
*/

	// 创建一个构造函数	

	var sortEvent = function(val){

		this.$ele = $(val);

		this.param = this.$ele.data("lzsort-param");

		this.status = this.$ele.data("lzsort-status");

	}

	// 设置事件函数，用于调用所有事件函数

	sortEvent.prototype.setEvent = function(){

		var event = this,

		param = this.param;

		// 如果事件（event）参数为数组，则调用所有事件函数

		if($.isArray(param.event)){

			// 调用所有事件函数以绑定元素

			$.each(param.event, function(index, val) {
				
				event[val]  && event[val]();

			});

		// 如果事件（event）参数不为数组，则调用当前事件

		}else{

			event[param.event] && event[param.event]();

		}

	}

	// 设置拖拽排序事件

	sortEvent.prototype.drag = function(){

		// 初始化各类参数

		var me = this.$ele,

		self = me.get(0),

		status = this.status,

		param = this.param;

		// 当点击鼠标按下后，如果是在排序元素上，则将其信息存在status中

		me.children().on('mousedown',function(e){

			e.preventDefault();

			e.stopPropagation();

			// 如果已经开启排序

			if(status.myflag){

				status.mousex = e.pageX;

				status.mousey = e.pageY;

				status.beforePos = $(this).index();

				status.afterPos = $(this).index();

				status.elem = $(this);

				status.posx = $(this).position().left;

				status.posy = $(this).position().top;

				self.sortexcute.setBlock($(this));

				$(this).css('opacity',param.opacity);

				status.dragFlag = true;	

			}

		})

		// 当移动的时候判断是否进入另一个排序元素中，是则进行交换排序操作

		me.on('mousemove',function(e){

			e.preventDefault();

			e.stopPropagation();

			// 如果排序功能已经打开并且有一个元素正在被拖拽

			if(status.myflag && status.dragFlag){

				var target = null,

				posx = e.pageX-status.mousex+status.posx,

				posy = e.pageY-status.mousey+status.posy;

				status.block.css({

					top:posy,

					left:posx

				})

				// 如果浏览器版本低于ie11，进行兼容操作

				if(status.kit){

					status.block.hide();

					target = document.elementFromPoint(e.clientX,e.clientY);

					status.block.show();

				}else{

					target = e.target;

				}

				// 如果进入的元素为排序的元素，且不是当前正在拖拽的元素，并且不在执行中执行交换操作

				if($(target).hasClass(lzexpando) && $(target).index()!==status.afterPos && !status.onprogress){

					// 将正在执行设置为true

					status.onprogress = true;

					// 获得拖拽元素和交换元素的位置

					var dragRect = status.elem.get(0).getBoundingClientRect(),

					blockRect = target.getBoundingClientRect(),

					index = $(target).index();

					// 调用执行交换的函数

					var k = self.sortexcute.doMove(target);

					// 如果交换成功将移动后的位置更新

					k && (status.afterPos = index);

					// 是否进行动画移动

					if(param.animation && !status.kit && k){

						self.sortexcute.doEffect(dragRect,status.elem.get(0));

						self.sortexcute.doEffect(blockRect,target);

					}else{

						status.onprogress = false;

					}

				}

			}

		})

		// 在文档上移动时，更新拖拽块的位置

		$(document).on('mousemove', function(e) {

			e.preventDefault();
			
			if(status.dragFlag && status.myflag){

				var posx = e.pageX-status.mousex+status.posx,

					posy = e.pageY-status.mousey+status.posy;

					status.block.css({

						top:posy,

						left:posx

					})

			}
		});

		// 结束拖拽，初始化状态，删除移动块

		$(document).on('mouseup', function(e) {

			e.preventDefault();

			if(status.dragFlag && status.myflag){

				status.dragFlag= false;

				status.block.remove();

				status.block = null;

				status.elem.css("opacity",1);

				self.sortexcute.setaffiliates()

			}
		});


	}

	// 滚轮事件进行排序

	sortEvent.prototype.wheel = function(){

		var me = this.$ele,

		self = me.get(0),

		status = this.status,

		param = this.param;

		// 当前排序元素上进行滚轮滑动时，进行前一个或者后一个的排序

		me.children().on('mousewheel DOMMouseScroll', function(e) {
			
			e.preventDefault();

			e.stopPropagation();

			if (status.myflag && !status.dragFlag && !status.onprogress) {

				var target = null;

				status.onprogress = true;

				status.beforePos = $(this).index();

				status.afterPos = $(this).index();

				status.elem = $(this);

	            var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
	            (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1)); // firefox  

	            if (delta > 0) {

	            	target = $(e.target).prev();

	            } else if (delta < 0) {

	             	target = $(e.target).next();   

	            }

	            if(target.length!=0){

	            	var dragRect = status.elem.get(0).getBoundingClientRect(),

					blockRect = target.get(0).getBoundingClientRect(),

	            	index = $(target).index();

	            	if(index>status.afterPos){

						$(target).after(status.elem);

					}else if(index<status.afterPos){

						$(target).before(status.elem);
					}

					status.afterPos = index;

					if(param.animation && !status.kit){

						self.sortexcute.doEffect(dragRect,status.elem.get(0));

						self.sortexcute.doEffect(blockRect,target.get(0));

					}else{

						status.onprogress = false;

					}

					self.sortexcute.setaffiliates()

	            }else{

	            	status.onprogress = false;
	            }

       	 	}

		});
	}

/*！
* 定义构造函数--执行函数
*
* 初始化该对象上的各类参数
*
* 设置各类prototype的方法：滚动条和内容高度的计算，并进行滚动操作
*/

	// 创建构造函数	

	var sortMethods = function(val){

		// 初始化各类参数

		this.$ele = $(val),

		this.param = this.$ele.data("lzsort-param");

		this.status = this.$ele.data("lzsort-status");

	}

	// 当进行拖拽排序时，初始化移动块 

	sortMethods.prototype.setBlock = function(elem){

		var me = this.$ele,

		param = this.param,

		status = this.status,

		block =$(elem).clone();

		block.css({

			'position' :'absolute',

			'top': $(elem).position().top,

			'left': $(elem).position().left,

			'pointer-events':'none'

		}).addClass('lzsort-helper').removeClass(lzexpando).appendTo(me);

		status.block = $('.lzsort-helper').eq(0);	

	}

	// 进行元素的交换

	sortMethods.prototype.doMove = function(elem){

		var me = this.$ele,

		status = this.status,

		param = this.param;

		var index = $(elem).index();

		if(param.axis==='y'){

			if(index>status.afterPos && $(elem).offset().left===status.elem.offset().left){

					$(elem).after(status.elem);

					return true;

			}else if(index<status.afterPos && $(elem).offset().left===status.elem.offset().left){

					$(elem).before(status.elem);

					return true;

			}

		}else if(param.axis === 'x'){

			if(index>status.afterPos && $(elem).offset().top===status.elem.offset().top){

				$(elem).after(status.elem);

				return true

			}else if(index<status.afterPos && $(elem).offset().top===status.elem.offset().top){

				$(elem).before(status.elem);

				return true;

			}

		}else{

			if(index>status.afterPos){

				$(elem).after(status.elem);

				return true;

			}else if(index<status.afterPos){

				$(elem).before(status.elem);

				return true;

			}

		}
		return false;
	}

	// 进行移动效果

	sortMethods.prototype.doEffect = function(rect,elem){

		var me = this.$ele,

		status = this.status,

		param = this.param;

		var currect = elem.getBoundingClientRect();

		$(elem).css({

			transition:'none',

			transform: "translate("+(rect.left-currect.left)+"px,"+(rect.top-currect.top)+"px)"

		})

		elem.offsetWidth;

		$(elem).css("transition","all "+param.duration+"ms "+param.effect+" "+param.delay+"ms");

		$(elem).css("transform","translate(0,0)");

		clearTimeout(elem.animated);

		elem.animated = setTimeout(function(){
			$(elem).css({

				transition:'',

				transform:''

			});

			status.onprogress=false;

			elem.animated = null;

		},param.duration);

	}

	// 更新隶属元素的位置

	sortMethods.prototype.setaffiliates =function(){

		var status = this.status,

		afterPos = status.afterPos,

		beforePos = status.beforePos;

		$.each($(status.affiliates), function(index, val) {
			
			if(beforePos>afterPos){

				$(val).children().eq(afterPos).before($(val).children().eq(beforePos));

			}else if (beforePos<afterPos){

				$(val).children().eq(afterPos).after($(val).children().eq(beforePos));

			}

		});

	}

/*！
* 定义构造函数--初始化函数
*
* 初始化该对象上的各类参数
*
* 设置各类prototype的方法：包括初始化参数，初始化事件，初始化布局
*/

	var sortInit = function(val,a){

		this.$ele = $(val);

		this.$ele.data('lzsort-param',this.initParam(a));

		this.$ele.data('lzsort-status',{
			block:null,       // 移动块元素
			dragFlag:false,   // 是否正在进行拖拽
			elem:null,        // 正在拖拽的元素
			beforePos:0,      // 拖拽前的位置
			afterPos:0,       // 拖拽后的位置
			affiliates:'',    // 隶属的元素选择器
			posx:0,           // 拖拽元素拖拽前距离父元素左边的距离
			posy:0,			  // 拖拽元素拖拽前距离父元素顶部的距离
			mousex:0,         // 拖拽前的鼠标横坐标
			mousey:0,         // 拖拽前的鼠标纵坐标
			kit:false,        // 浏览器是否ie11以下
			onprogress:false, // 是否正在进行移动
			myflag:false      // 是否开启排序
		})

	}

	// 初始化页面布局

	sortInit.prototype.layout = function(){

		var me = this.$ele,

		param = me.data('lzsort-param'),

		status = me.data('lzsort-status');

		status.kit = $.checkkit();

		if(me.css('position')==='static') me.css('position','relative');

		status.affiliates = param.affiliates.join(",");

		me.children().addClass(lzexpando);

		if(param.wheel) param.event.push('wheel');

	}

	// 初始化事件函数

	sortInit.prototype.initEvent = function(){

		var me = this.$ele,

		event = new sortEvent(me);

		event.setEvent();

	}

	// 初始化各项参数	

	sortInit.prototype.initParam=function(a){

		var param = {

			// 可拖动的方向

			axis: 'xy',

			// 拖动时底部显示的元素的透明度

			opacity:0,

			// 是否执行移动动画

			animation: true,

			// 移动动画的效果

			effect: 'ease',

			// 移动动画的延迟时间

			delay: 0,

			// 移动动画的持续时间

			duration: 100,

			// 隶属的元素的选择器

			affiliates:[],

			// 是否能够进行滚轮排序

			wheel:false,

			// 事件集

			event:['drag']

		}

		if($.isArray(a)){

			param.affiliates =a;

		}else if(typeof a ==='string'){

			param.axis = a;

		}else if(typeof a ==='boolean'){

			param.aniamation = a;

		}else if($.isObject(a)){

			param=$.extend({},param,a);

		}

		if(this.$ele.data("lzsort-param")){

			param = $.extend({},param,this.$ele.data("lzsort-param"));

		}

		param.axis = (param.axis == 'x' || param.axis =='y' || param.axis == 'xy' ||param.axis =='yx')?param.axis:'xy';

		param.animation = (param.animation===false)?false:true;

		isNaN(param.delay) && (param.delay=0);

		isNaN(param.duration) && (param.duration=300);

		isNaN(param.opacity) && (param.opacity=0);

		param.wheel = (param.wheel===true)?true:false;

		return param;

	}

/*！
* 在jQuery原型中创建一个对象级方法，用于对外接口，是开发者能够向插件中开启和关闭排序
*
* var a = obj.lzsortTool();  创建一个实例，obj 为当前需要改变的排序集
*
* 新的实例对象a可以调用内部的方法
*/


	$.fn.lzsortTool = function(){

		var me = $(this);

		var tool = {

			status : me.data('lzsort-status'),

			// 开启排序

			start: function(){

				if(!!this.status){

					this.status.myflag = true;

				}

			},

			// 关闭排序

			end: function(){

				if(!!this.status){

					this.status.myflag = false;

				}

			}

		}

		return tool;

	}

/*！
* 在jQuery原型中创建一个对象级方法，用于调用sort方法
*/

	$.fn.lzsort = function(a){

		var me = $(this);

		$.each(me,function(index,val){

			var newSort = new sortInit(val,a);

			val.sortexcute = new sortMethods(val);

			newSort.layout();

			newSort.initEvent();

		})

		return me;

	}

})(jQuery)