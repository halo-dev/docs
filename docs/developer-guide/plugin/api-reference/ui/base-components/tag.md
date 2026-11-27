---
title: VTag 标签
description: 使用 VTag 在 Halo 插件中展示分类、状态等标记，支持语义色、尺寸、单行省略、可关闭、可点击与可选中状态
---

`VTag` 用于展示分类、状态或属性标记。

从 2.28.0 开始，`VTag` 支持尺寸、`success`、`warning`、`info` 语义色与浅色变体，长文本单行省略并在悬浮时显示完整内容，以及可关闭、可点击、可选中和禁用状态。新增属性都是可选的，已有用法不需要修改。

## 引入

```ts
import { VTag } from "@halo-dev/components";
```

## 示例

### 不同主题

`theme` 决定标签的语义颜色。从 2.28.0 开始新增 `success`、`warning` 和 `info`。

```vue preview
<script lang="ts" setup>
import { VSpace, VTag } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VTag>草稿</VTag>
    <VTag theme="primary">已发布</VTag>
    <VTag theme="secondary">置顶</VTag>
    <VTag theme="danger">审核失败</VTag>
    <VTag theme="success">运行中</VTag>
    <VTag theme="warning">待审核</VTag>
    <VTag theme="info">计划发布</VTag>
  </VSpace>
</template>
```

### 浅色变体

从 2.28.0 开始，`variant` 设为 `soft` 时使用低饱和的浅色背景和同色系文字，适合大量并排出现的状态标记。

```vue preview
<script lang="ts" setup>
import { VSpace, VTag } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VTag variant="soft">草稿</VTag>
    <VTag variant="soft" theme="primary">已发布</VTag>
    <VTag variant="soft" theme="danger">审核失败</VTag>
    <VTag variant="soft" theme="success">运行中</VTag>
    <VTag variant="soft" theme="warning">待审核</VTag>
    <VTag variant="soft" theme="info">计划发布</VTag>
  </VSpace>
</template>
```

### 尺寸

从 2.28.0 开始，`size` 支持 `sm`（默认）、`md`、`lg`，图标和关闭按钮会随尺寸自动缩放。

```vue preview
<script lang="ts" setup>
import { IconSettings, VSpace, VTag } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VTag size="sm">小尺寸</VTag>
    <VTag size="md">中等尺寸</VTag>
    <VTag size="lg">大尺寸</VTag>
    <VTag size="lg" theme="primary">
      <template #leftIcon>
        <IconSettings />
      </template>
      系统设置
    </VTag>
  </VSpace>
</template>
```

### 长文本省略

从 2.28.0 开始，标签固定为单行显示。文本超过 `maxWidth`（默认 `12rem`）或超出父容器时可用的宽度时会以省略号截断，悬浮时在提示中显示完整内容。

```vue preview
<script lang="ts" setup>
import { VSpace, VTag } from "@halo-dev/components";
</script>

<template>
  <VSpace direction="column" align="start">
    <VTag max-width="8rem">一个非常非常长的文章标签名称也不会撑破布局</VTag>
    <VTag max-width="16rem" theme="primary"
      >一个非常非常长的文章标签名称也不会撑破布局</VTag
    >
  </VSpace>
</template>
```

### 可关闭

从 2.28.0 开始，`closable` 显示内置的关闭按钮，点击时触发 `close` 事件；不再需要手动通过 `rightIcon` 插槽放置关闭图标。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VSpace, VTag } from "@halo-dev/components";

const tags = ref(["Halo", "Vue", "Java"]);

function removeTag(tag: string) {
  tags.value = tags.value.filter((item) => item !== tag);
}
</script>

<template>
  <VSpace>
    <VTag
      v-for="tag in tags"
      :key="tag"
      closable
      theme="secondary"
      @close="removeTag(tag)"
    >
      {{ tag }}
    </VTag>
  </VSpace>
</template>
```

### 可点击

从 2.28.0 开始，`clickable` 让标签显示手型光标和悬停效果，并可通过键盘聚焦后按 `Enter` 或空格触发。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VSpace, VTag } from "@halo-dev/components";

const selected = ref("文章");
</script>

<template>
  <VSpace direction="column" align="start">
    <VSpace>
      <VTag
        v-for="type in ['文章', '页面', '瞬间']"
        :key="type"
        clickable
        :theme="selected === type ? 'primary' : 'default'"
        @click="selected = type"
      >
        {{ type }}
      </VTag>
    </VSpace>
    <span class="text-sm text-gray-500">当前选择：{{ selected }}</span>
  </VSpace>
</template>
```

### 可选中

从 2.28.0 开始，`checkable` 让标签在点击时切换选中状态，配合 `v-model:checked` 使用；也可以只监听 `change` 事件自行维护状态。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VSpace, VTag } from "@halo-dev/components";

const checked = ref(false);
</script>

