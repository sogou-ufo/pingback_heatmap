<?php
    header('Content-type:application/javascript');
    
    echo '(function(){';
    echo 'var severToday='.time().';';
    echo file_get_contents('./page.show.js');
    echo '})();';
?>
