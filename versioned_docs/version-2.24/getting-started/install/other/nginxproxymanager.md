---
title: Nginx Proxy Manager 反向代理
description: 使用 Nginx Proxy Manager 为 Halo 配置域名转发与 SSL 证书说明。
---

## Halo 部署

参见 [使用 Docker Compose 部署](../docker-compose)

:::info
`「反向代理」` 部分不进行操作，保证 Halo 服务运行无误即可。
:::

## 简介

Nginx Proxy Manager 是一个可视化的 Nginx 反向代理管理器，支持在 Web UI 上管理反向代理的网站，支持申请免费的 SSL 证书并自动续签。

接下来会介绍如何使用 Nginx Proxy Manager 来反向代理 Halo，以下的 Nginx 安装方式均来自于 [Nginx Proxy Manager 官方文档](https://nginxproxymanager.com/guide/)。在开始之前，建议先阅读一遍官方文档，需要对其有一定的了解。

## 说明

- 此文档需要对 Docker 和 Docker Compose 有一定的熟悉程度，并且已经提前在服务器上安装
- 在安装 Nginx Proxy Manager 之前，需要确保服务器没有其他占用了 80 和 443 端口的服务
- 需要对 Vim 有一定的熟悉程度
- 下文使用 NPM 简称 Nginx Proxy Manager

## 安装 Nginx Proxy Manager

首先，我们创建一个文件夹来存放 NPM 的 `docker-compose.yml` 文件：

```bash
mkdir npm && cd npm
vim docker-compose.yml
```

将下面的内容复制到 `docker-compose.yml` 文件：

```yaml
services:
  npm:
    image: 'jc21/nginx-proxy-manager:latest'
    networks:
      - npm
    restart: unless-stopped
    ports:
      - '80:80'       # Nginx 的 80 端口
      - '443:443'     # Nginx 的 443 端口
      - '81:81'       # Nginx Proxy Manager 的管理端口
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt

# 定义网络以便 NPM 与其他容器通信
networks:
  npm:
    name: npm
    attachable: true
```

:::info
配置中提到的 80、443、81 端口需要提前在服务器提供商开放端口。
:::

启动 NPM：

```bash
docker compose up -d
```

在服务正常启动的情况下，现在已经可以通过 `http://{服务器公网 IP}:81` 访问 NPM 的网页端了。

:::info
如果无法通过端口访问到 NPM，可以检查是否在服务器提供商开放了 `81` 端口。
:::

![Nginx Proxy Manager Welcome](/img/nginx-proxy-manager/npm-welcome.png)

首次进入页面会提示创建管理员账户，需要注意的是：**邮箱一定要是合法邮箱，后续涉及到 SSL 证书签发**。

至此，我们已经完成了 Nginx Proxy Manager 的搭建，之后就可以用它给我们的 Halo 或者其他 Web 应用做反向代理了。

## 配置 Halo 的反向代理

1. 配置 Halo 的 Docker 编排，需要将 `npm` 的网络加入到 Halo 的容器，之后就可以使用 Halo 的服务名作为 `hostname` 在 NPM 的内部进行反向代理了。

    ```yaml {3-5,16-17}
    # 省略
    networks:
      # 加入 npm 网络
      npm:
        external: true
      halo:

    services:
      halo:
        image: registry.fit2cloud.com/halo/halo-pro:2.24
        container_name: halo
        restart: on-failure:3
        volumes:
          - ./halo2:/root/.halo2
        networks:
          # 加入 npm 网络
          - npm
          - halo
    # 省略
    ```

    配置完成之后，需要使用 `docker compose up -d` 命令重建 Halo 容器。
2. 进入 NPM 仪表盘，点击代理服务进入代理服务配置页面。

    ![Nginx Proxy Manager Dashboard](/img/nginx-proxy-manager/npm-dashboard.png)
3. 添加代理配置

    ![Nginx Proxy Manager Add Proxy](/img/nginx-proxy-manager/npm-add-proxy.png)

    1. **域名**：配置想要代理到 Halo 的域名，需要提前在域名服务商解析到当前服务器
    2. **协议**：选择 http
    3. **转发主机名 / IP**：填写 Halo 容器的服务名，比如上方示例中的 `halo`
    4. **转发端口**：8090

    以上配置为必须修改，界面中的其他配置可以按需选择，但其中的**缓存资源**不建议打开，可能不会完全遵守 Halo 的缓存策略。

    配置完成之后，就可以尝试访问域名。
4. 配置 SSL，点击 SSL 选项卡，勾选 **申请新证书** 之后保存即可，同时建议勾选 **强制 SSL**，这样在访问 http 协议的地址时会自动跳转到 https 协议的地址。

    ![Nginx Proxy Manager SSL](/img/nginx-proxy-manager/npm-ssl.png)

至此，我们已经完成了在 Nginx Proxy Manager 配置 Halo 反向代理并添加 SSL 证书的全过程。

## 进阶配置：性能与安全（可选）

前文已完成基础反向代理与 SSL，对大多数博客已经够用。本节介绍在 NPM 中追加性能优化与安全响应头配置，两个目标：

- **性能**：让 JavaScript、字体、JSON 等静态资源也参与 gzip 压缩；调大 proxy buffer 避免响应落盘
- **安全**：补齐 [securityheaders.com](https://securityheaders.com) 认可的安全响应头，默认可拿到 A 评级

:::info
本节所有配置均为反代层通用优化，与具体主题无关，适用于任何 Halo 实例。
:::

### 在 NPM 中找到自定义配置入口

1. 进入 NPM 仪表盘，在 Hosts → Proxy Hosts 点开 Halo 的代理记录进行编辑
2. 切换到 **Advanced** 标签页
3. 把下面的内容粘贴到 **Custom Nginx Configuration** 文本框
4. 保存后 NPM 会自动 reload nginx，无需重建容器

### 推荐的自定义配置

```nginx
# ---- gzip 压缩：补齐 NPM 默认未覆盖的 JS、字体、JSON 等 MIME 类型 ----
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_min_length 1024;
gzip_types
  text/css
  text/javascript
  application/javascript
  application/x-javascript
  application/json
  application/xml
  application/rss+xml
  application/atom+xml
  image/svg+xml
  font/ttf
  font/otf
  font/woff
  font/woff2;
# 若目录下存在 .gz 预压缩文件则优先使用
gzip_static on;

# ---- proxy buffer：避免较大响应被临时写入磁盘 ----
proxy_buffers 16 32k;
proxy_buffer_size 64k;
proxy_busy_buffers_size 128k;

# ---- 安全响应头：加 always 确保错误页也会返回 ----
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
# HSTS 请在确认 HTTPS 稳定运行后再启用，见下文说明
# add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

# ---- RSS 路径别名：Halo 默认 RSS 为 /rss.xml ----
rewrite ^/rss$ /rss.xml permanent;
rewrite ^/feed$ /rss.xml permanent;
```

:::tip
`gzip_types` 不要再列 `text/html`，nginx 默认已经对其启用 gzip，重复声明会产生 `duplicate MIME type` 警告。
:::

### 关于 HSTS

`Strict-Transport-Security` 会告诉浏览器未来只能通过 HTTPS 访问当前域名。一旦启用且 `max-age` 较长，浏览器会缓存该策略直到过期，期间无法回退到 HTTP。因此建议：

- 在 HTTPS 证书可正常续签、基础设施稳定运行 1–2 周后再启用
- 先从 `max-age=300`（5 分钟）起步验证，确认无误再逐步调大到 `63072000`（2 年）
- `preload` 表示提交到浏览器内置 HSTS 列表，**提交后撤销非常困难**，确有必要再加

### 验证配置是否生效

```bash
# 查看安全响应头
curl -I https://your-halo-domain.example.com/ \
  | grep -iE "x-content-type|x-frame|x-xss|referrer-policy|permissions-policy"

# 检查 JavaScript 是否启用了 gzip
curl -IH "Accept-Encoding: gzip" \
  https://your-halo-domain.example.com/themes/<your-theme>/source/main.js \
  | grep -i content-encoding
```

浏览器侧也可以在 DevTools → Network → Response Headers 中确认。

### 常见问题

#### 能拿到 securityheaders.com A+ 吗？

上面的配置能稳定拿到 **A 评级**。追求 **A+** 的硬指标是配置 `Content-Security-Policy`（CSP），在博客场景下收益较低：

- 多数 Halo 主题依赖若干第三方 CDN（字体、评论系统、统计、表情等），每个都需要加入 CSP 白名单
- 主题模板中常见内联脚本，需使用 `'unsafe-inline'`（会明显削弱 CSP 的价值）或改造为 nonce 模式
- 管理后台「代码注入」功能注入的脚本同样受 CSP 约束，白名单收敛难度较高

如确有 A+ 需求，建议按以下路径落地：

1. 先使用 `Content-Security-Policy-Report-Only`，不阻断页面，仅在浏览器控制台打印违规
2. 观察 1–2 周，根据 violation 报告收敛白名单
3. 白名单稳定后再转为生产 `Content-Security-Policy`

作为参考，GitHub 本身的 securityheaders.com 评级也是 A，对博客类站点而言 A 已足够。

#### NPM 界面中的「缓存资源」开关要开启吗？

建议保持关闭。Halo 自身已通过 `ETag`、`Last-Modified` 等机制对静态资源提供合理的缓存策略，NPM 层再叠一层缓存可能导致主题升级或资源替换后不能立即生效。性能提升主要来自本节的 gzip 与 proxy buffer 优化。

#### 为什么要调大 proxy buffer？

NPM 默认的 proxy buffer 较小，当 Halo 返回的响应体超过 buffer 总量时，nginx 会把剩余数据临时写入磁盘后再转发。调大到 `16 32k`（共 512 KB）能覆盖绝大多数 HTML/JSON 响应，避免磁盘 I/O 成为瓶颈。
