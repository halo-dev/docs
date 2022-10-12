---
title: 常见问题
description: 使用上的常见问题
---

### Halo 是什么？

**Halo** [ˈheɪloʊ]，一款现代化的开源博客/CMS系统，值得一试。

### 没有提供 SQL 脚本，是否需要手动建表？

得益于我们使用的 ORM 框架，Halo 在首次启动的时候会自动根据实体类创建表结构，无需通过 SQL 脚本自行创建，也不会提供所谓的 SQL 脚本。所以仅需配置好数据库连接地址和用户名密码即可。注意，H2 无需手动创建数据库，MySQL 需要。

详情可见：[配置参考](../getting-started/config#数据库)

### 为什么百度无法搜索到我的站点？

这是一个暂时无法解答的问题。所涉及到的问题过多，受影响因素可能有域名、服务器 IP 位置、建站时间、网站结构、内容等等。建议了解一下 SEO 相关知识对网站进行优化，目前我们在程序方面做的优化有：

- 支持 sitemap 站点地图：可访问 `/sitemap.xml` 或 `/sitemap.html`
- 全站绝对路径
- 页面静态化
- 支持自定义文章关键字和描述
- 支持自定义站点关键字以及站点描述

### 忘记了管理员密码，如何重置？

目前在登录页面含有隐藏的 `找回密码` 链接，点击即可进入找回密码页面，具体可参考以下步骤：

1. 在登录页面按下键盘快捷键（Windows / Linux：`Shift + Alt + H`，macOS：`Shift + Command + H`）即可显示 `找回密码` 链接。
2. 按照表单提示输入用户名和邮箱，点击 `获取` 按钮即可发送带有验证码的邮件。
3. 按照表单填写验证码和新密码，点击重置密码即可。

> 需要注意的是，第 2 步中的获取验证码需要事先配置了 SMTP 发信设置，否则无法发送验证码。但你可以登录服务器查看 Halo 运行日志，搜索 `Got reset password code` 关键字即可获取到验证码。

### 附件上传提示 `413 Request Entity Too Large` 如何解决？

这可能是由于 Nginx 的上传大小限制所导致的。可以在 Nginx 的配置文件下的 server 节点加入 `client_max_body_size 1024m;` 即可解决，如果 1024m 还不够，请自行断定，详细配置参考如下：

```nginx {4}
server {
    listen       80;
    server_name  localhost;
    client_max_body_size 1024m;
}
```

### 开启了两步验证但丢失了验证设备或 APP，如何取消两步验证？

可以参考 [忘记了管理员密码，如何重置？](#忘记了管理员密码如何重置) 重置密码，完成重置密码之后即可清除两步验证。

### 网站加载速度慢，是什么问题导致的？

导致网站加载速度慢的原因有很多，建议打开浏览器的 Developer Tools 查看具体是哪个请求时间过长，然后进行针对性的优化。这里提供一些可能的原因：

1. 服务器带宽过小，很多厂商提供的最低带宽一般是 1M。
2. 服务器地区过远，这个需要自行取舍。
3. 网站上的图片过多或者体积过大，可以尝试压缩图片，或者参考 [优雅的让 Halo 支持 webp 图片输出](https://halo.run/archives/halo-and-webp.html) 的教程配置一个 Webp 图片的服务。
4. 部分主题的静态资源可能是由公共 CDN 提供的，当这个 CDN 不稳定的时候可能会导致加载变慢。

一些提升网站加载速度的建议：

1. 尽量不要选择 1M 带宽的服务器，可以根据自己的预算适当提升带宽。一般 3M 以上即可。
2. 尽量购买网络质量较好的服务器，或者较近区域的服务器。
3. 如果一定需要放大量的图片，建议先无损压缩一下再使用。
4. 如上所说，可以自行搭建一个 Webp 图片转换的服务，参考 [优雅的让 Halo 支持 webp 图片输出](https://halo.run/archives/halo-and-webp.html)。
5. 如果网站的静态资源加载慢是由三方 CDN 导致的，可以自行修改主题。
6. 可以使用全站 CDN 加速的方案。

### 如何在一台服务器上部署多个站点？

参考 [写在前面/工作目录](../getting-started/prepare.md#工作目录) 我们可以知道，工作目录对于 Halo 主程序来说是固定的。如果我们需要部署多个站点，我们提供以下两种方式以供参考：

1. 创建多个 Linux 账户，并在每个账户上运行一个独立的 Halo。因为工作目录是基于账户的，所以每个账户都有自己的工作目录。但是有一点需要注意，就是需要修改每一个 Halo 的运行端口，参考：[配置参考/端口](../getting-started/config#%E7%AB%AF%E5%8F%A3)
2. 使用 Docker 创建多个容器，因为使用 Docker 可以将内部的工作目录映射到宿主机的任何目录，可以参考以下创建容器的方式：

    ```bash
    # 第一个 Halo 容器
    docker run -it -d --name halo1 -p 8090:8090 -v ~/.halo.1:/root/.halo --restart=unless-stopped halohub/halo:latest

    # 第二个 Halo 容器
    docker run -it -d --name halo2 -p 8091:8090 -v ~/.halo.2:/root/.halo --restart=unless-stopped halohub/halo:latest
    ```

更多 Docker 相关的教程请参考：[使用 Docker 部署 Halo](../getting-started/install/docker.md)

### 如何查看运行日志？

1. 登录到服务器，查看工作目录下的 `logs/spring.log`。
2. 在 Halo 后台进入开发者选项（点击左上角 `Halo Dashboard` 10 次），选择 `实时日志` 界面。

### SMTP 发信设置配置正确，但是发信失败，如何解决？

可能是部分厂商不允许使用密码作为客户端登录的凭证，一般会提供类似 `授权码` 的设置，将 `授权码` 当做密码在 Halo 后台设置即可。如还有其他类型的原因，欢迎向我们提交 issue：[https://github.com/halo-dev/halo/issues/new/choose](https://github.com/halo-dev/halo/issues/new/choose)

### 网站配置了全站 CDN 导致后台部分功能异常，如何解决？

可能是 CDN 厂商默认关闭了 `参数跟随` 选项，导致部分接口参数没有正确添加到回源请求上。你可以在 CDN 控制台查找此选项并打开。或者设置路径过滤，过滤掉 `/api/admin`，让接口请求始终访问回源地址。

### 前台样式丢失，如何解决？

前台样式不正常或者丢失有很多种问题的可能，最快捷定位问题的方式就是打开浏览器控制台查看具体请求的错误，以下列出了部分导致出现该问题的常见原因：

1. 后台设置的 `博客地址` 与实际访问地址不一致。也可能是开启了 https 之后，无法正常加载 http 资源，将 `博客地址` 改为 https 协议即可。
2. Nginx 配置了静态资源缓存，但没有设置 `proxy_pass`，参考如下：

    ```nginx
    location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|flv|mp4|ico)$ {
        proxy_pass http://halo;
        expires 30d;
        access_log off;
    }
    ```
