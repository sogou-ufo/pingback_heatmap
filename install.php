<?php 
    if(file_exists("./conf.php")){
        require_once "./conf.php";    
        global $config;
        if(!file_exists($config["path"])){
            echo "file not exist";    
        }else{
            $reg_arr = array();    
            $rep_arr = array();
            foreach($config as $config_item=>$config_value){
                array_push( $reg_arr , '/#' . $config_item . '#/');
                array_push( $rep_arr , $config_value);
            }
            if($handle = opendir('./source/')) {
                while (false !== ($entry = readdir($handle))) {
                       if( $entry == "." || $entry == ".." || is_dir("./source/" . $entry) || $entry == "install.php" || $entry =="conf.php" )continue;
                    file_put_contents($config["path"] . $entry , preg_replace($reg_arr , $rep_arr , file_get_contents("./source/" . $entry))); 
                }
                closedir($handle);
            }
            system("rm -rf " . $config["path"] . "static/;cp -rf ./source/static " . $config["path"]);
            print_r("\033[32mnow u can add data.get.sh,data.init.sh,data.process.sh,data.send.sh to crontab\033[0m" . "\n");
        }
    }else{
        print_r("\033[31mno conf.php found!\033[0m\n");
    }
?>
