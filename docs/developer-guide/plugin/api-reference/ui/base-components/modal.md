---
title: VModal 弹窗
description: 使用 VModal 在 Halo 插件中展示模态对话框，支持标题、页脚、全屏、自定义尺寸、关闭控制与关闭前确认
---

`VModal` 是一个模态对话框容器，可以承载表单、详情或确认内容。需要在插件中展示复杂内容时使用它。

从 2.28.0 开始，`VModal` 基于 [Reka UI](https://reka-ui.com/docs/components/dialog) 的 Dialog 原语构建，焦点陷阱、按 Esc 关闭、关闭后焦点还原和无障碍属性都由它负责，正文区域独立滚动。原有的属性和插槽保持不变，已有用法无需修改。

## 引入

```ts
import { VModal } from "@halo-dev/components";
```

在 Halo Console 中，弹窗通常由 `v-if` 控制显隐，需要主动关闭时通过组件实例的 `close()` 方法完成。

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton, VModal } from "@halo-dev/components";

const modal = ref<InstanceType<typeof VModal> | null>(null);
const visible = ref(false);
</script>

<template>
  <VButton type="primary" @click="visible = true">打开弹窗</VButton>

  <VModal v-if="visible" ref="modal" title="编辑文章" @close="visible = false">
    这里是弹窗内容。
    <template #footer>
      <VButton type="primary" @click="modal?.close()">关闭</VButton>
    </template>
  </VModal>
</template>
```

### 带页脚操作

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton, VModal, VSpace } from "@halo-dev/components";

const modal = ref<InstanceType<typeof VModal> | null>(null);
const visible = ref(false);
</script>

<template>
  <VButton type="primary" @click="visible = true">打开弹窗</VButton>

  <VModal v-if="visible" ref="modal" title="发布文章" @close="visible = false">
    文章发布后将对所有访客可见。
    <template #footer>
      <VSpace>
        <VButton type="primary" @click="modal?.close()">确认发布</VButton>
        <VButton @click="modal?.close()">取消</VButton>
      </VSpace>
    </template>
  </VModal>
</template>
```

### 头部操作

从 2.28.0 开始，`actions` 插槽只负责布局，不再为其内部的裸 `<span>` 元素提供按钮样式，也不在鼠标悬停头部时隐藏操作项。插槽中应使用 `VButton`，否则操作项不会有按钮外观。弹窗自带的关闭按钮同样是一个 `VButton`。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import {
  IconArrowLeft,
  IconArrowRight,
  VButton,
  VModal,
} from "@halo-dev/components";

const visible = ref(false);
</script>

<template>
  <VButton type="primary" @click="visible = true">打开弹窗</VButton>

  <VModal v-if="visible" title="浏览图片" @close="visible = false">
    这里可以放置上一张、下一张等头部操作。
    <template #actions>
      <VButton label="上一张" variant="ghost" size="sm">
        <template #icon>
          <IconArrowLeft />
        </template>
      </VButton>
      <VButton label="下一张" variant="ghost" size="sm">
        <template #icon>
          <IconArrowRight />
        </template>
      </VButton>
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

  <VModal
    v-if="visible"
    title="点击遮罩可关闭"
    layer-closable
    @close="visible = false"
  >
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

  <VModal v-if="visible" title="全屏弹窗" fullscreen @close="visible = false">
    全屏弹窗适合放置代码编辑器或复杂表单。
  </VModal>
</template>
```

### 自定义尺寸

`width` 设置最大宽度，`height` 设置内容高度。两者都接受数字或 CSS 长度：数字按像素处理，字符串按原样应用，因此可以写 `calc(100vh - 12rem)`、`min(720px, 100%)` 这类表达式。`fullscreen` 为 `true` 时这两个属性会被忽略。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton, VModal } from "@halo-dev/components";

const visible = ref(false);
</script>

<template>
  <VButton type="primary" @click="visible = true">打开宽弹窗</VButton>

  <VModal
    v-if="visible"
    title="宽弹窗"
    width="min(720px, 100%)"
    height="20rem"
    @close="visible = false"
  >
    宽度和高度都可以使用 CSS 长度，内容区域在超出高度时独立滚动。
  </VModal>
</template>
```

### 关闭控制

内置关闭按钮可以用 `showClose` 隐藏，例如底部已经有明确的取消按钮时；`closeLabel` 用于替换该按钮的无障碍名称。按 Esc 关闭由 `closeOnEsc` 控制，点击遮罩关闭由 `layerClosable` 控制。`layerClosable` 为 `false` 时，点击遮罩不会关闭弹窗，只给弹窗一个轻微的缩放反馈。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton, VModal, VSpace } from "@halo-dev/components";

const visible = ref(false);
</script>

<template>
  <VButton type="primary" @click="visible = true">打开弹窗</VButton>

  <VModal
    v-if="visible"
    title="只能通过按钮关闭"
    :show-close="false"
    :close-on-esc="false"
    @close="visible = false"
  >
    关闭按钮和 Esc 都已关闭，只能使用底部操作离开。
    <template #footer>
      <VSpace>
        <VButton type="primary" @click="visible = false">我知道了</VButton>
      </VSpace>
    </template>
  </VModal>
