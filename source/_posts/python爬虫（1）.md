---
title: python爬虫（1）
date: 2020-09-16 09:00:00
tags:
  - python
---


### [](#1爬虫相关库与urllib)1爬虫相关库与urllib

<!-- more -->



```python
from urllib import request

url = "http://www.baidu.com"
response = request.urlopen(url,timeout=1)
print(response.read().decode("utf-8"))
```


### [](#2网页的两种请求方式)2网页的两种请求方式

1.get方式


```python
from urllib import request

response2 = request.urlopen('http://httpbin.org/get', timeout=1)
print(response2.read())
```


2.post方式
  提交用户名和密码


```python
from urllib import parse
from urllib import request

data = bytes(parse.urlencode(&#123;'word': 'hello'&#125;), encoding='utf8')
print(data)

response = request.urlopen('http://httpbin.org/post', data=data)
print(response.read().decode('utf-8'))
```


### [](#3-http头部信息的模拟)3.http头部信息的模拟

```python
from urllib import request, parse

url = 'http://httpbin.org/post'

headers = &#123;
"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
"Accept-Encoding": "gzip, deflate, sdch",
"Accept-Language": "zh-CN,zh;q=0.8",
"Connection": "close",
"Cookie": "_gauges_unique_hour=1; _gauges_unique_day=1; _gauges_unique_month=1; _gauges_unique_year=1; _gauges_unique=1",
"Referer": "http://httpbin.org/",
"Upgrade-Insecure-Requests": "1",
"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36 LBBROWSER"
&#125;

dict = &#123;
'name': 'value'
&#125;

data = bytes(parse.urlencode(dict), encoding='utf8')
req = request.Request(url=url, data=data, headers=headers, method='POST')
response = request.urlopen(req)
print(response.read().decode('utf-8'))
```

