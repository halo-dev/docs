---
title: 插件安装界面选项卡
description: 扩展插件安装界面选项卡 - plugin:installation:tabs:create
---

目前 Halo 原生支持本地上传和远程下载的方式安装插件，此扩展点用于扩展插件安装界面的选项卡，以支持更多的安装方式。

![插件安装界面选项卡](/img/developer-guide/plugin/api-reference/ui/extension-points/plugin-installation-tabs-create.png)

## 类型定义

```ts
{
  "plugin:installation:tabs:create"?: () => PluginInstallationTab[] | Promise<PluginInstallationTab[]>;
}
```

```ts title="PluginInstallationTab"
export interface PluginInstallationTab {
  id: string;
  label: string;
  component: Raw<Component>;
  props?: Record<string, unknown>;
  permissions?: string[];
  priority: number;
}
```

## 示例

## 实现案例

- <https://github.com/halo-dev/plugin-app-store>
