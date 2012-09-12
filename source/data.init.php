<?php
	// deal logs
	$logDir = './log/';
	$referfileDir = './initedlog';
	if(is_dir($logDir)){
		$ds = opendir($logDir);
		$hash = array();	
		while($file=readdir($ds)){
			if($file!='.' && $file!='..'){
				$fname = $logDir.$file;
				$filesource = fopen($fname, "r");
				while(!feof($filesource)){
				    $line = fgets($filesource);
					preg_match('/&pageUrl=([^&]+)/', $line, $pageUrl);
					preg_match('/&pos=([^&]+)/', $line, $pos);
					if(count($pageUrl)==2 && count($pos)==2){	
						$url = urldecode($pageUrl[1]);
						$url = preg_replace('/[^0-9a-zA-Z_]/i','',$url);
						$url = urlencode($url);
						$referfilename = $referfileDir.'/'.$url;
						if(!isset($hash[$referfilename])){	
							$hash[$referfilename] = fopen($referfilename,'a');
							fwrite($hash[$referfilename],'var data=[');
						}
						fwrite($hash[$referfilename],'"'.$pos[1].'",');
					}
				}
				fclose($filesource);
			}
		}	

		// clode source
		foreach($hash as $key=>$source){
			fwrite($source,'""];exports.data=data;');
			fclose($source);
		}
	}
?>
