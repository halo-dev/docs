---
title: 介绍
description: 介绍 Halo 的 RESTful API 使用方式
---

Halo 提供了 RESTful 风格的 API，Halo 的前端（主要为 Console 和 UC）与后端的交互都是通过 API 完成的。

此文档将介绍如何使用 Halo 提供的 RESTful API。

## API 在线文档

文档地址：[https://api.halo.run](https://api.halo.run)

![API 文档预览](/img/developer-guide/rest-api/swagger-ui-overview.png)

其中，我们为 Halo 核心模块提供了几个分组，方便开发者查看：

- **Console API**：为 Console 控制台提供的自定义 API。
- **User-center API**：为 UC 个人中心提供的自定义 API。
- **Extension API**：核心[模型](https://github.com/halo-dev/rfcs/tree/main/extension)自动生成的 CRUD API。
- **Public API**：公开的 API，无需认证。
- **Aggregated API**：所有 API 的聚合。

## 认证方式

### 个人令牌（推荐）

个人令牌是一种用于访问 Halo API 的安全凭证，你可以使用个人令牌代替您的 Halo 账户密码进行身份验证。

在个人中心的**个人令牌**页面中，可以根据当前用户已有的权限创建个人令牌，创建方式可参考：[个人中心 / 个人令牌](../../user-guide/user-center.md#个人令牌)

创建成功后，将会得到一个 `pat_` 开头的字符串，接下来在所需请求的请求头中添加 `Authorization` 字段，值为 `Bearer <pat>` 即可。

#### 示例

cURL 请求示例：

```bash
curl -X 'GET' \
  'https://demo.halo.run/apis/content.halo.run/v1alpha1/posts' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer pat_1234567890abcdef'
```

[Axios](https://www.axios-http.cn/) 请求示例：

```javascript
import axios from 'axios';

axios.get('https://demo.halo.run/apis/content.halo.run/v1alpha1/posts', {
  headers: {
    Authorization: 'Bearer pat_1234567890abcdef',
  },
})
.then(response => {
  // handle response
})
```

### Basic Auth

:::warning
通过 Basic Auth 认证将在未来的版本默认关闭，请谨慎使用。
:::

Basic Auth 是一种通过用户名和密码进行身份验证的方式，你可以使用 Halo 账户的用户名和密码进行身份验证。

在请求头中添加 `Authorization` 字段，值为 `Basic <base64>` 即可，其中 `<base64>` 为 `username:password` 的 Base64 编码。

#### 示例

cURL 请求示例：

```bash
curl -X 'GET' \
  'https://demo.halo.run/apis/content.halo.run/v1alpha1/posts' \
  -H 'accept: */*' \
  -H 'Authorization: Basic ZGVtbzpQQHNzdzByZDEyMy4u'
```

[Axios](https://www.axios-http.cn/) 请求示例：

```javascript
import axios from 'axios';

axios.get('https://demo.halo.run/apis/content.halo.run/v1alpha1/posts', {
  headers: {
    Authorization: `Basic ${Buffer.from('demo:P@ssw0rd123..').toString('base64')}`,
  },
})
.then(response => {
  // handle response
})
```

## 示例项目

列举一些使用了 Halo RESTful API 的项目，以供参考：

- [halo-sigs/attachment-upload-cli](https://github.com/halo-sigs/attachment-upload-cli)：在 Terminal 中上传文件到 Halo 并得到链接，兼容 Typora 编辑器的图片上传。
- [halo-sigs/vscode-extension-halo](https://github.com/halo-sigs/vscode-extension-halo)：用于将 Markdown 文件发布到 Halo 的 Visual Studio Code 插件。
- [halo-sigs/obsidian-halo](https://github.com/halo-sigs/obsidian-halo)：Obsidian 插件，用于将 Markdown 文件发布到 Halo。
- [LetTTGACO/elog](https://github.com/LetTTGACO/elog)：开放式跨端博客解决方案，随意组合写作平台（语雀/飞书/Notion/FlowUs）和博客平台。
- [GodlessLiu/Halo-Image-Plugin](https://github.com/GodlessLiu/Halo-Image-Plugin)：一个浏览器插件，支持在浏览器中上传图片内容到 Halo 附件。
- [terwer/siyuan-plugin-publisher](https://github.com/terwer/siyuan-plugin-publisher)：支持将思源笔记的文章发布到 Halo。
