---
title: 与 Nginx Proxy Manager 配合使用
description: 使用 Nginx Proxy Manager 管理 Halo 服务的反向代理
---

## 与 Nginx Proxy Manager 配合使用

### Halo 部署

参见 [使用 Docker Compose 部署](https://docs.halo.run/getting-started/install/docker-compose)

> 信息：
>
> `「反向代理」` 部分不用进行操作，保证 Halo 服务运行无误即可。（即可以用`http://ip:端口号` 的形式访问博客。）


### 简介

顾名思义，Nginx Proxy Manager就是一个Nginx的代理管理器，它最大的特点是简单方便。

即使是没有Nginx基础的小伙伴，也能轻松地用它来完成反向代理的操作，而且因为自带面板，操作极其简单，非常适合配合docker搭建的应用使用。

Nginx Proxy Manager后台还可以一键申请SSL证书，并且会自动续期，方便省心。

下面我们就来介绍如何用Nginx Proxy Manger来配合Halo，实现反向代理和https访问。



### 安装Nginx Proxy Manager

> 说明：默认你的服务器已经安装了Docker和Docker-compose，如果你没有安装，可以参考：[使用 Docker Compose 部署](https://docs.halo.run/getting-started/install/docker-compose)的环境搭建部分来进行安装。



点击下方链接进入 Nginx Proxy Manager（以下简称NPM） 官网：https://nginxproxymanager.com/

我们可以直接选择[快速安装](https://nginxproxymanager.com/guide/#quick-setup)。

首先，我们创建一个文件夹来存放NPM的`docker-compose.yml`文件：

```bash
mkdir -p ~/data/docker_data/nginxproxymanager   # 创建一个npm的文件夹

cd ~/data/docker_data/nginxproxymanager    # 进入该文件夹

vi docker-compose.yml
```

在英文状态的输入法下，按下`i`，左下角出现`--INSERT--`后，粘贴填入下面的内容：

```yaml
version: '3'
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'              #不建议修改端口
      - '81:81'              # 可以把冒号左边的81端口修改成你服务器上没有被占用的端口
      - '443:443'            #不建议修改端口
    volumes:
      - ./data:/data         # 点号表示当前文件夹，冒号左边的意思是在当前文件夹下创建一个data目录，用于存放数据，如果不存在的话，会自动创建
      - ./letsencrypt:/etc/letsencrypt  # 点号表示当前文件夹，冒号左边的意思是在当前文件夹下创建一个letsencrypt目录，用于存放证书，如果不存在的话，会自动创建
```



> 注意：安装了NPM之后，就不需要再安装Nginx了，否则会端口冲突（不建议修改NPM的80、443端口）。如果你的服务器安装了宝塔面板，也可以和NPM一起使用，只要你到软件后台把宝塔安装的Nginx关闭或者卸载即可。



之后，同样在英文输入法下，按一下`esc`，然后`:wq` 保存退出。



启动NPM：

```bash
docker-compose up -d     # -d 表示后台运行

docker compose up -d     # 如果你用的是 docker-compose-plugin的话，用这条命令
```



不出意外，此时你使用[http://127.0.0.1:81](http://127.0.0.1:81/) 就可以访问NPM的网页端了。（注意把`127.0.0.1`替换成你实际服务器的IP）

> 注意：
>
> 1、不知道服务器IP，可以直接在命令行输入：curl ip.sb，会显示当前服务器的IP。
>
> 2、遇到访问不了的情况，请再次检查在宝塔面板的防火墙和服务商的后台防火墙是否打开对应了端口。



默认登陆的用户名：`admin@example.com` 密码：`changeme`

第一次登陆会提示更改用户名和密码，建议修改一个复杂一点的密码。

至此，我们已经完成了Nginx Proxy Manager的搭建，之后就可以用它给我们的Halo或者其他web应用做反向代理了。



### 配置Halo的反向代理



首先我们登陆网页端之后，会弹出修改用户名和密码的对话框，我们根据自己的实际来修改自己的用户名和邮箱。

![iShot_2022-12-12_16.44.51](https://img.laoda.de/i/2022/12/12/r7qwgr-2.webp)

保存之后，会让我们修改密码（建议用一个复杂的密码）。

![image-20221212164639702](https://img.laoda.de/i/2022/12/12/r88bvl-2.webp)



接着我们就可以来给Halo来添加一个反向代理了。

点击`Proxy Hosts`，



![image-20221212165447656](https://img.laoda.de/i/2022/12/12/rd1a5e-2.webp)



接着点击`Add Proxy Host`，弹出如下对话框：



![image-20221212165912118](https://img.laoda.de/i/2022/12/12/rftexf-2.webp)

看起来都是英文，很复杂，但是其实很简单，我们只要用到其中的几个功能即可，这边稍微解释一下：

- `Domain Names` ：填我们Halo网站的域名，首先记得做好DNS解析，把域名绑定到我们的服务器的IP上
- `Scheme` ：默认`http`即可，除非你有自签名证书
- `Forward Hostname/IP` ：填入服务器的IP，或者Docker容器内部的IP（如果NPM和Halo搭建在同一台服务器上的话）
- `Forward Port`：填入Halo映射出的端口，这边默认是`8090`
- `Cache Assets` ：缓存，可以选择打开
- `Block Common Exploits`： 阻止常见的漏洞，可以选择打开
- `Websockets Support` ：WS支持，可以选择打开
- `Access List`： 这个是NPM自带的一个限制访问功能，这边我们不管，后续可以自行研究。



以下是一个样列：

![image-20221212165113531](https://img.laoda.de/i/2022/12/12/rb22bk-2.webp)

因为样例的NPM和Halo搭建在同一台VPS上，所以这边的IP，图中填的是`172.17.0.1`，为Docker容器内部的IP地址，

可以通过下面的命令查询：

```bash
ip addr show docker0
```



![image-20221212171134006](https://img.laoda.de/i/2022/12/12/sawc56-2.webp)



这边的IP是`172.17.0.1`，填入这个IP，可以不用打开防火墙的`8090`端口。



当然，如果你的NPM和Halo不在同一台服务上，你需要在IP部分填入**你的Halo所在的服务器的IP**，并在服务商（部分服务商如腾讯、阿里）的后台打开`8090`端口。



### 一键申请SSL证书



接着我们来申请一张SSL证书，让我们的网站支持`https`访问。

![image-20221212165406296](https://img.laoda.de/i/2022/12/12/rcskzu-2.webp)



![image-20221212171814387](https://img.laoda.de/i/2022/12/12/sey05n-2.webp)

如图所示，记得打开强制SSL，其他四个的功能请自行研究，这边不多做讨论。

> 注意（防止出现`Internal Server Error`问题）：
>
> 1、申请证书需要你提前将域名解析到NPM所在的服务器的IP上；
>
> 2、如果你使用的是国内的服务器，默认`80`和`443`端口是关闭的，你需要备案之后才能使用
>
> 2 、如果你使用了CloudFlare的DNS服务，记得把小黄云关闭（即不开启CDN）。



不出意外，你将成功申请到SSL证书，证书会三个月自动续期。

再次点开配置，查看一下，将强制SSL打开。

![image-20221212165346472](https://img.laoda.de/i/2022/12/12/rcfn9x-2.webp)



至此，你已经成功完成了Halo的反向代理，快尝试使用域名访问一下看看吧！


> 同样的，举一反三，试试把你的NPM也用一个域名来反向代理一下吧。(小提示：你需要再解析一个域名（可以是二级域名）到NPM所在的服务器上，反代页面需要填的IP可以填docker容器内的IP也可以填服务器的IP，端口填`81`即可）
