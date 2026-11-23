---
title: VPagination 分页
description: 使用 VPagination 在 Halo 插件列表中实现分页、每页条数切换和总数展示
---

`VPagination` 用于列表底部的分页控制，支持页码切换、每页条数选择和总条数展示。

## 引入

```ts
import { VPagination } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VPagination } from "@halo-dev/components";

const page = ref(1);
const size = ref(10);
</script>

<template>
  <VPagination
    v-model:page="page"
    v-model:size="size"
    :total="126"
    :size-options="[10, 20, 50]"
  />
</template>
```

### 监听分页变化

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VPagination } from "@halo-dev/components";

const page = ref(1);
const size = ref(10);
const current = ref({ page: 1, size: 10 });

function handleChange(value: { page: number; size: number }) {
  current.value = value;
}
</script>

<template>
  <div class="space-y-3">
    <VPagination
      v-model:page="page"
      v-model:size="size"
      :total="86"
      :size-options="[10, 20, 50]"
      @change="handleChange"
    />
    <p class="text-sm text-gray-500">
      当前第 {{ current.page }} 页，每页 {{ current.size }} 条
    </p>
  </div>
</template>
```

### 自定义文案

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VPagination } from "@halo-dev/components";

const page = ref(1);
const size = ref(10);
</script>

<template>
  <VPagination
    v-model:page="page"
    v-model:size="size"
    :total="48"
    :size-options="[10, 20]"
    page-label="页"
    size-label="条 / 页"
    total-label="共 48 条评论"
  />
</template>
```

## Props

| 属性          | 类型       | 默认值      | 说明                                               |
| ------------- | ---------- | ----------- | -------------------------------------------------- |
| `page`        | `number`   | `1`         | 当前页码，支持 `v-model:page`                      |
| `size`        | `number`   | `10`        | 每页条数，支持 `v-model:size`                      |
| `total`       | `number`   | `0`         | 数据总条数                                         |
| `sizeOptions` | `number[]` | `[10]`      | 每页条数选项                                       |
| `showTotal`   | `boolean`  | `true`      | 是否显示总条数                                     |
| `pageLabel`   | `string`   | `undefined` | 页码选择框后的文字，未设置时使用组件库内置文案     |
| `sizeLabel`   | `string`   | `undefined` | 每页条数选择框后的文字，未设置时使用组件库内置文案 |
| `totalLabel`  | `string`   | `undefined` | 自定义总条数文字，未设置时使用组件库内置文案       |

## Emits

| 事件          | 参数                             | 说明                                   |
| ------------- | -------------------------------- | -------------------------------------- |
| `update:page` | `number`                         | 页码变化时触发                         |
| `update:size` | `number`                         | 每页条数变化时触发，页码会同时重置为 1 |
| `change`      | `{ page: number; size: number }` | 页码或每页条数变化时触发               |
