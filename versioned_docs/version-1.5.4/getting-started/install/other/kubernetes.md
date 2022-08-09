---
title: 使用 Kubernetes 部署 Halo
description: 使用 Kubernetes 部署 Halo
---

:::info
在继续操作之前，我们推荐您先阅读[《写在前面》](../../prepare)，这可以快速帮助你了解 Halo。
:::

## kubernetes集群信息

```bash
[root@vm-24-13-centos ~]# kubectl get nodes
NAME              STATUS   ROLES                         AGE   VERSION
vm-24-13-centos   Ready    control-plane,master,worker   14d   v1.20.4
```

## 创建halo工作目录

1. 在系统任意位置创建一个文件夹，此文档以 `~/halo-app` 为例。

```bash
mkdir ~/halo-app && cd ~/halo-app
```

:::info
注意：后续操作中，Halo 的所有相关数据都会保存在这个目录，请妥善保存。
:::

## 创建secret配置信息

创建 `generate-secret.sh` 文件，生成secret字段信息

:::info
在 kubernetes 中，推荐使用 secret 存储敏感的配置信息。
:::

```bash
#!/usr/bin/env bash
kubectl create secret generic halo-secret \
  --from-literal=data_source_url='jdbc:mysql://10.0.1.13:33306/halodb?characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true' \
  --from-literal=datasource_password=Dxxxxxxxxxxss= \
  --from-literal=datasource_username=halo \
  -n blogs
```

脚本中字段的信息释义：

- `data_source_url`: 以MySQL作为数据存储，halo使用jdbc驱动连接，其中 `10.0.1.13:33306` 为MySQL服务的IP地址和端口号，`halodb` 为halo所需要的数据库。
- `datasource_username`: halo连接MySQL的`用户名`
- `datasource_password`: halo连接MySQL时 `datasource_username` 的密码
- `-n`: 表示此secret所在命名空间

## 配置MySQL账号信息

1. 在MySQL中创建以上脚本中预先定义好的用户名、密码、以及 halo 运行所需要的数据库 `halodb`，以下以 `mysql:8.0.30` 为例

```mysql
CREATE USER 'halo'@'%' IDENTIFIED BY 'Dxxxxxxxxxxss=';
grant select,update,insert,delete,index on halodb.* to 'halo'@'%';
flush privileges;
```

## 配置持久化存储卷

在 k8s 中运行 halo，会涉及到`主题`、静态资源如`上传本地图片`等需要持久化到数据卷中，为了后期的数据迁移，需要配置持久卷存储这些数据，此处我们使用本地存储。

1. 创建 `halo.pv.yaml` 文件

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: halo-pv-volume
  labels:
    type: local
spec:
  storageClassName: manual
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/data/halo" # 此目录为halo的数据目录
```

2. 创建 `halo.pvc.yaml` 文件

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: halo-pv-claim
  namespace: blogs
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## 准备halo的部署文件

创建 `halo.deployment.yaml` 文件，定义 halo 服务运行状态

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: halo-server
  namespace: blogs
  labels:
    app: halo-server
spec:
  revisionHistoryLimit: 5 # deployment历史保留数量
  strategy:
    rollingUpdate: # 滚动升级策略
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
  replicas: 1
  template:
    metadata:
      name: halo-server
      labels:
        app: halo-server
    spec:
      containers:
        - name: halo-server
          image: halohub/halo:1.5.4 # 直接修改此处。更新版本即可
          imagePullPolicy: IfNotPresent
          resources:
            limits: # 定义halo服务资源使用
              cpu: 2
              memory: 1Gi
            requests:
              cpu: 1
              memory: 500Mi
          ports:
            - containerPort: 8090 # 服务端口
              name: http
          env: # halo的配置均以环境变量的方式配置
            - name: SERVER_PORT
              value: "8090"
            - name: SPRING_DATASOURCE_DRIVER_CLASS_NAME
              value: com.mysql.cj.jdbc.Driver
            - name: SPRING_DATASOURCE_URL
              valueFrom:
                secretKeyRef:
                  key: data_source_url # 从secert中读取数据源信息
                  name: halo-secret
                  optional: false
            - name: SPRING_DATASOURCE_USERNAME # 从secert中读取halo数据用户
              valueFrom:
                secretKeyRef:
                  key: datasource_username
                  name: halo-secret
                  optional: false
            - name: SPRING_DATASOURCE_PASSWORD # 从secert中读取halo数据用户的密码
              valueFrom:
                secretKeyRef:
                  key: datasource_password
                  name: halo-secret
                  optional: false
            - name: HALO_ADMIN_PATH
              value: admin
            - name: HALO_CACHE
              value: memory
          volumeMounts:
            - mountPath: /root/.halo # 配置halo的数据目录
              name: halo-data
            - mountPath: /etc/localtime # 配置时间
              name: timezone
              readOnly: true
      restartPolicy: Always
      volumes:
        - name: halo-data
          persistentVolumeClaim:
            claimName: halo-pv-claim
        - name: timezone
          hostPath:
            path: /usr/share/zoneinfo/Asia/Shanghai
  selector:
    matchLabels:
      app: halo-server
```

## 配置 halo 的服务

创建 `halo.svc.yaml` 文件，声明 halo 的暴露方式

```yaml
apiVersion: v1
kind: Service
metadata:
  name: halo
  namespace: blogs
spec:
  selector:
    app: halo-server
  ports:
    - port: 8090
      name: halo-port
      targetPort: http
  type: ClusterIP
```

## 配置证书

配置证书，提供 https 访问 halo 服务

```bash
~# ls -al
drwxr-xr-x@  6 marionxue  staff   192 Jul 30 22:33 .
drwxr-xr-x  13 marionxue  staff   416 Aug  9 21:00 ..
-rw-r--r--@  1 marionxue  staff  1016 Jul 30 22:33 devopsman.cn.csr
-rw-r--r--@  1 marionxue  staff  1678 Jul 30 22:33 devopsman.cn.key
-rw-r--r--@  1 marionxue  staff  4105 Jul 30 22:33 devopsman.cn_bundle.crt
-rw-r--r--@  1 marionxue  staff  4105 Jul 30 22:33 devopsman.cn_bundle.pem
~# kubectl create secret tls devopsman-cn-ssl  --cert=./devopsman.cn.ssl/devopsman.cn_bundle.crt --key=./devopsman.cn.ssl/devopsman.cn.key --namespace blogs
```

## 配置ingress,提供外部访问方式

创建 `halo.ingress.yaml` 文件

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: halo-ingress
  labels:
    exposed_by: ingress
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: "20M"
spec:
  ingressClassName: nginx
  rules:
    - host: devopsman.cn
      http:
        paths:
          - pathType: Prefix
            path: "/"
            backend:
              service:
                name: halo
                port:
                  number: 8090
  tls:
    - hosts:
        - devopsman.cn
      secretName: devopsman-cn-ssl
```

完成以上资源定义之后，即可应用。

```bash
kubectl apply -f .
```

![halo-kubernetes](/img/halo-kubernetes.jpg)

## 最后验证halo服务

![halo-test](/img/halo-test.jpg)