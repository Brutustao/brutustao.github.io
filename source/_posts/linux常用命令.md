---
title: linux常用命令
date: 2020-08-10 09:00:00
tags:
  - linux,
---
<!-- more -->


$ 命令行提示符


**粗体**表示命令


*斜体*表示参数


  *filename, file1, file2* 都是文件名。有时文件名有后缀，比如file.zip


  *command* 命令名


  *dir* 文件夹名


  *string* 字符串


  *username* 用户名


  *groupname* 组名


  *regex* 正则表达式


  *path* 路径


  *device* 设备名


  *partition* 分区名


  *IP* IP地址


  *domain* 域名


  *ID* 远程用户ID


  *host* 主机名，可以为IP地址或者域名


  *var* 变量名


  *value* 变量值


 

### [](#命令帮助)命令帮助

$**man** *command*


查询命令command的说明文档


  $**man** -k *keyword*


  查询关键字


$**info** *command*


更加详细的说明文档


$**whatis** *command*


简要说明


$**which** *command*


command的binary文件所在路径


$**whereis** *command*


在搜索路径中的所有command


这里只是以command (binary file) 为例。比如man还可以用于查询系统函数、配置文件等。


### [](#用户)用户

$**finger** *username*


显示用户username的信息


$**who**


显示当前登陆用户


  $**who** am I


  一个有趣的用法


$**write** username


向用户发送信息 (用EOF结束输入)


$**su**


成为root用户


$**sudo** *command*


以root用户身份执行


$**passwd**


更改密码


### [](#SHELL-BASH)SHELL (BASH)

$**history**


显示在当前shell下命令历史


$**alias**


显示所有的命令别称


  $**alias** *new_command*=’*command*‘


  将命令*command别称为*new_command


$**env**


显示所有的环境变量


  $**export** *var*=*value*


  设置环境变量*var为*value  


$**expr** 1 + 1


计算1+1


### [](#文件系统)文件系统

$**du** -sh *dir*


文件夹大小, -h 人类可读的单位, -s 只显示摘要


$**find** . -name *filename*


从当前路径开始，向下寻找文件*filename*


$**locate** *string*


寻找包含有*string*的路径


  $**updatedb**


  与**find**不同，**locate**并不是实时查找。你需要更新数据库，以获得最新信息。


$**ln** -s *filename path*


为文件*filename*在*path*位置创建软链接


$**pwd**


显示当前路径


  $**cd** *path*


  更改当前工作路径为*path*


  $**cd** -


  更改当前路径为之前的路径


### [](#文件)文件

$**touch** *filename*


如果文件不存在，创建一个空白文件；如果文件存在，更新文件读取和修改时间。


$**rm** *filename*


删除文件


$**cp** *file1 file2*


复制*file1为*file2


$**ls** -l *path*


显示文件和文件相关信息


$**mkdir** *dir*


创建dir文件夹


  $**mkdir** -p *path*


  递归创建路径path上的所有文件夹


  $**rmdir** *dir*


  删除*dir*文件夹，*dir*必须为空文件夹。


  $**rm** -r *dir*


  删除*dir*文件夹，以及其包含的所有文件


$**file** *filename*


文件filename的类型描述


$**chown** *username*:*groupname* *filename*


更改文件的拥有用会为*owner，拥有组为*group


$**chmod** *755 filename*


更改文件的权限为755: owner r+w+x, group: r+x, others: r+x


$**od** -c *filename*


以ASCII字符显示文件


### [](#文件显示)文件显示

$**cat** *filename*


显示文件
  $**cat** *file1 file2*


  连接显示file1和file2


$**head** -1 *filename*


显示文件第一行


$**tail** -5 *filename*


显示文件倒数第五行


$**diff** *file1 file2*


显示*file1*和*file2*的差别


$**sort** *filename*


对文件中的行排序，并显示


  $**sort** -f *filename*


  排序时，不考虑大小写


  $**sort** -u *filename*


  排序，并去掉重复的行


$**uniq** *filename*


显示文件*filename*中不重复的行 (内容相同，但不相邻的行，不算做重复)


$**wc** *filename*


统计文件中的字符、词和行数


  $**wc** -l *filename*


  统计文件中的行数


### [](#文本)文本

$**echo** *string*


显示*string*


$**echo** *string* | **cut** -c5-7


截取文本的第5到第7列


$**echo** *string* | **grep** *regex*


显示包含正则表达式*regex*的行


$**echo** *string* | **grep** -o *regex*


