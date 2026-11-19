---
title: VSwitch 开关
description: 使用 VSwitch 在 Halo 插件中实现布尔值切换，支持禁用和加载状态
---

`VSwitch` 用于在两个互斥状态之间切换，例如开启/关闭某个功能。

## 引入

```ts
import { VSwitch } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VSwitch } from "@halo-dev/components";

const enabled = ref(false);
</script>

<template>
  <div class="flex items-center gap-3">
    <VSwitch v-model="enabled" />
    <span class="text-sm text-gray-500">
      {{ enabled ? "已开启" : "已关闭" }}
    </span>
  </div>
</template>
```

### 禁用状态

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VSwitch, VSpace } from "@halo-dev/components";

const enabled = ref(true);
</script>

<template>
  <VSpace>
    <VSwitch v-model="enabled" disabled />
    <VSwitch :model-value="false" disabled />
  </VSpace>
</template>
```

### 加载状态

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VSwitch } from "@halo-dev/components";

const enabled = ref(true);
</script>

<template>
  <VSwitch v-model="enabled" loading />
</template>
```

### 监听变化

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { Toast, VSwitch } from "@halo-dev/components";

const enabled = ref(false);

function handleChange(value: boolean) {
  Toast.success(value ? "已开启" : "已关闭");
}
</script>

<template>
  <VSwitch v-model="enabled" @change="handleChange" />
</template>
```

## Props

| 属性         | 类型      | 默认值  | 说明                             |
| ------------ | --------- | ------- | -------------------------------- |
| `modelValue` | `boolean` | `false` | 是否开启，支持 `v-model`         |
| `disabled`   | `boolean` | `false` | 是否禁用                         |
| `loading`    | `boolean` | `false` | 是否显示加载状态，加载时不可操作 |

## Emits

| 事件                | 参数      | 说明               |
| ------------------- | --------- | ------------------ |
| `update:modelValue` | `boolean` | 开关状态变化时触发 |
| `change`            | `boolean` | 开关状态变化时触发 |
