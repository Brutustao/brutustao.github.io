---
title: 用 Claude 改造 Hexo 博客
date: 2026-05-05 09:00:00
tags:
  - hexo
  - claude
---

今天花了大半天时间，把博客从头到尾梳理了一遍。记录下用 Claude 都做了些什么。

## 首页摘要显示

之前首页一直显示全文，文章一长页面就很臃肿。解决方法是插入 `<!-- more -->` 标签。用脚本批量处理了 9 篇文章，但遇到一个坑——文件编码是 UTF-8 with BOM，`^---` 正则始终匹配不上，改成 `utf-8-sig` 读取才解决。不过第一次插的位置不对（插在 Front-matter 后面），导致 excerpt 为空。改成了插在第一段后面，这样首页就只显示每篇文章的第一段 + "阅读全文" 按钮。

## 语言修复

NexT v8 的语言包是 `zh-CN.yml`，但配置文件写的是 `language: zh-Hans`。主题找不到这个文件，fallback 到了阿拉伯语——菜单变成了 "الوسوم"、"الأرشيفات"，底部显示 "تطبيق الموقع"。改回 `zh-CN` 后全部恢复正常。

## 部署问题修复

GitHub Actions 部署一直用 `peaceiris/actions-gh-pages`，但 `GITHUB_TOKEN` 推送的提交不会触发内置的 `pages-build-deployment` 工作流。所以 gh-pages 分支内容是最新的，但 GitHub Pages CDN 一直没更新。换成 `actions/upload-pages-artifact` + `actions/deploy-pages` 官方方案解决。

## 标签页

菜单里有"标签"链接，但 `source/tags/` 目录不存在，打开是空白。新建了 `type: tags` 页面。检查文章时发现标签格式也有问题——`- vim,` 末尾带逗号，Hexo 把 "vim," 当成标签名。统一去掉了逗号。

## 杂项

- 头像换成了新图片
- 侧边栏位置调到了右侧，又改回了左侧

## 感受

用 Claude 改博客很顺手，描述需求直接改代码，不用自己查文档。但编码问题（BOM、语言包）这类细节还是得留意，工具再强也想不到文件开头有个不可见字符。整体下来效率比手动改高太多了。
