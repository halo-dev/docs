---
title: VDropdown 下拉菜单
description: 使用 VDropdown、VDropdownItem 和 VDropdownDivider 在 Halo 插件界面中构建下拉操作菜单
---

下拉菜单用于收纳一组次要操作，点击触发元素后展开。

组件库重新导出了 [floating-vue](https://floating-vue.starpad.dev/guide/component.html) 的 `Dropdown` 组件，并基于它提供了 Halo 风格的菜单项和分割线。

## 引入

```ts
import {
  VDropdown,
  VDropdownDivider,
  VDropdownItem,
} from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { VButton, VDropdown, VDropdownItem, Toast } from "@halo-dev/components";

function handleSelect(action: string) {
  Toast.success(`选择了：${action}`);
}
</script>

<template>
  <VDropdown placement="bottom-start" :distance="6">
    <VButton>更多操作</VButton>
    <template #popper>
      <VDropdownItem @click="handleSelect('编辑')">编辑</VDropdownItem>
      <VDropdownItem @click="handleSelect('复制')">复制</VDropdownItem>
      <VDropdownItem @click="handleSelect('移动')">移动</VDropdownItem>
    </template>
  </VDropdown>
</template>
```

### 选中与禁用

```vue preview
<script lang="ts" setup>
import { VButton, VDropdown, VDropdownItem } from "@halo-dev/components";
</script>

<template>
  <VDropdown placement="bottom-start" :distance="6">
    <VButton>排序方式</VButton>
    <template #popper>
      <VDropdownItem selected>最近创建</VDropdownItem>
      <VDropdownItem>最近更新</VDropdownItem>
      <VDropdownItem disabled>访问量最多</VDropdownItem>
    </template>
  </VDropdown>
</template>
```

### 分割线与危险操作

```vue preview
<script lang="ts" setup>
import {
  VButton,
  VDropdown,
  VDropdownDivider,
  VDropdownItem,
} from "@halo-dev/components";
</script>

<template>
  <VDropdown placement="bottom-start" :distance="6">
    <VButton>操作</VButton>
    <template #popper>
      <VDropdownItem>查看详情</VDropdownItem>
      <VDropdownItem>导出</VDropdownItem>
      <VDropdownDivider />
      <VDropdownItem type="danger">删除</VDropdownItem>
    </template>
  </VDropdown>
</template>
```

### 带图标

```vue preview
<script lang="ts" setup>
import {
  IconDeleteBin,
  IconExternalLinkLine,
  IconSave,
  VButton,
  VDropdown,
  VDropdownItem,
} from "@halo-dev/components";
</script>

<template>
  <VDropdown placement="bottom-start" :distance="6">
    <VButton>操作</VButton>
    <template #popper>
      <VDropdownItem>
        <template #prefix-icon>
          <IconSave />
        </template>
        保存
      </VDropdownItem>
      <VDropdownItem>
        <template #prefix-icon>
          <IconExternalLinkLine />
        </template>
        在新窗口打开
      </VDropdownItem>
      <VDropdownItem type="danger">
        <template #prefix-icon>
          <IconDeleteBin />
        </template>
        删除
      </VDropdownItem>
    </template>
  </VDropdown>
</template>
```

## VDropdown Props

`VDropdown` 的完整属性请参考 [floating-vue 文档](https://floating-vue.starpad.dev/guide/component.html)，常用属性如下：

| 属性        | 类型       | 默认值               | 说明                                          |
| ----------- | ---------- | -------------------- | --------------------------------------------- |
| `placement` | `string`   | `"bottom"`           | 弹出位置，例如 `top`、`bottom-start`、`right` |
| `distance`  | `number`   | `0`                  | 弹出层与触发元素的距离                        |
| `triggers`  | `string[]` | `["hover", "focus"]` | 触发方式，可选 `hover`、`click`、`focus`      |
| `shown`     | `boolean`  | `false`              | 是否显示弹出层，支持 `v-model:shown`          |
| `disabled`  | `boolean`  | `false`              | 是否禁用                                      |
| `theme`     | `string`   | `"dropdown"`         | 弹出层主题                                    |

## VDropdownItem Props

| 属性       | 类型                    | 默认值      | 说明             |
| ---------- | ----------------------- | ----------- | ---------------- |
| `selected` | `boolean`               | `false`     | 是否显示选中样式 |
| `disabled` | `boolean`               | `false`     | 是否禁用         |
| `type`     | `"default" \| "danger"` | `"default"` | 菜单项类型       |

## Emits

| 组件            | 事件           | 参数         | 说明                                    |
| --------------- | -------------- | ------------ | --------------------------------------- |
| `VDropdownItem` | `click`        | `MouseEvent` | 点击菜单项时触发，`disabled` 时不会触发 |
| `VDropdown`     | `show`         | -            | 弹出层显示时触发                        |
| `VDropdown`     | `hide`         | -            | 弹出层隐藏时触发                        |
| `VDropdown`     | `update:shown` | `boolean`    | 弹出层显示状态变化时触发                |

## Slots

| 组件            | 插槽          | 说明           |
| --------------- | ------------- | -------------- |
| `VDropdown`     | `default`     | 触发元素       |
| `VDropdown`     | `popper`      | 弹出层内容     |
| `VDropdownItem` | `default`     | 菜单项内容     |
| `VDropdownItem` | `prefix-icon` | 菜单项左侧图标 |
| `VDropdownItem` | `suffix-icon` | 菜单项右侧图标 |

## 指令

`vClosePopper` 可以在弹出层内的元素上使用，点击后关闭当前弹出层。

```vue
<VButton v-close-popper>点击后关闭</VButton>
```
