---
title: VDrawer 抽屉
description: 使用 VDrawer 在 Halo 插件中从屏幕边缘展开次级任务面板，支持四个方向、自定义尺寸、内嵌模式、底部吸附点与拖拽关闭
---

`VDrawer` 从视口边缘滑出一块面板，适合承载次级任务和上下文操作，例如在不离开当前列表的情况下编辑某一条内容的设置。它在移动端也支持从底部拖拽展开和关闭。

需要居中的对话框时使用 [VModal](./modal.md)。`VDrawer` 基于 [Reka UI](https://reka-ui.com/docs/components/dialog) 的 Dialog 原语构建（Reka UI 没有独立的 Drawer 原语），因此同样具备焦点陷阱、关闭后焦点还原和配套的无障碍属性。

**引入版本**：2.28.0

## 引入

```ts
import { VDrawer } from "@halo-dev/components";
```

## 示例

### 基础用法

使用 `v-model:visible` 控制显隐，默认从右侧滑出。`default` 插槽是正文区域，`footer` 插槽放置底部操作。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton, VDrawer, VSpace } from "@halo-dev/components";

const visible = ref(false);
</script>

<template>
  <VButton type="primary" @click="visible = true">打开抽屉</VButton>

  <VDrawer
    v-model:visible="visible"
    title="文章设置"
    description="调整发布选项和展示方式"
  >
    <div class="space-y-3 text-sm text-gray-600">
      <p>抽屉适合承载次级任务，不会打断当前的阅读和编辑流程。</p>
      <p>头部和底部固定，正文区域独立滚动，内容再长也不会撑破抽屉。</p>
    </div>

    <template #footer>
      <VSpace spacing="sm">
        <VButton type="primary" @click="visible = false">保存</VButton>
        <VButton @click="visible = false">取消</VButton>
      </VSpace>
    </template>
  </VDrawer>
</template>
```

### 不同方向

`placement` 支持 `right`、`left`、`top`、`bottom`，默认 `right`。`size` 在左右方向作用于宽度，在上下方向作用于高度。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton, VDrawer, VSpace } from "@halo-dev/components";

const visible = ref(false);
const placement = ref<"left" | "right" | "top" | "bottom">("right");
const labels = {
  left: "从左侧滑出",
  right: "从右侧滑出",
  top: "从顶部滑出",
  bottom: "从底部滑出",
} as const;

function open(value: keyof typeof labels) {
  placement.value = value;
  visible.value = true;
}
</script>

<template>
  <VSpace>
    <VButton v-for="(label, value) in labels" :key="value" @click="open(value)">
      {{ label }}
    </VButton>
  </VSpace>

  <VDrawer v-model:visible="visible" :placement="placement" title="方向示例">
    <p class="text-sm text-gray-600">当前方向：{{ placement }}</p>
  </VDrawer>
</template>
```

### 自定义尺寸

`size` 接受数字或 CSS 长度。数字按像素处理，左右方向默认 `400px`，上下方向默认根据内容自适应高度。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton, VDrawer } from "@halo-dev/components";

const visible = ref(false);
</script>

<template>
  <VButton type="primary" @click="visible = true">打开宽抽屉</VButton>

  <VDrawer v-model:visible="visible" :size="720" title="宽抽屉">
    <p class="text-sm text-gray-600">
      使用数字时单位为像素，也可以传入 24rem、50% 等 CSS 长度。
    </p>
  </VDrawer>
</template>
```

### 内嵌模式

设置 `inset` 后，抽屉会与视口边缘保持 16px 间距并带圆角，看起来像浮在页面上方。该效果从 `sm` 断点（640px）开始生效，更小的屏幕仍然贴边展开。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton, VDrawer } from "@halo-dev/components";

const visible = ref(false);
</script>

<template>
  <VButton type="primary" @click="visible = true">打开内嵌抽屉</VButton>

  <VDrawer v-model:visible="visible" inset :size="420" title="内嵌抽屉">
    <p class="text-sm text-gray-600">
      在宽屏下与视口保持间距，移动端自动改为贴边。
    </p>
  </VDrawer>
</template>
```

### 非模态

默认是模态抽屉：显示遮罩、锁定页面滚动并捕获焦点。把 `modal` 设为 `false` 后，抽屉展开时页面其余区域仍可交互，适合边看页面边操作的场景。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton, VDrawer } from "@halo-dev/components";

