---
title: VTable 表格
description: 使用 VTable 在 Halo 插件中展示多列数据，支持列定义、列级排序、行选择、展开行、多级表头、固定列、列宽调整和虚拟滚动
---

`VTable` 用于展示真正的多列数据，提供列定义、表头、对齐、列级排序、行选择、展开行、多级表头、固定列和虚拟滚动等能力。它基于 TanStack Table 构建，并沿用 `@halo-dev/components` 的样式。

当列表更适合卡片式的单列布局时，请使用 [VEntity](./entity.md)；需要横向对比多个字段时使用 `VTable`。

**引入版本**：2.28.0

## 引入

```ts
import { VTable, createTableColumnHelper } from "@halo-dev/components";
```

## 示例

### 基础用法

用 `createTableColumnHelper<TData>()` 创建列助手，可以获得 `data` 与列定义的类型推断。

```vue preview
<script lang="ts" setup>
import { VTable, createTableColumnHelper } from "@halo-dev/components";

interface Post {
  id: string;
  title: string;
  author: string;
  views: number;
}

const posts: Post[] = [
  { id: "1", title: "Halo 主题开发入门", author: "Ryan", views: 1280 },
  { id: "2", title: "插件迁移注意事项", author: "Lilian", views: 642 },
  { id: "3", title: "内容 API 使用指南", author: "John", views: 987 },
];

const column = createTableColumnHelper<Post>();

const columns = column.columns([
  column.accessor("title", {
    header: "标题",
    meta: { minWidth: 200 },
  }),
  column.accessor("author", {
    header: "作者",
    meta: { width: 120 },
  }),
  column.accessor("views", {
    header: "浏览量",
    meta: { align: "right", width: 100 },
  }),
]);
</script>

<template>
  <div class="overflow-hidden rounded border border-gray-100 bg-white">
    <VTable :columns="columns" :data="posts" row-key="id" />
  </div>
</template>
```

`rowKey` 指定行 id 使用的字段，选择状态和展开状态都以它为键；不设置时会退化为行下标，数据排序或替换后不稳定，因此建议始终提供。

单元格默认渲染 accessor 对应的值，`null`、`undefined` 和空字符串会显示为 `-`。

### 列排序

列排序默认关闭，需要在列上设置 `enableSorting`。客户端排序由 `sortFn` 决定，内置 `alphanumeric`、`text`、`datetime` 和 `basic` 四种：

```vue preview
<script lang="ts" setup>
import {
  VTable,
  createTableColumnHelper,
  type SortingState,
} from "@halo-dev/components";
import { ref } from "vue";

interface Post {
  id: string;
  title: string;
  createdAt: string;
  views: number;
}

const posts: Post[] = [
  { id: "1", title: "Halo 主题开发入门", createdAt: "2026-11-01", views: 1280 },
  { id: "2", title: "插件迁移注意事项", createdAt: "2026-10-28", views: 642 },
  { id: "3", title: "内容 API 使用指南", createdAt: "2026-10-21", views: 987 },
];

const column = createTableColumnHelper<Post>();

const columns = column.columns([
  column.accessor("title", {
    header: "标题",
    enableSorting: true,
    sortFn: "text",
    meta: { minWidth: 200 },
  }),
  column.accessor("createdAt", {
    header: "创建时间",
    enableSorting: true,
    sortFn: "datetime",
    meta: { width: 140 },
  }),
  column.accessor("views", {
    header: "浏览量",
    enableSorting: true,
    sortFn: "basic",
    meta: { align: "right", width: 100 },
  }),
]);

const sorting = ref<SortingState>([]);
</script>

<template>
  <div class="overflow-hidden rounded border border-gray-100 bg-white">
    <VTable
      v-model:sorting="sorting"
      :columns="columns"
      :data="posts"
      row-key="id"
    />
  </div>
</template>
```

排序状态是受控的：传入 `sorting` 或使用 `v-model:sorting` 后，组件会同步外部的排序状态。

### 自定义单元格

用 `cell-<columnId>` 插槽自定义某一列的单元格，插槽参数包含 `row`、`original`、`value`、`column`、`cell` 和 `table`。列 id 默认为 accessor 的字段名，也可以用 `column.display({ id })` 声明一个不绑定字段的列。

