---
title: 站点设置
description: 站点设置相关功能说明
---

## 基本设置

Halo 提供了以下站点基本信息设置：

- **站点标题**
- **站点副标题**
- **Logo**
- **Favicon**
- **首选语言**

在控制台设置完成后，主题端可以通过特定的表达式获取到这些信息并且在对应的位置进行展示。具体是否读取使用这些配置、在哪些位置显示这些信息由使用的不同主题而决定。

以 Halo 2.0 的[默认主题 Earth](https://github.com/halo-dev/theme-earth) 为例，这些设置信息将在如下位置进行展示。

![默认主题基本设置说明](/img/user-guide/settings/setting-basic.png)

## 文章设置

针对主题端的文章展示，Halo 提供了以下设置项：

- **文章列表显示条数**：首页的文章显示条数。
- **归档页文章显示条数**：归档页面（\/archives）的文章显示条数。
- **分类页文章显示条数**：分类归档页面（\/categories\/\{slug\}）的文章显示条数。
- **标签页文章显示条数**：标签归档页面（\/tags\/\{slug\}）的文章显示条数。
- **别名生成策略**：
  - 根据标题：自动根据文章标题生成，比如文章标题为 `Hello Halo`，那么别名将生成为 `hello-halo`
  - 时间戳：使用当前时间的时间戳作为标题
  - Short UUID：生成类似于 `BT5kIgrb` 的别名
  - UUID：生成类似于 `4f662408-ed90-470b-9ed1-7fdc0283631b` 的别名
- **附件存储策略**：在编辑器中上传图片时的附件存储策略
  - 已经在 Halo 2.22 中标记为过时，后续请使用 [附件设置](#附件设置) 代替
- **附件存储组**：在编辑器中上传图片时的附件分组
  - 已经在 Halo 2.22 中标记为过时，后续请使用 [附件设置](#附件设置) 代替

## SEO 设置

针对站点的 SEO（搜索引擎优化）需求，Halo 提供了以下设置项：

- **屏蔽搜索引擎**：配置后会在所有页面 HTML 源码的 head 部分添加：

    ```html
    <meta name="robots" content="noindex" />
    ```

    :::info
    需要注意的是，并不是所有搜索引擎都会遵守这个规则。
    :::

- **站点关键词**：格式为以 `,` 分隔的关键词列表，配置后会在所有页面 HTML 源码的 head 部分添加：

    ```html
    <meta name="keywords" content="{关键词 A, 关键词 B}" />
    ```

    :::warning 注意
    目前主流的搜索引擎（如 Google、Bing、百度搜索等）已经不再使用该标签作为关键词的参考，因此该设置项的作用已经不大，未来我们也可能会移除该设置项。
    :::

- **站点描述**：配置后会在所有页面 HTML 源码的 head 部分添加：

    ```html
    <meta name="description" content="{描述}" />
    ```

## 用户设置

- **开放注册**：是否允许访客注册，勾选之后在登录页面会显示注册入口。
- **注册需验证邮箱**：开启之后，用户注册时必须要经过邮箱验证，需要配置好 [邮件通知](#通知设置)。
- **保留用户名**：设置之后这些用户名将无法被其他用户注册。
- **默认角色**：新注册用户的默认角色。
- **头像存储位置**：用户上传头像的存储策略。
  - 已经在 Halo 2.22 中标记为过时，后续请使用 [附件设置](#附件设置) 代替
- **个人中心附件存储位置**：用户在个人中心端上传附件时的默认存储策略，需要用户包含上传附件的权限。
  - 已经在 Halo 2.22 中标记为过时，后续请使用 [附件设置](#附件设置) 代替

## 附件设置

- **管理端附件配置**：为管理端设置附件上传默认的存储策略和分组，通常用于直接上传附件的场景，比如在文章编辑器中粘贴上传。
- **个人中心附件配置**：为个人中心设置附件上传默认的存储策略和分组，如果你的网站允许部分用户在个人中心创建文章，**那么建议单独创建一个专门的存储策略，并限制文件格式和大小**。
- **头像附件配置**：用户上传头像的存储策略配置，**建议单独创建存储策略并限制仅允许上传图片**。

## 评论设置

针对站点的评论功能，Halo 提供了以下设置项：

- **启用评论**：全局评论功能开关配置，修改后影响所有文章、页面的评论功能。
- **新评论审核**：新增的评论是否需要在控制台进行审核，审核通过后其他访问者才能看到该条评论。
- **仅允许注册用户评论**：开启后只有登录用户才能添加评论，关闭后匿名（未登录）的访客也可以通过自行填写昵称、邮箱、网址等信息进行评论。

## 主题路由设置

针对访问站点各种类型页面的 URL 生成规则，Halo 提供了以下主题路由设置项：

- **分类页路由前缀**：定位到分类列表页面以及分类归档页面。
  - 默认的分类列表页面 URL 规则前缀为 `/categories`
  - 默认的分类归档页面 URL 规则前缀为 `/categories/{slug}`
- **标签页路由前缀**：定位到标签列表页面以及标签归档页面。
  - 默认的标签列表页面 URL 规则前缀为 `/tags`
  - 默认的标签归档页面 URL 规则前缀为 `/tags/{slug}`
- **归档页路由前缀**：定位到文章归档页面的 URL 规则前缀，默认为 `/archives`。
- **文章详情页访问规则**：定位到具体文章详情页面的 URL 规则前缀，默认为 `/archives/{slug}` ，用户可从以下路径规则进行选择：
  - `/archives/{slug}`
  - `/archives/{name}`
  - `/?p={name}`
  - `/?p={slug}`
  - `/?p={slug}`
  - `/{year}/{slug}`
  - `/{year}/{month}/{slug}`
  - `/{year}/{month}/{day}/{slug}`

    :::info 变量说明
    - `slug`：文章别名
    - `name`：文章 `metadata.name` 字段值
    - `year`：四位数格式的文章发布年份
    - `month`：两位数格式的文章发布月份
    - `day`：两位数格式的文章发布日
    :::

## 代码注入

你可以使用代码注入功能，在特定类型的页面中注入额外的代码。你可以通过该功能覆盖或补充部分主题 CSS 样式，或者引入额外的 JavaScript 脚本扩展主题端功能。

- **全局 head 标签**：该代码将会被注入到所有页面的 head 标签中。
- **内容页 head 标签**：该代码将会被注入到文章、页面详情页的 head 标签中。
- **页脚**：该代码将会被注入到所有页面的页脚中。

## 品牌信息

:::note
限 [Halo 付费版](../getting-started/prepare.md#发行版本) 可用。
:::

<p>
<img src="/img/user-guide/settings/brand.png" width="50%" class="medium-zoom-image" />
</p>

- **登录页 Logo**：登录、注册等页面的 Logo 设置，如果不填写将默认使用 Halo 的标志。
- **登录页 Logo 大小**：用于调整登录页面的 Logo 大小。
- **控制台 Logo**：Console 控制台、UC 个人中心的 Logo 设置，如果不填写将默认使用 Halo 的标志。
- **控制台 Logo 大小**：用于调整控制台的 Logo 大小。
- **显示控制台页脚信息**：是否显示 Console 控制台和 UC 个人中心底部的版权信息。
- **自定义页脚信息**：如果勾选了 **显示控制台页脚信息**，可以自定义底部的版权信息，支持 HTML，如果不填写将使用默认的 Halo 版权信息。

## 通知设置

从 2.10.0 版本开始，Halo 提供了 **通知** 功能，当有新的评论、留言、回复等事件发生时，Halo 会通过配置的方式通知站长或者相关用户。同时，个人中心配置的电子邮箱也会作为通知的接收邮箱。

### 邮件通知

- **启用邮件通知器**：开启后，当有新的评论、留言、回复等事件发生时，Halo 会通过 **邮件** 的方式通知站长或者相关用户。
- **用户名**：你需要在此处填写你的 **邮箱账号**。
- **密码**：你需要在此处填写你的 **邮箱密码** 或相关的 **授权码**，具体请参考你所使用邮箱的相关说明。
- **显示名称**：你需要在此处填写你的 **邮箱显示名称**，该名称将会作为邮件发送者的名称显示。
- **SMTP 服务器地址**：你需要在此处填写你的 **SMTP 服务器地址**，具体请参考你所使用邮箱的相关说明。
- **端口号**：你需要在此处填写你的 **SMTP 服务器端口号**，具体请参考你所使用邮箱的相关说明。
- **加密方式**：你需要在此处选择你的 **SMTP 服务器加密方式**，具体请参考你所使用邮箱的相关说明。

> 常见邮箱服务商的文档如下：
>
> - [QQ 邮箱](https://service.mail.qq.com/detail/0/310)
> - [163 邮箱](https://help.mail.163.com/faqDetail.do?code=d7a5dc8471cd0c0e8b4b8f4f8e49998b374173cfe9171305fa1ce630d7f67ac2a5feb28b66796d3b)
> - [Gmail](https://support.google.com/mail/answer/7104828?hl=zh-Hans)
> - [阿里云企业邮箱](https://help.aliyun.com/document_detail/36687.html)
> - [腾讯企业邮箱](https://open.work.weixin.qq.com/help2/pc/19870)

### 短信通知

:::note
限 [Halo 付费版](../getting-started/prepare.md#发行版本) 可用。
:::

目前短信通知在 Halo 中基本只作为用户登录时发送验证码使用，以下是配置说明：

- 提供商 (腾讯云/阿里云/UCloud)：目前仅支持腾讯云、阿里云、UCloud 短信服务中的国内短信服务，即仅能向中国大陆手机号码发送短信
- 超时时间：短信在系统中记录的超时时间，超过当前时间后系统会判断已到期
- 验证码长度：发送验证码到手机商的长度，一般为 6 位
- 提供商具体配置：不同的提供商需要提供的参数不一致，具体提供商的具体参数说明请参考后续文档
- 测试短信：提供检测机制测试当前的配置是否有效。点击测试短信会发送短信给当前操作用户，所以当前的用户在个人信息中配置正确的手机号码

#### 腾讯云短信服务配置说明

在 Halo 中进行以下设置之前，需要先在腾讯云开通短信服务，并创建可用的签名、模板及应用等内容。

- [腾讯云短信服务控制台地址](https://console.cloud.tencent.com/smsv2)
- [腾讯云短信服务文档地址](https://cloud.tencent.com/document/product/382/37745)

1. SecretId：用于调用腾讯云接口的 API 密钥的 SecretId，可以在腾讯云控制台 [API密钥管理页面](https://console.cloud.tencent.com/cam/capi) 创建
2. SecretKey：用于调用腾讯云接口的 API 密钥的 SecretKey，可以在腾讯云控制台 [API密钥管理页面](https://console.cloud.tencent.com/cam/capi) 创建
3. 地域：腾讯云接口要求的必传参数，可选的地域列表可以查看 [腾讯云文档](https://cloud.tencent.com/document/api/382/52071#.E5.9C.B0.E5.9F.9F.E5.88.97.E8.A1.A8)
4. 应用 ID：在腾讯云短信服务 [应用管理菜单](https://console.cloud.tencent.com/smsv2/app-manage) 中创建的应用的 `SDK AppID`
5. 签名内容：在腾讯云短信服务 [签名管理菜单](https://console.cloud.tencent.com/smsv2/csms-sign) 中创建的签名的 `签名内容`
6. 模板 ID：在腾讯云短信服务 [正文模板管理菜单](https://console.cloud.tencent.com/smsv2/csms-template) 中创建的正文模板的 `ID`

#### 阿里云短信服务配置说明

在 Halo 中进行以下设置之前，需要先在阿里云开通短信服务，并创建可用的签名、模板等内容。

- [阿里云短信服务控制台地址](https://dysms.console.aliyun.com/overview)
- [阿里云短信服务文档地址](https://help.aliyun.com/zh/sms/)

1. AccessKey ID：用于调用阿里云接口的 API 密钥的 AccessKey ID，可以在阿里云控制台 [AccessKey管理页面](https://ram.console.aliyun.com/manage/ak) 创建
2. AccessKey Secret：用于调用阿里云接口的 API 密钥的 AccessKey Secret，可以在阿里云控制台 [AccessKey管理页面](https://ram.console.aliyun.com/manage/ak) 创建
3. 地域：阿里云接口要求的必传参数，可选的地域列表可以查看 [阿里云文档](https://help.aliyun.com/zh/sms/developer-reference/api-dysmsapi-2017-05-25-endpoint?spm=a2c4g.11174283.0.0.13d64994r9G5rN)
4. 短信签名：在阿里云短信服务 [签名管理菜单](https://dysms.console.aliyun.com/domestic/text/sign) 中创建的签名的 `签名名称`
5. 短信模板：在阿里云短信服务 [模板管理菜单](https://dysms.console.aliyun.com/domestic/text/template) 中创建的模板的 `模板CODE`

#### UCloud 短信服务配置说明

在 Halo 中进行以下设置之前，需要先在 UCloud 开通短信服务，并创建可用的签名、模板等内容。

- [UCloud 短信服务控制台地址](https://console.ucloud.cn/usms)
- [UCloud 短信服务文档地址](https://docs.ucloud.cn/usms/README)

> 目前仅支持国内短信且短信模版仅支持一个变量的验证码类型短信模版如：**你的验证码为{1}，该验证码5分钟内有效，如非本人操作，请忽略本短信！**

1. 公钥：用于调用 UCloud 接口的 API 密钥的 公钥，可以在 UCloud 控制台 [API密钥](https://console.ucloud.cn/uaccount/api_manage) 创建
2. 私钥：用于调用 UCloud 接口的 API 密钥的 私钥，可以在 UCloud 控制台 [API密钥](https://console.ucloud.cn/uaccount/api_manage) 创建
3. 项目 ID：UCloud 接口要求的必传参数，可选的项目列表可以查看 [项目管理](https://console.ucloud.cn/uaccount/iam/project_manage) 中的`项目ID`
4. 模版 ID：在 UCloud 短信服务 [短信模板](https://console.ucloud.cn/usms/domestic) 中创建的签名的 `模板ID`
5. 签名内容：在 UCloud 短信服务 [短信签名](https://console.ucloud.cn/usms/domestic) 中创建的签名的 `签名内容`

配置完成之后，可以在 [身份认证](../user-guide/users.md#身份认证) 中开启手机号登录。
