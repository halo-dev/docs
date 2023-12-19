---
title: 主题管理界面选项卡
description: 扩展主题管理界面选项卡 - theme:list:tabs:create
---

目前在 Halo 的主题管理中原生支持本地上传和远程下载的方式安装主题，此扩展点用于扩展主题管理界面的选项卡，以支持更多的安装方式。

![主题管理界面选项卡](/img/developer-guide/plugin/api-reference/ui/extension-points/theme-list-tabs-create.png)

## 类型定义

```ts
{
  "theme:list:tabs:create"?: () => ThemeListTab[] | Promise<ThemeListTab[]>;
}
```

```ts title="ThemeListTab"
export interface ThemeListTab {
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
