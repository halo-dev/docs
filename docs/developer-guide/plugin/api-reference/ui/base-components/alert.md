---
title: VAlert 提示
description: 使用 VAlert 在 Halo 插件页面中展示成功、信息、警告和错误等提示信息，支持关闭、自定义图标和操作按钮
---

`VAlert` 用于在页面内展示需要用户注意的信息，提供比 Toast 更持久、比 Dialog 更轻量的提示方式。

## 引入

```ts
import { VAlert } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { VAlert } from "@halo-dev/components";
</script>

<template>
  <VAlert
    type="info"
    title="内容已保存为草稿"
    description="发布前仍可继续编辑，草稿会保留最近一次保存的内容。"
  />
</template>
```

### 不同类型

```vue preview
<script lang="ts" setup>
import { VAlert, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace direction="column" align="stretch">
    <VAlert
      type="success"
      title="站点配置已更新"
      description="新的 SEO 和缓存设置已经生效。"
    />
    <VAlert
      type="info"
      title="发现新版本"
      description="Halo 2.27.0 已发布，包含若干问题修复。"
    />
    <VAlert
      type="warning"
      title="插件需要重新加载"
      description="检测到插件配置发生变化，重新加载后才能应用到前台页面。"
    />
    <VAlert
      type="error"
      title="同步失败"
      description="远程内容源暂时不可用，请检查网络连接后重试。"
    />
  </VSpace>
</template>
```

### 带操作按钮

```vue preview
<script lang="ts" setup>
import { VAlert, VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VAlert type="warning" title="存在未保存的更改">
    <template #actions>
      <VSpace spacing="sm">
        <VButton size="sm" type="primary">保存</VButton>
        <VButton size="sm">放弃</VButton>
      </VSpace>
    </template>
  </VAlert>
</template>
```

### 不可关闭

```vue preview
<script lang="ts" setup>
import { VAlert } from "@halo-dev/components";
</script>

<template>
  <VAlert
    type="default"
    title="只读模式"
    description="当前账号没有修改权限。"
    :closable="false"
  />
</template>
```

### 监听关闭事件

`VAlert` 不会自行隐藏，需要在 `close` 事件中控制显示状态。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VAlert, VButton } from "@halo-dev/components";

const visible = ref(true);
</script>

<template>
  <VSpace direction="column" align="start">
    <VAlert
      v-if="visible"
      title="点击右侧关闭按钮可关闭此提示"
      @close="visible = false"
    />
    <VButton v-if="!visible" @click="visible = true">重新显示</VButton>
  </VSpace>
</template>
```

## Props

| 属性          | 类型                                                       | 默认值      | 说明                     |
| ------------- | ---------------------------------------------------------- | ----------- | ------------------------ |
| `type`        | `"default" \| "success" \| "info" \| "warning" \| "error"` | `"default"` | 提示类型，决定图标和配色 |
| `title`       | `string`                                                   | `""`        | 标题                     |
| `description` | `string`                                                   | `""`        | 描述内容                 |
| `closable`    | `boolean`                                                  | `true`      | 是否显示关闭按钮         |

## Emits

| 事件    | 参数 | 说明                                 |
| ------- | ---- | ------------------------------------ |
| `close` | -    | 点击关闭按钮时触发，不会自动隐藏提示 |

## Slots

| 插槽          | 说明                                     |
| ------------- | ---------------------------------------- |
| `icon`        | 自定义图标，默认根据 `type` 显示对应图标 |
| `title`       | 自定义标题                               |
| `description` | 自定义描述内容                           |
| `actions`     | 操作区域，显示在描述下方                 |
