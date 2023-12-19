---
title: 插件详情选项卡
description: 扩展当前插件的详情选项卡 - plugin:self:tabs:create
---

此扩展点用于在 Console 的插件详情页面中添加自定义选项卡，可以用于自定义插件的配置页面。

## 类型定义

```ts
{
  "plugin:self:tabs:create"?: () => PluginTab[] | Promise<PluginTab[]>;
}
```

```ts title="PluginTab"
export interface PluginTab {
  id: string;
  label: string;
  component: Raw<Component>;
  permissions?: string[];
}
```

## 实现案例

- <https://github.com/halo-dev/plugin-app-store>
