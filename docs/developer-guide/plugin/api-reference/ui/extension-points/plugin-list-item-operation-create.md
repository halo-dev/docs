---
title: 插件数据列表操作菜单
description: 扩展插件数据列表操作菜单 - plugin:list-item:operation:create
---

此扩展点用于扩展插件数据列表的操作菜单项。

## 类型定义

```ts
{
  "plugin:list-item:operation:create"?: (
    plugin: Ref<Plugin>
  ) => OperationItem<Plugin>[] | Promise<OperationItem<Plugin>[]>;
}
```

```ts title="OperationItem"
export interface OperationItem<T> {
  priority: number;
  component: Raw<Component>;
  props?: Record<string, unknown>;
  action?: (item?: T) => void;
  label?: string;
  hidden?: boolean;
  permissions?: string[];
  children?: OperationItem<T>[];
}
```

## 示例

## 实现案例

- <https://github.com/halo-dev/plugin-app-store>