```vue preview
<script lang="ts" setup>
import {
  IconMore,
  VDropdown,
  VDropdownItem,
  VTable,
  VTag,
  createTableColumnHelper,
} from "@halo-dev/components";

type PostStatus = "published" | "draft";

interface Post {
  id: string;
  title: string;
  status: PostStatus;
}

const posts: Post[] = [
  { id: "1", title: "Halo 主题开发入门", status: "published" },
  { id: "2", title: "插件迁移注意事项", status: "draft" },
];

const column = createTableColumnHelper<Post>();

const columns = column.columns([
  column.accessor("title", {
    header: "标题",
    meta: { minWidth: 200 },
  }),
  column.accessor("status", {
    header: "状态",
    meta: { width: 100 },
  }),
  column.display({
    id: "actions",
    header: "操作",
    enableSorting: false,
    meta: { align: "right", width: 80 },
  }),
]);
</script>

<template>
  <div class="overflow-hidden rounded border border-gray-100 bg-white">
    <VTable :columns="columns" :data="posts" row-key="id">
      <template #cell-status="{ value }">
        <VTag :theme="value === 'published' ? 'primary' : 'secondary'">
          {{ value === "published" ? "已发布" : "草稿" }}
        </VTag>
      </template>
      <template #cell-actions>
        <VDropdown :dispose-timeout="null">
          <button
            aria-label="更多操作"
            class="inline-flex cursor-pointer rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            type="button"
          >
            <IconMore />
          </button>
          <template #popper>
            <VDropdownItem>编辑</VDropdownItem>
            <VDropdownItem type="danger">移入回收站</VDropdownItem>
          </template>
        </VDropdown>
      </template>
    </VTable>
  </div>
</template>
```

表头同样可以用 `header-<columnId>` 插槽自定义。

### 行选择与展开行

开启 `selectable` 后会新增一列复选框，表头复选框支持全选和半选；开启 `expandable` 后会新增展开按钮，并通过 `expanded` 插槽渲染详情行。

```vue preview
<script lang="ts" setup>
import {
  VTable,
  createTableColumnHelper,
  type RowSelectionState,
} from "@halo-dev/components";
import { computed, ref } from "vue";

interface Post {
  id: string;
  title: string;
  summary: string;
}

const posts: Post[] = [
  {
    id: "1",
    title: "Halo 主题开发入门",
    summary: "从目录结构、模板到 Finder API，梳理主题开发的完整流程。",
  },
  {
    id: "2",
    title: "插件迁移注意事项",
    summary: "升级到新版本前需要检查的扩展点、依赖和配置项。",
  },
];

const column = createTableColumnHelper<Post>();

const columns = column.columns([
  column.accessor("title", { header: "标题", meta: { minWidth: 200 } }),
]);

const rowSelection = ref<RowSelectionState>({});
const selectedCount = computed(() => Object.keys(rowSelection.value).length);
</script>

<template>
  <div class="overflow-hidden rounded border border-gray-100 bg-white">
    <div class="border-b border-gray-100 px-4 py-3 text-sm text-gray-500">
      已选择 {{ selectedCount }} 项
    </div>
    <VTable
      v-model:row-selection="rowSelection"
      :columns="columns"
      :data="posts"
      row-key="id"
      expandable
      selectable
    >
      <template #expanded="{ row }">
        <p class="text-sm text-gray-600">{{ row.original.summary }}</p>
      </template>
    </VTable>
  </div>
</template>
```

表头全选作用于当前页的所有行。`expandable` 不能与 `virtualize` 同时使用。

### 多级表头与粘性表头

用 `column.group()` 组合多级表头；`sticky` 让表头在滚动时保持可见，需要给表格容器设置高度，例如通过 `ui.root` 添加 `max-h-64`。

