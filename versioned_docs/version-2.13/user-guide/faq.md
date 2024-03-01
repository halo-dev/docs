---
title: 常见问题
description: 使用上的常见问题
---

### Halo 是什么？

**Halo** [ˈheɪloʊ]，是一款好用又强大的[开源建站工具](https://github.com/halo-dev/halo)，配合上不同的模板与插件，可以很好地帮助你构建你心中的理想站点。它可以是你公司的官方网站，可以是你的个人博客，也可以是团队共享的知识库，甚至可以是一个论坛、一个商城。

### 忘记密码怎么办？

1. 站点管理员已经配置好邮件通知，并且用户已完成电子邮箱验证时，可以点击登录页面的 `找回密码` 选项或直接访问 `/console/reset-password` 地址，填写用户名及对应邮箱后，系统将向该邮箱发送密码重置链接，用户可通过该链接重置密码；
2. 如果不满足上述条件，或者密码重置邮件不能发送成功，请直接联系具有用户管理权限的管理员进行密码重置操作，管理员可参考文档[修改用户密码](./users#修改用户密码)部分修改指定用户的密码；
3. 如果系统没有任何一个能够正常登录控制台且具有用户管理权限的管理员账号，则用户需要通过更新数据库记录的方式重置指定用户的密码。
  
  :::info 参考 SQL 语句

  通过以下 SQL 语句，可以将 `admin` 用户的密码重置为 `password`，密码重置后请尽快修改为更加安全的密码。
  
  **PostgreSQL** 数据库

  ```SQL
    UPDATE
        extensions
    SET
        data = convert_to(
            jsonb_set(
                convert_from(data, 'UTF-8') :: jsonb,
                '{spec,password}',
                '"{bcrypt}$2a$10$7tBEL1sNQSr/uWtLZHLmCeA9IGx0I9/Jz//3Uwo/anIm9xdxv.xrO"'
            ) :: text,
            'UTF-8'
        )
    WHERE
        name LIKE '/registry/users/admin';
  ```

  **MySQL** 数据库

  ```SQL
  UPDATE
      extensions
  SET
      data = JSON_SET(
          CONVERT(data USING utf8mb4),
          '$.spec.password',
          '{bcrypt}$2a$10$7tBEL1sNQSr/uWtLZHLmCeA9IGx0I9/Jz//3Uwo/anIm9xdxv.xrO'
      )
  WHERE
      name LIKE '/registry/users/admin';
  ```
  
  :::

### 附件上传提示 `413 Request Entity Too Large` 如何解决？

这可能是由于 Nginx 的上传大小限制所导致的。可以在 Nginx 的配置文件下的 server 节点加入 `client_max_body_size 1024m;` 即可解决，如果 1024m 还不够，请自行断定，详细配置参考如下：

```nginx {4}
server {
    listen       80;
    server_name  localhost;
    client_max_body_size 1024m;
}
```

### 网站加载速度慢，是什么问题导致的？

导致网站加载速度慢的原因有很多，建议打开浏览器的 Developer Tools 查看具体是哪个请求时间过长，然后进行针对性的优化。这里提供一些可能的原因：

1. 服务器带宽过小，很多厂商提供的最低带宽一般是 1M。
2. 服务器地区过远，这个需要自行取舍。
3. 网站上的图片过多或者体积过大，可以尝试压缩图片，或者参考 [优雅的让 Halo 支持 webp 图片输出](https://www.halo.run/archives/halo-and-webp) 的教程配置一个 Webp 图片的服务。
4. 部分主题的静态资源可能是由公共 CDN 提供的，当这个 CDN 不稳定的时候可能会导致加载变慢。

一些提升网站加载速度的建议：

1. 尽量不要选择 1M 带宽的服务器，可以根据自己的预算适当提升带宽。一般 3M 以上即可。
2. 尽量购买网络质量较好的服务器，或者较近区域的服务器。
3. 如果一定需要放大量的图片，建议先无损压缩一下再使用。
4. 如上所说，可以自行搭建一个 Webp 图片转换的服务，参考 [优雅的让 Halo 支持 webp 图片输出](https://www.halo.run/archives/halo-and-webp)。
5. 如果网站的静态资源加载慢是由三方 CDN 导致的，可以自行修改主题。
6. 可以使用全站 CDN 加速的方案。

### 如何在一台服务器上部署多个站点？

使用 Docker 创建多个容器，因为使用 Docker 可以将内部的工作目录映射到宿主机的任何目录，可以参考以下创建容器的方式：

 ```bash
 # 第一个 Halo 容器
 docker run \
   -it -d \
   --name halo-1 \
   -p 8090:8090 \
   -v ~/.halo2:/root/.halo2 \
   halohub/halo:2.13 \

 # 第二个 Halo 容器
 docker run \
   -it -d \
   --name halo-2 \
   -p 8091:8090 \
   -v ~/.halo2_2:/root/.halo2 \
   halohub/halo:2.13 \
 ```

更多 Docker 相关的教程请参考：[使用 Docker 部署 Halo](../getting-started/install/docker.md)

### 如何查看运行日志？

1. 可以在 Console 端的概览页面下载最近的日志文件。
2. 使用 docker logs 命令进行查看。

  ```bash
  # '-f' 滚动更新日志
  # '-n 200' 从倒数第200行开始查看
  # 更多帮助可以查看 'docker logs --help'
  docker logs -f halo -n 200
  ```

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
