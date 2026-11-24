---
title: VTabs 选项卡
description: 使用 VTabs、VTabItem 和 VTabbar 在 Halo 插件中切换不同内容区域，支持多种样式、排列方向、图标徽标、禁用状态、持久化面板与贴边全宽形态
---

选项卡用于在同一区域切换不同的内容。`VTabs` 组合 `VTabItem` 使用，`VTabbar` 则适合只需要标签栏的场景。

从 2.28.0 开始，这三个组件新增了图标、徽标、禁用状态、持久化面板和贴边全宽形态，并补齐了键盘交互与溢出滚动，已有用法不需要修改。

## 引入

```ts
import { VTabs, VTabItem, VTabbar } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VTabItem, VTabs } from "@halo-dev/components";

const activeId = ref("general");
</script>

<template>
  <VTabs v-model:active-id="activeId">
    <VTabItem id="general" label="基本设置">
      在这里配置站点的基本信息。
    </VTabItem>
    <VTabItem id="seo" label="SEO"> 在这里配置搜索引擎优化选项。 </VTabItem>
    <VTabItem id="advanced" label="高级">
      高级设置仅供有经验的用户使用。
    </VTabItem>
  </VTabs>
</template>
```

### 不同样式

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VTabItem, VTabs } from "@halo-dev/components";

const activeId = ref("a");
</script>

<template>
  <VTabs v-model:active-id="activeId" type="pills">
    <VTabItem id="a" label="文章">文章列表</VTabItem>
    <VTabItem id="b" label="页面">页面列表</VTabItem>
    <VTabItem id="c" label="评论">评论列表</VTabItem>
  </VTabs>
</template>
```

### 垂直排列

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VTabItem, VTabs } from "@halo-dev/components";

const activeId = ref("general");
</script>

<template>
  <VTabs v-model:active-id="activeId" direction="column">
    <VTabItem id="general" label="基本设置">基本设置内容</VTabItem>
    <VTabItem id="advanced" label="高级设置">高级设置内容</VTabItem>
  </VTabs>
</template>
```

### 仅使用标签栏

`VTabbar` 通过 `items` 接收标签数据，不需要渲染 `VTabItem`。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VTabbar } from "@halo-dev/components";

const activeId = ref("all");

const items = [
  { id: "all", label: "全部" },
  { id: "published", label: "已发布" },
  { id: "draft", label: "草稿" },
];
</script>

<template>
  <VTabbar v-model:active-id="activeId" :items="items" type="outline" />
</template>
```

### 图标与徽标

`VTabItem` 的 `icon` 接收一个图标组件，`badge` 在标签文字后显示计数或短标记。两者会自动同步到 `VTabs` 生成的标签栏，`v-for` 渲染的标签也能被正确收集。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import {
  IconDashboard,
  IconPages,
  VTabItem,
  VTabs,
} from "@halo-dev/components";

const activeId = ref("dashboard");
</script>

<template>
  <VTabs v-model:active-id="activeId">
    <VTabItem id="dashboard" label="仪表盘" :icon="IconDashboard">
      仪表盘内容
    </VTabItem>
    <VTabItem id="posts" label="文章" :icon="IconPages" badge="12">
      文章列表内容
    </VTabItem>
  </VTabs>
</template>
```

`VTabbar` 的 `items` 同样支持 `icon`、`badge` 和 `disabled` 字段。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { IconDashboard, IconPages, VTabbar } from "@halo-dev/components";

const activeId = ref("dashboard");

const items = [
  { id: "dashboard", label: "仪表盘", icon: IconDashboard },
  { id: "posts", label: "文章", icon: IconPages, badge: 12 },
];
</script>

<template>
  <VTabbar v-model:active-id="activeId" :items="items" />
</template>
```

### 禁用标签

把某个标签设为 `disabled` 后，它仍然显示，但无法点击或通过键盘选中。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VTabItem, VTabs } from "@halo-dev/components";

const activeId = ref("basic");
</script>

<template>
  <VTabs v-model:active-id="activeId">
    <VTabItem id="basic" label="基础">基础配置</VTabItem>
    <VTabItem id="advanced" label="高级" disabled>高级配置</VTabItem>
  </VTabs>
</template>
```

如果 `activeId` 无法匹配任何标签，或者指向的标签被禁用，组件会回退到第一个可用标签，并通过 `update:activeId` 同步出去，避免出现空白面板。

### 持久化面板

默认情况下，未激活的 `VTabItem` 会被卸载。设置 `persistent` 后，面板只隐藏而不卸载，切换回来时表单状态、滚动位置等内容仍然保留。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VTabItem, VTabs } from "@halo-dev/components";

const activeId = ref("general");
const title = ref("");
</script>

<template>
  <VTabs v-model:active-id="activeId">
    <VTabItem id="general" label="基本设置" persistent>
      <input
        v-model="title"
        class="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        placeholder="切换标签后这里的内容不会丢失"
      />
    </VTabItem>
    <VTabItem id="seo" label="SEO"> SEO 设置内容 </VTabItem>
  </VTabs>
