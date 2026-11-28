---
title: Toast 轻提示
description: 使用 Toast 在 Halo 插件中展示自动消失的轻量提示消息，支持成功、信息、警告、错误与加载状态，以及堆叠、合并和操作按钮
---

`Toast` 用于展示短暂的操作结果提示，会自动消失，不需要用户确认。它通过函数调用，不需要在模板中声明组件，也不需要自己挂载容器。

从 Halo 2.28.0 开始，`Toast` 基于 Reka UI 重做：所有提示共用一个通知区域，可以堆叠显示、合并重复消息、暂停倒计时，并补齐了键盘操作和读屏播报。原有的 `Toast.success/info/warning/error(content, props?)` 调用方式保持不变，已有代码无需修改。

## 引入

```ts
import { Toast } from "@halo-dev/components";
```

## 示例

### 不同类型

```vue preview
<script lang="ts" setup>
import { Toast, VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VButton @click="Toast.success('保存成功')">成功</VButton>
    <VButton @click="Toast.info('正在同步数据')">信息</VButton>
    <VButton @click="Toast.warning('配置将在重启后生效')">警告</VButton>
    <VButton @click="Toast.error('保存失败，请重试')">错误</VButton>
  </VSpace>
</template>
```

### 标题与操作按钮

`title` 会显示在内容上方；`action` 在内容下方渲染一个操作按钮，适合「撤销」「查看详情」这类可以立即处理的提示。点击操作按钮后默认关闭该提示，可以通过 `closeOnClick` 关闭这一行为。

```vue preview
<script lang="ts" setup>
import { Toast, VButton } from "@halo-dev/components";

function showToast() {
  Toast.success("文章已移至回收站", {
    title: "操作完成",
    action: {
      label: "撤销",
      onClick: () => {
        Toast.info("已撤销删除");
      },
    },
  });
}
</script>

<template>
  <VButton @click="showToast">显示带操作的提示</VButton>
</template>
```

### 加载中与异步结果

`Toast.loading` 显示的提示不会自动消失，需要用 `Toast.update` 或 `Toast.dismiss` 结束；`Toast.promise` 把这三步合并在一起，等待期间显示加载状态，成功或失败后自动变成对应类型的提示。

```vue preview
<script lang="ts" setup>
import { Toast, VButton, VSpace } from "@halo-dev/components";

async function save() {
  await Toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
    loading: "正在保存",
    success: "保存成功",
    error: "保存失败，请重试",
  });
}

function manual() {
  const instance = Toast.loading("正在同步数据");
  setTimeout(() => {
    Toast.update(instance.id, {
      type: "success",
      content: "同步完成",
      status: "success",
    });
  }, 1500);
}
</script>

<template>
  <VSpace>
    <VButton type="primary" @click="save">保存</VButton>
    <VButton @click="manual">手动更新</VButton>
  </VSpace>
</template>
```

`success` 和 `error` 也可以传函数，根据结果生成内容，`Toast.promise` 会把原始 Promise 的结果或错误继续抛给调用方：

```ts
await Toast.promise(createPost(payload), {
  loading: "正在发布",
  success: (post) => `《${post.title}》已发布`,
  error: (error) => (error instanceof Error ? error.message : "发布失败"),
});
```

### 复用同一条提示

传入固定的 `key` 时，相同 `key` 的提示不会被重复创建，而是更新已有的那一条。适合进度提示、批量操作等需要反复刷新同一条消息的场景。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { Toast, VButton } from "@halo-dev/components";

const progress = ref(0);

function start() {
  progress.value = 0;
  const timer = setInterval(() => {
    progress.value += 20;
    const instance = Toast.info(`已处理 ${progress.value}%`, {
      key: "import-progress",
      duration: 0,
    });
    if (progress.value >= 100) {
      clearInterval(timer);
      instance.close();
    }
  }, 600);
}
</script>

<template>
  <VButton @click="start">开始导入</VButton>
</template>
```

### 不自动消失

将 `duration` 设为 `0` 或负数，提示会一直显示，直到用户手动关闭。

```vue preview
<script lang="ts" setup>
import { Toast, VButton } from "@halo-dev/components";

function showToast() {
  Toast.warning("需要手动关闭这条提示", {
    duration: -1,
    closable: true,
  });
}
</script>

<template>
  <VButton @click="showToast">显示常驻提示</VButton>
