---
title: VAccordion 折叠面板
description: 使用 VAccordion 和 VAccordionItem 在 Halo 插件中分组展示可展开收起的内容，支持单开、多开、受控展开状态与朴素样式
---

`VAccordion` 用于把内容分组收起到一组标题下，点击标题展开对应内容，适合设置表单、常见问题或较长的说明文字。

需要在一行内切换内容时使用 [VTabs](./tabs.md)。`VAccordion` 基于 [Reka UI](https://reka-ui.com/docs/components/accordion) 的 Accordion 构建，提供键盘操作、`aria-expanded` 等无障碍属性，以及展开和收起的动画。

**引入版本**：2.28.0

## 引入

```ts
import { VAccordion, VAccordionItem } from "@halo-dev/components";
```

## 示例

### 基础用法

`VAccordion` 包裹若干 `VAccordionItem`，每个 `VAccordionItem` 通过 `value` 标识自己，`title` 是标题文字。

```vue
<script lang="ts" setup>
import { VAccordion, VAccordionItem } from "@halo-dev/components";
</script>

<template>
  <VAccordion type="single" collapsible>
    <VAccordionItem value="general" title="通用设置">
      <p class="text-sm text-gray-600">在这里配置通用选项。</p>
    </VAccordionItem>
    <VAccordionItem value="publishing" title="发布设置">
      <p class="text-sm text-gray-600">在这里配置发布选项。</p>
    </VAccordionItem>
    <VAccordionItem value="advanced" title="高级设置">
      <p class="text-sm text-gray-600">在这里配置高级选项。</p>
    </VAccordionItem>
  </VAccordion>
</template>
```

`type="single"` 时同时只展开一项，`collapsible` 表示允许再次点击已展开的标题收起。默认的 `bordered` 样式渲染为带边框的卡片列表。

### 同时展开多项

设置 `type="multiple"` 后可以同时展开多项，此时 `modelValue` 是数组。下面的例子通过 `default-value` 指定初始展开的项。

```vue
<script lang="ts" setup>
import { VAccordion, VAccordionItem } from "@halo-dev/components";
</script>

<template>
  <VAccordion type="multiple" :default-value="['general', 'publishing']">
    <VAccordionItem value="general" title="通用设置">
      <p class="text-sm text-gray-600">在这里配置通用选项。</p>
    </VAccordionItem>
    <VAccordionItem value="publishing" title="发布设置">
      <p class="text-sm text-gray-600">在这里配置发布选项。</p>
    </VAccordionItem>
    <VAccordionItem value="advanced" title="高级设置">
      <p class="text-sm text-gray-600">在这里配置高级选项。</p>
    </VAccordionItem>
  </VAccordion>
</template>
```

### 受控展开状态

使用 `v-model` 可以读取和控制展开的项。`single` 模式下的值是字符串，`multiple` 模式下是字符串数组，没有展开项时为 `undefined`。

```vue
<script lang="ts" setup>
import { computed, ref } from "vue";
import { VAccordion, VAccordionItem, VSpace } from "@halo-dev/components";

const open = ref<string | string[] | undefined>("comments");

const openLabel = computed(() => {
  if (!open.value) {
    return "没有展开的分组";
  }
  return Array.isArray(open.value)
    ? `展开 ${open.value.length} 项`
    : `展开 ${open.value}`;
});
</script>

<template>
  <VSpace direction="column" align="start">
    <span class="text-sm text-gray-500">{{ openLabel }}</span>
    <VAccordion v-model="open" type="single" collapsible>
      <VAccordionItem value="comments" title="评论设置">
        <p class="text-sm text-gray-600">在这里配置评论选项。</p>
      </VAccordionItem>
      <VAccordionItem value="seo" title="SEO 设置">
        <p class="text-sm text-gray-600">在这里配置搜索引擎优化选项。</p>
      </VAccordionItem>
    </VAccordion>
  </VSpace>
</template>
```

### 在卡片或表单中使用

在已有卡片或表单内部使用时，设置 `variant="plain"` 去掉容器边框和背景，只保留分组之间的分隔线。同时设置 `header-as="div"`，避免折叠项被渲染成标题而进入文档大纲。

```vue
<script lang="ts" setup>
import { VAccordion, VAccordionItem } from "@halo-dev/components";
</script>

<template>
  <div class="rounded-base border border-[#eaecf0] bg-white p-4">
    <VAccordion variant="plain" type="single" collapsible>
      <VAccordionItem value="metadata" title="元数据" header-as="div">
        <p class="text-sm text-gray-600">折叠收起后内容仍然保持挂载。</p>
        <input
          class="mt-2 block h-9 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900"
          placeholder="元数据值"
        />
      </VAccordionItem>
      <VAccordionItem value="advanced" title="高级设置" header-as="div">
        <p class="text-sm text-gray-600">在这里配置高级选项。</p>
      </VAccordionItem>
    </VAccordion>
  </div>
</template>
```

### 自定义标题与图标

使用 `trigger` 插槽替换标题内容，使用 `icon` 插槽替换右侧的箭头图标，插槽参数里都有当前项的 `open` 状态。

```vue
<script lang="ts" setup>
import { VAccordion, VAccordionItem } from "@halo-dev/components";
</script>

<template>
  <VAccordion type="single" collapsible>
    <VAccordionItem value="custom">
      <template #trigger="{ open }">
        <span class="font-medium">
          {{ open ? "收起自定义字段" : "添加自定义字段" }}
        </span>
      </template>
      <p class="text-sm text-gray-600">触发器可以渲染任意内容。</p>
    </VAccordionItem>
  </VAccordion>
</template>
```

### 禁用

给 `VAccordion` 设置 `disabled` 会禁用其中的所有项；也可以只在某个 `VAccordionItem` 上设置 `disabled`。

```vue
<script lang="ts" setup>
import { VAccordion, VAccordionItem } from "@halo-dev/components";
</script>

<template>
  <VAccordion type="single" collapsible>
    <VAccordionItem value="locked" title="不可编辑的分组" disabled>
      <p class="text-sm text-gray-600">这一组内容暂时不能展开。</p>
    </VAccordionItem>
    <VAccordionItem value="editable" title="可编辑的分组">
      <p class="text-sm text-gray-600">这一组可以正常展开。</p>
    </VAccordionItem>
  </VAccordion>
</template>
```

## 内容挂载

收起的内容默认不会被卸载（`unmountOnHide` 默认为 `false`），因此折叠起来再展开时，里面的表单仍保留已填写的内容。内容很多的列表可以用 `unmount-on-hide` 按需卸载，或给某一项设置 `force-mount` 强制保留。

## VAccordion Props

| 属性            | 类型                     | 默认值       | 说明                                                                    |
| --------------- | ------------------------ | ------------ | ----------------------------------------------------------------------- |
| `type`          | `"single" \| "multiple"` | `undefined`  | 展开模式：`single` 同时只展开一项，`multiple` 可同时展开多项            |
| `collapsible`   | `boolean`                | `false`      | `single` 模式下是否允许再次点击已展开项将其收起                         |
| `modelValue`    | `string \| string[]`     | `undefined`  | 当前展开项的 `value`，支持 `v-model`                                    |
| `defaultValue`  | `string \| string[]`     | `undefined`  | 非受控使用时初始展开的项                                                |
| `disabled`      | `boolean`                | `false`      | 是否禁用整个面板                                                        |
| `unmountOnHide` | `boolean`                | `false`      | 收起后是否卸载内容                                                      |
| `variant`       | `"bordered" \| "plain"`  | `"bordered"` | 外观：`bordered` 为带边框的卡片列表，`plain` 去掉容器装饰，适合嵌入卡片 |

## VAccordionItem Props

| 属性            | 类型                                                              | 默认值      | 说明                                                  |
| --------------- | ----------------------------------------------------------------- | ----------- | ----------------------------------------------------- |
| `value`         | `string`                                                          | 必填        | 项的唯一标识，与 `v-model` 的值对应                   |
| `title`         | `string`                                                          | `undefined` | 标题文字，需要自定义内容时使用 `trigger` 插槽         |
| `disabled`      | `boolean`                                                         | `false`     | 是否禁用该项                                          |
| `headerAs`      | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" \| "div" \| "span"` | `"h3"`      | 包裹标题的标签，嵌入卡片时可用 `div` 避免影响文档大纲 |
| `unmountOnHide` | `boolean`                                                         | `undefined` | 覆盖根组件的同名设置                                  |
| `forceMount`    | `boolean`                                                         | `false`     | 收起时也保留内容挂载                                  |
| `triggerClass`  | `string \| string[] \| Record<string, boolean>`                   | `undefined` | 标题区域的附加类名                                    |
| `contentClass`  | `string \| string[] \| Record<string, boolean>`                   | `undefined` | 内容区域的附加类名                                    |

## Emits

| 组件         | 事件                | 参数                              | 说明             |
| ------------ | ------------------- | --------------------------------- | ---------------- |
| `VAccordion` | `update:modelValue` | `string \| string[] \| undefined` | 展开项变化时触发 |

## Slots

| 组件             | 插槽      | 参数       | 说明                           |
| ---------------- | --------- | ---------- | ------------------------------ |
| `VAccordion`     | `default` | —          | `VAccordionItem` 列表          |
| `VAccordionItem` | `default` | `{ open }` | 展开后显示的内容               |
| `VAccordionItem` | `trigger` | `{ open }` | 自定义标题内容，替代 `title`   |
| `VAccordionItem` | `icon`    | `{ open }` | 自定义右侧图标，默认是方向箭头 |
