---
title: 主题管理界面选项卡
description: 扩展主题管理界面选项卡 - theme:list:tabs:create
---

目前在 Halo 的主题管理中原生支持本地上传和远程下载的方式安装主题，此扩展点用于扩展主题管理界面的选项卡，以支持更多的安装方式。

![主题管理界面选项卡](/img/developer-guide/plugin/extension-points/ui/theme-list-tabs-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "theme:list:tabs:create": (): ThemeListTab[] | Promise<ThemeListTab[]> => {
      return [
        {
          id: "foo",
          label: "foo",
          component: markRaw(FooComponent),
          props: {},
          permissions: [],
          priority: 0,
        }
      ];
    },
  },
});
```

```ts title="ThemeListTab"
export interface ThemeListTab {
  id: string;                       // 选项卡 ID
  label: string;                    // 选项卡标题
  component: Raw<Component>;        // 选项卡面板组件
  props?: Record\<string, unknown\>;  // 选项卡面板组件属性
  permissions?: string[];           // 选项卡 UI 权限
  priority: number;                 // 选项卡排序优先级
}
```

## 实现案例

- [https://github.com/halo-dev/plugin-app-store](https://github.com/halo-dev/plugin-app-store)
