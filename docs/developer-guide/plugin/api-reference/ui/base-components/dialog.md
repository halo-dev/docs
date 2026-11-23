---
title: Dialog 确认对话框
description: 使用 Dialog 函数或 VDialog 组件在 Halo 插件中展示确认、警告和错误对话框，支持确认与取消回调
---

`Dialog` 用于让用户确认一个操作，例如删除、发布或离开未保存的页面。组件库提供函数式调用和组件式两种用法。

## 引入

```ts
import { Dialog, VDialog } from "@halo-dev/components";
```

## 函数式调用

推荐使用 `Dialog` 函数，它会自动挂载到 `document.body`，不需要在模板中维护显示状态。

### 基础用法

```vue preview
<script lang="ts" setup>
import { Dialog, VButton } from "@halo-dev/components";

function openDialog() {
  Dialog.info({
    title: "提示",
    description: "这是一个信息对话框。",
    confirmText: "知道了",
    showCancel: false,
  });
}
</script>

<template>
  <VButton type="primary" @click="openDialog">打开对话框</VButton>
</template>
```

### 确认与取消

```vue preview
<script lang="ts" setup>
import { Dialog, VButton } from "@halo-dev/components";

function openDialog() {
  Dialog.warning({
    title: "确认删除",
    description: "删除后不可恢复，确定要继续吗？",
    confirmText: "删除",
    confirmType: "danger",
    cancelText: "取消",
    onConfirm() {
      Dialog.success({
        title: "已删除",
        description: "选中的内容已删除。",
        showCancel: false,
      });
    },
  });
}
</script>

<template>
  <VButton type="danger" @click="openDialog">删除</VButton>
</template>
```

### 四种类型

```vue preview
<script lang="ts" setup>
import { Dialog, VButton, VSpace } from "@halo-dev/components";

const labels = {
  success: "成功",
  info: "信息",
  warning: "警告",
  error: "错误",
} as const;

function open(type: keyof typeof labels) {
  Dialog[type]({
    title: `${labels[type]}对话框`,
    description: "根据类型显示不同的图标和颜色。",
    showCancel: false,
  });
}
</script>

<template>
  <VSpace>
    <VButton @click="open('success')">成功</VButton>
    <VButton @click="open('info')">信息</VButton>
    <VButton @click="open('warning')">警告</VButton>
    <VButton @click="open('error')">错误</VButton>
  </VSpace>
</template>
```

## 组件式调用

需要在自定义位置渲染或精确控制生命周期时，可以使用 `VDialog`。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton, VDialog } from "@halo-dev/components";

const visible = ref(false);
</script>

<template>
  <VButton type="primary" @click="visible = true">打开对话框</VButton>
  <VDialog
    v-model:visible="visible"
    type="warning"
    title="确认操作"
    description="确定要继续吗？"
    confirm-text="继续"
    @close="visible = false"
  />
</template>
```

## Dialog 配置

`Dialog(props)` 以及 `Dialog.info`、`Dialog.success`、`Dialog.warning`、`Dialog.error` 接受以下参数：

| 属性          | 类型                                                | 默认值      | 说明                                                  |
| ------------- | --------------------------------------------------- | ----------- | ----------------------------------------------------- |
| `title`       | `string`                                            | `undefined` | 标题，未设置时使用组件库内置文案                      |
| `description` | `string`                                            | `""`        | 描述内容                                              |
| `confirmText` | `string`                                            | `undefined` | 确认按钮文字，未设置时使用组件库内置文案              |
| `confirmType` | `"default" \| "primary" \| "secondary" \| "danger"` | `"primary"` | 确认按钮类型                                          |
| `cancelText`  | `string`                                            | `undefined` | 取消按钮文字，未设置时使用组件库内置文案              |
| `showCancel`  | `boolean`                                           | `true`      | 是否显示取消按钮                                      |
| `uniqueId`    | `string`                                            | `undefined` | 唯一标识，用于避免重复弹出                            |
| `onConfirm`   | `() => void \| Promise<void>`                       | `undefined` | 点击确认时调用，返回 Promise 时确认按钮会显示加载状态 |
| `onCancel`    | `() => void`                                        | `undefined` | 点击取消时调用                                        |

## VDialog Props

| 属性          | 类型                                                | 默认值      | 说明                                     |
| ------------- | --------------------------------------------------- | ----------- | ---------------------------------------- |
| `type`        | `"success" \| "info" \| "warning" \| "error"`       | `"info"`    | 对话框类型                               |
| `visible`     | `boolean`                                           | `false`     | 是否显示，支持 `v-model:visible`         |
| `title`       | `string`                                            | `undefined` | 标题，未设置时使用组件库内置文案         |
| `description` | `string`                                            | `""`        | 描述内容                                 |
| `confirmText` | `string`                                            | `undefined` | 确认按钮文字，未设置时使用组件库内置文案 |
| `confirmType` | `"default" \| "primary" \| "secondary" \| "danger"` | `"primary"` | 确认按钮类型                             |
| `cancelText`  | `string`                                            | `undefined` | 取消按钮文字，未设置时使用组件库内置文案 |
| `showCancel`  | `boolean`                                           | `true`      | 是否显示取消按钮                         |
| `uniqueId`    | `string`                                            | `undefined` | 唯一标识                                 |
| `onConfirm`   | `() => void \| Promise<void>`                       | `undefined` | 点击确认时调用                           |
| `onCancel`    | `() => void`                                        | `undefined` | 点击取消时调用                           |

## Emits

| 事件             | 参数      | 说明                     |
| ---------------- | --------- | ------------------------ |
| `update:visible` | `boolean` | 对话框显示状态变化时触发 |
| `close`          | -         | 对话框关闭时触发         |