</template>
```

面板数量多、内容较重时不必开启，避免同时挂载所有面板。

### 贴边全宽

在卡片头部使用标签栏时，设置 `flush` 让标签栏自己负责顶部圆角并去掉左右内边距，不需要再额外裁剪容器。`VTabs` 也支持 `flush`，会透传给内部的 `VTabbar`。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VCard, VTabbar } from "@halo-dev/components";

const activeId = ref("general");

const items = [
  { id: "general", label: "基本设置" },
  { id: "seo", label: "SEO 设置" },
];
</script>

<template>
  <VCard>
    <template #header>
      <VTabbar
        v-model:active-id="activeId"
        :items="items"
        class="w-full"
        flush
        type="outline"
      />
    </template>
    当前标签：{{ activeId }}
  </VCard>
</template>
```

### 溢出滚动

标签数量超过可用宽度时，标签栏两侧会出现滚动按钮和边缘渐隐效果，当前标签会自动滚动到可见区域。触控板横向滑动或 `Shift` + 滚轮可以滚动标签栏；普通垂直滚轮仍然滚动页面，不会拦截。

## 键盘与无障碍

标签栏遵循 WAI-ARIA 的选项卡模式：`Tab` 进入标签栏后，用方向键在标签之间移动，`Home` 和 `End` 跳到第一个和最后一个可用标签，`Enter` 或空格选中当前标签。面板本身也可以被键盘聚焦，方便直接操作其中的内容。

每个标签都有 `role="tab"` 与对应的 `aria-selected`，面板有 `role="tabpanel"`，并通过 `aria-controls` 和 `aria-labelledby` 相互关联。只显示图标、没有 `label` 的标签应通过 `ariaLabel` 提供无障碍名称；设置了 `label` 时 `ariaLabel` 不再生效。

## VTabs Props

| 属性        | 类型                                | 默认值      | 说明                                        |
| ----------- | ----------------------------------- | ----------- | ------------------------------------------- |
| `activeId`  | `number \| string`                  | `undefined` | 当前选中的标签 ID，支持 `v-model:active-id` |
| `type`      | `"default" \| "pills" \| "outline"` | `"default"` | 标签栏样式                                  |
| `direction` | `"row" \| "column"`                 | `"row"`     | 标签栏排列方向                              |
| `idKey`     | `string`                            | `"id"`      | 从 `VTabItem` 中读取 ID 的属性名            |
| `labelKey`  | `string`                            | `"label"`   | 从 `VTabItem` 中读取标签文字的属性名        |
| `flush`     | `boolean`                           | `false`     | 贴边全宽形态，透传给内部的 `VTabbar`        |

## VTabItem Props

| 属性         | 类型               | 默认值      | 说明                                  |
| ------------ | ------------------ | ----------- | ------------------------------------- |
| `id`         | `string \| number` | `undefined` | 标签 ID                               |
| `label`      | `string`           | `undefined` | 标签文字                              |
| `icon`       | `Component`        | `undefined` | 标签图标，显示在文字左侧              |
| `badge`      | `string \| number` | `undefined` | 标签文字后的徽标                      |
| `disabled`   | `boolean`          | `false`     | 是否禁用该标签                        |
| `ariaLabel`  | `string`           | `undefined` | 标签的无障碍名称，没有 `label` 时使用 |
| `persistent` | `boolean`          | `false`     | 未激活时只隐藏面板，不卸载            |

## VTabbar Props

| 属性        | 类型                                | 默认值      | 说明                                        |
| ----------- | ----------------------------------- | ----------- | ------------------------------------------- |
| `activeId`  | `number \| string`                  | `undefined` | 当前选中的标签 ID，支持 `v-model:active-id` |
| `items`     | `TabbarItem[]`                      | `undefined` | 标签数据，字段见下方说明                    |
| `type`      | `"default" \| "pills" \| "outline"` | `"default"` | 标签栏样式                                  |
| `direction` | `"row" \| "column"`                 | `"row"`     | 标签栏排列方向                              |
| `idKey`     | `string`                            | `"id"`      | 读取 ID 的属性名                            |
| `labelKey`  | `string`                            | `"label"`   | 读取标签文字的属性名                        |
| `flush`     | `boolean`                           | `false`     | 贴边全宽形态，自行处理顶部圆角与内边距      |

`TabbarItem` 常用的字段有 `id`、`label`、`icon`、`badge`、`disabled` 和 `ariaLabel`，含义与 `VTabItem` 的同名属性一致；`id` 与 `label` 之外的字段都可以省略。

## Emits

| 组件      | 事件              | 参数               | 说明                 |
| --------- | ----------------- | ------------------ | -------------------- |
| `VTabs`   | `update:activeId` | `number \| string` | 选中的标签变化时触发 |
| `VTabs`   | `change`          | `number \| string` | 选中的标签变化时触发 |
| `VTabbar` | `update:activeId` | `number \| string` | 选中的标签变化时触发 |
| `VTabbar` | `change`          | `number \| string` | 选中的标签变化时触发 |

## Slots

| 组件       | 插槽      | 说明            |
| ---------- | --------- | --------------- |
| `VTabs`    | `default` | `VTabItem` 列表 |
| `VTabItem` | `default` | 标签内容        |