```vue preview
<script lang="ts" setup>
import { VTable, createTableColumnHelper } from "@halo-dev/components";

interface Post {
  id: string;
  title: string;
  author: string;
  views: number;
}

const posts: Post[] = Array.from({ length: 20 }, (_, index) => ({
  id: String(index + 1),
  title: `文章 ${index + 1}`,
  author: index % 2 === 0 ? "Ryan" : "Lilian",
  views: 100 + index * 37,
}));

const column = createTableColumnHelper<Post>();

const columns = [
  column.group({
    id: "content",
    header: "内容",
    columns: column.columns([
      column.accessor("title", { header: "标题", meta: { minWidth: 200 } }),
      column.accessor("author", { header: "作者", meta: { width: 120 } }),
    ]),
  }),
  column.group({
    id: "metrics",
    header: "数据",
    columns: column.columns([
      column.accessor("views", {
        header: "浏览量",
        meta: { align: "right", width: 100 },
      }),
    ]),
  }),
];
</script>

<template>
  <div class="overflow-hidden rounded border border-gray-100 bg-white">
    <VTable
      :columns="columns"
      :data="posts"
      :ui="{ root: 'max-h-64' }"
      row-key="id"
      sticky
    />
  </div>
</template>
```

### 服务端排序

数据量较大或排序需要由接口完成时，开启 `manualSorting`，组件只更新并抛出排序状态，不会重排行：

```vue preview
<script lang="ts" setup>
import {
  VTable,
  createTableColumnHelper,
  type SortingState,
} from "@halo-dev/components";
import { ref } from "vue";

interface Post {
  id: string;
  title: string;
  createdAt: string;
}

const column = createTableColumnHelper<Post>();

const columns = column.columns([
  column.accessor("title", {
    header: "标题",
    enableSorting: true,
    sortFn: "text",
    meta: { minWidth: 200 },
  }),
  column.accessor("createdAt", {
    header: "创建时间",
    enableSorting: true,
    meta: { width: 140 },
  }),
]);

const posts = ref<Post[]>([
  { id: "1", title: "Halo 主题开发入门", createdAt: "2026-11-01" },
  { id: "2", title: "插件迁移注意事项", createdAt: "2026-10-28" },
]);

const sorting = ref<SortingState>([]);

// 实际使用时在这里按排序状态请求接口，并更新 posts
function handleSortingChange(value: SortingState) {
  sorting.value = value;
}
</script>

<template>
  <div class="overflow-hidden rounded border border-gray-100 bg-white">
    <VTable
      :columns="columns"
      :data="posts"
      :sorting="sorting"
      manual-sorting
      row-key="id"
      @update:sorting="handleSortingChange"
    />
  </div>
</template>
```

`SortingState` 是 `{ id, desc }` 数组，其中 `id` 为列 id。

### 列宽、固定列与表头菜单

`resizable` 允许拖动表头边缘调整列宽，`pinnable` 允许把列固定在左侧或右侧，`header-menu` 在表头右侧显示列操作菜单，包含升序、降序、清除排序、隐藏列和固定列。

```vue preview
<script lang="ts" setup>
import {
  VTable,
  createTableColumnHelper,
  type ColumnPinningState,
} from "@halo-dev/components";
import { ref } from "vue";

interface Post {
  id: string;
  title: string;
  author: string;
  views: number;
}

const posts: Post[] = [
  { id: "1", title: "Halo 主题开发入门", author: "Ryan", views: 1280 },
  { id: "2", title: "插件迁移注意事项", author: "Lilian", views: 642 },
];

const column = createTableColumnHelper<Post>();

const columns = column.columns([
  column.accessor("title", {
    header: "标题",
    enableSorting: true,
    sortFn: "text",
    meta: { minWidth: 200 },
  }),
  column.accessor("author", { header: "作者", meta: { width: 140 } }),
  column.accessor("views", {
    header: "浏览量",
    enableSorting: true,
    sortFn: "basic",
    meta: { align: "right", width: 120 },
  }),
]);

const columnPinning = ref<ColumnPinningState>({
  start: ["title"],
  end: ["views"],
});
</script>

<template>
  <div class="overflow-hidden rounded border border-gray-100 bg-white">
    <VTable
      v-model:column-pinning="columnPinning"
      :columns="columns"
      :data="posts"
      header-menu
      pinnable
      resizable
      row-key="id"
    />
  </div>
</template>
```

表头菜单会在表头右侧预留 40px，按钮所在列的宽度需要留出这部分空间，简短的标题大约需要 80px。菜单和列宽拖拽手柄的无障碍文字可以通过 `headerMenuLabels` 覆盖。

列宽通过 `meta.width` 和 `meta.minWidth` 设置，数字按像素处理。开启列宽调整或固定列后，百分比宽度会被忽略，此时请使用数字。

