//	args should be (id,width,height)
var system = require('system');
//	默认参数
var args = [0,0];
for(var	i = 1,len = args.length;i < len; i++){
	args[i] = system.args[i] || args[i]
};
function draw(){
	var page = new WebPage();	
	page.viewportSize = { width: 1024, height: 4000 };
	// 不能用短域名
	page.open('#staticSever#page.draw.php?fname=' + args[1]  + '&t=' + (+ (new Date())),function(){
		var imgname = './img/' + args[1] + '.img.png';
		page.render(imgname);
		page.release();
		console.log('热点图' + imgname + '创建成功，正在退出phantom');
		phantom.exit();
	});
};
// id必需
if(!args[1]){
	console.log('file name is required');
	phantom.exit();
}
draw();
