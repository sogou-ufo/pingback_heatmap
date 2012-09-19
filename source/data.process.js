/**
 *    node js数据处理
 */
// 参数
var temp = process.argv.slice(2);

var queue = [];//render queue
var baseDir = '#path#';
baseDir = './';

var logDir = baseDir + 'initedlog';
// log
function log(code,signal){
    console.log(code + ' : ' + signal);
};

var __args = {
    loop:3,// 调用phantom执行失败重试次数
    test:0,// 测试效果
    end:0
};

for(var i = 0, len = temp.length; i < len; i++){
    if(temp[i].indexOf('=')<1)continue;
    var kv = temp[i].split('=');
    __args[kv[0]] = kv[1];
};

// 每天24点之后开始运行渲染图脚本，因此日期减1
var day = Math.floor((+(new Date()) / (1000*60*60) + 8)/24) - 1;
require('child_process').exec('echo "' + day + '" >> run.log');

// conver pos
function posXInit(x,viewport){
    return x*1 + viewport / 2;
};

var defaultViewport = 1024;
//    data processor
function dataProcessor(data){
    var input = data.data;
    var viewport = data.viewport;
    // 不需要对坐标进行转换
    var passViewport = data.exchangeAxis ? 0 : viewport;
    var map = {};
    var arr = [];
    var total = 0;
    // get max
    var max = 0;
    // viewport height
    var maxY = 0;
    //    计数
    for(var i = 0,len = input.length;i < len;i++){
        if(map[input[i]] >= 0){
            var key = map[input[i]];
            arr[key].count++;
        }else{
            var xy = input[i].split('_');
            map[input[i]] = arr.length;
            var key = map[input[i]];
            arr.push({
                count:1,
                x:posXInit(xy[0], passViewport),
                y:xy[1] * 1
            });
            if(xy[1] * 1 > maxY){
                maxY = xy[1] * 1;
                }
        }
        total++;
        if(arr[key].count > max){
            max =  arr[key].count;
        }
    }
    // 排序x轴顺序，提升对前端选区效果的响应
    arr = arr.sort(function(a1,a2){
        return a1.x - a2.x    
    });
    log(0,'数据处理完毕');
    return {
        'total': total,
        'maxY': maxY,
        'max': max,
        'data': arr
    }
};

// make file name
function filename(refer){
    var fname = 'h' + refer.replace(/[^0-9a-zA-Z_]/g,'');
    return fname + day
};

// save data into filenam.data.js
var pointer = 0;
function dataBase(input, callback){
    var fname = filename(input.refer);
    var data = dataProcessor(input);
    var viewport = input.viewport; 
    var fs = require('fs');
    //    asynchronous
    fs.writeFile(baseDir + 'data/' + fname + '.data.js','window.' + fname + '=' + JSON.stringify(data) + ';','utf8',function(){
        log(0,'数据已保存，渲染热点图...' + ' ' + fname);
        var exec= require('child_process').exec , phantom;
        phantom = exec('phantomjs img.draw.js ' + fname + ' ' + viewport , function(err,stdout,stderr){
            !err && log(0,stdout);
            err && log(1,'执行出错: ' + err);
            log(err?err:0,'程序执行完毕，退出');
            callback && callback();
        });
    });
};

// test data maker
function dataMaker(){
    var str = [];
    for(var i = - 480; i < 481;i+=5){
        if(Math.random()>0.5)continue;
        for(var j = 10; j < 1000;j+=5){
            var limit = Math.random() * 1000 * Math.random();
            for(var k = 0; k < limit;k++){
                str.push(i + '_' + j)
            }
        }
    }
    return {
        refer: 'http://123.sogou.com',
        data:str
    }
};

// test
function test(){
    log(0,'开始运行测试效果，模拟数据来源...');
    dataBase(dataMaker())
};

// 串行逐一处理任务，防止崩溃
function oneByOne(arr) {
    if(!arr || arr.length == 0)return;
    var item = arr[0];
    function callback(){
        oneByOne(arr.slice(1)); 
    };
    if(!item || !item.match(/^http/)){
        callback();
        return;
    }
    try{
        var datafile = require(logDir + '/' + item);
        var refer = unescape(item);
        // 过滤掉小数据
        if (!datafile.data || datafile.data.length < 100) {
            callback();
            return;    
        }
        dataBase({
            refer: refer,
            viewport: datafile.viewport || defaultViewport,
            exchangeAxis: datafile.exchangeAxis || 0,
            data: datafile.data
        }, arr.length > 1 ? callback : false)
    }catch(e){
        require('child_process').exec('echo "' + item + ' ' + e + '" >> err.log');
        callback();
    }
};

function logInit(){
    var fs = require('fs');
    var logs = fs.readdirSync(logDir); 
    oneByOne(logs);
};

__args.test && test();

!__args.test && logInit();
