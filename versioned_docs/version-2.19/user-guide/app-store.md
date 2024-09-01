---
title: 应用市场
description: 内置应用市场的使用说明
---

为了方便使用者安装应用市场的主题和插件，我们提供了一个内置到 Console 的应用市场插件，可以更加方便在 Console 直接安装主题和插件。并且此插件从 Halo 2.10 开始已经预设到 Halo 中，无需手动安装。

如果你使用了旧版本的 Halo，并且当前未安装应用市场插件，可以访问 [https://www.halo.run/store/apps/app-VYJbF](https://www.halo.run/store/apps/app-VYJbF) 手动下载并在 Console 的插件管理中安装。

:::info 提示
这是目前唯一由 Halo 官方提供的服务，如果你当前的 Halo 网站处于无法访问外网的环境或者不需要此功能，你可以卸载或者停用此插件，不会影响网站的正常使用。
:::

## 应用市场页面

这是一个为 Console 提供的独立的应用市场页面，此页面基本和 [https://www.halo.run/store/apps](https://www.halo.run/store/apps) 保持一致，但有所不同的是，你可以直接在这里查看所有的主题和插件并安装到你的 Halo 站点中。

![应用市场](/img/user-guide/app-store/app-store-page.png)

## 绑定 Halo 官网账号

![账号绑定](/img/user-guide/app-store/app-store-pat.png)

如果你需要购买 Halo 应用市场中的付费应用，建议先绑定好 Halo 官网的账号，绑定之后即可直接在 Console 中购买和安装付费应用和主题。

绑定方式：

1. 进入应用市场插件的设置页面，切换到 **账号绑定** 选项卡。
2. 根据提示访问 Halo 官网并注册账号，然后在 Halo 官网的[个人中心](https://www.halo.run/uc/profile?tab=pat)生成一个个人令牌并填写到下方的 **个人令牌** 输入框即可。

## 安装/更新插件

此插件还扩展了插件安装的界面，可以在安装插件时直接从应用市场获取。

![安装插件](/img/user-guide/app-store/app-store-plugins.png)

此外，如果插件是从应用市场安装的，后续插件更新之后也可以及时收到更新信息，并一键更新。

![更新插件](/img/user-guide/app-store/app-store-upgrade-plugin.png)

## 安装/更新主题

与插件一样，在主题管理中也可以直接从应用市场中获取，以及接受主题更新提示。

![安装主题](/img/user-guide/app-store/app-store-themes.png)

![更新主题](/img/user-guide/app-store/app-store-upgrade-theme.png)

## 付费应用激活

目前部分付费主题和插件需要许可证激活才能够正常使用，在购买付费应用之后就会自动为你的 Halo 官网账号中生成对应的应用许可证，**所以在此之前需要确保已经在你的网站中绑定好了 Halo 官网账号**。

:::info 注意
当前应用市场的许可证暂不支持离线激活，需要 Halo 所在的服务器能够正常访问 [https://www.halo.run](https://www.halo.run)。
:::

在安装好需要许可证的付费插件或主题后，列表会显示一个许可证状态的图标，点击即可打开许可证激活的对话框，选择许可证并点击激活即可。

![插件激活状态](/img/user-guide/app-store/app-store-license-status.png)

![插件许可证激活](/img/user-guide/app-store/app-store-plugin-license.png)

除此之外，你也可以在 **许可证管理** 页面查看所有应用的许可证，并管理它们的状态。

![许可证列表](/img/user-guide/app-store/app-store-license-manage.png)

其他注意事项：

1. 目前同一个账号的许可证在同一时间只能在一个站点中使用，使用 Halo 配置中的 **外部访问地址（halo.external-url）** 和设备 id 做判定。
2. 取消激活会删除许可证使用记录。
