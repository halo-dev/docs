---
title: 主题数据列表操作菜单
description: 扩展主题数据列表操作菜单 - theme:list-item:operation:create
---

此扩展点用于扩展主题数据列表的操作菜单项。

![主题数据列表操作菜单](/img/developer-guide/plugin/api-reference/ui/extension-points/theme-list-item-operation-create.png)

## 类型定义

```ts
{
  "theme:list-item:operation:create"?: (
    theme: Ref<Theme>
  ) => OperationItem<Theme>[] | Promise<OperationItem<Theme>[]>;
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
