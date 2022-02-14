---
title: 在 Windows 服务器上部署
---

:::info
在继续操作之前，我们推荐您先阅读[《写在前面》](/getting-started/prepare)，这可以快速帮助你了解 Halo。
:::

## 系统要求

目前运行 Halo 的最低依赖要求为 JRE 11，而 Java9 之后将不再提供 32 位系统的环境，因此请确保您的服务器属于 64 位 CPU。

## 依赖检查

如下将介绍在 Windows 下安装 OpenJRE 11 的方式。如果您的服务器已经安装过 OpenJRE 11，则可以直接跳过本节。

1. 使用浏览器前往 <https://developers.redhat.com/content-gateway/file/java-11-openjdk-jre-11.0.10.9-1.windows.redhat.x86_64.msi> 下载 OpenJRE 11 的可执行程序。

2. 下载时会提示登录“红帽”，任意注册账号登录即可。登录完成之后会自动下载 JRE。

3. 双击 MSI 安装程序，安装 JRE 至服务器，注意到安装程序第三步时，勾选 `JAVA_HOME Variable`，其余直接 `next` 即可

![img2.png](/img/img2.png)

4. 安装完成之后， 使用 <kbd>Win</kbd>+<kbd>R</kbd> 打开运行窗口并输入 `CMD` 后，回车打开 CMD 窗口。之后键入 `java -version`。显示如下所示内容即代表安装成功。

```bash
openjdk version "11.0.10" 2021-01-19 LTS
OpenJDK Runtime Environment 18.9 (build 11.0.10+9-LTS)
OpenJDK 64-Bit Server VM 18.9 (build 11.0.10+9-LTS, mixed mode)
```

![1615618595.jpg](/img/1615618595.jpg)

## 安装 Halo

1. 下载运行包

使用浏览器前往 <https://dl.halo.run/release/halo-1.4.6.jar> 下载最新版本 Halo 运行包，**并保存至桌面**。修改 Jar 包名称为 `halo.jar`

:::info
如果下载速度不理想，可以[在这里](/getting-started/downloads)选择其他下载地址。
:::

2. 下载示例配置文件

使用浏览器前往 <https://dl.halo.run/config/application-template.yaml> 下载示例配置文件，**并保存至桌面**。修改示例配置文件名字为 `application.yaml`。

:::tip
IE 浏览器下，配置文件可能会以文本的形式直接打开，因此推荐使用其他浏览器或下载器下载。
:::

3. 使用记事本编辑配置文件，配置数据库或者端口等，如需配置请参考[参考配置](/getting-started/config)

4. 测试运行 Halo

使用 <kbd>Win</kbd>+<kbd>R</kbd> 打开运行窗口并输入 `CMD` 后，回车打开 CMD 窗口，并键入如下命令。

```bash
cd Desktop && java -jar halo.jar
```

5. 如看到类似以下日志输出，则代表启动成功。

```bash
run.halo.app.listener.StartedListener    : Halo started at         http://127.0.0.1:8090
run.halo.app.listener.StartedListener    : Halo admin started at   http://127.0.0.1:8090/admin
run.halo.app.listener.StartedListener    : Halo has started successfully!
```

浏览器打开 `http://ip:端口号` 即可看到安装引导界面。

:::info
如测试启动正常，请继续看`作为服务运行`部分，第 4 ~ 5 步仅仅作为测试。当你关闭 CMD 窗口之后，服务会停止。你可使用 <kbd>CTRL</kbd>+<kbd>C</kbd> 停止运行测试进程。
:::

:::tip
如果需要配置域名访问，建议先配置好反向代理以及域名解析再进行初始化。如果通过 `http://ip:端口号` 的形式无法访问，请到服务器厂商后台将运行的端口号添加到安全组，如果服务器使用了 Linux 面板，请检查此 Linux 面板是否有还有安全组配置，需要同样将端口号添加到安全组。
:::