### 虚拟滚动

行数很多时可以用 `virtualize` 只渲染可视区域内的行。它需要表格容器有高度限制、行高一致，通常与 `sticky` 一起使用：

```vue preview
<script lang="ts" setup>
import { VTable, createTableColumnHelper } from "@halo-dev/components";

interface Post {
  id: string;
  title: string;
  views: number;
}

const posts: Post[] = Array.from({ length: 1000 }, (_, index) => ({
  id: String(index + 1),
  title: `文章 ${index + 1}`,
  views: index * 13,
}));

const column = createTableColumnHelper<Post>();

const columns = column.columns([
  column.accessor("title", { header: "标题", meta: { minWidth: 200 } }),
  column.accessor("views", {
    header: "浏览量",
    meta: { align: "right", width: 100 },
  }),
]);
</script>

<template>
  <div class="overflow-hidden rounded border border-gray-100 bg-white">
    <VTable
      :columns="columns"
      :data="posts"
      :ui="{ root: 'max-h-96' }"
      :virtualize="{ estimateSize: 45 }"
      row-key="id"
      sticky
    />
  </div>
</template>
```

`estimateSize` 是预估行高，默认 45；`overscan` 是可视区域外额外渲染的行数，默认 8。行高不一致时虚拟滚动会出现错位。

### 加载状态与空状态

```vue
<VTable
  :columns="columns"
  :data="posts"
  :loading="loading"
  empty-text="还没有文章"
  row-key="id"
/>
```

没有数据且 `loading` 为 `true` 时显示加载状态，否则显示 `emptyText`。两者都可以用 `loading` 和 `empty` 插槽替换默认内容。

## Props

| 属性               | 类型                                           | 默认值       | 说明                                                         |
| ------------------ | ---------------------------------------------- | ------------ | ------------------------------------------------------------ |
| `data`             | `TData[]`                                      | 无，必填     | 表格数据                                                     |
| `columns`          | `TableColumn<TData>[]`                         | 无，必填     | 列定义，建议由 `createTableColumnHelper` 生成                |
| `rowKey`           | `string \| ((row: TData) => string \| number)` | `undefined`  | 行 id 使用的字段或函数，不设置时使用行下标                   |
| `loading`          | `boolean`                                      | `false`      | 是否正在加载，无数据时显示加载状态而不是空状态               |
| `emptyText`        | `string`                                       | `"暂无数据"` | 无数据时的提示文字                                           |
| `sticky`           | `boolean`                                      | `false`      | 滚动时表头保持可见，需要给容器设置高度                       |
| `selectable`       | `boolean`                                      | `false`      | 显示复选框列，表头支持全选和半选                             |
| `expandable`       | `boolean`                                      | `false`      | 显示展开按钮和详情行，不能与 `virtualize` 同时使用           |
| `manualSorting`    | `boolean`                                      | `false`      | 由调用方处理排序，组件只更新并抛出排序状态                   |
| `sorting`          | `SortingState`                                 | `undefined`  | 排序状态，支持 `v-model:sorting`                             |
| `rowSelection`     | `RowSelectionState`                            | `undefined`  | 行选择状态，支持 `v-model:row-selection`                     |
| `expanded`         | `ExpandedState`                                | `undefined`  | 展开状态，支持 `v-model:expanded`                            |
| `columnVisibility` | `ColumnVisibilityState`                        | `undefined`  | 列可见状态，支持 `v-model:column-visibility`                 |
| `columnSizing`     | `ColumnSizingState`                            | `undefined`  | 列宽状态，以列 id 为键，支持 `v-model:column-sizing`         |
| `columnPinning`    | `ColumnPinningState`                           | `undefined`  | 固定列状态，支持 `v-model:column-pinning`                    |
| `resizable`        | `boolean`                                      | `false`      | 允许拖动表头边缘调整列宽                                     |
| `pinnable`         | `boolean`                                      | `false`      | 允许把列固定在左侧或右侧                                     |
| `headerMenu`       | `boolean`                                      | `false`      | 在表头显示列操作菜单                                         |
| `headerMenuLabels` | `Partial<TableHeaderMenuLabels>`               | `{}`         | 覆盖表头菜单和列宽手柄的文字                                 |
| `virtualize`       | `boolean \| TableVirtualizeOptions`            | `false`      | 启用虚拟滚动，需要容器高度限制和统一行高                     |
| `ui`               | `TableUi`                                      | `{}`         | 追加到各表格元素的 class                                     |
| `caption`          | `string`                                       | `undefined`  | 表格标题，同时作为无障碍名称                                 |
| `selectAllLabel`   | `string`                                       | `"选择全部"` | 全选复选框的无障碍标签                                       |
| `selectRowLabel`   | `string`                                       | `"选择"`     | 行复选框的无障碍标签前缀，最终为 `${selectRowLabel} ${行号}` |