const visible = ref(false);
</script>

<template>
  <VButton type="primary" @click="visible = true">打开非模态抽屉</VButton>

  <VDrawer
    v-model:visible="visible"
    :modal="false"
    :size="360"
    title="非模态抽屉"
  >
    <p class="text-sm text-gray-600">没有遮罩，也不会锁定页面滚动。</p>
  </VDrawer>
</template>
```

### 底部吸附点

底部抽屉可以设置 `snapPoints`，让面板停在不同的高度。小于等于 `1` 的数字表示视口高度的比例（`1` 为整屏），大于 `1` 的数字按像素处理，字符串支持 `px`、`rem`、`em`、`vh` 和 `%`。

拖拽时面板会落到最近的吸附点，快速滑动则按方向和速度决定移动或关闭；`snapToSequentialPoints` 可以把一次拖拽限制为只移动一个吸附点。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton, VDrawer } from "@halo-dev/components";

const visible = ref(false);
const snapPoint = ref<number | string>(0.4);
</script>

<template>
  <VButton type="primary" @click="visible = true">打开吸附抽屉</VButton>

  <VDrawer
    v-model:visible="visible"
    v-model:snap-point="snapPoint"
    placement="bottom"
    :snap-points="[0.4, 0.75, 1]"
    show-handle
    title="底部抽屉"
  >
    <p class="text-sm text-gray-600">当前吸附点：{{ snapPoint }}</p>
    <p class="mt-2 text-sm text-gray-600">向上拖动可展开到更高的吸附点。</p>
  </VDrawer>
</template>
```

### 关闭前确认

`beforeClose` 在关闭前调用。返回 `false` 或解析为 `false` 的 Promise 时抽屉保持打开，可以用来提示未保存的修改。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { Dialog, VButton, VDrawer } from "@halo-dev/components";

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
  <VButton type="primary" @click="visible = true">打开抽屉</VButton>

  <VDrawer
    v-model:visible="visible"
    :before-close="beforeClose"
    title="关闭前确认"
  >
    <input
      v-model="content"
      class="block h-9 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      placeholder="填写一些内容后再关闭"
      type="text"
    />
  </VDrawer>
