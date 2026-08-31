---
title: 个人中心
description: Halo 个人中心（/uc）：资料、认证方式与会话及与 Console 的入口说明。
---

从 Halo 2.11 开始，除了 Console 管理控制台，我们新增加了个人中心，用于管理和用户相关的所有功能。有了个人中心之后，也可以让网站有更多的使用和开发场景。

## 进入个人中心

你可以通过点击 Console 左下角的个人中心图标进入个人中心，也可以直接访问 `/uc` 进入个人中心。

:::info Console 入口显示条件
此外，如果用户拥有进入 Console 的权限，也会在个人中心的左侧导航栏中看到 Console 的入口。

详情可见：[创建角色](./users.md#创建角色)
:::

![Uc entry](/img/uc/uc-entry.png)

## 个人资料

这个页面会显示和用户相关的信息，并支持修改头像、显示名称、简介等个人资料。用户还可以验证电子邮箱；付费版本在站点已配置短信服务时，还可以验证并绑定手机号。用户可以修改登录密码；通过免密认证注册且尚未设置密码的用户，可以在这里设置密码。

![User profile](/img/uc/uc-profile-edit-2.26.png)

## 通知配置

这个页面可以配置用户的通知偏好，可以选择接收哪些类型的通知。

![Notification preferences](/img/uc/uc-notification-preferences.png)

## 个人令牌

个人令牌是一种用于访问 Halo API 的凭证，可以通过个人令牌访问 Halo 的 RESTful API，而无需通过用户名和密码授权，使用方式可查阅：[RESTful API 介绍](../../developer-guide/restful-api/introduction.md)

![Personal access token](/img/uc/pat-list-2.26.png)

创建新的个人令牌：

![Create personal access token](/img/uc/pat-create-2.26.png)

- **名称**：个人令牌的名称。
- **过期时间**：个人令牌的过期时间，不选择则表示永不过期。
- **描述**：个人令牌的描述信息，用于描述个人令牌的用途。
- **角色与权限模板**：决定个人令牌可以访问的 API 范围，可以选择多个角色或权限模板。

创建好的个人令牌：

![Personal access token string](/img/uc/pat-token-2.26.png)

令牌值只会在创建完成时完整显示，请立即复制并妥善保管。对于已有令牌，可以查看最后使用时间，并执行撤销、恢复或删除操作；删除后无法恢复。


## 认证方式

认证方式页面会列出当前账号可以使用的第三方认证方式。对于支持账号绑定的认证方式，可以在这里绑定或解除绑定。

![个人中心认证方式](/img/uc/authentication-methods-2.26.png)

## 两步验证

在这个选项卡中，我们可以配置登录之后两步验证方式，目前支持 TOTP 验证器。

![Totp](/img/uc/totp.png)

![Totp Config](/img/uc/totp-config.png)

## 登录设备

在这里可以看到当前账号的所有登录设备，你也可以在更多按钮中撤销任意设备。

![User devices](/img/uc/user-devices.png)

## 消息

此页面用于显示用户收到的站内消息。

![Notifications](/img/uc/uc-notifications.png)

## 我的文章

Halo 默认为个人中心提供了管理个人文章的功能，每个用户都可以在个人中心创建、编辑自己的文章。当然，也可以通过配置角色权限，自行决定是否开放此功能，可查阅[创建角色](./users.md#创建角色)。

![My posts](/img/uc/uc-posts.png)

## 商城

Halo 商城版会在个人中心增加订单、收货地址和优惠券功能，使用方法参见[商城客户中心](./shop/customer-center.md)。
