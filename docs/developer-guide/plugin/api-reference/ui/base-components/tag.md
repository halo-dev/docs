---
title: VTag 标签
description: 使用 VTag 在 Halo 插件中展示分类、状态等标记，支持不同主题、圆角和图标
---

`VTag` 用于展示分类、状态或属性标记。

## 引入

```ts
import { VTag } from "@halo-dev/components";
```

## 示例

### 不同主题

```vue preview
<script lang="ts" setup>
import { VSpace, VTag } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VTag>默认</VTag>
    <VTag theme="primary">主要</VTag>
    <VTag theme="secondary">次要</VTag>
    <VTag theme="danger">危险</VTag>
  </VSpace>
</template>
```

### 圆角标签

```vue preview
<script lang="ts" setup>
import { VSpace, VTag } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VTag rounded>已发布</VTag>
    <VTag rounded theme="primary">草稿</VTag>
  </VSpace>
</template>
```

### 带图标

```vue preview
<script lang="ts" setup>
import { IconCheckboxCircle, IconTimerLine, VTag } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VTag theme="primary">
      <template #leftIcon>
        <IconCheckboxCircle />
      </template>
      已发布
    </VTag>
    <VTag theme="secondary">
      <template #leftIcon>
        <IconTimerLine />
      </template>
      定时发布
    </VTag>
  </VSpace>
</template>
```

### 自定义样式

```vue preview
<script lang="ts" setup>
import { VTag } from "@halo-dev/components";
</script>

<template>
  <VTag :styles="{ backgroundColor: '#e0f2fe', color: '#0369a1' }">
    自定义颜色
  </VTag>
</template>
```

## Props

| 属性      | 类型                                                | 默认值      | 说明               |
| --------- | --------------------------------------------------- | ----------- | ------------------ |
| `theme`   | `"default" \| "primary" \| "secondary" \| "danger"` | `"default"` | 标签主题           |
| `rounded` | `boolean`                                           | `false`     | 是否显示为圆角标签 |
| `styles`  | `CSSProperties`                                     | `{}`        | 自定义样式         |

## Slots

| 插槽        | 说明     |
| ----------- | -------- |
| `default`   | 标签内容 |
| `leftIcon`  | 左侧图标 |
| `rightIcon` | 右侧图标 |
