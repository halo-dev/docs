---
title: 日期选择
description: 使用 VDatePickerPanel、VDateTimePickerPanel、VDateRangePickerPanel 等组件在 Halo 插件中选择日期、日期时间和日期范围，支持预设范围、可选范围限制和筛选栏变体
---

日期选择组件用于替代浏览器原生的 `datetime-local` 输入框。原生输入在不同浏览器中的行为不一致，例如 Firefox 不提供时间选择器，这些组件提供统一的日历与时间选择体验。Halo 控制台和用户中心的发布时间、个人访问令牌过期时间等输入框已经使用它们。

**引入版本**：2.28.0

## 引入

```ts
import {
  VDatePickerDropdown,
  VDatePickerPanel,
  VDateRangePickerDropdown,
  VDateRangePickerPanel,
  VDateTimePickerPanel,
  VDateTimeRangePickerPanel,
  VFilterDateRangeDropdown,
} from "@halo-dev/components";
```

组件分为两类：面板（Panel）只渲染日历和时间输入，适合嵌入自己的弹层；下拉（Dropdown）在面板外提供触发器、打开状态和确认操作。

## 值与格式

所有组件的值都是普通字符串，调用方不需要依赖 `@internationalized/date` 的类型：

| 组件                                               | 值类型                        | 格式                                                   |
| -------------------------------------------------- | ----------------------------- | ------------------------------------------------------ |
| 日期面板、日期下拉（`mode` 为 `date`）             | `string \| undefined`         | `YYYY-MM-DD`                                           |
| 日期时间面板、日期时间下拉（`mode` 为 `datetime`） | `string \| undefined`         | `YYYY-MM-DDTHH:mm`，精确到分钟                         |
| 日期范围面板与下拉、筛选日期范围                   | `DateRangeValue \| undefined` | `{ start?: string; end?: string }`，两端使用上面的格式 |

范围值允许只包含 `start` 或只包含 `end`，例如用户只选了开始日期；两者都为空时值为 `undefined`。面板会按原样输出用户当前的选择，下拉组件则在范围完整后才提交。

## 日期面板 VDatePickerPanel

面板只渲染日历，选中某一天后立即更新值：

```vue preview
<script lang="ts" setup>
import { VDatePickerPanel } from "@halo-dev/components";
import { ref } from "vue";

const date = ref<string>();
</script>

<template>
  <div class="space-y-2">
    <div
      class="inline-flex overflow-hidden rounded-md border border-gray-200 bg-white"
    >
      <VDatePickerPanel v-model="date" locale="zh-CN" :week-starts-on="1" />
    </div>
    <p class="text-sm text-gray-500">{{ date ?? "未选择日期" }}</p>
  </div>
</template>
```

`locale` 默认为 `en`，用于日历中的月份和星期名称。`weekStartsOn` 取 `0` 到 `6`，`0` 表示周日，省略时使用该语言的默认值。

## 日期时间面板 VDateTimePickerPanel

在日历下方增加时间输入：

```vue preview
<script lang="ts" setup>
import { VDateTimePickerPanel } from "@halo-dev/components";
import { ref } from "vue";

const publishTime = ref<string>();
</script>

<template>
  <div class="space-y-2">
    <div
      class="inline-flex overflow-hidden rounded-md border border-gray-200 bg-white"
    >
      <VDateTimePickerPanel
        v-model="publishTime"
        locale="zh-CN"
        default-time="09:00"
        :week-starts-on="1"
      />
    </div>
    <p class="text-sm text-gray-500">{{ publishTime ?? "未选择时间" }}</p>
  </div>
</template>
```

选择一个日期时，组件会把该日期和当前时间组合后输出；`defaultTime` 决定还没有时间时使用的时间，默认为 `00:00`。只修改时间而尚未选择日期时不会输出值。

## 日期范围面板 VDateRangePickerPanel

范围面板默认并排渲染两个月的日历，并可以通过 `presets` 提供快捷范围：

```vue preview
<script lang="ts" setup>
import {
  VDateRangePickerPanel,
  type DatePickerPreset,
  type DateRangeValue,
} from "@halo-dev/components";
import { ref } from "vue";

const range = ref<DateRangeValue>();

function toDateString(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toDateString(date);
}

const presets: DatePickerPreset<DateRangeValue>[] = [
  {
    label: "最近 7 天",
    value: () => ({ start: daysAgo(6), end: toDateString(new Date()) }),
  },
  {
    label: "最近 30 天",
    value: () => ({ start: daysAgo(29), end: toDateString(new Date()) }),
  },
];
</script>

<template>
  <div class="space-y-2">
    <div
      class="inline-flex overflow-hidden rounded-md border border-gray-200 bg-white"
    >
      <VDateRangePickerPanel
        v-model="range"
        locale="zh-CN"
        :presets="presets"
        :week-starts-on="1"
      />
    </div>
    <p class="text-sm text-gray-500">
      {{ range ? `${range.start ?? "…"} ~ ${range.end ?? "…"}` : "未选择范围" }}
    </p>
  </div>
</template>
```

