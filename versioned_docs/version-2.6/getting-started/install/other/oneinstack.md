---
title: 与 OneinStack 配合使用
description: 使用 OneinStack 管理 Halo 服务的反向代理
---

## Halo 部署

参见 [使用 Docker Compose 部署](../docker-compose.md)

:::info
`「反向代理」` 部分不进行操作，保证 Halo 服务运行无误即可。
:::

## 通过 OneinStack 安装 Nginx

点击下方链接进入 OneinStack 官网，仅选择 `安装 Nginx`，其他的都可以取消选择。

<https://oneinstack.com/auto>

最后点击 `复制安装命令` 到服务器执行即可。如果你仅安装 Nginx，你的链接应该是这样：

```bash
wget -c http://mirrors.linuxeye.com/oneinstack-full.tar.gz && tar xzf oneinstack-full.tar.gz && ./oneinstack/install.sh --nginx_option 1
```

:::info
这一步会经过编译安装，可能会导致安装时间很漫长，这主要取决于你服务器的性能。
:::

出现下面的信息即代表安装成功：

```bash
Nginx installed successfully!
Created symlink from /etc/systemd/system/multi-user.target.wants/nginx.service to /usr/lib/systemd/system/nginx.service.
Redirecting to /bin/systemctl start nginx.service
####################Congratulations########################
Total OneinStack Install Time: 5 minutes

Nginx install dir:              /usr/local/nginx
```

## 创建 vhost

> 即创建一个站点，你可以通过这样的方式在你的服务器创建无限个站点。接下来的目的就是创建一个站点，并反向代理到 Halo。这一步在此教程使用 `demo.halo.run` 这个域名做演示，实际情况请修改此域名。

1. 进入到 oneinstack 目录，执行 vhost 创建命令

  ```bash
  cd oneinstack
  ```

  ```bash
  sh vhost.sh
  ```

2. 按照提示选择或输入相关信息

  ```bash
  What Are You Doing?
      1. Use HTTP Only
      2. Use your own SSL Certificate and Key
      3. Use Let's Encrypt to Create SSL Certificate and Key
      q. Exit
  Please input the correct option:
  ```

  这一步是选择证书配置方式，如果你有自己的证书，输入 <kbd>2</kbd> 即可。如果需要使用 `Let's Encrypt` 申请证书，选择 <kbd>3</kbd> 即可。

  ```bash
  Please input domain(example: www.example.com):
  ```

  输入自己的域名即可，前提是已经提前解析好了域名。

  ```bash
  Please input the directory for the domain:demo.halo.run :
  (Default directory: /data/wwwroot/demo.halo.run):
  ```

  提示输入站点根目录，因为我们是使用 Nginx 的反向代理，所以这个目录是没有必要配置的，我们直接使用默认的即可（直接回车）。

  ```bash
  Do you want to add more domain name? [y/n]:
  ```

  是否需要添加其他域名，按照需要选择即可，如果不需要，输入 <kbd>n</kbd> 并回车确认。

  ```bash
  Do you want to add hotlink protection? [y/n]:
  ```

  是否需要做防盗链处理，按照需要选择即可。

  ```bash
  Allow Rewrite rule? [y/n]:
  ```

  路径重写配置，我们不需要，选择 <kbd>n</kbd> 回车确定即可。

  ```bash
  Allow Nginx/Tengine/OpenResty access_log? [y/n]:
  ```

  Nginx 的请求日志，建议选择 <kbd>y</kbd>。

  这样就完成了 vhost 站点的创建，最终会输出站点的相关信息：

  ```bash
  Your domain:                  demo.halo.run
  Virtualhost conf:             /usr/local/nginx/conf/vhost/demo.halo.run.conf
  Directory of:                 /data/wwwroot/demo.halo.run
  ```

  Nginx 的配置文件即 `/usr/local/nginx/conf/vhost/demo.halo.run.conf`。

## 修改 Nginx 配置文件

上方创建 vhost 的过程并没有创建反向代理的配置，所以需要我们自己修改一下配置文件。

1. 使用你熟悉的工具打开配置文件，此教程使用 vim。

  ```bash
  vim /usr/local/nginx/conf/vhost/demo.halo.run.conf
  ```

