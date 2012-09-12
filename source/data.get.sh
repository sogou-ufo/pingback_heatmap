#!/bin/bash
cd #path# 
rm -rf log
mkdir log
#start=$(date +%s) && sleep 2 && end=$(date +%s) && echo $(( $end - $start ))
#定时任务，7点开始执行，下载日志到本机
time=$(date -d last-day +%Y%m%d)
rsync -avzP #logSever# ./log/ 