`presets` 中的 `value` 可以是固定值，也可以是返回范围值的函数；函数在点击预设时执行，因此「今天」「最近 7 天」这类相对范围始终以点击时的日期计算。`maximumDays` 限制一次能选择的最大天数，`allowNonContiguousRanges` 允许选择包含不可选日期的范围。

## 日期时间范围面板 VDateTimeRangePickerPanel

日期时间范围在范围面板下方增加开始和结束时间：

```vue preview
<script lang="ts" setup>
import { VDateTimeRangePickerPanel } from "@halo-dev/components";
import { ref } from "vue";

const range = ref<{
  start?: string;
  end?: string;
}>();
</script>

<template>
  <div class="space-y-2">
    <div
      class="inline-flex overflow-hidden rounded-md border border-gray-200 bg-white"
    >
      <VDateTimeRangePickerPanel
        v-model="range"
        locale="zh-CN"
        :week-starts-on="1"
      />
    </div>
    <p class="text-sm text-gray-500">
      {{ range ? `${range.start ?? "…"} ~ ${range.end ?? "…"}` : "未选择范围" }}
    </p>
  </div>
</template>
```

新选择开始日期时使用 `defaultStartTime`（默认 `00:00`），结束日期使用 `defaultEndTime`（默认 `23:59`）。对应的日期还没有选择时，该端的时间输入处于禁用状态。

## 日期下拉 VDatePickerDropdown

下拉组件只渲染 `trigger` 插槽和面板，触发器由调用方提供，和 `VDropdown` 的用法一致：

```vue preview
<script lang="ts" setup>
import { IconCalendar, VDatePickerDropdown } from "@halo-dev/components";
import { ref } from "vue";

const date = ref<string>();
</script>

<template>
  <VDatePickerDropdown v-model="date" mode="date" locale="zh-CN">
    <template #trigger="{ open }">
      <button
        type="button"
        class="inline-flex h-9 items-center gap-2 rounded-md border bg-white px-3 text-sm"
        :class="open ? 'border-primary' : 'border-gray-300'"
      >
        <IconCalendar class="size-4 text-gray-500" />
        <span :class="date ? 'text-gray-900' : 'text-gray-400'">
          {{ date ?? "选择日期" }}
        </span>
      </button>
    </template>
  </VDatePickerDropdown>
</template>
```

`mode` 为 `date` 时，选中日期后立即更新 `v-model` 并触发 `select` 事件，同时关闭面板。`mode` 为 `datetime` 时，面板底部会出现清除和确认按钮：选择过程只修改草稿，点击确认后才更新值并触发 `select`，点击清除只清空草稿。用 `v-model:open` 可以控制面板的打开状态。

日期模式下没有底部操作栏。需要在界面中清除已有值时，由调用方提供清除按钮并把值设为 `undefined`。

## 日期范围下拉 VDateRangePickerDropdown

```vue preview
<script lang="ts" setup>
import { IconCalendar, VDateRangePickerDropdown } from "@halo-dev/components";
import { ref } from "vue";

const range = ref<{ start?: string; end?: string }>();

function display() {
  if (!range.value) {
    return "选择时间范围";
  }

  return `${range.value.start ?? "…"} ~ ${range.value.end ?? "…"}`;
}
</script>

<template>
  <VDateRangePickerDropdown v-model="range" mode="date-range" locale="zh-CN">
    <template #trigger="{ open }">
      <button
        type="button"
        class="inline-flex h-9 items-center gap-2 rounded-md border bg-white px-3 text-sm"
        :class="open ? 'border-primary' : 'border-gray-300'"
      >
        <IconCalendar class="size-4 text-gray-500" />
        <span :class="range ? 'text-gray-900' : 'text-gray-400'">
          {{ display() }}
        </span>
      </button>
    </template>
  </VDateRangePickerDropdown>
</template>
```

`mode` 为 `date-range` 时，两端都选择完成后才更新值并关闭面板；`mode` 为 `datetime-range` 时使用底部的确认按钮提交，范围不完整时确认按钮不可用。

## 筛选日期范围 VFilterDateRangeDropdown

筛选栏中的日期范围筛选，配合 [VFilterDropdownGroup](./filter-dropdown.md) 使用：

```vue preview
<script lang="ts" setup>
import {
  VFilterDateRangeDropdown,
  VFilterDropdown,
  VFilterDropdownGroup,
} from "@halo-dev/components";
import { ref } from "vue";

const range = ref<{ start?: string; end?: string }>();
const category = ref<string>();
</script>

<template>
  <VFilterDropdownGroup>
    <VFilterDateRangeDropdown v-model="range" label="创建时间" locale="zh-CN" />
    <VFilterDropdown
      v-model="category"
      label="分类"
      :options="[
        { label: '教程', value: 'tutorial' },
        { label: '资讯', value: 'news' },
      ]"
    />
  </VFilterDropdownGroup>
</template>
```

