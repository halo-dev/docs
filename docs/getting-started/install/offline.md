---
title: 使用离线包部署
description: 使用离线包在离线环境部署
---

import DockerArgs from "./slots/_docker-args.md"
import DockerRegistryList from "./slots/_docker-registry-list.md"

:::info
在继续操作之前，我们推荐您先阅读[《写在前面》](../prepare.md)，这可以快速帮助你了解 Halo。
:::

Halo 离线安装包使用 Docker + Docker Compose 的方式部署 Halo 及其他服务，安装包中内置了 Docker 程序和容器镜像文件，可以帮助用户在无法访问互联网的服务器上，完成 Halo 的安装部署。

## 下载安装包

请自行前往[飞致云开源社区](https://community.fit2cloud.com/#/products/halo/downloads)下载 Halo 最新版本的安装包，并复制到目标机器的 /tmp 目录下。

## 安装部署

### 解压安装包

以 root 用户 ssh 登录到目标机器, 并执行如下命令：

```bash
cd /tmp
# 解压安装包（halo-offline-installer-v2.17.0-amd64.tar.gz 为示例安装包名称，操作时可根据实际安装包名称替换）
tar zxvf halo-offline-installer-v2.17.0-amd64.tar.gz
```

:::info
安装包目录说明

```text
[root@localhost halo-offline-installer-v2.17.0-amd64]# tree
.
├── docker                      # 离线安装 Docker 使用到的文件
│   ├── bin
│   │   ├── containerd
│   │   ├── containerd-shim-runc-v2
│   │   ├── ctr
│   │   ├── docker
│   │   ├── docker-compose
│   │   ├── dockerd
│   │   ├── docker-init
│   │   ├── docker-proxy
│   │   └── runc
│   └── service
│       └── docker.service
├── docker-compose.yaml         # 包含 Halo 及数据库服务的 Docker Compose 文件
├── .env                        # Docker Compose 文件使用的变量声明文件，部分参数从该文件中读取
├── images                      # Halo 及数据库的容器镜像文件
│   ├── halo.tar.gz
│   ├── mysql.tar.gz
│   └── postgres.tar.gz
├── install.sh                  # 安装脚本
├── LICENSE
└── README.md
```

:::

### 执行安装脚本

```bash
# 进入安装包目录（halo-offline-installer-v2.17.0-amd64 为示例安装包目录名称，操作时可根据实际安装包名称替换）
cd halo-offline-installer-v2.17.0-amd64

# 运行安装脚本
/bin/bash install.sh
```

根据脚本给出的提示，输入安装目录、服务端口、数据库信息等相关配置信息，等待脚本执行完成。

:::info
假设采用默认安装位置 /opt/halo 完成安装，安装目录的文件结构如下：

```text
[root@meter-prototype halo]# tree
.
├── data                            # 数据存储目录
│   ├── db                          # 数据库数据存储目录，挂载至数据库容器
│   └── halo                        # Halo 数据存储目录，挂载至 Halo 容器
│       ├── indices
│       ├── keys
│       ├── logs
│       ├── plugins
│       └── themes
├── docker-compose.yaml             # Docker Compose 文件
├── .env                            # Docker Compose 文件使用的变量声明文件，部分参数从该文件中读取
├── install.log                     # 安装脚本日志文件
├── LICENSE
└── README.md
```

安装完成后，可以直接进入 /opt/halo 目录，使用 docker-compose 命令完成后续维护操作，也可以修改 docker-compose.yaml 中的相关配置满足不同需求。

运行参数详解：

<DockerArgs />

:::

### 登录访问

用浏览器访问 /console 即可进入 Halo 管理页面，首次启动会进入初始化页面。
