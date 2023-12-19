---
title: 备份页面选项卡
description: 扩展备份页面选项卡 - backup:tabs:create
---

此扩展点可以针对备份页面扩展更多关于 UI 的功能，比如定时备份设置、备份到第三方云存储等。

## 类型定义

```ts
{
  "backup:tabs:create"?: () => BackupTab[] | Promise<BackupTab[]>;
}
```

```ts title="BackupTab"
export interface BackupTab {
  id: string;
  label: string;
  component: Raw<Component>;
  permissions?: string[];
}
```

## 示例
