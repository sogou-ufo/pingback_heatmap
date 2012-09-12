    // 代码对介入者无侵入
    var $;
    _createScriptTag = function(scr, url, charset){
        scr.setAttribute('type', 'text/javascript');
        charset && scr.setAttribute('charset', charset);
        scr.setAttribute('src', url);
        document.getElementsByTagName('head')[0].appendChild(scr);
    };
    _removeScriptTag = function(scr){
        if (scr.clearAttributes) {
            scr.clearAttributes();
        } else {
            for (var attr in scr) {
                if (scr.hasOwnProperty(attr)) {
                    delete scr[attr];
                }
            }
        }
        if(scr && scr.parentNode){
            scr.parentNode.removeChild(scr);
        }
        scr = null;
    };

    callByBrowser = function (url, opt_callback, opt_options) {
        var scr = document.createElement('SCRIPT'),
            scriptLoaded = 0,
            options = opt_options || {},
            charset = options['charset'],
            callback = opt_callback || function(){},
            timeOut = options['timeOut'] || 0,
            timer;
        scr.onload = scr.onreadystatechange = function () {
            if (scriptLoaded) {
                return;
            }
            
            var readyState = scr.readyState;
            if ('undefined' == typeof readyState
                || readyState == 'loaded'
                || readyState == 'complete') {
                scriptLoaded = 1;
                try {
                    callback();
                    clearTimeout(timer);
                } finally {
                    scr.onload = scr.onreadystatechange = null;
                    _removeScriptTag(scr);
                }
            }
        };

        if( timeOut ){
            timer = setTimeout(function(){
                scr.onload = scr.onreadystatechange = null;
                _removeScriptTag(scr);
                options.onfailure && options.onfailure();
            }, timeOut);
        }
        
        _createScriptTag(scr, url, charset);
    };
    var dataSever = '#dataSever#';
    var staticSever = '#staticSever#';
    function filename(refer,date){
        var fname = 'h' + refer.replace(/[^0-9a-zA-Z_]/g,'');
        var day = date ? Math.floor((+(new Date(date)) / (1000*60*60)+8)/24) : Math.floor((+(new Date(severToday * 1000)) / (1000*60*60) + 8)/24) - 1;
        return fname + day
    };
    // 渲染热力图遮罩
    function drawMap(date,callback){
        var fname = filename(location.href,date);
        var src = dataSever + 'img/' + fname + '.img.png';
        if($('#heatmapimg')[0]){
            $('#heatmapimg').attr('src',src).attr('date',date);    
        }else{
            var tpl = '<img' + (date?' date="' + date + '"':'') + ' onerror="heatmapimgError(this)" id="heatmapimg" style="float:none;" src="' +
                src +
                '"/>';
            $('#heatmapcanvas').html(tpl);
        }
        rangeInit();
        callback && callback(fname);
    };
    function log(logmsg){
        $('#heatmapcount').html(logmsg.msg)
    };
    // 数据不存在
    window.heatmapimgError = function(img){
        log({
            code:1,
            msg: ($(img).attr('date') || '昨' ) + '日没有数据'
        });    
    };
    // 选区效果初始化
    var rangeInited;
    var clickRange;
    function rangeInit(){
        if(rangeInited)return;
        rangeInited = 1;
        clickRange = $('img#heatmapimg').imgAreaSelect({
            handles: true,
            instance: true,
            onSelectEnd: function(img,range){
                var fname = img.src.match(/h[^\/]+\.img\.png/g);    
                if(fname){
                    fname = fname.join('').split('.img.png')[0];
                    if(window[fname]){
                        var count = getAreaCount(range,window[fname].data);
                        $('.imgareaselect-selection').css({background:'#fff',opacity:0.6});
                        log({
                            code: 0,
                            msg: '区域点击: ' + count + '次 ' + (count/ window[fname].total*100).toFixed(2) + '%<br /> 页面点击: ' + window[fname].total + '次'
                        });
                    }
                }
            }
        })    
    };
    function getAreaCount(range,data){
        // 折半法
        var mid = parseInt(data.length/2);
        var count = 0;

        for(var i = mid, len = data.length; i < len; i++){
            var temp = data[i];
            if(temp.x > range.x2){
                break;
            }
            if(temp.x >= range.x1 && temp.y >= range.y1 && temp.y <= range.y2){
                count += temp.count
            }
        }    
        for(var i = mid - 1; i >=0; i--){
            var temp = data[i];
            if(temp.x < range.x1){
                break;
            }
            if(temp.x <= range.x2 && temp.y >= range.y1 && temp.y <= range.y2){
                count += temp.count    
            }
        }    
        return count
    };
    window.getAreaCount = getAreaCount;
    //    初始化热力图画布
    function drawInit(){
        var tpl = 
            '<div id="heatmapcanvas" style="text-align:center;overflow:hidden;height:' +
            $(document.body).height() + 'px;width:100%;position:absolute;left:0;top:0;z-index:10000;background:transparent;">' + 
            '</div>' + 
            '<ul id="heatmapmenu" style="position:fixed;right:0;top:0;z-index:10001;width:200px;border:1px solid #ccc;background:#fefefe;padding:4px;cursor:pointer;">' + 
            //'<li onclick="heatmapShow()">昨日点击分布</li>' + 
            '<li ><label for="heatmapdate">选择日期:</label><input style="width:80px;cursor:pointer;" type="input" readonly="readonly" id="heatmapdate"/><a style="float:right;" onclick="hideheatmap()">隐藏热点图</a></li>' + 
            '<li id="heatmapcount"></li>' + 
            '</ul>';
        $(document.body).append(tpl);
        $(document.body).append('<style type="text/css">#heatmapmenu{font-size:12px;}#heatmapmenu li{margin:4px 0;min-height:18px;width:100%;}#heatmapcount{border:1px solid #999;padding:2px 0;}.imgareaselect-border1,.imgareaselect-border2,.imgareaselect-border3,.imgareaselect-border4{border:1px solid #f00;}</style>')
    };
    // 更具日期进行热力图渲染
    function heatmapShow(date){
        drawMap(date,function(fname){
            loadData(fname,function(fname){
                window[fname] && log({code: 0, msg: (date || '昨') + '日页面点击' + window[fname].total});
            });
            $('#heatmapcanvas').show();
            $('.imgareaselect-outer').show();
        });    
    };
    function hideheatmap(){
         $('#heatmapcanvas').hide();
         clickRange && clickRange.setSelection(0,0,0,0);
         clickRange && clickRange.update();
         $('.imgareaselect-outer').hide();
    };
    window.hideheatmap = hideheatmap;
    window.heatmapShow = heatmapShow;
    // load data
    function loadData(fname,callback){
        if(!window[fname]){
            callByBrowser(dataSever + 'data/' + fname + '.data.js',function(){
                callback && callback(fname)    
            });    
        }else{
            // 数据已经加载过
            callback && callback(fname)    
        }
    };
    function loadStatic(){
        callByBrowser(staticSever + 'static/jquery.imgareaselect.dev.js',function(){
            heatmapShow();
        });
        callByBrowser(staticSever + 'static/jquery-ui-1.8.23.custom.min.js',function(){
            $( "#heatmapdate" ).datepicker({
                dateFormat: "yy-mm-dd",
                maxDate: new Date((severToday - 24*60*60) *1000),
                minDate: new Date('#starttime#'),
                onSelect: heatmapShow
            });
        });
        $(document.head).append('<link rel="stylesheet" type="text/css" href="' + staticSever  + 'static/jquery-ui-1.8.23.custom.css" />');
    };
    if(!window.jQuery){
        callByBrowser(staticSever + 'static/jquery-1.7.2.min.js',function(){
            // 防止jq污染接入页面
            jQuery.noConflict();
            $ = jQuery;
            drawInit();
            loadStatic();
        });
    }else{
        $ = jQuery;
        drawInit();
        loadStatic();
    };
