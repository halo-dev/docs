---
title: 主题
description: 主题管理相关功能说明
---

主题包含了各种站点页面模板的资源包。用户访问 Halo 站点浏览到的内容及样式，由 Halo 管理端所配置使用的主题所决定。
:::info
当前 Halo 支持的主题可在[Awesome Halo](https://github.com/halo-sigs/awesome-halo)仓库查看。
:::

## 安装主题

点击主题页面右上方的 `切换主题` 按钮即可弹出主题管理对话框。

目前 Halo 提供了两种主题安装方式：

1. 通过控制台上传安装
2. 将主题文件夹拷贝到服务器上的 `{Halo 工作目录}/themes/` 目录下等待 Halo 自动扫描

针对第一种安装方式，你可以点击主题管理对话框下方的 `安装主题` 按钮，在弹出的文件上传对话框中上传主题压缩包。

![安装主题](/img/user-guide/themes/theme-install.png)

主题安装成功后，便会出现在已安装主题列表中。

针对第二种方式，你需要手动将解压后的主题文件夹拷贝到服务器上的指定目录下，如果主题校验通过，你便可以在主题列表的 `未安装` 标签页中看到该主题。

之后点击主题所在行后方的 `安装` 按钮，即可完成该主题的安装。

![后台安装主题](/img/user-guide/themes/theme-install-alt.png)

## 切换主题

同样点击主题页面右上方的 `切换主题` 按钮弹出主题管理对话框。

在弹框中点击选中要切换的目标主题，此时页面返回到主题详情页，点击右上角的 `启用` 按钮即可将当前主题切换为实际使用的主题。
:::info
仅切换主题不点击右上角的 `启用` 按钮时，不会影响当前实际使用的主题。
:::

## 修改主题设置

主题页面默认显示出了当前主题的详细信息，在详细信息标签页后方的标签页，即为主题提供的相关设置。不同的主题提供的设置项各不相同，设置项的详细说明请参考对应主题的文档。

![主题设置](/img/user-guide/themes/theme-setting.png)

以 Halo 的默认主题 Earth 为例，该主题提供了布局、样式、侧边栏、页脚及备案设置共五组配置项。

## 预览主题

通过预览功能，你可以在不更改当前启用主题的情况下查看不同主题的效果。点击主题详情页面右上角的 `预览` 按钮预览当前主题，或者进入已安装主题列表，通过后方 `···` 的更多操作中的预览选项预览指定的主题。

![主题设置](/img/user-guide/themes/theme-preview.png)

在主题预览页面你可以切换不同分辨率的设备，模拟主题在不同终端下的显示效果。也可以通过右上角的功能菜单切换预览的主题，或者调整当前主题的设置，查看不同设置下主题所展现的区别。

## 更新主题

点击主题详情页右上角的 `···` 更多操作按钮，选择其中的 `更新` 选项即可上传新的主题包对当前主题进行更新。

## 重载主题配置

如果当前主题提供的设置象发生变化，可以通过 `···` 更多中的 `重载主题配置` 选项对主体配置项进行更新。

## 卸载主题

进入已安装主题列表，通过后方 `···` 的更多操作中的卸载选项即可卸载指定的主题。
![卸载主题](/img/user-guide/themes/theme-uninstall.png)
