---
title: 按钮
description: 使用 VButton 在 Halo 插件界面中触发操作，支持多种类型、尺寸、加载状态以及路由跳转
---

按钮用于触发一个操作，例如提交表单、打开弹窗或跳转页面。

## 引入

```ts
import { VButton } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { VButton } from "@halo-dev/components";
</script>

<template>
  <VButton>按钮</VButton>
</template>
```

### 不同类型

```vue preview
<script lang="ts" setup>
import { VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VButton type="default">默认按钮</VButton>
    <VButton type="primary">主要按钮</VButton>
    <VButton type="secondary">次要按钮</VButton>
    <VButton type="danger">危险按钮</VButton>
  </VSpace>
</template>
```

### 不同尺寸

```vue preview
<script lang="ts" setup>
import { VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VButton type="primary" size="lg">大号按钮</VButton>
    <VButton type="primary" size="md">中号按钮</VButton>
    <VButton type="primary" size="sm">小号按钮</VButton>
    <VButton type="primary" size="xs">超小按钮</VButton>
  </VSpace>
</template>
```

### 加载状态

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton } from "@halo-dev/components";

const loading = ref(false);

function handleClick() {
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
  }, 1500);
}
</script>

<template>
  <VButton type="primary" :loading="loading" @click="handleClick">
    {{ loading ? "处理中" : "点击加载" }}
  </VButton>
</template>
```

### 禁用状态

```vue preview
<script lang="ts" setup>
import { VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VButton disabled>禁用按钮</VButton>
    <VButton type="primary" disabled>禁用主要按钮</VButton>
    <VButton type="danger" disabled>禁用危险按钮</VButton>
  </VSpace>
</template>
```

### 图标按钮

```vue preview
<script lang="ts" setup>
import {
  IconAddCircle,
  IconDeleteBin,
  IconSearch,
  VButton,
  VSpace,
} from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VButton type="primary">
      <template #icon>
        <IconAddCircle />
      </template>
      新建
    </VButton>
    <VButton circle aria-label="搜索">
      <template #icon>
        <IconSearch />
      </template>
    </VButton>
    <VButton type="danger" circle aria-label="删除">
      <template #icon>
        <IconDeleteBin />
      </template>
    </VButton>
  </VSpace>
</template>
```

### 块级按钮

```vue preview
<script lang="ts" setup>
import { VButton } from "@halo-dev/components";
</script>

<template>
  <VButton type="primary" block>块级按钮</VButton>
</template>
```

## Props

| 属性       | 类型                                                | 默认值      | 说明                                                     |
| ---------- | --------------------------------------------------- | ----------- | -------------------------------------------------------- |
| `type`     | `"default" \| "primary" \| "secondary" \| "danger"` | `"default"` | 按钮类型                                                 |
| `size`     | `"lg" \| "md" \| "sm" \| "xs"`                      | `"md"`      | 按钮尺寸                                                 |
| `circle`   | `boolean`                                           | `false`     | 是否为圆形图标按钮                                       |
| `block`    | `boolean`                                           | `false`     | 是否占满父容器宽度                                       |
| `disabled` | `boolean`                                           | `false`     | 是否禁用                                                 |
| `loading`  | `boolean`                                           | `false`     | 是否显示加载状态，加载时不可点击                         |
| `route`    | `RouteLocationRaw`                                  | `undefined` | 点击后跳转的路由，使用 Halo Console 的 `vue-router` 实例 |
| `ghost`    | `boolean`                                           | `false`     | 是否为幽灵按钮                                           |

## Emits

| 事件    | 参数 | 说明                                               |
| ------- | ---- | -------------------------------------------------- |
| `click` | -    | 点击按钮时触发，`disabled` 或 `loading` 时不会触发 |

## Slots

| 插槽      | 说明                     |
| --------- | ------------------------ |
| `default` | 按钮内容                 |
| `icon`    | 按钮图标，显示在内容左侧 |
