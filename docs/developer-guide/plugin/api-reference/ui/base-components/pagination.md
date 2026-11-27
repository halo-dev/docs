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

## 数值校正

从 2.28.0 开始，`VPagination` 会对 `total`、`size`、`page` 做归一化，可以直接把接口返回的值传进来，不需要在调用方清洗：

- `total` 为 `0`、负数或非有限值时按 `0` 处理，页码显示为 `0 / 0`，页码选择框和上一页、下一页按钮都处于禁用状态。
- `size` 不是正整数时，取 `sizeOptions` 中第一个有效值；`sizeOptions` 里也没有有效值时回落到 `10`。
- 当前 `size` 不在 `sizeOptions` 中时，组件会把它补进下拉选项，保证当前每页条数始终可选。
- `page` 超出有效范围时取最接近的有效页码，有效范围随 `total` 与 `size` 变化。

在挂载时以及 `total`、`size` 变化后，组件会用校正后的值触发 `update:page` 和 `update:size`，因此使用 `v-model` 后不需要自己夹取页码：

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VPagination } from "@halo-dev/components";

const page = ref(99);
const size = ref(10);
const total = ref(25);
</script>

<template>
  <div class="space-y-3">
    <VPagination
      v-model:page="page"
      v-model:size="size"
      :total="total"
      :size-options="[10, 20, 50]"
    />
    <p class="text-sm text-gray-500">当前第 {{ page }} 页</p>
  </div>
</template>
```

自动校正只触发 `update:page`、`update:size`，不触发 `change`，所以在校正后需要重新请求数据时，请监听 `page` 或 `size` 的变化。用户主动操作时，点选页码或切换每页条数会触发 `change`。

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

| 事件          | 参数                             | 说明                                             |
| ------------- | -------------------------------- | ------------------------------------------------ |
| `update:page` | `number`                         | 页码变化时触发                                   |
| `update:size` | `number`                         | 每页条数变化时触发，用户切换时页码会同时重置为 1 |
| `change`      | `{ page: number; size: number }` | 页码或每页条数变化时触发                         |