## 事件

| 事件                      | 参数                    | 说明                                                   |
| ------------------------- | ----------------------- | ------------------------------------------------------ |
| `update:sorting`          | `SortingState`          | 排序状态变化时触发                                     |
| `update:rowSelection`     | `RowSelectionState`     | 行选择状态变化时触发                                   |
| `update:expanded`         | `ExpandedState`         | 展开状态变化时触发                                     |
| `update:columnVisibility` | `ColumnVisibilityState` | 列可见状态变化时触发                                   |
| `update:columnSizing`     | `ColumnSizingState`     | 列宽变化时触发                                         |
| `update:columnPinning`    | `ColumnPinningState`    | 固定列状态变化时触发                                   |
| `row-click`               | `row: TData`            | 点击行时触发，点击链接、按钮、输入框等交互元素时不触发 |

## 插槽

| 插槽                | 参数                                                  | 说明                 |
| ------------------- | ----------------------------------------------------- | -------------------- |
| `cell-<columnId>`   | `row`、`original`、`value`、`column`、`cell`、`table` | 自定义某一列的单元格 |
| `header-<columnId>` | `header`、`column`、`table`                           | 自定义某一列的表头   |
| `expanded`          | `row`、`table`                                        | 展开行的内容         |
| `empty`             | -                                                     | 无数据时的内容       |
| `loading`           | -                                                     | 加载中的内容         |
| `caption`           | -                                                     | 自定义表格标题       |

## 列定义

`TableColumn<TData>` 与 TanStack Table 的 `ColumnDef` 一致，另外通过 `meta` 控制展示：

| 字段            | 类型                                                | 说明                                                       |
| --------------- | --------------------------------------------------- | ---------------------------------------------------------- |
| `id`            | `string`                                            | 列 id，决定 `cell-<columnId>` 插槽名，默认为 accessor 字段 |
| `header`        | `string \| 函数`                                    | 表头内容                                                   |
| `cell`          | `函数`                                              | 默认单元格渲染函数，返回 VNode 或文本                      |
| `enableSorting` | `boolean`                                           | 是否可排序，默认为 `false`                                 |
| `sortFn`        | `"alphanumeric" \| "text" \| "datetime" \| "basic"` | 客户端排序函数                                             |
| `enableHiding`  | `boolean`                                           | 是否允许通过表头菜单隐藏，默认为 `true`                    |
| `columns`       | `TableColumn<TData>[]`                              | 子列，用于多级表头                                         |
| `meta.align`    | `"left" \| "center" \| "right"`                     | 表头和单元格的水平对齐                                     |
| `meta.width`    | `string \| number`                                  | 列宽，数字按像素处理                                       |
| `meta.minWidth` | `string \| number`                                  | 最小列宽，数字按像素处理                                   |
| `meta.thClass`  | `string`                                            | 追加到表头单元格的 class                                   |
| `meta.tdClass`  | `string`                                            | 追加到数据单元格的 class                                   |

用 `column.group({ id, header, columns })` 可以创建多级表头。

## 表格实例

通过模板引用可以拿到底层能力：

| 属性/方法  | 说明                                                        |
| ---------- | ----------------------------------------------------------- |
| `tableApi` | TanStack Table 的表格实例，可读取行模型、列状态或调用其方法 |
| `tableRef` | 表格的 `<table>` 元素                                       |

```vue
<script lang="ts" setup>
import { VTable } from "@halo-dev/components";
import { ref } from "vue";

const tableRef = ref<InstanceType<typeof VTable>>();

// tableRef.value?.tableApi.getSelectedRowModel().rows
// tableRef.value?.tableRef?.querySelector("tbody")
</script>
```