</template>
```

### 无标题弹窗

没有 `title` 且没有 `header` 插槽时，弹窗需要 `ariaLabel` 提供无障碍名称，否则屏幕阅读器只会读到组件库的默认名称，例如图片浏览这类头部完全自定义的弹窗。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton, VModal } from "@halo-dev/components";

const visible = ref(false);
</script>

<template>
  <VButton @click="visible = true">打开无标题弹窗</VButton>

  <VModal
    v-if="visible"
    aria-label="图片预览"
    width="min(640px, 100%)"
    @close="visible = false"
  >
    没有可见标题时，`ariaLabel` 会作为弹窗的无障碍名称。
  </VModal>
</template>
```

### 关闭前确认

`beforeClose` 在关闭前调用。返回 `false` 或解析为 `false` 的 Promise 时弹窗保持打开，可以用来提示未保存的修改。点击关闭按钮、按 Esc、点击遮罩和调用 `close()` 都会经过它；关闭请求尚未结束时重复触发不会重复执行。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { Dialog, VButton, VModal } from "@halo-dev/components";

const visible = ref(false);
const content = ref("");

function beforeClose() {
  if (!content.value.trim()) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    Dialog.warning({
      title: "放弃未保存的内容",
      description: "关闭后当前填写的内容会丢失，确定继续吗？",
      confirmText: "放弃",
      confirmType: "danger",
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
}
</script>

<template>
  <VButton type="primary" @click="visible = true">打开弹窗</VButton>

  <VModal
    v-if="visible"
    title="关闭前确认"
    :before-close="beforeClose"
    @close="visible = false"
  >
    <input
      v-model="content"
      class="block h-9 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      placeholder="填写一些内容后再关闭"
      type="text"
    />
  </VModal>
</template>
```

## Props

| 属性            | 类型                                | 默认值      | 说明                                                            |
| --------------- | ----------------------------------- | ----------- | --------------------------------------------------------------- |
| `visible`       | `boolean`                           | `undefined` | 是否显示，支持 `v-model:visible`；不传时组件挂载即显示          |
| `title`         | `string`                            | `undefined` | 标题                                                            |
| `ariaLabel`     | `string`                            | `undefined` | 没有可见标题时用于无障碍名称，缺省依次回退到 `title` 和内置名称 |
| `width`         | `number \| string`                  | `500`       | 最大宽度：数字按像素，字符串为 CSS 长度                         |
| `height`        | `number \| string`                  | `undefined` | 内容高度：数字按像素，字符串为 CSS 长度                         |
| `fullscreen`    | `boolean`                           | `false`     | 是否全屏显示                                                    |
| `bodyClass`     | `string[]`                          | `undefined` | 应用到内容区域的 class 列表                                     |
| `mountToBody`   | `boolean`                           | `false`     | 是否通过 Teleport 挂载到 `body`                                 |
| `centered`      | `boolean`                           | `true`      | 是否在视口中垂直居中                                            |
| `layerClosable` | `boolean`                           | `false`     | 是否允许点击遮罩关闭                                            |
| `closeOnEsc`    | `boolean`                           | `true`      | 按 Esc 是否关闭弹窗                                             |
| `showClose`     | `boolean`                           | `true`      | 是否显示内置关闭按钮                                            |
| `closeLabel`    | `string`                            | `undefined` | 关闭按钮的无障碍名称，未设置时使用组件库内置文案                |
| `beforeClose`   | `() => boolean \| Promise<boolean>` | `undefined` | 关闭前调用，返回 `false` 时保持打开                             |
| `unmountOnHide` | `boolean`                           | `false`     | 关闭后是否卸载内容；为 `false` 时保留内容，供下次打开复用       |

## Emits

| 事件             | 参数      | 说明                             |
| ---------------- | --------- | -------------------------------- |
| `update:visible` | `boolean` | 显示状态变化时触发               |
| `close`          | -         | 关闭时触发，在退场动画结束后发出 |

## Slots

| 插槽      | 说明                                                          |
| --------- | ------------------------------------------------------------- |
| `default` | 弹窗内容                                                      |
| `header`  | 自定义整个头部区域                                            |
| `center`  | 头部中间区域                                                  |
| `actions` | 头部右侧操作区域（关闭按钮之前），请使用 `VButton` 放置操作项 |
| `footer`  | 底部操作区域                                                  |

## 暴露的方法

| 方法      | 说明                            |
| --------- | ------------------------------- |
| `close()` | 关闭弹窗，受 `beforeClose` 约束 |

## 交互与无障碍

- 弹窗使用 Dialog 语义，标题会渲染为 `DialogTitle`；没有可见标题时自动补充视觉隐藏的标题，屏幕阅读器仍能得到名称。`aria-label`、`aria-labelledby` 等 `aria-*` 属性与 `role` 会应用到弹窗内容元素，其余属性仍落在外层包裹元素上。
- 打开时焦点进入弹窗并落在弹窗容器本身，而不是第一个可聚焦元素，避免头部操作按钮的聚焦样式和悬停提示在打开瞬间被触发；关闭后焦点回到打开前的元素。
- 点击关闭按钮、按 Esc、点击遮罩和调用 `close()` 都会经过 `beforeClose`；`beforeClose` 抛错时弹窗保持打开并在控制台记录错误。
- 正文区域使用 OverlayScrollbars 独立滚动，内容超出 `height` 时不会撑破弹窗，滚动的轨道也不会溢出弹窗圆角。
