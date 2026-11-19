---
title: VModal 弹窗
description: 使用 VModal 在 Halo 插件中展示模态对话框，支持标题、页脚、全屏、居中以及点击遮罩关闭
---

`VModal` 是一个模态对话框容器，可以承载表单、详情或确认内容。需要在插件中展示复杂内容时使用它。

## 引入

```ts
import { VModal } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton, VModal } from "@halo-dev/components";

const visible = ref(false);
</script>

<template>
  <VButton type="primary" @click="visible = true">打开弹窗</VButton>

  <VModal v-model:visible="visible" title="编辑文章"> 这里是弹窗内容。 </VModal>
</template>
```

### 带页脚操作

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton, VModal, VSpace } from "@halo-dev/components";

const visible = ref(false);
</script>

<template>
  <VButton type="primary" @click="visible = true">打开弹窗</VButton>

  <VModal v-model:visible="visible" title="发布文章">
    文章发布后将对所有访客可见。
    <template #footer>
      <VSpace>
        <VButton type="primary" @click="visible = false">确认发布</VButton>
        <VButton @click="visible = false">取消</VButton>
      </VSpace>
    </template>
  </VModal>
</template>
```

### 点击遮罩关闭

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton, VModal } from "@halo-dev/components";

const visible = ref(false);
</script>

<template>
  <VButton @click="visible = true">打开弹窗</VButton>

  <VModal v-model:visible="visible" title="点击遮罩可关闭" layer-closable>
    也可以按 Esc 关闭。
  </VModal>
</template>
```

### 全屏

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton, VModal } from "@halo-dev/components";

const visible = ref(false);
</script>

<template>
  <VButton @click="visible = true">全屏打开</VButton>

  <VModal v-model:visible="visible" title="全屏弹窗" fullscreen>
    全屏弹窗适合放置代码编辑器或复杂表单。
  </VModal>
</template>
```

## Props

| 属性            | 类型       | 默认值      | 说明                             |
| --------------- | ---------- | ----------- | -------------------------------- |
| `visible`       | `boolean`  | `undefined` | 是否显示，支持 `v-model:visible` |
| `title`         | `string`   | `undefined` | 标题                             |
| `width`         | `number`   | `500`       | 最大宽度，单位像素               |
| `height`        | `string`   | `undefined` | 内容高度                         |
| `fullscreen`    | `boolean`  | `false`     | 是否全屏显示                     |
| `bodyClass`     | `string[]` | `undefined` | 应用到内容区域的 class 列表      |
| `mountToBody`   | `boolean`  | `false`     | 是否通过 Teleport 挂载到 `body`  |
| `centered`      | `boolean`  | `true`      | 是否在视口中垂直居中             |
| `layerClosable` | `boolean`  | `false`     | 是否允许点击遮罩关闭             |

## Emits

| 事件             | 参数      | 说明               |
| ---------------- | --------- | ------------------ |
| `update:visible` | `boolean` | 显示状态变化时触发 |
| `close`          | -         | 关闭时触发         |

## Slots

| 插槽      | 说明                             |
| --------- | -------------------------------- |
| `default` | 弹窗内容                         |
| `header`  | 自定义整个头部区域               |
| `center`  | 头部中间区域                     |
| `actions` | 头部右侧操作区域（关闭按钮之前） |
| `footer`  | 底部操作区域                     |
