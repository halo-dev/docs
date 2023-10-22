---
title: 与宝塔面板配合使用
description: 与宝塔面板配合使用的指南
---

## 声明

1. 本组织与宝塔面板官方无任何合作和利益关系。
2. 您在使用期间如果有宝塔面板所带来的问题，均与我们无关。
3. 开始之前，我们默认认为您已经安装好了宝塔面板，以及熟悉宝塔面板的使用。
4. 建议使用宝塔面板最新版本，截止到撰写指南的时刻，宝塔面板的版本为 `7.4.7`。

## Halo 部署

参见 [在 Linux 环境部署](../linux.md)

:::info
`「作为服务运行」` 部分可以不进行操作，只需测试启动无误即可，后面将使用宝塔面板软件包中的 `Supervisor` 托管 Halo 进程。
:::

## 宝塔面板所需软件包下载

需要在宝塔面板的软件商店安装的软件包有：

1. Nginx
2. Supervisor

## 使用 Supervisor 托管 Halo 进程

打开 Supervisor 管理器的设置，点击 `添加守护进程` 按钮。

需要填写的表单信息如下：

- **名称**：随意
- **启动用户**：如果您按照 [在 Linux 环境部署](../linux.md) 创建了用于运行 Halo 的用户，则选择您创建的用户即可。否则选择默认的 root。
- **运行目录**：运行包的存放目录，按照实际情况填写，需要保证你所选的目录包含运行包。
- **启动命令**：`java -server -Xms256m -Xmx256m -jar halo.jar`

填写完成之后点击 `确定` 按钮即可。

## 添加站点并配置 Nginx

1. 点击左侧的 `网站` 菜单项，点击 `添加站点` 按钮。

需要填写的表单信息如下：

- **域名**：填写您已经解析到当前服务器公网 IP 的域名。
- **PHP版本**：纯静态

填写完成之后点击 `提交` 按钮即可。

2. 设置 SSL

:::info
在配置反向代理之前，我们推荐先设置好 SSL 证书。
:::

- 可选择 `宝塔 SSL` 或者 `Let's Encrypt` 进行证书申请。
- 需要开启右上角的 `强制 HTTPS`。

3. 修改配置文件

在根节点添加：

```nginx
upstream halo {
    server 127.0.0.1:8090;
}
```

> 其中的 8090 为 Halo 的运行端口，请按需修改。

在 server 节点添加：

```nginx
location / {
    proxy_pass http://halo;
    proxy_set_header HOST $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

修改 server 节点中的 `location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$` 节点：

```nginx
location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
{
    proxy_pass http://halo;
    expires      30d;
    error_log /dev/null;
    access_log off;
}
```

修改 server 节点中的 `location ~ .*\.(js|css)?$` 节点：

```nginx
location ~ .*\.(js|css)?$
{
    proxy_pass http://halo;
    expires      12h;
    error_log /dev/null;
    access_log off; 
}
```

完整配置文件示例（仅包含关键部分）：

```nginx
upstream halo {
    server 127.0.0.1:8090;
}
server
{
    ...
    
    location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
    {
        proxy_pass http://halo;
        expires      30d;
        error_log /dev/null;
        access_log off;
    }
    
    location ~ .*\.(js|css)?$
    {
        proxy_pass http://halo;
        expires      12h;
        error_log /dev/null;
        access_log off; 
    }
    
    location / {
        proxy_pass http://halo;
        proxy_set_header HOST $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    ...
}
```

随后点击保存即可。如果配置不生效，请重载 Nginx 或者 重启 Nginx。

最后，访问域名即可进行 Halo 的初始化。
