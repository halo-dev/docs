---
title: VPopover 浮层
description: 使用 VPopover 在 Halo 插件中展开包含表单、提示或设置内容的浮动面板，支持受控打开状态、多种弹出位置和与触发器等宽
---

`VPopover` 用于在触发元素旁展开一块内容面板，适合放置输入框、表单、设置项或提示内容这类需要交互的富内容。

操作菜单仍然使用 [VDropdown](./dropdown.md)，它更适合一组简单的菜单项。`VPopover` 基于 [Reka UI](https://reka-ui.com/docs/components/popover) 的 Popover 构建，提供碰撞检测、按 Esc 或点击外部关闭、关闭后焦点回到触发器以及配套的无障碍属性。

**引入版本**：2.28.0

## 引入

```ts
import { VPopover } from "@halo-dev/components";
```

## 示例

### 基础用法

默认插槽是触发元素，`content` 插槽是面板内容，插槽参数里的 `close` 可以关闭面板。

```vue preview
<script lang="ts" setup>
import { Toast, VButton, VPopover } from "@halo-dev/components";
import { ref } from "vue";

const name = ref("Halo");

function save(close: () => void) {
  Toast.success(`已保存为 ${name.value}`);
  close();
}
</script>

<template>
  <VPopover>
    <VButton>重命名</VButton>
    <template #content="{ close }">
      <div class="w-64 space-y-3 p-3">
        <label
          class="block text-sm font-medium text-gray-900"
          for="popover-name"
        >
          显示名称
        </label>
        <input
          id="popover-name"
          v-model="name"
          class="block h-9 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          type="text"
        />
        <div class="flex justify-end gap-2">
          <VButton type="secondary" @click="close">取消</VButton>
          <VButton type="primary" @click="save(close)">保存</VButton>
        </div>
      </div>
    </template>
  </VPopover>
</template>
```

### 受控打开状态

使用 `v-model:open` 可以自己控制面板的打开状态，例如在触发元素上同步显示文字。

```vue preview
<script lang="ts" setup>
import { VButton, VPopover } from "@halo-dev/components";
import { ref } from "vue";

const open = ref(false);
</script>

<template>
  <VPopover v-model:open="open">
    <VButton>{{ open ? "收起设置" : "打开设置" }}</VButton>
    <template #content>
      <div class="w-56 p-3 text-sm text-gray-600">
        面板内容由外部的 <code>open</code> 控制。
      </div>
    </template>
  </VPopover>
</template>
```

也可以通过组件实例的 `show()` 和 `hide()` 打开或关闭面板。

### 与触发器等宽

设置 `match-trigger-width` 后，面板宽度会跟随触发元素，适合下拉式选择面板。

```vue preview
<script lang="ts" setup>
import { VButton, VPopover } from "@halo-dev/components";
</script>

<template>
  <div class="w-64">
    <VPopover match-trigger-width>
      <VButton block>选择选项</VButton>
      <template #content>
        <div class="p-2 text-sm text-gray-600">面板宽度与触发器一致。</div>
      </template>
    </VPopover>
  </div>
</template>
```

### 调整面板内边距

面板默认带有 `1.5` 的内边距。需要让内容贴边时，可以通过 `contentClass` 覆盖默认样式。

```vue preview
<script lang="ts" setup>
import { VButton, VPopover } from "@halo-dev/components";
</script>

<template>
  <VPopover content-class="!p-0">
    <VButton>查看详情</VButton>
    <template #content>
      <div class="w-56 p-3 text-sm text-gray-600">
        这段内容使用自己的内边距，面板本身不再留白。
      </div>
    </template>
  </VPopover>
</template>
```

## Props

| 属性                | 类型                                            | 默认值           | 说明                                                           |
| ------------------- | ----------------------------------------------- | ---------------- | -------------------------------------------------------------- |
| `open`              | `boolean`                                       | `undefined`      | 受控的打开状态，支持 `v-model:open`；省略时由组件自己维护      |
| `disabled`          | `boolean`                                       | `false`          | 是否禁用触发器，禁用时不会打开面板                             |
| `placement`         | `VPopoverPlacement`                             | `"bottom-start"` | 弹出位置，可选 12 个方向；空间不足时由碰撞检测自动调整         |
| `offset`            | `number`                                        | `4`              | 触发器与箭头尖端的距离（像素），关闭箭头时即与面板的距离       |
| `modal`             | `boolean`                                       | `false`          | 是否以模态方式打开，打开时阻止与页面其余部分交互               |
| `arrow`             | `boolean`                                       | `true`           | 是否显示指向触发器的箭头                                       |
| `matchTriggerWidth` | `boolean`                                       | `false`          | 面板宽度是否与触发元素一致                                     |
| `contentClass`      | `string \| string[] \| Record<string, boolean>` | `undefined`      | 追加到面板的类名，用于覆盖默认样式，例如 `!p-0` 去掉默认内边距 |

`placement` 的可选值为 `top`、`top-start`、`top-end`、`right`、`right-start`、`right-end`、`bottom`、`bottom-start`、`bottom-end`、`left`、`left-start`、`left-end`。

## Slots

| 插槽      | 参数                   | 说明                                       |
| --------- | ---------------------- | ------------------------------------------ |
| `default` | `open`、`show`、`hide` | 触发元素，组件会把触发行为渲染到插槽根元素 |
| `content` | `open`、`close`        | 面板内容，`close` 用于关闭面板             |

触发元素插槽只应包含一个根元素。组件以 `as-child` 方式渲染触发器，因此直接在插槽里放 `VButton` 时，它的 `type` 等属性不会被覆盖。

## 暴露的方法

| 方法     | 说明     |
| -------- | -------- |
| `show()` | 打开面板 |
| `hide()` | 关闭面板 |

## 交互与无障碍

- 触发器带有 `aria-haspopup="dialog"`、`aria-expanded` 和 `aria-controls`，屏幕阅读器可以获知面板状态。
- 按 Esc 或点击面板外部会关闭面板，关闭后焦点回到触发元素。
- 面板位置由 Reka UI 的碰撞检测计算，靠近视口边缘时会自动翻转或偏移。

## 与 VDropdown 的关系

已有 `VDropdown` 的用法不受影响，操作菜单仍然推荐使用 `VDropdown`。需要放置表单、输入框等富内容时改用 `VPopover`，以便获得更合适的键盘行为和无障碍语义，可以按需逐步迁移。