2. 删除一些不必要的配置

  ```nginx
  location ~ [^/]\.php(/|$) {
    #fastcgi_pass remote_php_ip:9000;
    fastcgi_pass unix:/dev/shm/php-cgi.sock;
    fastcgi_index index.php;
    include fastcgi.conf;
  }
  ```

  此段配置是针对 php 应用的，所以可以删掉。

3. 添加 `upstream` 配置

  在 `server` 的同级节点添加如下配置：

  ```nginx {2}
  upstream halo {
    server 127.0.0.1:8090;
  }
  ```

4. 在 `server` 节点添加如下配置

  ```nginx {6}
  location / {
    proxy_set_header HOST $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://halo;
  }
  ```

5. 修改 `location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|flv|mp4|ico)$` 节点

  ```nginx {2}
  location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|flv|mp4|ico)$ {
    proxy_pass http://halo;
    expires 30d;
    access_log off;
  }
  ```

6. 修改 `location ~ .*\.(js|css)?$` 节点

  ```nginx {2}
  location ~ .*\.(js|css)?$ {
    proxy_pass http://halo;
    expires 7d;
    access_log off;
  }
  ```

  如果不按照第 5，6 步操作，请求一些图片或者样式文件不会经过 Halo，所以请不要忽略此配置。

7. 添加 acme.sh 续签验证路由

  OneinStack 使用的 acme.sh 管理证书，如果你在创建 vhost 的时候选择了使用 `Let's Encrypt` 申请证书，那么 OneinStack 会在系统内添加一个定时任务去自动续签证书，acme.sh 默认验证站点所有权的方式为在站点根目录生成一个文件（.well-known）来做验证，由于配置了反向代理，所以在验证的时候是无法直接访问到站点目录下的 .well-known 文件夹下的验证文件的。需要添加如下配置：

  ```nginx {4}
  location ^~ /.well-known/acme-challenge/ {
    default_type "text/plain";
    allow all;
    root /data/wwwroot/demo.halo.run/;
  }
  ```

  至此，配置修改完毕，保存即可。最终你的配置文件可能如下面配置一样：

  ```nginx {2,20,29,34,41-47,51}
  upstream halo {
    server 127.0.0.1:8090;
  }
  server {
    listen 80;
    listen [::]:80;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    ssl_certificate /usr/local/nginx/conf/ssl/demo.halo.run.crt;
    ssl_certificate_key /usr/local/nginx/conf/ssl/demo.halo.run.key;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers TLS13-AES-256-GCM-SHA384:TLS13-CHACHA20-POLY1305-SHA256:TLS13-AES-128-GCM-SHA256:TLS13-AES-128-CCM-8-SHA256:TLS13-AES-128-CCM-SHA256:EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_timeout 10m;
    ssl_session_cache builtin:1000 shared:SSL:10m;
    ssl_buffer_size 1400;
    add_header Strict-Transport-Security max-age=15768000;
    ssl_stapling on;
    ssl_stapling_verify on;
    server_name demo.halo.run;
    access_log /data/wwwlogs/demo.halo.run_nginx.log combined;
    index index.html index.htm index.php;
    root /data/wwwroot/demo.halo.run;
    if ($ssl_protocol = "") { return 301 https://$host$request_uri; }
    include /usr/local/nginx/conf/rewrite/none.conf;
    #error_page 404 /404.html;
    #error_page 502 /502.html;
    location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|flv|mp4|ico)$ {
      proxy_pass http://halo;
      expires 30d;
      access_log off;
    }
    location ~ .*\.(js|css)?$ {
      proxy_pass http://halo;
      expires 7d;
      access_log off;
    }
    location ~ /(\.user\.ini|\.ht|\.git|\.svn|\.project|LICENSE|README\.md) {
      deny all;
    }
    location / {
      proxy_set_header HOST $host;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_pass http://halo;
    }
    location ^~ /.well-known/acme-challenge/ {
      default_type "text/plain";
      allow all;
      root /data/wwwroot/demo.halo.run/;
    }
  }
  ```

## 重载 Nginx 使配置生效

验证 nginx 配置

```bash
nginx -t
```

如果输出如下提示则代表配置有效：

```bash
nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful
```

重载 Nginx 配置：

```bash
nginx -s reload
```

至此，整个教程完毕，现在你可以访问域名检查是否已经配置成功。
