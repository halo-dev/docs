---
title: Toast 轻提示
description: 使用 Toast 在 Halo 插件中展示自动消失的轻量提示消息，支持成功、信息、警告和错误类型
---

`Toast` 用于展示短暂的操作结果提示，会自动消失，不需要用户确认。它通过函数调用，不需要在模板中声明组件。

## 引入

```ts
import { Toast } from "@halo-dev/components";
```

## 示例

### 不同类型

```vue preview
<script lang="ts" setup>
import { Toast, VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VButton @click="Toast.success('保存成功')">成功</VButton>
    <VButton @click="Toast.info('正在同步数据')">信息</VButton>
    <VButton @click="Toast.warning('配置将在重启后生效')">警告</VButton>
    <VButton @click="Toast.error('保存失败，请重试')">错误</VButton>
  </VSpace>
</template>
```

### 自定义关闭行为

```vue preview
<script lang="ts" setup>
import { Toast, VButton } from "@halo-dev/components";

function showToast() {
  Toast.success("这条提示 5 秒后消失", {
    duration: 5000,
    closable: true,
  });
}
</script>

<template>
  <VButton type="primary" @click="showToast">显示提示</VButton>
</template>
```

### 不自动消失

将 `duration` 设为负数，提示会一直显示，直到用户手动关闭。

```vue preview
<script lang="ts" setup>
import { Toast, VButton } from "@halo-dev/components";

function showToast() {
  Toast.warning("需要手动关闭这条提示", {
    duration: -1,
    closable: true,
  });
}
</script>

<template>
  <VButton @click="showToast">显示常驻提示</VButton>
</template>
```

## Toast 函数

| 方法                             | 参数                      | 说明           |
| -------------------------------- | ------------------------- | -------------- |
| `Toast(options)`                 | `ToastProps`              | 按配置显示提示 |
| `Toast.success(content, props?)` | `string`, `ToastApiProps` | 显示成功提示   |
| `Toast.info(content, props?)`    | `string`, `ToastApiProps` | 显示信息提示   |
| `Toast.warning(content, props?)` | `string`, `ToastApiProps` | 显示警告提示   |
| `Toast.error(content, props?)`   | `string`, `ToastApiProps` | 显示错误提示   |

## Props

| 属性            | 类型                                          | 默认值      | 说明                                   |
| --------------- | --------------------------------------------- | ----------- | -------------------------------------- |
| `type`          | `"success" \| "info" \| "warning" \| "error"` | `"success"` | 提示类型                               |
| `content`       | `string`                                      | `""`        | 提示内容                               |
| `duration`      | `number`                                      | `3000`      | 显示时长（毫秒），设为负数时不自动关闭 |
| `closable`      | `boolean`                                     | `true`      | 是否显示关闭按钮                       |
| `frozenOnHover` | `boolean`                                     | `true`      | 鼠标悬停时是否暂停倒计时               |
| `onClose`       | `() => void`                                  | `undefined` | 关闭时调用                             |

## 返回值

`Toast` 函数返回一个实例对象：

| 属性    | 类型         | 说明           |
| ------- | ------------ | -------------- |
| `id`    | `string`     | 实例 ID        |
| `vnode` | `VNode`      | 组件 VNode     |
| `close` | `() => void` | 手动关闭该提示 |

:::tip
连续显示内容相同、类型相同的提示时，会合并为一个提示并显示出现次数。
:::
