---
title: VSpace 间距
description: 使用 VSpace 在 Halo 插件中控制一组元素之间的间距和排列方向
---

`VSpace` 用于给一组元素设置统一的间距，避免手动添加 margin。

## 引入

```ts
import { VSpace } from "@halo-dev/components";
```

## 示例

### 水平排列

```vue preview
<script lang="ts" setup>
import { VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VButton>按钮</VButton>
    <VButton>按钮</VButton>
    <VButton>按钮</VButton>
  </VSpace>
</template>
```

### 垂直排列

```vue preview
<script lang="ts" setup>
import { VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace direction="column" align="start">
    <VButton>第一个按钮</VButton>
    <VButton>第二个按钮</VButton>
    <VButton>第三个按钮</VButton>
  </VSpace>
</template>
```

### 不同间距

```vue preview
<script lang="ts" setup>
import { VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace direction="column" align="start">
    <VSpace spacing="xs">
      <VButton size="sm">xs</VButton>
      <VButton size="sm">xs</VButton>
    </VSpace>
    <VSpace spacing="sm">
      <VButton size="sm">sm</VButton>
      <VButton size="sm">sm</VButton>
    </VSpace>
    <VSpace spacing="md">
      <VButton size="sm">md</VButton>
      <VButton size="sm">md</VButton>
    </VSpace>
    <VSpace spacing="lg">
      <VButton size="sm">lg</VButton>
      <VButton size="sm">lg</VButton>
    </VSpace>
  </VSpace>
</template>
```

### 对齐方式

```vue preview
<script lang="ts" setup>
import { VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace align="start">
    <VButton size="lg">大按钮</VButton>
    <VButton size="sm">小按钮</VButton>
  </VSpace>
</template>
```

## Props

| 属性        | 类型                                        | 默认值     | 说明                               |
| ----------- | ------------------------------------------- | ---------- | ---------------------------------- |
| `spacing`   | `"xs" \| "sm" \| "md" \| "lg"`              | `"xs"`     | 元素间距，对应 10、12、16、20 像素 |
| `direction` | `"row" \| "column"`                         | `"row"`    | 排列方向                           |
| `align`     | `"start" \| "end" \| "center" \| "stretch"` | `"center"` | 交叉轴对齐方式                     |

## Slots

| 插槽      | 说明               |
| --------- | ------------------ |
| `default` | 需要设置间距的元素 |