</template>
```

## Props

| 属性                     | 类型                                | 默认值      | 说明                                                                          |
| ------------------------ | ----------------------------------- | ----------- | ----------------------------------------------------------------------------- |
| `visible`                | `boolean`                           | `undefined` | 受控的显示状态，支持 `v-model:visible`；省略时由组件自己维护                  |
| `defaultVisible`         | `boolean`                           | `false`     | 非受控模式下的初始显示状态                                                    |
| `placement`              | `DrawerPlacement`                   | `"right"`   | 抽屉贴靠的视口边缘，可选 `left`、`right`、`top`、`bottom`                     |
| `size`                   | `number \| string`                  | `undefined` | 抽屉尺寸：数字按像素，字符串为 CSS 长度；左右方向默认 `400px`，上下方向自适应 |
| `title`                  | `string`                            | `undefined` | 标题                                                                          |
| `description`            | `string`                            | `undefined` | 标题下方的描述                                                                |
| `ariaLabel`              | `string`                            | `undefined` | 没有可见标题时用于无障碍名称，缺省依次回退到 `title` 和内置名称               |
| `modal`                  | `boolean`                           | `true`      | 是否为模态抽屉；模态时显示遮罩、锁定页面滚动并捕获焦点                        |
| `inset`                  | `boolean`                           | `false`     | 是否与视口边缘保留间距并带圆角，从 `sm` 断点（640px）开始生效                 |
| `layerClosable`          | `boolean`                           | `true`      | 点击遮罩是否关闭抽屉                                                          |
| `closeOnEsc`             | `boolean`                           | `true`      | 按 Esc 是否关闭抽屉                                                           |
| `beforeClose`            | `() => boolean \| Promise<boolean>` | `undefined` | 关闭前调用，返回 `false` 时保持打开                                           |
| `showClose`              | `boolean`                           | `true`      | 是否显示内置关闭按钮                                                          |
| `closeLabel`             | `string`                            | `undefined` | 关闭按钮的无障碍名称，未设置时使用组件库内置文案                              |
| `showHandle`             | `boolean`                           | `false`     | 是否显示顶部拖拽条                                                            |
| `swipeToDismiss`         | `boolean`                           | `true`      | 是否允许通过拖拽关闭抽屉                                                      |
| `handleOnly`             | `boolean`                           | `false`     | 是否只允许从拖拽条和头部开始拖拽；触摸输入始终只响应这两个区域                |
| `swipeThreshold`         | `number`                            | `0.25`      | 拖拽超过抽屉尺寸的该比例后关闭                                                |
| `snapPoints`             | `DrawerSnapPoint[]`                 | `undefined` | 底部抽屉的吸附点，按高度从小到大排序并去重                                    |
| `snapPoint`              | `DrawerSnapPoint`                   | `undefined` | 受控的当前吸附点，支持 `v-model:snap-point`                                   |
| `defaultSnapPoint`       | `DrawerSnapPoint`                   | `undefined` | 非受控模式下的初始吸附点，默认为最高的吸附点                                  |
| `snapToSequentialPoints` | `boolean`                           | `false`     | 是否把一次拖拽限制为只移动一个吸附点                                          |
| `mountToBody`            | `boolean`                           | `true`      | 是否通过 Teleport 挂载到 `body`                                               |
| `unmountOnHide`          | `boolean`                           | `true`      | 关闭后是否卸载内容                                                            |
| `bodyClass`              | `string[]`                          | `undefined` | 应用到正文滚动区域的 class 列表                                               |
| `contentClass`           | `string[]`                          | `undefined` | 追加到抽屉面板的 class 列表，用于覆盖默认样式                                 |

`DrawerSnapPoint` 为 `number | string`。`0 < number <= 1` 表示视口高度的比例，大于 `1` 的数字按像素处理；字符串支持 `px`、`rem`、`em`、`vh` 和 `%`，无法解析或小于等于 `0` 的值会被忽略。

## Slots

| 插槽          | 说明                                                       |
| ------------- | ---------------------------------------------------------- |
| `default`     | 正文内容，区域独立滚动                                     |
| `header`      | 整个头部区域；提供后会替换内置的标题、描述、操作和关闭按钮 |
| `title`       | 标题内容，默认为 `title` 属性                              |
| `description` | 描述内容，默认为 `description` 属性                        |
| `actions`     | 头部右侧、关闭按钮之前的操作区                             |
| `footer`      | 底部操作区，仅在提供插槽时渲染                             |
| `handle`      | 拖拽条内容，替换默认的短横条                               |

## Emits

| 事件               | 参数              | 说明                 |
| ------------------ | ----------------- | -------------------- |
| `update:visible`   | `boolean`         | 显示状态变化时触发   |
| `update:snapPoint` | `DrawerSnapPoint` | 当前吸附点变化时触发 |
| `open`             | -                 | 抽屉打开后触发       |
| `close`            | -                 | 抽屉关闭后触发       |

## 暴露的方法

| 方法            | 说明                                    |
| --------------- | --------------------------------------- |
| `open()`        | 打开抽屉                                |
| `close()`       | 关闭抽屉，受 `beforeClose` 约束         |
| `snapTo(index)` | 切换到指定序号的吸附点，序号从 `0` 开始 |

## 交互与无障碍

- 抽屉使用 Dialog 语义，标题和描述会渲染为 `DialogTitle` 和 `DialogDescription`；没有可见标题或描述时，会补充视觉隐藏的文本，屏幕阅读器仍能得到名称。
- 模态抽屉会把焦点限制在面板内，关闭后焦点回到打开前的元素。设置 `layerClosable` 为 `false` 时，点击面板外或聚焦到面板外都不会关闭抽屉。
- 点击遮罩、按 Esc、点击关闭按钮都会经过 `beforeClose`；关闭请求尚未结束时重复触发不会重复执行。
- 拖拽在指针抬起后按方向和速度结算：超过 `swipeThreshold` 或快速滑动会关闭抽屉，否则回到最近的吸附点。用户开启「减少动态效果」时，过渡动画会被简化。

## 与 VModal 的关系

`VModal` 仍然是居中的模态对话框，适合确认和填写表单；`VDrawer` 从屏幕边缘展开，适合需要保留上下文的长表单或详情面板。两者的关闭流程类似，`VDrawer` 额外提供四个方向、内嵌模式、底部吸附点和拖拽关闭。
