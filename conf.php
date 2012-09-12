<?php
	/**
	 config
	 * */
	 $config = array(
	 	"path" 			=> dirname(__FILE__) . "/", // 安装目录，默认安装文件所在的目录为安装目录
		"logSever" 		=> "root@xxx::root/xxxxx/*_click_\$time.log", // 日志文件存储的服务器及规则，如果不能满足需求可以直接修改data.get.sh
		"starttime"		=> date("Y-m-d"), // 安装pingback时间，默认是安装时间，建议配置为第一次日志产生时间
		"staticSever" 	=> "http://ufo/~yangqianjun/githeatmap/pingback_heatmap/", // 工具所在根目录的http地址，必须以"/"结尾
		"dataSever"		=> "", // 如果需要分开部署数据和热点图生成逻辑，则将此配置项配置成数据服务器，并在data.send.sh完善实现数据拷贝到数据服务器逻辑，必须以"/"结尾
		"dataSendCMD"	=> "", // 发送数据命令
	 );

	 if($config["dataSever"]==""){
	 	$config["dataSever"] = $config["staticSever"];
	 }
?>
