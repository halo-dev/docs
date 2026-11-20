---
title: VLoading 加载中
description: 使用 VLoading 在 Halo 插件中展示加载动画，提示内容正在加载
---

`VLoading` 显示一个居中的加载动画，用于数据加载中的占位。

## 引入

```ts
import { VLoading } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { VLoading } from "@halo-dev/components";
</script>

<template>
  <VLoading />
</template>
```

### 在容器中使用

```vue preview
<script lang="ts" setup>
import { VLoading } from "@halo-dev/components";
</script>

<template>
  <div class="flex h-40 items-center justify-center rounded-base bg-gray-50">
    <VLoading />
  </div>
</template>
```

`VLoading` 没有属性、事件和插槽，大小由所在容器决定。
