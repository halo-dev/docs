---
title: 个人中心
description: 关于个人中心的功能说明
---

从 Halo 2.11 开始，除了 Console 管理控制台，我们新增加了个人中心，用于管理和用户相关的所有功能。有了个人中心之后，也可以让网站有更多的使用和开发场景。

## 进入个人中心

你可以通过点击 Console 左下角的个人中心图标进入个人中心，也可以直接访问 `/uc` 进入个人中心。

:::info 提示
此外，如果用户拥有进入 Console 的权限，也会在个人中心的左侧导航栏中看到 Console 的入口。

详情可见：[创建角色](./users.md#创建角色)
:::

![Entry](/img/uc/uc-entry.png)

## 个人资料

这个页面会显示和用户相关的一些信息。

![Entry](/img/uc/uc-profile.png)

## 通知配置

这个页面可以配置用户的通知偏好，可以选择接收哪些类型的通知。

![Entry](/img/uc/uc-notification-preferences.png)

## 个人令牌

个人令牌是一种用于访问 Halo API 的凭证，可以通过个人令牌访问 Halo 的 REST API，而无需通过用户名和密码授权。

![Entry](/img/uc/uc-pat.png)

创建新的个人令牌：

![Entry](/img/uc/uc-pat-creation.png)

- **名称**：个人令牌的名称。
- **过期时间**：个人令牌的过期时间，不选择则表示永不过期。
- **描述**：个人令牌的描述信息，用于描述个人令牌的用途。
- **权限**：个人令牌的权限，可以选择多个权限。

创建好的个人令牌：

![Entry](/img/uc/uc-pat-token.png)

## 消息

此页面用于显示用户收到的站内消息。

![Entry](/img/uc/uc-notifications.png)

## 我的文章

Halo 默认为个人中心提供了管理个人文章的功能，每个用户都可以在个人中心创建、编辑自己的文章。当然，也可以通过配置角色权限，自行决定是否开放此功能，可查阅[创建角色](./users.md#创建角色)。

![Entry](/img/uc/uc-posts.png)