筛选变体会把自身注册到所在的 `VFilterDropdownGroup`，因此组的「清除筛选」按钮可以同时清空日期范围。触发器在未选择时显示 `label`，选择后显示 `创建时间：2026-11-01 ~ 2026-11-20`，缺失的一端用省略号表示；分隔符可以通过 `labelSeparator` 和 `rangeSeparator` 修改。

筛选变体只保留筛选栏需要的参数，不支持最小、最大日期和最多天数等限制。需要这些限制时，直接使用 `VDateRangePickerDropdown` 并自行渲染筛选样式的触发器。

## 面板通用属性

以下属性适用于全部面板，也被对应的下拉组件透传：

| 属性                 | 类型                              | 默认值       | 说明                                                              |
| -------------------- | --------------------------------- | ------------ | ----------------------------------------------------------------- |
| `modelValue`         | 见[值与格式](#值与格式)           | `undefined`  | 当前值，支持 `v-model`                                            |
| `locale`             | `string`                          | `"en"`       | 日历使用的语言，例如 `zh-CN`                                      |
| `weekStartsOn`       | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | -            | 每周的第一天，`0` 为周日                                          |
| `numberOfMonths`     | `number`                          | `1`          | 并排显示的月数，范围面板默认为 `2`                                |
| `fixedWeeks`         | `boolean`                         | `true`       | 始终渲染六周，保持面板高度稳定                                    |
| `minValue`           | `string`                          | -            | 可选的最小日期，`YYYY-MM-DD`，在日期时间中按日期比较              |
| `maxValue`           | `string`                          | -            | 可选的最大日期，格式同上                                          |
| `isDateDisabled`     | `(date: string) => boolean`       | -            | 为每个渲染的日期调用，参数为 `YYYY-MM-DD`，返回 `true` 表示不可选 |
| `defaultPickerValue` | `string`                          | -            | 没有值时面板显示的月份                                            |
| `calendarLabel`      | `string`                          | `"Calendar"` | 日历网格的无障碍标签                                              |
| `disabled`           | `boolean`                         | `false`      | 是否禁用                                                          |
| `readonly`           | `boolean`                         | `false`      | 是否只读                                                          |

## 面板专属属性

| 组件                        | 属性                       | 类型                                 | 默认值    | 说明                             |
| --------------------------- | -------------------------- | ------------------------------------ | --------- | -------------------------------- |
| `VDateTimePickerPanel`      | `defaultTime`              | `string`                             | `"00:00"` | 选择日期时使用的时间             |
|                             | `hourCycle`                | `12 \| 24`                           | `24`      | 时间输入的 12 或 24 小时制       |
|                             | `timeLabel`                | `string`                             | `"Time"`  | 时间输入左侧的文字               |
| `VDateRangePickerPanel`     | `presets`                  | `DatePickerPreset<DateRangeValue>[]` | -         | 日历左侧的快捷范围列表           |
|                             | `maximumDays`              | `number`                             | -         | 一次能选择的最大天数             |
|                             | `allowNonContiguousRanges` | `boolean`                            | -         | 是否允许选择包含不可选日期的范围 |
| `VDateTimeRangePickerPanel` | `presets`                  | `DatePickerPreset<DateRangeValue>[]` | -         | 日历左侧的快捷范围列表           |
|                             | `maximumDays`              | `number`                             | -         | 一次能选择的最大天数             |
|                             | `allowNonContiguousRanges` | `boolean`                            | -         | 是否允许选择包含不可选日期的范围 |
|                             | `defaultStartTime`         | `string`                             | `"00:00"` | 新选择开始日期时使用的时间       |
|                             | `defaultEndTime`           | `string`                             | `"23:59"` | 新选择结束日期时使用的时间       |
|                             | `hourCycle`                | `12 \| 24`                           | `24`      | 时间输入的 12 或 24 小时制       |
|                             | `startTimeLabel`           | `string`                             | `"Start"` | 开始时间左侧的文字               |
|                             | `endTimeLabel`             | `string`                             | `"End"`   | 结束时间左侧的文字               |

## 面板事件

| 事件                | 参数                                                                   | 说明           |
| ------------------- | ---------------------------------------------------------------------- | -------------- |
| `update:modelValue` | 日期为 `string \| undefined`，范围面板为 `DateRangeValue \| undefined` | 选择变化时触发 |

## 下拉属性

除了面板通用属性，下拉组件还接受：

| 属性           | 类型                                                         | 默认值                                  | 说明                                                  |
| -------------- | ------------------------------------------------------------ | --------------------------------------- | ----------------------------------------------------- |
| `mode`         | `"date" \| "datetime"` 或 `"date-range" \| "datetime-range"` | `"date"` / `"date-range"`               | 渲染哪种面板                                          |
| `placement`    | `VDropdownPlacement`                                         | `"bottom-start"`                        | 面板出现的位置，可选值参考 [VDropdown](./dropdown.md) |
| `panelWidth`   | `string`                                                     | -                                       | 面板宽度，例如 `20rem`；默认根据内容自适应            |
| `panelLabel`   | `string`                                                     | `"Date picker"` / `"Date range picker"` | 面板的无障碍标签                                      |
| `open`         | `boolean`                                                    | -                                       | 受控的打开状态，支持 `v-model:open`                   |
| `confirmLabel` | `string`                                                     | `"Confirm"`                             | 确认按钮的文字，仅日期时间模式使用                    |
| `clearLabel`   | `string`                                                     | `"Clear"`                               | 清除按钮的文字，仅日期时间模式使用                    |

`VDateRangePickerDropdown` 另外接受 `presets`、`maximumDays`、`allowNonContiguousRanges`、`defaultStartTime`、`defaultEndTime`、`hourCycle`、`startTimeLabel`、`endTimeLabel`，含义与日期时间范围面板相同。

## 下拉插槽

| 插槽      | 参数                   | 说明                                                              |
| --------- | ---------------------- | ----------------------------------------------------------------- |
| `trigger` | `open`、`show`、`hide` | 触发器内容，组件只负责渲染它和面板；`show`、`hide` 可手动控制面板 |

## 下拉事件

| 事件                | 参数                                                               | 说明                                         |
| ------------------- | ------------------------------------------------------------------ | -------------------------------------------- |
| `update:modelValue` | 日期为 `string \| undefined`，范围为 `DateRangeValue \| undefined` | 值变化时触发                                 |
| `update:open`       | `open: boolean`                                                    | 面板打开或关闭时触发                         |
| `select`            | 日期为 `string`，范围为 `DateRangeValue`                           | 提交选择时触发，范围下拉只在两端都选中时触发 |

## VFilterDateRangeDropdown 属性

| 属性             | 类型                                 | 默认值           | 说明                       |
| ---------------- | ------------------------------------ | ---------------- | -------------------------- |
| `label`          | `string`                             | 无，必填         | 触发器上的文字             |
| `modelValue`     | `DateRangeValue \| undefined`        | `undefined`      | 当前范围，支持 `v-model`   |
| `mode`           | `"date-range" \| "datetime-range"`   | `"date-range"`   | 渲染哪种范围面板           |
| `variant`        | `"default" \| "outline"`             | `"default"`      | 触发器的样式               |
| `presets`        | `DatePickerPreset<DateRangeValue>[]` | -                | 面板左侧的快捷范围列表     |
| `labelSeparator` | `string`                             | `": "`           | 标签与范围之间的分隔符     |
| `rangeSeparator` | `string`                             | `" ~ "`          | 开始与结束之间的分隔符     |
| `confirmLabel`   | `string`                             | `"Confirm"`      | 确认按钮的文字             |
| `clearLabel`     | `string`                             | `"Clear"`        | 清除按钮的文字             |
| `hourCycle`      | `12 \| 24`                           | `24`             | 时间输入的 12 或 24 小时制 |
| `startTimeLabel` | `string`                             | `"Start"`        | 开始时间左侧的文字         |
| `endTimeLabel`   | `string`                             | `"End"`          | 结束时间左侧的文字         |
| `locale`         | `string`                             | `"en"`           | 日历使用的语言             |
| `disabled`       | `boolean`                            | `false`          | 是否禁用                   |
| `placement`      | `VDropdownPlacement`                 | `"bottom-start"` | 面板出现的位置             |
| `panelWidth`     | `string`                             | -                | 面板宽度                   |

## VFilterDateRangeDropdown 事件与方法

| 事件                | 参数                                 | 说明           |
| ------------------- | ------------------------------------ | -------------- |
| `update:modelValue` | `value: DateRangeValue \| undefined` | 范围变化时触发 |

通过模板引用调用 `clear()` 可以清空当前范围，`VFilterDropdownGroup` 的清除操作也会调用它。

## 类型

| 类型                          | 定义                                       |
| ----------------------------- | ------------------------------------------ |
| `DateRangeValue`              | `{ start?: string; end?: string }`         |
| `DatePickerPreset<T>`         | `{ label: string; value: T \| (() => T) }` |
| `DatePickerWeekStart`         | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6`          |
| `DatePickerDropdownMode`      | `"date" \| "datetime"`                     |
| `DateRangePickerDropdownMode` | `"date-range" \| "datetime-range"`         |