显示符合正则*regrex*的子字符串


### [](#时间与日期)时间与日期

$**date**


当前日期时间


  $**date** +”%Y-%m-%d_%T”


  以YYYY-MM-DD_HH:MM:SS的格式显示日期时间 (格式可参考$man date)


  $**date** –date=”1999-01-03 05:30:00” 100 days


  显示从1900-01-03 05:30:00向后100天的日期时间


$**sleep** 300 


休眠300秒


### [](#进程)进程

$**top**


显示进程信息，并实时更新


$**ps**


显示当前shell下的进程


  $**ps** -lu *username*


  显示用户*username*的进程


  $**ps** -ajx


  以比较完整的格式显示所有的进程


$**kill** *PID*


杀死PID进程 (PID为Process ID)


  $**kill** %*job*


  杀死job工作 (job为job number)


$**lsof** -u *username*


用户*username*的进程所打开的文件


$**dmesg**


显示系统日志


$**time** *a.out*


测试a.out的运行时间


### [](#硬件)硬件

$**uname** -a


显示系统信息


$**df** -lh


显示所有硬盘的使用状况


$**mount**


显示所有的硬盘分区挂载


  $**mount** *partition path*


  挂在*partition到路径*path


  $**umount** *partition*


  卸载*partition*


$**sudo** **fdisk** -l


显示所有的分区


  $**sudo fdisk** *device*


  为device(比如/dev/sdc)创建分区表。 进入后选择n, p, w


  $**sudo mkfs** -t ext3 *partition*


  格式化分区*patition*(比如/dev/sdc1)


  修改 /etc/fstab，以自动挂载分区。增加行：


  /dev/sdc1 path(mount point) ext3 defaults 0 0


$**arch**


显示架构


$**cat** /proc/cpuinfo


显示CPU信息


$**cat** /proc/meminfo


显示内存信息


$**free**


显示内存使用状况


$**pagesize**


显示内存page大小（以KByte为单位）


### [](#网络)网络

$**ifconfig**


显示网络接口以及相应的IP地址。ifconfig可用于设置网络接口


  $**ifup** *eth0*


  运行*eth0*接口


  $**ifdown** *eth0*


  关闭*eth0*接口


$**iwconfig**


显示无线网络接口


$**route**


显示路由表。route还可以用于修改路由表


$**netstat**


显示当前的网络连接状态


$**ping** *IP*


发送ping包到地址*IP*


$**traceroute** *IP*


探测前往地址*IP*的路由路径


$**dhclient**


向DHCP主机发送DHCP请求，以获得IP地址以及其他设置信息。


$**host** *domain*


DNS查询，寻找域名*domain*对应的IP


  $**host** *IP*


  反向DNS查询


$**wget** *url*


使用**wget**下载*url*指向的资源


  $**wget** -m *url* 


  镜像下载


### [](#SSH登陆与文件传输)SSH登陆与文件传输

$**ssh** *ID*@*host*


ssh登陆远程服务器*host*，*ID*为用户名。


$**sftp** *ID*@*host*


登陆服务器*host*，*ID*为用户名。sftp登陆后，可以使用下面的命令进一步操作：


  **get** *filename*  # 下载文件


  **put** *filename*  # 上传文件


  **ls**       # 列出host上当前路径的所有文件


  **cd**       # 在host上更改当前路径


  **lls**       # 列出本地主机上当前路径的所有文件


  **lcd**       # 在本地主机更改当前路径


$**scp** *localpath* *ID*@*host*:*path*


将本地*localpath*指向的文件上传到远程主机的*path*路径


  $**scp** -r *ID*@*site*:*path* *localpath*


  以ssh协议，遍历下载*path路径下的整个文件系统，到本地的*localpath


### [](#压缩与归档)压缩与归档

$**zip** *file.zip* *file1* *file2*


将*file1和*file2*压缩到*file.zip


$**unzip** *file.zip*


解压缩*file.zip*


$**gzip** -c *filename > file.gz*


将文件*filename压缩到*file.gz


$**gunzip** *file.gz*


解压缩*file.gz*文件


$**tar** -cf *file.tar* *file1* *file2*


创建tar归档


  $**tar** -zcvf *file.tar file1 file2*


  创建tar归档，并压缩


  $**tar** -xf *file.tar*


  释放tar归档


  $**tar** -zxf *file.tar.gz*


  解压并释放tar归档


### [](#打印)打印

$**lpr** *filename*


打印文件


$**lpstat**


显示所有打印机的状态

