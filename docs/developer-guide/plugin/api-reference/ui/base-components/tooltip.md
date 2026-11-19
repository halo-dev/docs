---
title: Tooltip 文字提示
description: 使用 v-tooltip 指令或 VTooltipComponent 在 Halo 插件中为元素添加悬停提示
---

文字提示用于在用户悬停或聚焦元素时，展示简短的说明文字。组件库重新导出了 [floating-vue](https://floating-vue.starpad.dev/) 的 Tooltip 组件和指令。

## 引入

```ts
import { VTooltipComponent, vTooltip } from "@halo-dev/components";
```

## 示例

### 使用指令

```vue preview
<script lang="ts" setup>
import { IconDeleteBin, VButton, vTooltip } from "@halo-dev/components";
</script>

<template>
  <VButton v-tooltip="'删除这条记录'" type="danger" circle aria-label="删除">
    <template #icon>
      <IconDeleteBin />
    </template>
  </VButton>
</template>
```

### 使用组件

```vue preview
<script lang="ts" setup>
import { VButton, VTooltipComponent } from "@halo-dev/components";
</script>

<template>
  <VTooltipComponent placement="top">
    <VButton>悬停查看提示</VButton>
    <template #popper> 这是一个文字提示 </template>
  </VTooltipComponent>
</template>
```

### 不同位置

```vue preview
<script lang="ts" setup>
import { VButton, VSpace, VTooltipComponent } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VTooltipComponent placement="top">
      <VButton size="sm">上方</VButton>
      <template #popper>上方提示</template>
    </VTooltipComponent>
    <VTooltipComponent placement="bottom">
      <VButton size="sm">下方</VButton>
      <template #popper>下方提示</template>
    </VTooltipComponent>
    <VTooltipComponent placement="left">
      <VButton size="sm">左侧</VButton>
      <template #popper>左侧提示</template>
    </VTooltipComponent>
    <VTooltipComponent placement="right">
      <VButton size="sm">右侧</VButton>
      <template #popper>右侧提示</template>
    </VTooltipComponent>
  </VSpace>
</template>
```

## VTooltipComponent Props

`VTooltipComponent` 是 floating-vue 的 `Tooltip` 组件，完整属性请参考 [floating-vue 文档](https://floating-vue.starpad.dev/guide/tooltip.html)。常用属性如下：

| 属性        | 类型       | 默认值               | 说明                                            |
| ----------- | ---------- | -------------------- | ----------------------------------------------- |
| `placement` | `string`   | `"top"`              | 提示位置，例如 `top`、`bottom`、`left`、`right` |
| `triggers`  | `string[]` | `["hover", "focus"]` | 触发方式                                        |
| `distance`  | `number`   | `0`                  | 提示与元素的间距                                |
| `disabled`  | `boolean`  | `false`              | 是否禁用提示                                    |
| `shown`     | `boolean`  | `false`              | 是否显示提示，支持 `v-model:shown`              |

## 指令

| 指令        | 示例                     | 说明                 |
| ----------- | ------------------------ | -------------------- |
| `v-tooltip` | `v-tooltip="'提示内容'"` | 在元素上添加文字提示 |

## Slots

| 插槽      | 说明           |
| --------- | -------------- |
| `default` | 触发提示的元素 |
| `popper`  | 提示内容       |
