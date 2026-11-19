---
title: VCard 卡片
description: 使用 VCard 在 Halo 插件界面中组织内容，支持标题、头部操作、主体和页脚区域
---

`VCard` 是一个带边框和阴影的内容容器，用来把相关的内容和操作组织在一起。

## 引入

```ts
import { VCard } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { VCard } from "@halo-dev/components";
</script>

<template>
  <VCard title="关于 Halo">
    Halo 是一个强大易用的开源建站工具，拥有丰富的可扩展性。
  </VCard>
</template>
```

### 带头部操作

```vue preview
<script lang="ts" setup>
import { VButton, VCard } from "@halo-dev/components";
</script>

<template>
  <VCard title="文章">
    <template #actions>
      <VButton size="sm" type="primary">新建文章</VButton>
    </template>
    这里展示文章列表。
  </VCard>
</template>
```

### 带页脚

```vue preview
<script lang="ts" setup>
import { VButton, VCard, VSpace } from "@halo-dev/components";
</script>

<template>
  <VCard title="站点信息">
    <p class="text-sm text-gray-600">修改站点名称和描述。</p>
    <template #footer>
      <VSpace>
        <VButton size="sm" type="primary">保存</VButton>
        <VButton size="sm">取消</VButton>
      </VSpace>
    </template>
  </VCard>
</template>
```

### 自定义头部

```vue preview
<script lang="ts" setup>
import { VCard, VTag } from "@halo-dev/components";
</script>

<template>
  <VCard>
    <template #header>
      <div class="flex w-full items-center justify-between px-4 py-3">
        <span class="text-base font-bold">插件设置</span>
        <VTag theme="primary">已启用</VTag>
      </div>
    </template>
    插件设置内容。
  </VCard>
</template>
```

## Props

| 属性        | 类型       | 默认值      | 说明                            |
| ----------- | ---------- | ----------- | ------------------------------- |
| `title`     | `string`   | `undefined` | 卡片标题                        |
| `bodyClass` | `string[]` | `undefined` | 应用到卡片主体区域的 class 列表 |

## Slots

| 插槽      | 说明                                            |
| --------- | ----------------------------------------------- |
| `default` | 卡片主体内容                                    |
| `header`  | 自定义整个头部区域，会覆盖 `title` 和 `actions` |
| `actions` | 头部右侧的操作区域                              |
| `footer`  | 卡片底部区域，存在时才显示                      |
