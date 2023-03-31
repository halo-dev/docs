---
title: 常见问题
description: 使用上的常见问题
---

### Halo 是什么？

**Halo** [ˈheɪloʊ]，是一款好用又强大的[开源建站工具](https://github.com/halo-dev/halo)，配合上不同的模板与插件，可以很好地帮助你构建你心中的理想站点。它可以是你公司的官方网站，可以是你的个人博客，也可以是团队共享的知识库，甚至可以是一个论坛、一个商城。

### 忘记密码怎么办？

如果安装时没有指定 `HALO_SECURITY_INITIALIZER_SUPERADMINPASSWORD` 环境变量，系统会随机一个初始化密码，可以通过下面的命令进行查看。

```bash
docker logs halo | grep 'Generated random password:' | tail -1
```

如果你已经修改过初始化密码后忘记了密码，假设系统中还有可用的具有用户管理权限的其他用户，可以通过该用户参考[修改用户密码](./users#修改用户密码)部分，修改指定用户的密码。没有可用的具有用户管理权限的管理员用户时，目前需要通过删除数据库记录的方式，触发管理员用户的初始化任务进行密码重置。

假设 Halo 使用容器方式运行，容器名称为 `halo`，具体操作如下。

1. 停止 Halo 服务

  ```bash
  docker stop halo
  ```

2. 连接 Halo 使用的数据库，删除 admin 用户记录

  以容器化部署的 PostgreSQL 为例，假设容器名称为 `halo_db`。

  ```bash
  # 进入 psql 命令行
  docker exec -it halo_db psql halo

  # 执行下面的 SQL 删除 admin 用户记录
  delete from extensions where name like '/registry/users/admin';
  ```

  :::info
  其他类型的数据库处理方式类似，先通过命令行或数据库连接工具连接到数据库后，再执行上面的 `delete` SQL 语句。
  :::

3. 重新启动 Halo 服务

  ```bash
  docker start halo
  ```

4. 登录 Halo 控制台

  如果部署时通过 `HALO_SECURITY_INITIALIZER_SUPERADMINUSERNAME` 和 `HALO_SECURITY_INITIALIZER_SUPERADMINPASSWORD` 环境变量指定了初始化用户名和密码，使用该用户名密码登录控制台。
  
  如果未指定该配置，则默认用户名为 `admin`，默认密码将打印在 Halo 容器日志中，可以通过如下命令查看。

  ```bash
  docker logs halo | grep 'Generated random password:' | tail -1
  ```

### 为什么百度无法搜索到我的站点？

这是一个暂时无法解答的问题。所涉及到的问题过多，受影响因素可能有域名、服务器 IP 位置、建站时间、网站结构、内容等等。建议了解一下 SEO 相关知识对网站进行优化，目前我们在程序方面做的优化有：

- 支持 sitemap 站点地图：可访问 `/sitemap.xml` 或 `/sitemap.html`
- 全站绝对路径
- 页面静态化
- 支持自定义文章关键字和描述
- 支持自定义站点关键字以及站点描述

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
    docker run \
      -it -d \
      --name halo-1 \
      -p 8090:8090 \
      -v ~/.halo2.1:/root/.halo2 \
      -e HALO_EXTERNAL_URL=http://localhost:8090/ \
      -e HALO_SECURITY_INITIALIZER_SUPERADMINPASSWORD=P@88w0rd \
      halohub/halo:2.4.0

    # 第二个 Halo 容器
    docker run \
      -it -d \
      --name halo-2 \
      -p 8090:8090 \
      -v ~/.halo2.2:/root/.halo2 \
      -e HALO_EXTERNAL_URL=http://localhost:8090/ \
      -e HALO_SECURITY_INITIALIZER_SUPERADMINPASSWORD=P@88w0rd \
      halohub/halo:2.4.0
    ```

更多 Docker 相关的教程请参考：[使用 Docker 部署 Halo](../getting-started/install/docker.md)

### 如何查看运行日志？

使用 docker logs 命令进行查看。

```bash
# '-f' 滚动更新日志
# '-n 200' 从倒数第200行开始查看
# 更多帮助可以查看 'docker logs --help'
docker logs -f halo_next -n 200
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
