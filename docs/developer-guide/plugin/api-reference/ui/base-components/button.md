---
title: 按钮
description: 使用 VButton 在 Halo 插件界面中触发操作，支持多种类型、变体、尺寸、形状、加载状态、图标按钮、链接渲染以及路由跳转
---

按钮用于触发一个操作，例如提交表单、打开弹窗或跳转页面。

从 2.28.0 开始，`VButton` 新增 `variant`、`shape`、`label` 和 `as` 属性，仅含图标的按钮会自动使用正方形布局。

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

`type` 决定按钮的语义颜色。

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

### 不同变体

`variant` 决定按钮的视觉重量：`solid` 为实心（默认），`soft` 为浅色底，`ghost` 为无底色和边框。三种变体都与 `type` 组合使用。

```vue preview
<script lang="ts" setup>
import { VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace direction="column" align="start">
    <VSpace>
      <VButton>取消</VButton>
      <VButton type="primary">保存设置</VButton>
      <VButton type="danger">删除</VButton>
    </VSpace>
    <VSpace>
      <VButton variant="soft">取消</VButton>
      <VButton variant="soft" type="primary">保存设置</VButton>
      <VButton variant="soft" type="danger">删除</VButton>
    </VSpace>
    <VSpace>
      <VButton variant="ghost">取消</VButton>
      <VButton variant="ghost" type="primary">保存设置</VButton>
      <VButton variant="ghost" type="danger">删除</VButton>
    </VSpace>
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

### 不同形状

`shape` 用于把按钮呈现为胶囊或圆形（`circle` 适合图标按钮）。`round` 与图标按钮的正方形布局可以组合使用。

```vue preview
<script lang="ts" setup>
import { IconAddCircle, VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace align="center">
    <VButton type="primary">默认</VButton>
    <VButton type="primary" shape="round">胶囊按钮</VButton>
    <VButton label="新建" type="primary" shape="circle">
      <template #icon>
        <IconAddCircle />
      </template>
    </VButton>
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

图标可以放在 `icon` 插槽中（会为图标保留与文字的间距），也可以直接放在默认插槽中。只有图标、没有文本内容时，按钮会自动使用正方形布局：宽度等于高度，左右内边距为 0。

仅含图标的按钮需要一个无障碍名称，否则开发环境下会在控制台给出警告。用 `label` 可以同时提供无障碍名称和悬停提示，也可以改用 `aria-label` 或 `aria-labelledby`。

```vue preview
<script lang="ts" setup>
import {
  IconAddCircle,
  IconRefreshLine,
  VButton,
  VSpace,
} from "@halo-dev/components";
</script>

<template>
  <VSpace align="center">
    <VButton type="primary">
      <template #icon>
        <IconAddCircle />
      </template>
      新建
    </VButton>
    <VButton label="新建" type="primary">
      <template #icon>
        <IconAddCircle />
      </template>
    </VButton>
    <VButton label="刷新" variant="ghost" size="sm">
      <template #icon>
        <IconRefreshLine />
      </template>
    </VButton>
    <VButton label="删除" type="danger" shape="circle">
      <template #icon>
        <IconAddCircle />
      </template>
    </VButton>
  </VSpace>
</template>
```

`label` 与 `v-tooltip` 不要同时使用，两者会绑定两个提示浮层。需要自定义提示行为时，改用 `aria-label` 提供无障碍名称，再单独使用 `v-tooltip`。

### 渲染为链接

`as` 可以把按钮渲染为其他元素或组件，例如用 `as="a"` 得到真正的链接，同时保留按钮样式。非 `button` 根元素不会渲染 `type` 属性，禁用状态改用 `aria-disabled="true"` 表示，并阻止点击。

```vue preview
<script lang="ts" setup>
import { VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace align="center">
    <VButton as="a" href="https://www.halo.run" target="_blank">
      在新窗口打开
    </VButton>
    <VButton as="a" href="https://www.halo.run" target="_blank" variant="ghost">
      幽灵样式链接
    </VButton>
    <VButton as="a" href="https://www.halo.run" target="_blank" disabled>
      禁用状态
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

| 属性       | 类型                                                | 默认值      | 说明                                                                       |
| ---------- | --------------------------------------------------- | ----------- | -------------------------------------------------------------------------- |
| `type`     | `"default" \| "primary" \| "secondary" \| "danger"` | `"default"` | 按钮的语义颜色                                                             |
| `variant`  | `"solid" \| "soft" \| "ghost"`                      | `"solid"`   | 按钮的视觉重量，从 Halo 2.28.0 开始支持                                    |
| `shape`    | `"default" \| "circle" \| "round"`                  | `"default"` | 按钮形状，从 Halo 2.28.0 开始支持                                          |
| `size`     | `"lg" \| "md" \| "sm" \| "xs"`                      | `"md"`      | 按钮尺寸                                                                   |
| `label`    | `string`                                            | `undefined` | 无障碍名称，同时作为悬停提示，从 Halo 2.28.0 开始支持                      |
| `as`       | `string \| Component`                               | `"button"`  | 根元素或组件，例如 `"a"`，从 Halo 2.28.0 开始支持                          |
| `block`    | `boolean`                                           | `false`     | 是否占满父容器宽度                                                         |
| `disabled` | `boolean`                                           | `false`     | 是否禁用；非 `button` 根元素上表现为 `aria-disabled` 并阻止点击            |
| `loading`  | `boolean`                                           | `false`     | 是否显示加载状态，加载时不可点击                                           |
| `route`    | `RouteLocationRaw`                                  | `undefined` | 点击后跳转的路由，使用 Halo Console 的 `vue-router` 实例，仅对原生按钮生效 |
| `circle`   | `boolean`                                           | `false`     | 已废弃，请使用 `shape="circle"`；为 `true` 时优先于 `shape`                |
| `ghost`    | `boolean`                                           | `false`     | 已废弃，请使用 `variant="ghost"`；为 `true` 时优先于 `variant`             |

## Emits

| 事件    | 参数 | 说明                                               |
| ------- | ---- | -------------------------------------------------- |
| `click` | -    | 点击按钮时触发，`disabled` 或 `loading` 时不会触发 |

## Slots

| 插槽      | 说明                                                 |
| --------- | ---------------------------------------------------- |
| `default` | 按钮内容；没有内容时按钮按图标按钮布局               |
| `icon`    | 按钮图标，显示在内容左侧；只有图标时按钮按正方形布局 |
