---
title: hexo博客遇到的问题
date: 2020-08-10 09:00:00
tags:
  - hexo,
---
<!-- more -->


### [](#1-自定义域名)1.自定义域名

本地推送到githup中不能将CNAME上传博客是显示不了的，


要将 CNAME 文件放在source文件中。


### [](#2-文章生成错误)2.文章生成错误

使用 hexo new  标题新建文章后，用hexo g 生成静态文件过程发生错误


解决方法。打开文章的文件，文件属性要加空格


### [](#3-文章插入图片)3.文章插入图片

使用阿里云图床


 

### [](#4-社交logo不能显示)4.社交logo不能显示

Twitter: [https://twitter.com/brutustao](https://twitter.com/brutustao) || twitter


如果把 || twitter 去掉就显示不了logo了


### [](#5-增加阅读全文标签)5.增加阅读全文标签

```plain
<!--more-->
```


在文章中添加上面的代码让博客的文章显示阅读全文

