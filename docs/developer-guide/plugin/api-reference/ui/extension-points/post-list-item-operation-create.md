---
title: 文章数据列表操作菜单
description: 扩展文章数据列表操作菜单 - post:list-item:operation:create
---

此扩展点用于扩展文章数据列表的操作菜单项。

![文章数据列表操作菜单](/img/developer-guide/plugin/api-reference/ui/extension-points/post-list-item-operation-create.png)

## 类型定义

```ts
{
  "post:list-item:operation:create"?: (
    post: Ref<ListedPost>
  ) => OperationItem<ListedPost>[] | Promise<OperationItem<ListedPost>[]>;
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
