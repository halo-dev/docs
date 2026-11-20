---
title: VDescription 描述列表
description: 使用 VDescription 和 VDescriptionItem 在 Halo 插件界面中以键值对形式展示详情信息
---

描述列表用于以“标签 - 内容”的形式展示对象的详细信息，常用于详情页和侧边信息面板。

## 引入

```ts
import { VDescription, VDescriptionItem } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { VDescription, VDescriptionItem } from "@halo-dev/components";
</script>

<template>
  <div class="overflow-hidden rounded-base border border-gray-100 bg-white">
    <VDescription>
      <VDescriptionItem label="名称" content="Halo" />
      <VDescriptionItem label="版本" content="2.27.0" />
      <VDescriptionItem label="运行状态" content="正常" />
    </VDescription>
  </div>
</template>
```

### 自定义内容

`VDescriptionItem` 的默认插槽优先级高于 `content` 属性，可以在内容中放置标签、链接等富文本。

```vue preview
<script lang="ts" setup>
import { VDescription, VDescriptionItem, VTag } from "@halo-dev/components";
</script>

<template>
  <div class="overflow-hidden rounded-base border border-gray-100 bg-white">
    <VDescription>
      <VDescriptionItem label="插件状态">
        <VTag theme="primary">已启用</VTag>
      </VDescriptionItem>
      <VDescriptionItem label="开发者">
        <a class="text-primary" href="https://www.halo.run" target="_blank">
          Halo 团队
        </a>
      </VDescriptionItem>
    </VDescription>
  </div>
</template>
```

### 垂直居中

```vue preview
<script lang="ts" setup>
import { VDescription, VDescriptionItem } from "@halo-dev/components";
</script>

<template>
  <div class="overflow-hidden rounded-base border border-gray-100 bg-white">
    <VDescription>
      <VDescriptionItem label="描述" vertical-center>
        当内容较长时，标签与内容垂直居中显示。
      </VDescriptionItem>
    </VDescription>
  </div>
</template>
```

## VDescription Props

`VDescription` 没有属性，只提供默认插槽。

## VDescriptionItem Props

| 属性             | 类型      | 默认值      | 说明                     |
| ---------------- | --------- | ----------- | ------------------------ |
| `label`          | `string`  | -           | 标签文本，必填           |
| `content`        | `string`  | `undefined` | 内容文本                 |
| `verticalCenter` | `boolean` | `false`     | 是否让标签和内容垂直居中 |

## Slots

| 组件               | 插槽      | 说明                         |
| ------------------ | --------- | ---------------------------- |
| `VDescription`     | `default` | 描述项列表                   |
| `VDescriptionItem` | `default` | 自定义内容，优先于 `content` |
