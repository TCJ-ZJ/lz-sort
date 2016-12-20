## lz-sort使用手册
**当前版本： V1.2.0**

### lz-sort是什么
>lz-sort是一款基于jQuery库开发的轻量级日期选择器插件，方便开发者能够通过对某个元素集合进行排序，并且提供操作杆方式来对页面的元素进行排序

### 具体参数列表

| 参数名称 | 参数变量 | 参数取值 | 参数说明 |
|-----------|------------|------------|------------|
| 可拖动的方向  	 |`axis`        |'[x]' / '[y]'/'[xy]'/['yx'] |控制排序时拖动的元素可以进行排序的方向，参数为空时：默认值为 *xy*
| 透明度 	  |`opacity`     |'[number]'   |控制拖动时底部元素的透明度，设置为0时则为不可见，参数为空时：默认值为 *0*
| 是否开启动画效果  	 |`animation`      |[true] / [false]|设置是否再排序的时候进行移动效果，参数为空时： 默认值为 *true*
| 效果名   |`effect`   |'[ease]'/'[linear]'/'[ease-in]'/'[ease-out]'/'[ease-in-out]' |参考transition，本参数为空时：默认值为 *ease*
| 持续时间   |`duration`   |'[number]' |参考transition，单位ms，本参数为空时：默认值为 *100*
| 隶属元素选择器   |`affiliates`   |'[array]' |该参数为一个数组，数组内放置选择器字符串，本参数为空时：默认值为 *[]*
| 是否开启滚轮排序   |`wheel`   |[true] / [false] |当该参数为true的时候能够滚动鼠标滑轮进行排序，本参数为空时：默认值为 *false*
| 是否开启长按排序   |`longPress`   |[true] / [false] |当该参数为true的时候能够长按鼠标左键进行排序，本参数为空时：默认值为 *false*



### 引入库文件
--此插件基于jQuery开发
```HTML
<script src="js/jquery-11.1.1.min.js"></script>
<script src="js/lz-sort.1.2.0.min.js"></script>
```	

### 调用插件
--参数可为空，全部参数请参考列表；可多次调用
```html
	<!-- 使用html5 data属性进行传参,优先级大于js传参 -->
	
	<div id="date" data-lzsort-param='{"axis":"y","wheel":true}'></div>
```

```javascript
<script type="javascript">
    <!--
    	$('#lzsort1').lzsort(['.affiliate']) //隶属元素选择器		
    $('#lzsort').lzsort('x') //可拖动的方向		
   $('#lzsort').lzdate(true) //是否开启移动动画
   
      /* 或使用对象传参 */

        $('#lzsort4').lzsort({
            axis : 'y' ,
            opacity : 0 ,
            animation : true ,
            effect:'linear',
            duration:100,
            affiliates:['.affiliate'],
            wheel:true，
	    longPress:false
       })
    -->
</script>
```


###回调方法
```javascript
	//调用方式	
	var tool = $('#lzsort').lzsort(); //调用插件并获得回调方法集
	var tool =  $('#lzsort').sortTool(); //获得该元素的回调方法集
	
	//回调方法
	tool.setAxis(str) //设置可移动的方向	
	tool.setOpacity(num) //设置透明度	
	tool.setDuration(num) //设置动画的持续时间	
	tool.setAffiliates(arr) // 设置隶属元素	
	tool.start() //开启排序	
	tool.stop() //关闭排序
	tool.onAnimation() //开启动画	
	tool.offAnimation() //关闭动画	
	tool.onWheel() //开启滚动排序	
	tool.offWheel() //关闭滚动排序	
	tool.onLongPress() //开启长按排序	
	tool.offLongPress() //关闭长安排序
	tool.init({}) //初始化排序	
	tool.on('dragStart',fn) //添加开始拖拽的回调函数
	tool.on('drag',fn) //添加正在拖拽时的回调函数
	tool.on('dragEnd',fn) //添加拖拽完成的回调函数
```

© 本手册由 磨盘兄弟 @lzmoop 官方提供 www.lzmoop.com
