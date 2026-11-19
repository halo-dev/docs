---
title: VTabs 选项卡
description: 使用 VTabs、VTabItem 和 VTabbar 在 Halo 插件中切换不同内容区域，支持多种样式和排列方向
---

选项卡用于在同一区域切换不同的内容。`VTabs` 组合 `VTabItem` 使用，`VTabbar` 则适合只需要标签栏的场景。

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

const activeId = ref("profile");
</script>

<template>
  <VTabs v-model:active-id="activeId" direction="column">
    <VTabItem id="profile" label="个人资料">个人资料内容</VTabItem>
    <VTabItem id="security" label="安全">安全设置内容</VTabItem>
    <VTabItem id="notifications" label="通知">通知设置内容</VTabItem>
  </VTabs>
</template>
```

### 仅使用标签栏

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

## VTabs Props

| 属性        | 类型                                | 默认值      | 说明                                        |
| ----------- | ----------------------------------- | ----------- | ------------------------------------------- |
| `activeId`  | `number \| string`                  | `undefined` | 当前选中的标签 ID，支持 `v-model:active-id` |
| `type`      | `"default" \| "pills" \| "outline"` | `"default"` | 标签栏样式                                  |
| `direction` | `"row" \| "column"`                 | `"row"`     | 标签栏排列方向                              |
| `idKey`     | `string`                            | `"id"`      | 从 `VTabItem` 中读取 ID 的属性名            |
| `labelKey`  | `string`                            | `"label"`   | 从 `VTabItem` 中读取标签文字的属性名        |

## VTabItem Props

| 属性    | 类型     | 默认值      | 说明     |
| ------- | -------- | ----------- | -------- |
| `id`    | `string` | `undefined` | 标签 ID  |
| `label` | `string` | `undefined` | 标签文字 |

## VTabbar Props

| 属性        | 类型                                | 默认值      | 说明                                        |
| ----------- | ----------------------------------- | ----------- | ------------------------------------------- |
| `activeId`  | `number \| string`                  | `undefined` | 当前选中的标签 ID，支持 `v-model:active-id` |
| `items`     | `Array<Record<string, string>>`     | `undefined` | 标签数据，每项至少包含 `id` 和 `label`      |
| `type`      | `"default" \| "pills" \| "outline"` | `"default"` | 标签栏样式                                  |
| `direction` | `"row" \| "column"`                 | `"row"`     | 标签栏排列方向                              |
| `idKey`     | `string`                            | `"id"`      | 读取 ID 的属性名                            |
| `labelKey`  | `string`                            | `"label"`   | 读取标签文字的属性名                        |

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
