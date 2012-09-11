pingback_heatmap

名词解释:

	pingback是sogou-ufo团队开发的一个可以获取用户在页面点击[mousedown event]坐标的Javascript工具，坐标原点是页面竖直平分线y=0

	pingback_heatmap基于pingback,heatmap,nodejs,phantomjs和php的再服务器端提前生成热力图的工具，查看效果的时候，只需要打开引用pingback js的页面，引入pingback_heatmap的api javascript，就可以查看不同日期的热力图，页面总点击数，并且可以通过鼠标创建选区获取某个特定区域的点击数

原理：

	pingback将获取到的用户点击信息以日志形式发送到服务器[pingback_heatmap不包含存储及切日志的逻辑，提供给工具的原始数据须是处理好的文本文件，每行内容，如：pos=x_y pageUrl=http://123.sogou.com]
	
	工具php部分会逐行读取log/目录下所有文本文件，提取出x_y值，并以pageUrl为维度分成不同的Javascript可方便读取的文件，并转存到initlog/目录下 
	
	工具nodejs部分会逐文件读取initlog/目录内容，以1024为viewport将x_y坐标转换成以(0,0)为原点的坐标，并统计求和，并以x值做排，处理完成后，会根据日期生成对应的json文件转存到data/目录下
	
	工具phantomjs部分根据处理好的json文件生成对应的png32背景透明图片转存到img/目录下
	
	以上，服务器端预处理完成
	
	查看效果的时候，只需要打开引用pingback js的页面，以书签或者其他方式引入pingback_heatmap js api后就可以直接选择日期查看效果

	
