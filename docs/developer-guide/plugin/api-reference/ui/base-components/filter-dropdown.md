---
title: VFilterDropdown 筛选下拉
description: 使用 VFilterDropdown 和 VFilterDropdownGroup 在 Halo 插件中构建列表筛选栏，支持本地与远程搜索、分组、树形选项、滚动加载和一键清空
---

筛选下拉用于列表页的筛选栏，点击触发器后在面板中选择筛选项。`VFilterDropdown` 支持本地搜索、远程搜索、分组、树形选项和滚动加载，`VFilterDropdownGroup` 用于组合多个筛选下拉，并提供一键清空。

**引入版本**：2.28.0

## 引入

```ts
import { VFilterDropdown, VFilterDropdownGroup } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { VFilterDropdown } from "@halo-dev/components";
import { ref } from "vue";

const status = ref<string>();

const options = [
  { label: "已发布", value: "published" },
  { label: "草稿", value: "draft" },
  { label: "定时发布", value: "scheduled" },
];
</script>

<template>
  <VFilterDropdown v-model="status" label="状态" :options="options" />
</template>
```

未选择时触发器显示 `状态`，选择后显示 `状态：已发布`。再次选择已选中的选项会清除选择。

### 清除选项与一键清空

```vue preview
<script lang="ts" setup>
import { VFilterDropdown, VFilterDropdownGroup } from "@halo-dev/components";
import { ref } from "vue";

const status = ref<string>();
const sort = ref<string>();
</script>

<template>
  <VFilterDropdownGroup clear-label="清除筛选">
    <VFilterDropdown
      v-model="status"
      label="状态"
      show-clear-option
      clear-label="全部"
      :options="[
        { label: '已发布', value: 'published' },
        { label: '草稿', value: 'draft' },
      ]"
    />
    <VFilterDropdown
      v-model="sort"
      label="排序"
      show-clear-option
      clear-label="默认"
      :options="[
        { label: '最近创建', value: 'metadata.creationTimestamp,desc' },
        { label: '创建时间升序', value: 'metadata.creationTimestamp,asc' },
      ]"
    />
  </VFilterDropdownGroup>
</template>
```

启用 `showClearOption` 后，面板顶部会出现清除选项，选择它会将值置为 `undefined`；未选择时触发器会显示清除选项的文字，例如 `状态：全部`。`VFilterDropdownGroup` 会自动感知组内筛选下拉的状态，在有筛选条件时显示清除按钮，点击后清除组内所有筛选下拉，并触发 `clear` 事件。

如果页面中还有不属于 `VFilterDropdown` 的筛选控件，可以通过 `hasExternalFilters` 让组把它们也计入筛选状态，并在 `clear` 事件中重置这些控件：

```vue
<VFilterDropdownGroup
  :has-external-filters="!!selectedUser"
  @clear="selectedUser = undefined"
>
  <!-- 筛选下拉 -->
</VFilterDropdownGroup>
```

### 搜索、分组与树形选项

```vue preview
<script lang="ts" setup>
import { IconFolder, VFilterDropdown } from "@halo-dev/components";
import { ref } from "vue";

const category = ref<string>();

const options = [
  {
    label: "前端",
    icon: IconFolder,
    children: [
      { label: "Vue", value: "vue", description: "frontend/vue" },
      { label: "React", value: "react", description: "frontend/react" },
    ],
  },
  {
    label: "后端",
    icon: IconFolder,
    children: [
      { label: "Java", value: "java", description: "backend/java" },
      { label: "Go", value: "go", description: "backend/go" },
    ],
  },
];
</script>

<template>
  <VFilterDropdown
    v-model="category"
    label="分类"
    searchable
    search-placeholder="搜索分类"
    :options="options"
  />
</template>
```

没有 `value` 的选项不可选择，可以作为树形的父节点，点击后展开或收起子选项。本地搜索会匹配选项的 `label`、`description` 和 `keywords`，并自动展开包含匹配项的分支。

`options` 中的每一项也可以是分组，分组可以带有标题：

```ts
const options = [
  {
    label: "最近使用",
    options: [
      { label: "Halo", value: "halo", description: "halo-dev/halo" },
      { label: "Console", value: "console", description: "halo-dev/console" },
    ],
  },
  {
    label: "全部项目",
    options: [
      { label: "官网", value: "website", description: "halo-dev/website" },
      { label: "插件", value: "plugins", description: "halo-dev/plugin" },
    ],
  },
];
```

### 远程搜索与滚动加载

