---
title: 使用 Helm 部署
description: 使用 Helm Chart 在 Kubernetes 集群中部署
---

import DockerArgs from "./slots/docker-args.md"

:::info
在继续操作之前，我们推荐您先阅读[《写在前面》](../prepare.md)，这可以快速帮助你了解 Halo。
:::

## 先决条件

1. 拥有可用的 1.19 或更高版本的 Kubernetes 集群
2. 安装有 Helm 客户端 3.2 或更高的版本
3. 指定 StorageClass 自动创建存储卷时需要底层存储驱动支持
4. 用户对 Kubernetes 及 Helm 相关概念及如何使用有基本了解

## 快速部署

通过以下命令可以使用默认安装参数快速部署 Halo。默认参数下该 Chart 会自动部署 PostgreSQL 数据库给 Halo 使用，同时 Halo 工作目录及 PostgreSQL 数据目录通过指定 StorageClass 的方式自动创建存储卷进行持久化。

```bash
# 添加 Halo 项目的 Helm Charts 仓库
helm repo add halo https://halo-sigs.github.io/charts/
# 从 chart 仓库中更新本地可用chart的信息 
helm repo update
# 使用默认参数，在当前的 Kubernetes namespace 中安装 Halo
helm install halo halo/halo
```

命令执行成功后会返回类似下文中的提示，通过提示中的命令可以获取到 NodePort 方式的 Halo 访问地址及默认的控制台管理员用户名和密码。

```text
NAME: halo
LAST DEPLOYED: Sun Jun 25 15:49:53 2023
NAMESPACE: halo
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
CHART NAME: halo
CHART VERSION: 1.1.0
APP VERSION: 2.6.1

** Please be patient while the chart is being deployed **

Your Halo site can be accessed through the following DNS name from within your cluster:

    halo.halo.svc.cluster.local (port 80)

To access your Halo site from outside the cluster follow the steps below:

1. Get the Halo URL by running these commands:

   export NODE_PORT=$(kubectl get --namespace halo -o jsonpath="{.spec.ports[0].nodePort}" services halo)
   export NODE_IP=$(kubectl get nodes --namespace halo -o jsonpath="{.items[0].status.addresses[0].address}")
   echo "Halo URL: http://$NODE_IP:$NODE_PORT/"
   echo "Halo Console URL: http://$NODE_IP:$NODE_PORT/console"

2. Open a browser and access Halo using the obtained URL.

3. Login with the following credentials below to see your site:

  echo Username: admin
  echo Password: $(kubectl get secret --namespace halo halo -o jsonpath="{.data.halo-password}" | base64 -d)
```

:::info 参数说明

- 使用 Halo Helm Chart 仓库中 [values.yaml](https://github.com/halo-sigs/charts/blob/main/charts/halo/values.yaml) 文件中的默认参数进行安装；
- 关于 PostgreSQL 数据库的更多参数说明，请参考 [Bitnami PostgreSQL Chart](https://github.com/bitnami/charts/tree/main/bitnami/postgresql#parameters)，在原有参数格式上增加 `postgresql.` 前缀即可。
:::

## 卸载

使用命令 `helm uninstall halo` 可卸载已安装的 Halo 应用，其中 `halo` 为安装时指定的 Halo 应用名称。

:::warning
卸载应用前请确认数据库及 Halo 工作空间中的文件已进行备份或不再需要。
:::

## 使用 MySQL 数据库

当用户希望使用 MySQL 数据库而非默认的 PostgreSQL 数据库时，可以参考以下命令进行部署。

```bash
helm install halo halo/halo --set mysql.enabled=true --set postgresql.enabled=false
```

:::info 参数说明

- `mysql.enabled=true`： 自动安装 MySQL 数据库；
- `postgresql.enabled=false`： 不自动安装 PostgreSQL 数据库；
- 关于 mysql 的更多参数说明，请参考 [Bitnami MySQL Chart](https://github.com/bitnami/charts/tree/main/bitnami/mysql#parameters)，在原有参数格式上增加 `mysql.` 前缀即可。
:::

## 使用已有的数据库

当用户希望使用已有的数据库而非自动安装新数据库时，可以参考以下命令进行部署。

```bash
helm install halo halo/halo \
    --set mysql.enabled=false \
    --set postgresql.enabled=false \
    --set externalDatabase.platform=mysql \
    --set externalDatabase.host=mysql \
    --set externalDatabase.port=3306 \
    --set externalDatabase.user=halo \
    --set externalDatabase.password=0P0gJrCyzz \
    --set externalDatabase.database=halo
```

:::info 参数说明

- `mysql.enabled=true`： 不自动安装 MySQL 数据库；
- `postgresql.enabled=false`： 不自动安装 PostgreSQL 数据库；
- `externalDatabase.platform=mysql`：外部数据库类型，例如 `postgresql`、`mysql`；
- `externalDatabase.host=mysql`：外部数据库连接地址；
- `externalDatabase.port=3306`：外部数据库连接端口；
- `externalDatabase.user=halo`：外部数据库用户名；
- `externalDatabase.password=0P0gJrCyzz`：外部数据库密码；
- `externalDatabase.database=halo`：外部数据库库名；
:::

## 创建 Ingress

当用户希望通过 Ingress 将 Halo 应用暴露到 Kubernetes 集群外进行访问时，可以参考以下安装参数。

```bash
helm install halo halo/halo --set ingress.enabled=true --set ingress.hostname=demo.halo.run
```

对于已有的 Halo 应用，可以通过如下命令更新应用参数，为 Halo 应用创建 Ingress。

```bash
helm upgrade halo halo/halo --set ingress.enabled=true --set ingress.hostname=demo.halo.run
```

## 其他参数

完整参数列表请参考 Halo 项目的 [Helm Chart 仓库](https://github.com/halo-sigs/charts#parameters)。
