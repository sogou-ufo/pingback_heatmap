<!doctype html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
        <style type="text/css">
            *{
                margin:0;
                padding:0;
            }
            .trp{
                background:transparent;
                height:1000px;
            }
        </style>
    </head>
    <body class="trp">
        <div id="canvas" class="trp" style="width:1024px;height:4000px;"></div>
        <script src="./data/<?php echo $_GET['fname']?>.data.js"></script>
        <script src="#staticUrl#/heatmap.js"></script>
        <script>
            var <?php echo $_GET['fname']?> = window.<?php echo $_GET['fname']?> || {max:0,data:[]};
            window.onload = function(){
                var hf = heatmapFactory.create({"element":document.getElementById("canvas"), "radius":25, "visible":true});
                hf.store.setDataSet(<?php echo $_GET['fname']?>);
            };
        </script>
    </body>
</html>
