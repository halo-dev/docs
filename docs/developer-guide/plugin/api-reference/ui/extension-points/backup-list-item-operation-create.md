---
title: 备份数据列表操作菜单
description: 扩展备份数据列表操作菜单 - backup:list-item:operation:create
---

此扩展点用于扩展备份数据列表的操作菜单项。

## 类型定义

```ts
{
  "backup:list-item:operation:create"?: (
    backup: Ref<Backup>
  ) => OperationItem<Backup>[] | Promise<OperationItem<Backup>[]>;
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
