---
title: Markdown 语法
description: Halo 编辑器中所支持的 Markdown 语法说明
---

## 写在前面

从 1.5.0 版本开始，Halo 默认保存编辑器渲染的 html 文档。使用的 Markdown 渲染库为 [markdown-it](https://github.com/markdown-it/markdown-it)，我们对此进行了封装：[@halo-dev/markdown-renderer](https://github.com/halo-dev/js-sdk/tree/master/packages/markdown-renderer)。后续我们会在任何需要渲染 Markdown 的地方都使用此库，保证 Markdown 渲染结果一致。

## 标题

| 语法              | HTML                | 预览              |
| ----------------- | ------------------- | ----------------- |
| `# 一级标题`      | `<h1>一级标题</h1>` | <h1>一级标题</h1> |
| `## 二级标题`     | `<h2>二级标题</h2>` | <h2>二级标题</h2> |
| `### 三级标题`    | `<h3>三级标题</h3>` | <h3>三级标题</h3> |
| `#### 四级标题`   | `<h4>四级标题</h4>` | <h4>四级标题</h4> |
| `##### 五级标题`  | `<h5>五级标题</h5>` | <h5>五级标题</h5> |
| `###### 六级标题` | `<h6>六级标题</h6>` | <h6>六级标题</h6> |

> 注意：语法与标题之间需要有空格，不要是 `#一级标题`。
