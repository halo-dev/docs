---
title: 与 Traefik 配合使用
description: 使用 Traefik 管理 Halo 服务的反向代理
---

## Halo 部署

参见 [使用 Docker Compose 部署](../docker-compose.md)

:::info
`「反向代理」` 部分不进行操作，保证 Halo 服务运行无误即可。
:::

## 简介

[Traefik](https://traefik.io/traefik/) 是一款开源的反向代理与负载均衡工具，它监听后端的变化并自动更新服务配置。

它与传统反向代理最大的区别，是支持声明式的动态路由规则，大大简化网关规则的配置。而且还有诸多实用特性，例如：健康检查、多实例负载均衡、能够实现 Let's Encrypt 证书的自动签发、验证与续期等等。

## 创建 Traefik

下面的配置中，创建了 Traefik 实例。并且做了基础的几项配置：

1. 监听了宿主机的 80、443 端口，并自动将 80 端口的请求重定向到 443 端口。[文档](https://doc.traefik.io/traefik/routing/entrypoints/)
2. 开启 Docker 服务发现，监听检测 Docker 容器声明的服务关系。[文档](https://doc.traefik.io/traefik/providers/docker/#provider-configuration)
3. 开启 Traefik Dashboard，建议使用二级域名的形式（示例：`traefik.yourdomain.com`）。[文档](https://doc.traefik.io/traefik/operations/dashboard/#dashboard-router-rule)
4. 开启证书自动生成，通过 ACME 自动管理 TLS 证书的申请、校验与续期。[文档](https://doc.traefik.io/traefik/https/acme/)

:::warning
ACME 证书 (`/acme.json`) 一定要 [持久化](https://doc.traefik.io/traefik/https/acme/#storage)，否则每次重启 Traefik 服务，都会去申请签发证书。可能会触发 Let's
Encrypt 的 [速率限制](https://letsencrypt.org/zh-cn/docs/rate-limits/)，导致签名的域名一段时间内无法签发新的证书。
:::

```yaml {19,31,35,41} showLineNumbers
version: "3.8"

networks:
  traefik:
    name: traefik
    attachable: true

services:
  traefik:
    image: traefik:v2.9
    container_name: traefik
    networks:
      - traefik
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./acme.json:/acme.json
    command: >
      --api.dashboard=true
      --entrypoints.web.address=:80
      --entrypoints.websecure.address=:443
      --entrypoints.web.http.redirections.entrypoint.to=websecure
      --entrypoints.web.http.redirections.entrypoint.scheme=https
      --providers.docker=true
      --providers.docker.endpoint=unix:///var/run/docker.sock
      --providers.docker.watch=true
      --providers.docker.exposedByDefault=false
      --certificatesResolvers.myresolver.acme.httpChallenge.entryPoint=web
      --certificatesresolvers.myresolver.acme.email=your-mail@mail.com
    labels:
      traefik.enable: "true"
      traefik.docker.network: traefik
      traefik.http.routers.dashboard.rule: Host(`traefik.yourdomain.com`)
      traefik.http.routers.dashboard.tls: "true"
      traefik.http.routers.dashboard.tls.certresolver: myresolver
      traefik.http.routers.dashboard.service: "api@internal"
      traefik.http.routers.dashboard.middlewares: auth
      # 账号密码 admin/P@88w0rd 生成 echo $(htpasswd -nb user password) | sed -e s/\\$/\\$\\$/g
      traefik.http.middlewares.auth.basicauth.users: "admin:$$apr1$$q8q0qpzT$$lvzMP7VYd9EUcG/wkIsAN."
```

## 配置 Halo 的反向代理

这里以最简配置（h2 数据库）Halo 服务的 Docker 配置举例。只需做以下调整：

1. 顶层 `networks` 中添加了外部网络 `traefik`
2. `services.halo.networks` 中添加了 `traefik` 网络
3. `services.halo.labels` 中声明了 Traefik 配置
   1. 路由规则为 `yourdomain.com`
   2. 开启 TLS
   3. 指定了服务端口为 8090

```yaml {4-5,16,20,25-31} showLineNumbers
version: "3.8"

networks:
  traefik:
    external: true
  halo:

services:
  halo:
    image: registry.fit2cloud.com/halo/halo:2.17
    container_name: halo
    restart: on-failure:3
    volumes:
      - ./halo2:/root/.halo2
    networks:
      - traefik
      - halo
    command:
      # 外部访问地址，请根据实际需要修改
      - --halo.external-url=https://yourdomain.com
    labels:
      traefik.enable: "true"
      traefik.docker.network: traefik
      traefik.http.routers.halo.rule: Host(`yourdomain.com`)
      traefik.http.routers.halo.tls: "true"
      traefik.http.routers.halo.tls.certresolver: myresolver
      traefik.http.services.halo.loadbalancer.server.port: 8090
```