```vue preview
<script lang="ts" setup>
import {
  VFilterDropdown,
  type FilterDropdownOption,
} from "@halo-dev/components";
import { onMounted, ref } from "vue";

const author = ref<string>();
const options = ref<FilterDropdownOption[]>([]);
const loading = ref(false);
const hasMore = ref(true);

const PAGE_SIZE = 20;
const allAuthors: FilterDropdownOption[] = Array.from(
  { length: 100 },
  (_, index) => ({
    label: `作者 ${index + 1}`,
    value: `author-${index + 1}`,
  }),
);

let keyword = "";
let page = 0;

function load(reset = false) {
  if (reset) {
    page = 0;
    options.value = [];
    hasMore.value = true;
  }

  if (!hasMore.value) {
    return;
  }

  loading.value = true;

  // 模拟远程请求，实际使用时替换为接口调用
  setTimeout(() => {
    const matched = allAuthors.filter((option) =>
      option.label.includes(keyword),
    );
    const start = page * PAGE_SIZE;
    const items = matched.slice(start, start + PAGE_SIZE);

    options.value = reset ? items : [...options.value, ...items];
    hasMore.value = start + items.length < matched.length;
    page += 1;
    loading.value = false;
  }, 300);
}

function handleSearch(value: string) {
  keyword = value;
  load(true);
}

onMounted(() => load(true));
</script>

<template>
  <VFilterDropdown
    v-model="author"
    label="作者"
    searchable
    remote-search
    search-placeholder="搜索作者"
    :options="options"
    :loading="loading"
    :has-more="hasMore"
    @search="handleSearch"
    @load-more="load()"
  />
</template>
```

开启 `remote-search` 后组件不会在本地过滤选项，输入停止 `searchDelay` 毫秒后会触发 `search` 事件，参数为去除首尾空格后的关键词。组件打开时不会自动触发 `search`，首次数据需要自行加载。列表滚动到距底部约 48px 时会触发 `load-more`；当选项不足一屏时也会自动触发。请始终通过 `loading` 和 `hasMore` 控制请求，避免重复加载。

如果选中的选项不在当前 `options` 中（例如远程搜索结果已更换），可以通过 `selectedLabel` 指定触发器显示的文字。

### 自定义触发器与选项

通过 `trigger` 和 `option` 插槽可以完全自定义内容，选中状态、勾选图标和展开箭头仍由组件处理：

```vue preview
<script lang="ts" setup>
import { VFilterDropdown } from "@halo-dev/components";
import { ref } from "vue";

const author = ref<string>();

const options = [
  { label: "张三", value: "zhangsan", description: "zhangsan@example.com" },
  { label: "李四", value: "lisi", description: "lisi@example.com" },
];
</script>

<template>
  <VFilterDropdown v-model="author" label="作者" searchable :options="options">
    <template #option="{ option }">
      <span
        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-600"
      >
        {{ option.label.slice(0, 1) }}
      </span>
      <div class="flex min-w-0 flex-1 flex-col">
        <span class="truncate text-sm">{{ option.label }}</span>
        <span class="truncate text-xs text-gray-500">
          {{ option.description }}
        </span>
      </div>
    </template>
  </VFilterDropdown>
</template>
```

## VFilterDropdown Props

| 属性                | 类型                          | 默认值           | 说明                                                             |
| ------------------- | ----------------------------- | ---------------- | ---------------------------------------------------------------- |
| `label`             | `string`                      | 无，必填         | 触发器上的文字                                                   |
| `modelValue`        | `string \| number \| boolean` | `undefined`      | 当前选中的值，支持 `v-model`                                     |
| `options`           | `FilterDropdownItem[]`        | `[]`             | 面板中的选项，支持选项和分组                                     |
| `title`             | `string`                      | -                | 面板顶部的标题                                                   |
| `searchable`        | `boolean`                     | `false`          | 显示搜索框并在本地过滤选项                                       |
| `remoteSearch`      | `boolean`                     | `false`          | 不在本地过滤，输入时防抖触发 `search` 事件                       |
| `searchPlaceholder` | `string`                      | `undefined`      | 搜索框占位文字，未设置时使用组件库内置文案                       |
| `searchDelay`       | `number`                      | `300`            | `search` 事件的防抖延迟，单位毫秒                                |
| `emptyText`         | `string`                      | `undefined`      | 无选项时的提示文字，未设置时使用组件库内置文案                   |
| `loading`           | `boolean`                     | `false`          | 是否正在加载选项，配合 `hasMore` 使用                            |
| `hasMore`           | `boolean`                     | `false`          | 是否还有更多选项，为 `true` 时滚动到底部会触发 `load-more`       |
| `disabled`          | `boolean`                     | `false`          | 是否禁用                                                         |
| `showClearOption`   | `boolean`                     | `false`          | 在面板顶部显示清除选项                                           |
| `clearLabel`        | `string`                      | `undefined`      | 清除选项的文字，未设置时使用组件库内置文案                       |
| `selectedLabel`     | `string`                      | -                | 选中项不在 `options` 中时，触发器显示的文字                      |
| `placement`         | `VDropdownPlacement`          | `"bottom-start"` | 面板出现的位置，可选值参考 [VDropdown](./dropdown.md)            |
| `panelWidth`        | `string`                      | -                | 面板宽度，例如 `20rem`；默认根据内容在 12rem 到 20rem 之间自适应 |
| `variant`           | `"default" \| "outline"`      | `"default"`      | 触发器的样式                                                     |