<template>
  <VSpace>
    <VTag v-model:checked="checked" checkable>标签筛选</VTag>
    <VTag checkable default-checked theme="success" variant="soft">
      已选中
    </VTag>
    <span class="text-sm text-gray-500">
      {{ checked ? "已选中" : "未选中" }}
    </span>
  </VSpace>
</template>
```

### 禁用

从 2.28.0 开始，`disabled` 会降低标签的不透明度，并阻止点击、关闭和切换选中状态。

```vue preview
<script lang="ts" setup>
import { VSpace, VTag } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VTag disabled>不可用</VTag>
    <VTag disabled closable theme="secondary">不可用</VTag>
    <VTag disabled clickable theme="primary">不可用</VTag>
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
import {
  IconCheckboxCircle,
  IconTimerLine,
  VSpace,
  VTag,
} from "@halo-dev/components";
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

### 自定义颜色

从 2.28.0 开始，`color` 直接设置背景色，文字颜色按背景亮度自动选择黑或白，浅色和深色背景都能保持可读。无法从取色值计算亮度时退回到 CSS `contrast-color()`。

```vue preview
<script lang="ts" setup>
import { VSpace, VTag } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VTag color="#FDE68A">浅色背景</VTag>
    <VTag color="#312E81">深色背景</VTag>
    <VTag rounded color="#4CCBA0">品牌色</VTag>
  </VSpace>
</template>
```

## 交互与无障碍

- 只有设置了 `clickable` 或 `checkable` 的标签才会显示手型光标、加入 Tab 顺序并响应 `Enter` 和空格。从 2.28.0 开始默认不再显示手型光标，点击标签后需要跳转或筛选的场景请显式设置 `clickable`。
- 可交互标签使用 `role="button"`，可选中标签通过 `aria-pressed` 暴露选中状态；关闭按钮有独立的无障碍名称，图标插槽对读屏软件隐藏。
- 被截断的标签在悬浮时才显示完整内容，未截断时不显示提示；传入 `title` 可以指定固定的提示内容。
- `disabled` 的标签使用 `aria-disabled` 标记为不可用，点击、关闭和键盘操作都会被忽略。

## Props

| 属性             | 类型                                                                                    | 默认值      | 说明                                                                 |
| ---------------- | --------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------- |
| `theme`          | `"default" \| "primary" \| "secondary" \| "danger" \| "success" \| "warning" \| "info"` | `"default"` | 标签主题，`success`、`warning`、`info` 从 2.28.0 开始支持            |
| `variant`        | `"solid" \| "soft"`                                                                     | `"solid"`   | 实心背景或浅色背景，从 2.28.0 开始支持                               |
| `size`           | `"sm" \| "md" \| "lg"`                                                                  | `"sm"`      | 尺寸，图标与关闭按钮随之缩放，从 2.28.0 开始支持                     |
| `rounded`        | `boolean`                                                                               | `false`     | 是否显示为圆角标签                                                   |
| `closable`       | `boolean`                                                                               | `false`     | 是否显示内置关闭按钮，从 2.28.0 开始支持                             |
| `clickable`      | `boolean`                                                                               | `false`     | 是否显示为可点击标签，从 2.28.0 开始支持                             |
| `checkable`      | `boolean`                                                                               | `false`     | 是否可在点击时切换选中状态，从 2.28.0 开始支持                       |
| `checked`        | `boolean`                                                                               | `undefined` | 选中状态，传入时为受控模式，配合 `v-model:checked` 使用              |
| `defaultChecked` | `boolean`                                                                               | `false`     | 非受控模式下的初始选中状态，从 2.28.0 开始支持                       |
| `disabled`       | `boolean`                                                                               | `false`     | 是否禁用，从 2.28.0 开始支持                                         |
| `maxWidth`       | `string`                                                                                | `"12rem"`   | 最大宽度，超出时单行省略，同时不会超过父容器宽度，从 2.28.0 开始支持 |
| `title`          | `string`                                                                                | `undefined` | 悬浮提示内容，省略时仅在文本被截断后显示完整标签                     |
| `color`          | `string`                                                                                | `undefined` | 自定义背景色，文字颜色按亮度自动选择，从 2.28.0 开始支持             |
| `styles`         | `CSSProperties`                                                                         | `{}`        | 自定义样式，从 2.28.0 标记为废弃，请改用原生 `style` 属性或 `color`  |

## Emits

| 事件             | 参数         | 说明                                       |
| ---------------- | ------------ | ------------------------------------------ |
| `close`          | `MouseEvent` | 点击关闭按钮时触发                         |
| `click`          | `MouseEvent` | 点击标签时触发，禁用时不触发               |
| `update:checked` | `boolean`    | 选中状态变化时触发，配合 `v-model:checked` |
| `change`         | `boolean`    | 选中状态变化时触发                         |

## Slots

| 插槽        | 说明                             |
| ----------- | -------------------------------- |
| `default`   | 标签内容                         |
| `leftIcon`  | 左侧图标，尺寸随 `size` 自动调整 |
| `rightIcon` | 右侧图标，尺寸随 `size` 自动调整 |