</template>
```

## Toast 函数

| 方法                              | 参数                                   | 说明                                                  |
| --------------------------------- | -------------------------------------- | ----------------------------------------------------- |
| `Toast(options)`                  | `ToastProps`                           | 按配置显示提示                                        |
| `Toast.success(content, props?)`  | `string`, `ToastApiProps`              | 显示成功提示                                          |
| `Toast.info(content, props?)`     | `string`, `ToastApiProps`              | 显示信息提示                                          |
| `Toast.warning(content, props?)`  | `string`, `ToastApiProps`              | 显示警告提示                                          |
| `Toast.error(content, props?)`    | `string`, `ToastApiProps`              | 显示错误提示                                          |
| `Toast.loading(content, props?)`  | `string`, `ToastApiProps`              | 显示加载提示，不会自动关闭，也不会合并重复消息        |
| `Toast.promise(promise, options)` | `Promise<T>`, `ToastPromiseOptions<T>` | 显示加载提示，并在 Promise 结束后更新为成功或失败提示 |
| `Toast.update(id, props?)`        | `string`, `ToastProps`                 | 更新仍未关闭的提示，未传入的属性沿用原值              |
| `Toast.dismiss(id?)`              | `string`                               | 关闭指定提示；不传 `id` 时关闭全部提示                |
| `Toast.clear()`                   | —                                      | 关闭全部提示                                          |

`ToastApiProps` 是去掉 `type` 和 `content` 的 `ToastProps`，因为这两个属性由具体方法决定。

## Props

| 属性            | 类型                                          | 默认值      | 说明                                                           |
| --------------- | --------------------------------------------- | ----------- | -------------------------------------------------------------- |
| `type`          | `"success" \| "info" \| "warning" \| "error"` | `"success"` | 提示类型，决定图标与颜色                                       |
| `content`       | `string`                                      | `""`        | 提示内容                                                       |
| `title`         | `string`                                      | `undefined` | 内容上方的标题                                                 |
| `duration`      | `number`                                      | `3000`      | 显示时长（毫秒），设为 `0` 或负数时不自动关闭                  |
| `closable`      | `boolean`                                     | `true`      | 是否显示关闭按钮                                               |
| `icon`          | `Component`                                   | `undefined` | 覆盖由 `type` 推导出的图标                                     |
| `action`        | `ToastActionOptions`                          | `undefined` | 内容下方的操作按钮                                             |
| `customClass`   | `string`                                      | `undefined` | 追加到提示元素上的类名                                         |
| `key`           | `string`                                      | `undefined` | 固定标识，相同 `key` 会更新同一条提示而不是新增                |
| `grouping`      | `boolean`                                     | `true`      | 合并类型和内容都相同的提示，并显示重复次数                     |
| `status`        | `"loading" \| "success" \| "error"`           | `undefined` | 通知状态，影响读屏播报方式和图标；`loading` 时提示不会自动关闭 |
| `count`         | `number`                                      | `0`         | 重复次数，合并提示时由组件累加，一般不需要手动传入             |
| `frozenOnHover` | `boolean`                                     | `true`      | 已废弃：现在始终在鼠标悬停或键盘焦点进入通知区域时暂停倒计时   |
| `onClose`       | `() => void`                                  | `undefined` | 提示关闭时调用                                                 |

### ToastActionOptions

| 属性           | 类型                          | 默认值      | 说明                   |
| -------------- | ----------------------------- | ----------- | ---------------------- |
| `label`        | `string`                      | —           | 按钮文案               |
| `altText`      | `string`                      | `label`     | 读屏软件朗读的操作说明 |
| `closeOnClick` | `boolean`                     | `true`      | 点击后是否关闭该提示   |
| `onClick`      | `(event: MouseEvent) => void` | `undefined` | 点击时调用             |

### ToastPromiseOptions

| 属性      | 类型                                                                 | 说明                             |
| --------- | -------------------------------------------------------------------- | -------------------------------- |
| `loading` | `string \| ToastProps`                                               | 加载中的提示                     |
| `success` | `string \| ToastProps \| ((value: T) => string \| ToastProps)`       | 成功后的提示，可传函数按结果生成 |
| `error`   | `string \| ToastProps \| ((error: unknown) => string \| ToastProps)` | 失败后的提示，可传函数按错误生成 |

## 返回值

`Toast` 函数返回一个实例对象：

| 属性    | 类型         | 说明                                              |
| ------- | ------------ | ------------------------------------------------- |
| `id`    | `string`     | 实例 ID，可用于 `Toast.update` 和 `Toast.dismiss` |
| `close` | `() => void` | 手动关闭该提示                                    |
| `vnode` | `VNode`      | 已废弃：提示不再渲染为独立的 VNode                |

## 行为说明

:::tip
连续显示内容相同、类型相同的提示时，会合并为一个提示并显示出现次数；带 `status` 或 `key` 的提示不参与合并。可以用 `grouping: false` 关闭合并。
:::

- 多条提示依次堆叠，相邻提示保持 10 像素间距，最新的提示最靠近屏幕边缘；每条提示按内容收缩宽度，最宽 22rem，窄屏下为视口宽度减去 2rem，长文本自动换行。
- 通知区域固定在顶部居中（`top-center`），最多同时显示 5 条提示，超出时最旧的一条自动关闭；显示时长、条数上限和快捷键不提供全局配置，单条提示的时长通过 `duration` 设置。
- 鼠标悬停或键盘焦点进入通知区域、以及窗口失去焦点时，自动关闭会暂停，离开后按剩余时间继续。
- 错误提示会被读屏软件立即播报，其他类型在合适时机播报；按 `F8` 可以把焦点移到通知区域，按 `Esc` 关闭提示，关闭按钮本身就是带无障碍名称的按钮。
- 向右滑动或拖拽可以关闭提示，减少动态效果的系统设置下会跳过入场和退出动画。