## VFilterDropdown 事件

| 事件                | 参数                                              | 说明                                         |
| ------------------- | ------------------------------------------------- | -------------------------------------------- |
| `update:modelValue` | `value: string \| number \| boolean \| undefined` | 选中值变化时触发                             |
| `select`            | `option: FilterDropdownOption \| undefined`       | 选中选项时触发，清除选择时参数为 `undefined` |
| `search`            | `keyword: string`                                 | 开启 `remoteSearch` 后，输入防抖完成时触发   |
| `load-more`         | -                                                 | 需要加载更多选项时触发                       |

## VFilterDropdown 插槽

| 插槽      | 参数                                                               | 说明             |
| --------- | ------------------------------------------------------------------ | ---------------- |
| `trigger` | `selectedOption`、`label`、`isSelected`                            | 自定义触发器内容 |
| `option`  | `option`、`selected`、`active`、`depth`、`expanded`、`hasChildren` | 自定义选项内容   |
| `empty`   | -                                                                  | 无选项时的内容   |
| `loading` | -                                                                  | 加载中的内容     |

## VFilterDropdown 方法

通过模板引用调用：

| 方法     | 说明         |
| -------- | ------------ |
| `show()` | 手动展开面板 |
| `hide()` | 手动收起面板 |

## VFilterDropdownGroup Props

| 属性                 | 类型                           | 默认值      | 说明                                             |
| -------------------- | ------------------------------ | ----------- | ------------------------------------------------ |
| `clearLabel`         | `string`                       | `undefined` | 清除按钮的无障碍标签，未设置时使用组件库内置文案 |
| `hasExternalFilters` | `boolean`                      | `false`     | 组外是否有生效的筛选条件                         |
| `spacing`            | `"xs" \| "sm" \| "md" \| "lg"` | `"sm"`      | 筛选组件之间的间距                               |

## VFilterDropdownGroup 事件

| 事件    | 参数 | 说明                                                                             |
| ------- | ---- | -------------------------------------------------------------------------------- |
| `clear` | -    | 清除完成后触发，无论清除的是组内筛选下拉还是调用方处理的外部筛选，都会触发此事件 |

## VFilterDropdownGroup 插槽

| 插槽      | 参数                  | 说明           |
| --------- | --------------------- | -------------- |
| `default` | -                     | 筛选下拉       |
| `clear`   | `clear`、`hasFilters` | 自定义清除按钮 |

## VFilterDropdownGroup 暴露的属性与方法

通过模板引用访问：

| 属性/方法    | 说明                 |
| ------------ | -------------------- |
| `hasFilters` | 是否有生效的筛选条件 |
| `clearAll()` | 清除组内所有筛选下拉 |

## 选项结构

`FilterDropdownOption` 的字段：

| 字段          | 类型                          | 默认值   | 说明                                         |
| ------------- | ----------------------------- | -------- | -------------------------------------------- |
| `label`       | `string`                      | 无，必填 | 选项文字，也是触发器显示的文字               |
| `value`       | `string \| number \| boolean` | -        | 选中值；省略时该项不可选，可作为树形的父节点 |
| `description` | `string`                      | -        | 选项的次要说明                               |
| `keywords`    | `string[]`                    | -        | 本地搜索时额外匹配的关键词                   |
| `icon`        | `Component`                   | -        | 选项左侧的图标组件                           |
| `disabled`    | `boolean`                     | `false`  | 是否禁用                                     |
| `children`    | `FilterDropdownOption[]`      | -        | 子选项，渲染为可折叠的树                     |

分组对象包含 `label`（可选的标题）和 `options`（分组中的选项）。

## 键盘操作

组件支持键盘操作：`↑`、`↓` 切换选项，`Home`、`End` 跳到首尾，`Enter` 或空格选择，`←`、`→` 收起或展开树形节点，`Esc` 关闭面板。搜索框聚焦时同样可以使用方向键切换结果。
