---
title: 备份页面选项卡
description: "使用 backup:tabs:create 扩展 Halo Console 备份页面选项卡，注册带权限控制的 Vue 面板，用于实现定时备份设置或第三方云存储配置。"
---

此扩展点可以针对备份页面扩展更多关于 UI 的功能，比如定时备份设置、备份到第三方云存储等。

:::info 需要超级管理员账号
自 Halo 2.28 起，备份页面仅超级管理员可用，因此这里的选项卡只会出现在超级管理员的控制台中。调试此扩展点时请使用超级管理员账号登录。
:::

![备份页面选项卡](/img/developer-guide/plugin/extension-points/ui/backup-tabs-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "backup:tabs:create": (): BackupTab[] | Promise<BackupTab[]> => {
      return [
        {
          id: "foo",
          label: "foo",
          component: markRaw(FooComponent),
          permissions: [],
        },
      ];
    },
  },
});
```

```ts title="BackupTab"
export interface BackupTab {
  id: string; // 选项卡 ID
  label: string; // 选项卡标题
  component: Raw<Component>; // 选项卡面板组件
  permissions?: string[]; // 选项卡权限
}
```
