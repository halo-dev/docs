---
title: 插件详情选项卡
description: 扩展当前插件的详情选项卡 - plugin:self:tabs:create
---

此扩展点用于在 Console 的插件详情页面中添加自定义选项卡，可以用于自定义插件的配置页面。

![插件详情选项卡](/img/developer-guide/plugin/api-reference/ui/extension-points/plugin-self-tabs-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "plugin:self:tabs:create": (): PluginTab[] | Promise<PluginTab[]> => {
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

```ts title="PluginTab"
export interface PluginTab {
  id: string;                 // 选项卡 ID，不能与设置表单的 group 重复
  label: string;              // 选项卡标题
  component: Raw<Component>;  // 选项卡面板组件
  permissions?: string[];     // 选项卡权限
}
```

其中，`component` 组件可以注入（inject）以下属性：

- `plugin`：当前插件对象，类型为 Ref\<[Plugin](#plugin)\>。

## 示例

此示例实现了一个自定义选项卡，用于获取插件的数据并显示名称。

```ts
import { definePlugin, PluginTab } from "@halo-dev/console-shared";
import MyComponent from "./views/my-component.vue";
import { markRaw } from "vue";
export default definePlugin({
  components: {},
  routes: [],
  extensionPoints: {
    "plugin:self:tabs:create": () : PluginTab[] => {
      return [
        {
          id: "my-tab-panel",
          label: "My Tab Panel",
          component: markRaw(MyComponent),
          permissions: []
        },
      ];
    },
  },
});
```

```html title="./views/my-component.vue"
<script lang="ts" setup>
const plugin = inject<Ref<Plugin | undefined>>("plugin");
</script>

<template>
  <h1>{{ plugin?.spec.displayName }}</h1>
</template>
```

## 实现案例

- [https://github.com/halo-dev/plugin-app-store](https://github.com/halo-dev/plugin-app-store)

## 类型定义

### Plugin

```mdx-code-block
import Plugin from "./interface/Plugin.md";

<Plugin />
```
