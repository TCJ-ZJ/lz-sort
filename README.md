## lz-sort使用手册
**当前版本： V1.1.0**

### lz-sort是什么
>lz-sort是一款基于jQuery库开发的轻量级日期选择器插件，方便开发者能够通过对某个元素集合进行排序，并且提供操作杆方式来对页面的元素进行排序

### 具体参数列表

| 参数名称 | 参数变量 | 参数取值 | 参数说明 |
|-----------|------------|------------|------------|
| 可拖动的方向  	 |`axis`        |'[x]' / '[y]'/'[xy]'/['yx'] |控制排序时拖动的元素可以进行排序的方向，参数为空时：默认值为 *xy*
| 透明度 	  |`opacity`     |'[number]'   |控制拖动时底部元素的透明度，设置为0时则为不可见，参数为空时：默认值为 *0*
| 是否开启动画效果  	 |`animation`      |[true] / [false]|设置是否再排序的时候进行移动效果，参数为空时： 默认值为 *true*
| 效果名   |`effect`   |'[ease]'/'[linear]'/'[ease-in]'/'[ease-out]'/'[ease-in-out]' |参考transition，本参数为空时：默认值为 *ease*
| 延迟时间   |`delay`   |'[number]'  |参考transition，单位ms，本参数为空时：默认值为 *0*
| 持续时间   |`duration`   |'[number]' |参考transition，单位ms，本参数为空时：默认值为 *100*
| 隶属元素选择器   |`affiliates`   |'[array]' |该参数为一个数组，数组内放置选择器字符串，本参数为空时：默认值为 *[]*
| 是否开启滚轮排序   |`wheel`   |[true] / [false] |当该参数为true的时候能够滚动鼠标滑轮进行排序，本参数为空时：默认值为 *false*



### 引入库文件
--此插件基于jQuery开发
```HTML
<script src="js/jquery-11.1.1.min.js"></script>
<script src="js/lz-sort.1.1.0.min.js"></script>
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
            delay: 0,
            duration:100,
            affiliates:['.affiliate'],
            wheel:true
       })
    -->
</script>
```


### 提供的外部调用函数

**调用接口**
```javascript
/*调用接口时，请使用操作元素集的父级元素*/

// 开启排序

$('#sort1').lzsortTool().start();

// 关闭排序

$('#sort2').lzsortTool().end();

```

© 本手册由 磨盘兄弟 @lzmoop 官方提供 www.lzmoop.com
