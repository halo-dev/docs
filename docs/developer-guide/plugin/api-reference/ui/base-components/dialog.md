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

### 异步确认

`onConfirm` 可以返回 Promise。确认按钮在等待期间显示加载状态，期间按 Esc、点击遮罩、取消按钮和关闭按钮都不会关闭对话框；Promise 成功后才关闭，被 reject 时对话框保持打开并清除加载状态，用户可以重试。

```vue preview
<script lang="ts" setup>
import { Dialog, VButton } from "@halo-dev/components";

function openDialog() {
  Dialog.warning({
    title: "发布文章",
    description: "发布后读者即可访问，你仍然可以随时撤回。",
    onConfirm() {
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 1500);
      });
    },
  });
}
</script>

<template>
  <VButton type="primary" @click="openDialog">发布</VButton>
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

### 关闭对话框

`Dialog()` 以及 `Dialog.info`、`Dialog.success`、`Dialog.warning`、`Dialog.error` 返回一个实例：

| 方法        | 说明                            |
| ----------- | ------------------------------- |
| `close()`   | 关闭对话框，不会触发 `onCancel` |
| `destroy()` | 立即移除对话框，跳过关闭动画    |

`Dialog.destroyAll()` 可以一次性移除所有通过函数式调用打开的对话框，例如在路由切换时清理。传入的 `uniqueId` 已存在时不会再弹出新的对话框，此时调用返回 `undefined`。

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

| 属性            | 类型                                                | 默认值      | 说明                                                               |
| --------------- | --------------------------------------------------- | ----------- | ------------------------------------------------------------------ |
| `title`         | `string`                                            | `undefined` | 标题，未设置时使用组件库内置文案                                   |
| `description`   | `string`                                            | `""`        | 描述内容                                                           |
| `confirmText`   | `string`                                            | `undefined` | 确认按钮文字，未设置时使用组件库内置文案                           |
| `confirmType`   | `"default" \| "primary" \| "secondary" \| "danger"` | `"primary"` | 确认按钮类型                                                       |
| `cancelText`    | `string`                                            | `undefined` | 取消按钮文字，未设置时使用组件库内置文案                           |
| `showCancel`    | `boolean`                                           | `true`      | 是否显示取消按钮                                                   |
| `uniqueId`      | `string`                                            | `undefined` | 唯一标识，用于避免重复弹出                                         |
| `size`          | `"sm" \| "md" \| "lg"`                              | `"md"`      | 尺寸，内容区最大宽度分别为 400、450、600 像素                      |
| `width`         | `number`                                            | `undefined` | 自定义宽度（像素），优先于 `size`                                  |
| `icon`          | `Component`                                         | `undefined` | 自定义图标，`icon` 插槽存在时以插槽为准                            |
| `showClose`     | `boolean`                                           | `true`      | 是否显示右上角关闭按钮                                             |
| `closeOnEsc`    | `boolean`                                           | `true`      | 是否允许按 Esc 关闭                                                |
| `layerClosable` | `boolean`                                           | `false`     | 是否允许点击遮罩关闭                                               |
| `onConfirm`     | `() => void \| Promise<void>`                       | `undefined` | 点击确认时调用，返回 Promise 时确认按钮会显示加载状态              |
| `onCancel`      | `() => void`                                        | `undefined` | 取消、关闭按钮、遮罩或 Esc 关闭时调用，程序调用 `close()` 时不触发 |

## VDialog Props

| 属性            | 类型                                                | 默认值      | 说明                                                  |
| --------------- | --------------------------------------------------- | ----------- | ----------------------------------------------------- |
| `type`          | `"success" \| "info" \| "warning" \| "error"`       | `"info"`    | 对话框类型                                            |
| `visible`       | `boolean`                                           | `false`     | 是否显示，支持 `v-model:visible`                      |
| `title`         | `string`                                            | `undefined` | 标题，未设置时使用组件库内置文案                      |
| `description`   | `string`                                            | `""`        | 描述内容                                              |
| `confirmText`   | `string`                                            | `undefined` | 确认按钮文字，未设置时使用组件库内置文案              |
| `confirmType`   | `"default" \| "primary" \| "secondary" \| "danger"` | `"primary"` | 确认按钮类型                                          |
| `cancelText`    | `string`                                            | `undefined` | 取消按钮文字，未设置时使用组件库内置文案              |
| `showCancel`    | `boolean`                                           | `true`      | 是否显示取消按钮                                      |
| `uniqueId`      | `string`                                            | `undefined` | 唯一标识                                              |
| `size`          | `"sm" \| "md" \| "lg"`                              | `"md"`      | 尺寸，内容区最大宽度分别为 400、450、600 像素         |
| `width`         | `number`                                            | `undefined` | 自定义宽度（像素），优先于 `size`                     |
| `icon`          | `Component`                                         | `undefined` | 自定义图标，`icon` 插槽存在时以插槽为准               |
| `showClose`     | `boolean`                                           | `true`      | 是否显示右上角关闭按钮                                |
| `closeOnEsc`    | `boolean`                                           | `true`      | 是否允许按 Esc 关闭                                   |
| `layerClosable` | `boolean`                                           | `false`     | 是否允许点击遮罩关闭                                  |
| `onConfirm`     | `() => void \| Promise<void>`                       | `undefined` | 点击确认时调用，返回 Promise 时确认按钮会显示加载状态 |
| `onCancel`      | `() => void`                                        | `undefined` | 取消、关闭按钮、遮罩或 Esc 关闭时调用                 |

## 插槽

`VDialog` 提供以下插槽，用于替换默认内容：

| 插槽          | 说明                                 |
| ------------- | ------------------------------------ |
| `default`     | 描述下方的自定义内容                 |
| `icon`        | 头部图标，替换默认的类型图标         |
| `description` | 描述内容，替换 `description` 属性    |
| `footer`      | 底部操作区，替换默认的确认与取消按钮 |

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton, VDialog } from "@halo-dev/components";

const visible = ref(false);
</script>

<template>
  <VButton type="primary" @click="visible = true">打开对话框</VButton>
  <VDialog v-model:visible="visible" title="删除文章" size="lg">
    <template #description>
      删除后文章将进入回收站，你可以在回收站中恢复。
    </template>
    <template #footer>
      <VButton type="danger" @click="visible = false">删除</VButton>
      <VButton @click="visible = false">取消</VButton>
    </template>
  </VDialog>
</template>
```

## Emits

| 事件             | 参数      | 说明                     |
| ---------------- | --------- | ------------------------ |
| `update:visible` | `boolean` | 对话框显示状态变化时触发 |
| `close`          | -         | 对话框关闭时触发         |
