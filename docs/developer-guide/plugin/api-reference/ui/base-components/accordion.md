---
title: VAccordion 折叠面板
description: 使用 VAccordion 和 VAccordionItem 在 Halo 插件中分组展示可展开收起的内容，支持多种外观、箭头位置与动画时长、标题层级、前置图标和自定义箭头
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

`type="single"` 时同时只展开一项，`collapsible` 表示允许再次点击已展开的标题收起。默认的 `default` 样式把各项渲染成一组之间带分隔线的列表，不额外加外框。

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

### 外观布局

`variant` 决定折叠面板的外观：

| 值          | 外观                                                       |
| ----------- | ---------------------------------------------------------- |
| `default`   | 默认值。各项之间用分隔线区分的列表，没有外框               |
| `bordered`  | 整个面板是一个带边框的圆角卡片，展开项带浅色背景           |
| `filled`    | 每个折叠项是独立的圆角块，展开时填充浅色背景               |
| `separated` | 每个折叠项是独立的卡片，项与项之间留出间距                 |
| `plain`     | 去掉容器的边框、背景和内边距，适合嵌入已有的卡片或表单区域 |

`bordered` 适合把一组设置收在同一个卡片里。

```vue
<script lang="ts" setup>
import { VAccordion, VAccordionItem } from "@halo-dev/components";
</script>

<template>
  <VAccordion variant="bordered" type="single" collapsible>
    <VAccordionItem value="general" title="通用设置">
      <p class="text-sm text-gray-600">在这里配置通用选项。</p>
    </VAccordionItem>
    <VAccordionItem value="publishing" title="发布设置">
      <p class="text-sm text-gray-600">在这里配置发布选项。</p>
    </VAccordionItem>
  </VAccordion>
</template>
```

`separated` 适合多个并列的分组，每项独立成卡片。

```vue
<script lang="ts" setup>
import { VAccordion, VAccordionItem } from "@halo-dev/components";
</script>

<template>
  <VAccordion variant="separated" type="multiple" :default-value="['general']">
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

### 箭头方向与动画

默认的箭头是一个向下的箭头，展开时旋转 180°。`chevron-position="left"` 把箭头放到标题左侧，此时前置图标会移到右侧以保持两侧平衡；`disable-chevron-rotation` 让箭头保持静止；`transition-duration` 用毫秒设置展开收起和箭头旋转的时长，设为 `0` 关闭动画。系统开启了“减少动态效果”时动画同样会关闭。

```vue
<script lang="ts" setup>
import { VAccordion, VAccordionItem } from "@halo-dev/components";
</script>

<template>
  <VAccordion
    type="single"
    collapsible
    chevron-position="left"
    :transition-duration="0"
  >
    <VAccordionItem value="general" title="通用设置">
      <p class="text-sm text-gray-600">箭头在左侧，展开和收起没有动画。</p>
    </VAccordionItem>
    <VAccordionItem value="advanced" title="高级设置">
      <p class="text-sm text-gray-600">在这里配置高级选项。</p>
    </VAccordionItem>
  </VAccordion>
</template>
```

### 前置图标与自定义箭头

`VAccordionItem` 的 `leading-icon` 接收一个图标组件，显示在标题文字之前。需要替换箭头时，可以给某一项传 `chevron` 或使用 `chevron` 插槽；如果整个面板用同一个箭头，在 `VAccordion` 上写一次 `#chevron` 插槽即可，它会转发给每个折叠项。

```vue
<script lang="ts" setup>
import {
  IconArrowRight,
  IconSettings,
  VAccordion,
  VAccordionItem,
} from "@halo-dev/components";
</script>

<template>
  <VAccordion type="single" collapsible :disable-chevron-rotation="true">
    <template #chevron>
      <IconArrowRight class="h-4 w-4" />
    </template>
    <VAccordionItem
      value="general"
      title="通用设置"
      :leading-icon="IconSettings"
    >
      <p class="text-sm text-gray-600">标题前有一个设置图标。</p>
    </VAccordionItem>
    <VAccordionItem value="advanced" title="高级设置">
      <p class="text-sm text-gray-600">所有项共用面板上定义的箭头。</p>
    </VAccordionItem>
  </VAccordion>
</template>
```

`VAccordionItem` 自己的 `chevron` 插槽优先于面板上的 `#chevron`，原有的 `icon` 插槽也仍然可用，插槽参数里都有当前项的 `open` 状态。

### 标题层级

折叠项的标题默认渲染为 `h3`。用 `order` 可以把整个面板的标题层级统一改成 `h2` 到 `h6`，需要单独调整某一项时使用该项的 `header-as`。

```vue
<script lang="ts" setup>
import { VAccordion, VAccordionItem } from "@halo-dev/components";
</script>

<template>
  <VAccordion type="single" collapsible :order="4">
    <VAccordionItem value="general" title="通用设置">
      <p class="text-sm text-gray-600">这一项渲染为 h4。</p>
    </VAccordionItem>
    <VAccordionItem value="advanced" title="高级设置" header-as="div">
      <p class="text-sm text-gray-600">这一项渲染为 div，不进入文档大纲。</p>
    </VAccordionItem>
  </VAccordion>
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

## 样式定制

每一项的各个部分都可以单独加类名：`trigger-class`、`label-class`、`leading-class`、`chevron-class`、`content-class`；也可以用 `class-names` 一次性传入 `item`、`trigger`、`label`、`leading`、`chevron`、`content` 六个部分。两部分会合并生效，`class-names` 里同名的键与单独的 `*Class` 属性同时存在时都会应用。

```vue
<script lang="ts" setup>
import { VAccordion, VAccordionItem } from "@halo-dev/components";
</script>

