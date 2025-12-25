---
title: 与 Nginx Proxy Manager 配合使用
description: 使用 Nginx Proxy Manager 管理 Halo 服务的反向代理
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
        image: registry.fit2cloud.com/halo/halo:2.22
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
