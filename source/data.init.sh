#!/bin/bash
cd #path# 

rm -rf ./initedlog
mkdir ./initedlog

/usr/bin/php ./data.init.php