<template>
  <VAccordion type="single" collapsible>
    <VAccordionItem
      value="general"
      title="通用设置"
      :class-names="{
        trigger: 'px-2',
        label: 'font-semibold',
        content: 'text-gray-500',
      }"
    >
      <p>通过 classNames 调整这一个折叠项的内边距和文字样式。</p>
    </VAccordionItem>
  </VAccordion>
</template>
```

## VAccordion Props

| 属性                     | 类型                                                            | 默认值      | 说明                                                                             |
| ------------------------ | --------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------- |
| `type`                   | `"single" \| "multiple"`                                        | `undefined` | 展开模式：`single` 同时只展开一项，`multiple` 可同时展开多项                     |
| `collapsible`            | `boolean`                                                       | `false`     | `single` 模式下是否允许再次点击已展开项将其收起                                  |
| `modelValue`             | `string \| string[]`                                            | `undefined` | 当前展开项的 `value`，支持 `v-model`                                             |
| `defaultValue`           | `string \| string[]`                                            | `undefined` | 非受控使用时初始展开的项                                                         |
| `disabled`               | `boolean`                                                       | `false`     | 是否禁用整个面板                                                                 |
| `unmountOnHide`          | `boolean`                                                       | `false`     | 收起后是否卸载内容                                                               |
| `variant`                | `"default" \| "bordered" \| "filled" \| "separated" \| "plain"` | `"default"` | 外观布局                                                                         |
| `chevronPosition`        | `"left" \| "right"`                                             | `"right"`   | 箭头在标题的左侧还是右侧                                                         |
| `disableChevronRotation` | `boolean`                                                       | `false`     | 展开时箭头不旋转                                                                 |
| `transitionDuration`     | `number`                                                        | `200`       | 展开收起和箭头旋转的时长，单位毫秒，`0` 关闭动画                                 |
| `order`                  | `2 \| 3 \| 4 \| 5 \| 6`                                         | `undefined` | 标题渲染的标题层级，对应 `h2` 到 `h6`；不设置时为 `h3`，可被项的 `headerAs` 覆盖 |

## VAccordionItem Props

| 属性            | 类型                                                              | 默认值      | 说明                                                                            |
| --------------- | ----------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------- |
| `value`         | `string`                                                          | 必填        | 项的唯一标识，与 `v-model` 的值对应                                             |
| `title`         | `string`                                                          | `undefined` | 标题文字，需要自定义内容时使用 `trigger` 插槽                                   |
| `disabled`      | `boolean`                                                         | `false`     | 是否禁用该项                                                                    |
| `headerAs`      | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" \| "div" \| "span"` | `undefined` | 包裹标题的标签，默认跟随面板的 `order`；嵌在卡片里时可用 `div` 避免影响文档大纲 |
| `unmountOnHide` | `boolean`                                                         | `undefined` | 覆盖根组件的同名设置                                                            |
| `forceMount`    | `boolean`                                                         | `false`     | 收起时也保留内容挂载                                                            |
| `leadingIcon`   | `Component`                                                       | `undefined` | 标题前显示的图标组件                                                            |
| `chevron`       | `Component`                                                       | `undefined` | 这一项使用的箭头组件，`chevron` 插槽优先                                        |
| `triggerClass`  | `string \| string[] \| Record<string, boolean>`                   | `undefined` | 标题区域的附加类名                                                              |
| `labelClass`    | `string \| string[] \| Record<string, boolean>`                   | `undefined` | 标题文字的附加类名                                                              |
| `leadingClass`  | `string \| string[] \| Record<string, boolean>`                   | `undefined` | 前置图标区域的附加类名                                                          |
| `chevronClass`  | `string \| string[] \| Record<string, boolean>`                   | `undefined` | 箭头区域的附加类名                                                              |
| `contentClass`  | `string \| string[] \| Record<string, boolean>`                   | `undefined` | 内容区域的附加类名                                                              |
| `classNames`    | `VAccordionClassNames`                                            | `undefined` | 一次传入各部分的类名，与上面的 `*Class` 属性合并                                |

## Emits

| 组件         | 事件                | 参数                              | 说明             |
| ------------ | ------------------- | --------------------------------- | ---------------- |
| `VAccordion` | `update:modelValue` | `string \| string[] \| undefined` | 展开项变化时触发 |

## Slots

| 组件             | 插槽      | 参数       | 说明                                                                  |
| ---------------- | --------- | ---------- | --------------------------------------------------------------------- |
| `VAccordion`     | `default` | —          | `VAccordionItem` 列表                                                 |
| `VAccordion`     | `chevron` | `{ open }` | 自定义箭头，自动转发给每个折叠项                                      |
| `VAccordionItem` | `default` | `{ open }` | 展开后显示的内容                                                      |
| `VAccordionItem` | `trigger` | `{ open }` | 自定义标题内容，替代 `title`                                          |
| `VAccordionItem` | `leading` | `{ open }` | 自定义前置内容，替代 `leadingIcon`                                    |
| `VAccordionItem` | `chevron` | `{ open }` | 自定义这一项的箭头，优先于面板的 `chevron` 插槽和该插槽的 `icon` 写法 |
| `VAccordionItem` | `icon`    | `{ open }` | 旧写法，等同项级箭头，优先顺序低于 `chevron` 插槽                     |
