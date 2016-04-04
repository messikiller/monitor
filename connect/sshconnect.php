<?php
//引入配置文件，配置文件中包含了要监控的主机IP和登陆密码
require_once(dirname(__FILE__).'/../config/config.inc.php');
//建立SSH；连接
$ssh_conn=ssh2_connect($config['ssh_host'], $config['ssh_port']) or die("SSH连接到Linux服务器失败！");
ssh2_auth_password($ssh_conn, $config['ssh_username'], $config['ssh_password']) or die("SSH登陆Linux服务器失败！");

?>