#!/bin/bash 
cd #path# 
rm -rf data 
rm -rf img 
mkdir data 
mkdir img 
echo $(date -d last-day +%Y%m%d) >> run.log 
/usr/local/bin/node data.process.js 
