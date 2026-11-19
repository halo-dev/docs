---
title: VPageHeader 页头
description: 使用 VPageHeader 在 Halo 插件页面顶部展示标题、图标和操作按钮
---

`VPageHeader` 用于页面顶部，展示页面标题、图标和操作区域，通常作为插件独立页面的第一个元素。

## 引入

```ts
import { VPageHeader } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { VPageHeader } from "@halo-dev/components";
</script>

<template>
  <VPageHeader title="文章管理" />
</template>
```

### 带图标和操作

```vue preview
<script lang="ts" setup>
import {
  IconAddCircle,
  IconPages,
  VButton,
  VPageHeader,
  VSpace,
} from "@halo-dev/components";
</script>

<template>
  <VPageHeader title="文章管理">
    <template #icon>
      <IconPages />
    </template>
    <template #actions>
      <VSpace>
        <VButton size="sm">导入</VButton>
        <VButton size="sm" type="primary">
          <template #icon>
            <IconAddCircle />
          </template>
          新建文章
        </VButton>
      </VSpace>
    </template>
  </VPageHeader>
</template>
```

## Props

| 属性    | 类型     | 默认值      | 说明     |
| ------- | -------- | ----------- | -------- |
| `title` | `string` | `undefined` | 页面标题 |

## Slots

| 插槽      | 说明         |
| --------- | ------------ |
| `icon`    | 标题前的图标 |
| `actions` | 右侧操作区域 |
