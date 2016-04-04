<?php

require_once(dirname(__FILE__).'/../connect/sshconnect.php');
//即将通过SSH发送的命令，分别用于获取全部内存和空闲内存空间
$cmd1="cat /proc/meminfo | grep MemTotal | awk '{print $2}'";
$cmd2="cat /proc/meminfo | grep MemFree | awk '{print $2}'";

//通过get方式获取到参数后开始发起请求
if ( isset($_GET['q']) && $_GET['q']=='meminfo' ) 
{
	$total_mem=$free_mem=0;
	//发送命令并执行
	ssh2_shell($ssh_conn,"bash");
	$streamcmd1=ssh2_exec($ssh_conn,$cmd1);
	$streamcmd2=ssh2_exec($ssh_conn,$cmd2);
	//获取命令执行结果，分别保存成全部内存和空闲内存
	stream_set_blocking($streamcmd1, true);	
	stream_set_blocking($streamcmd2, true);
	$total_mem=stream_get_contents($streamcmd1);
	$free_mem=stream_get_contents($streamcmd2);
	//计算内存使用率
	$percentage=($total_mem-$free_mem)/$total_mem;
	//打印内存使用率，保留4位置小数
	echo round($percentage, 4);
}

?>