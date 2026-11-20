---
title: VEmpty 空状态
description: 使用 VEmpty 在 Halo 插件列表中展示无数据时的占位提示和引导操作
---

当列表或页面没有数据时，使用 `VEmpty` 展示友好的空状态提示，并提供下一步操作。

## 引入

```ts
import { VEmpty } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { VEmpty } from "@halo-dev/components";
</script>

<template>
  <VEmpty title="暂无文章" message="创建一篇文章来填充这里的内容。" />
</template>
```

### 带操作按钮

```vue preview
<script lang="ts" setup>
import { VButton, VEmpty } from "@halo-dev/components";
</script>

<template>
  <VEmpty title="还没有插件" message="从应用市场安装插件来扩展功能。">
    <template #actions>
      <VButton type="primary">前往应用市场</VButton>
    </template>
  </VEmpty>
</template>
```

### 搜索无结果

```vue preview
<script lang="ts" setup>
import { VButton, VEmpty } from "@halo-dev/components";
</script>

<template>
  <VEmpty title="没有找到相关内容" message="试试更换关键词或清除筛选条件。">
    <template #actions>
      <VButton size="sm">清除筛选</VButton>
    </template>
  </VEmpty>
</template>
```

## Props

| 属性      | 类型     | 默认值      | 说明                             |
| --------- | -------- | ----------- | -------------------------------- |
| `title`   | `string` | `undefined` | 空状态标题                       |
| `message` | `string` | `undefined` | 补充说明                         |
| `image`   | `string` | `undefined` | 自定义图片地址，默认使用内置插图 |

## Slots

| 插槽      | 说明                     |
| --------- | ------------------------ |
| `image`   | 自定义插图               |
| `message` | 自定义补充说明           |
| `actions` | 操作区域，显示在说明下方 |
