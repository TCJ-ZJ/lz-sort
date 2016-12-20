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

	sortEvent = function(val){

		this.$ele = $(val);

		this.param = this.$ele.data('lzsort-param');

		this.status = this.$ele.data('lzsort-status');

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

	sortEvent.prototype.drag = function(){

		var me = this.$ele,

		self = me.get(0),

		status = this.status,

		param = this.param;

		me.children().off('.lzsort').on('mousedown.lzsort', function(e) {

			if(e.button==0){

				e.preventDefault();

				e.stopPropagation();

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

				param._onDragStart && param._onDragStart.call(this,param,status);

			}



		})

		me.off('.lzsort').on('mousemove.lzsort', function(e) {
			e.preventDefault();

			e.stopPropagation();

			if((status.myflag || status.longflag) && status.dragFlag){

				var target = null,

				posx = e.pageX - status.mousex +status.posx,

				posy = e.pageY - status.mousey + status.posy;

				status.block.css({

					top:posy,

					left:posx

				})

				if(status.kit){

					status.block.hide();

					target = document.elementFromPoint(e.clientX,e.clientY);

					status.block.show();

				}else{

					target = e.target;

				}

				if($(target).hasClass(lzexpando) && $(target).index()!==status.afterPos && !status.onprogress){

					status.onprogress = true;

					var dragRect = status.elem.get(0).getBoundingClientRect(),

					blockRect = target.getBoundingClientRect(),

					index = $(target).index();

					var k = self.sortexcute.doMove(target);

					k && (status.afterPos = index);

					if(param.animation && !status.kit && k){

						self.sortexcute.doEffect(dragRect,status.elem.get(0));

						self.sortexcute.doEffect(blockRect,target);

					}else{

						status.onprogress = false;

					}

				}

				param._onDrag && param._onDrag.call(this,param,status)

			}
		})

		$(document).on('mouseup', function(e) {

			e.preventDefault();
			
			if(status.block){

				status.dragFlag= false;

				status.block.remove();

				status.block = null;

				status.elem.css("opacity",1);

				!status.myflag && status.elem.css('cursor','default');

				self.sortexcute.setaffiliates()

				param._onDragEnd && param._onDragEnd.call(this,param,status)

			}

		});
	}

	sortEvent.prototype.wheel = function(){

		var me = this.$ele,

		self = me.get(0),

		status = this.status,

		param = this.param;

		me.children().off('mousewheel.lzsort DOMMouseScroll.lzsort').on('mousewheel.lzsort DOMMouseScroll.lzsort', function(e) {
			
			e.preventDefault();

			e.stopPropagation();

			if (status.myflag && !status.dragFlag && !status.onprogress && param.wheel) {

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

	sortEvent.prototype.longPress = function(){

		var me = this.$ele,

		self = me.get(0),

		status = this.status,

		param = this.param,

		interval = null;

		me.children().off('.longPress').on('mousedown.longPress', function(e) {

			var i = $(this);

			if(e.button===0 && param.longPress){

				interval = setTimeout(function(){

					status.longflag = true;

					i.css('cursor','move');

					(!param.myflag && param._onDragStart) && param._onDragStart.call(this,param,status);

				},1000)

			}

		}).on('mouseout.longPress', function(e) {

			e.preventDefault();

			if(status.longflag!=true){

				clearInterval(interval);

				interval = null;

			}
		});

		$(document).on('mouseup', function(e) {

			e.preventDefault();

			if(interval){

				clearInterval(interval);

				interval = null;

			}
			
			status.longflag = false;

		});

	}

	var sortMethods = function(val){

		this.$ele = $(val),

		this.param = this.$ele.data('lzsort-param');

		this.status = this.$ele.data('lzsort-status');

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

		$(elem).css("transition","all "+param.duration+"ms "+param.effect);

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

	var sortInit = function(val,a){

		this.$ele = $(val);

		this.$ele.data('lzsort-param',this.initParam(a));

		this.$ele.data('lzsort-status',{
			block:null,
			dragFlag:false,
			elem:null,
			beforePos:0,
			afterPos:0,
			affiliates:'',
			posx:0,
			posy:0,
			mousex:0,
			mousey:0,
			kit:false,
			onprogress:false,
			myflag:false,
			longflag:false
		})

	}

	sortInit.prototype.layout = function(){

		var me = this.$ele,

		param = me.data('lzsort-param'),

		status = me.data('lzsort-status');

		status.kit = $.checkkit();

		if(me.css('position')==='static') me.css('position','relative');

		status.affiliates = param.affiliates.join(",");

		me.children().addClass(lzexpando);

	}

	sortInit.prototype.initEvent = function(){

		var me = this.$ele,

		param = me.data('lzsort-param'),

		event = new sortEvent(me);

		if(param.wheel) param.event.push('wheel');

		if(param.longPress) param.event.push('longPress');

		event.setEvent();

	}

	sortInit.prototype.initParam = function(a){

		var param = {

			axis:'xy',

			opacity:0,

			animation:true,

			effect:'ease',

			duration:100,

			affiliates:[],

			wheel:false,

			longPress:false,

			_onDragStart:null,

			_onDrag:null,

			_onDragEnd:null,

			event:['drag','wheel','longPress']

		}

		$.isArray(a) && (param.affiliates = a);

		typeof a ==='string' && (param.axis =a);

		typeof a ==='boolean' && (param.animation=a);

		$.isObject(a) && (param = $.extend({},param,this.$ele.data('lzsort-param')));

		param.axis = (param.axis == 'x' || param.axis =='y' || param.axis == 'xy' ||param.axis =='yx')?param.axis:'xy';

		param.animation = (param.animation===false)?false:true;

		isNaN(param.delay) && (param.delay=0);

		isNaN(param.duration) && (param.duration=300);

		isNaN(param.opacity) && (param.opacity=0);

		param.wheel = (param.wheel===true)?true:false;

		param.longPress = (param.longPress===true)?true:false;

		return param;

	}

	var tool = function(val){

		this.$ele = $(val);

	}

	tool.prototype.destory = function(){

		var me = this.$ele;

		$.each(me,function(index,val){

			var self = $(val);

			self.off('.lzsort');

			self.children().off('.lzsort').off('.longPress');

			self.removeData('lzsort-param').removeData('lzsort-status');

		})

		return false;

	}

	tool.prototype.init = function(a){

		var me = this.$ele;

		$.each(me,function(index,val){

			var self = $(val);

			self.off('.lzsort');

			self.children().off('.lzsort').off('.longPress');

			self.removeData('lzsort-param').removeData('lzsort-status');

		})

		me.lzsort(a);

	}

	tool.prototype.setAxis = function(str){

		var me = this.$ele;

		$.each(me,function(index,val){

			$(val).data('lzsort-param').axis = str;

		})

		return this;

	}

	tool.prototype.setOpacity = function(num){

		var me = this.$ele;

		$.each(me,function(index,val){

			$(val).data('lzsort-param').opacity = num;

		})
	}

	tool.prototype.setDuration = function(num){

		var me = this.$ele;

		$.each(me,function(index,val){

			$(val).data('lzsort-param').duration = num;

		})

	}

	tool.prototype.setAffiliates = function(arr){

		var me = this.$ele;

		$.each(me,function(index,val){

			$(val).data('lzsort-param').affiliates = arr;

			$(val).data('lzsort-status').affiliates = arr.join(',');

		})

	}

	tool.prototype.start = function(){

		var me = this.$ele;

		$.each(me,function(index,val){

			$(val).data('lzsort-status').myflag = true;

		})

		me.children().css('cursor','move');

	}

	tool.prototype.stop = function(){

		var me = this.$ele;

		$.each(me,function(index,val){

			$(val).data('lzsort-status').myflag = false;

		})

		me.children().css('cursor','default');

	}

	tool.prototype.onAnimation = function(){

		var me = this.$ele;

		$.each(me,function(index,val){

			$(val).data('lzsort-param').animation = true;

		})

	}

	tool.prototype.offAnimation = function(){

		var me = this.$ele;

		$.each(me,function(index,val){

			$(val).data('lzsort-param').animation = false;

		})

	}

	tool.prototype.onWheel = function(){

		var me = this.$ele;

		$.each(me,function(index,val){

			$(val).data('lzsort-param').wheel = true;

		})

	}

	tool.prototype.offWheel = function(){

		var me = this.$ele;

		$.each(me,function(index,val){

			$(val).data('lzsort-param').wheel = false;

		})

	}

	tool.prototype.onLongPress = function(){

		var me = this.$ele;

		$.each(me,function(index,val){

			$(val).data('lzsort-param').longPress = true;

		})

	}

	tool.prototype.offLongPress = function(){

		var me = this.$ele;

		$.each(me,function(index,val){

			$(val).data('lzsort-param').longPress = false;

		})

	}

	tool.prototype.on = function(str,fn){

		if((str==='dragStart' || str ==='drag' || str ==='dragEnd') && typeof fn ==='function'){

			$.each(me,function(index,val){

				str ==='dragStart' && ($(val).data('lzsort-param')._onDragStart = fn);

				str ==='drag' && ($(val).data('lzsort-param')._onDrag = fn);

				str ==='dragEnd' && ($(val).data('lzsort-param')._onDragEnd = fn);

			})

		}

	}

	$.fn.sortTool = function(){

		var me = $(this);

		return new tool(me);

	}

	$.fn.lzsort = function(a){

		var me = $(this);

		$.each(me,function(index,val){

			var newSort = new sortInit(val,a);

			val.sortexcute = new sortMethods(val);

			newSort.layout();

			newSort.initEvent();

		})

		return me.sortTool();

	}

})(jQuery)