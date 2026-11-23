---
title: 基础组件
description: 使用 Halo 官方基础组件库 @halo-dev/components 构建与 Console 视觉一致的插件管理界面，包含组件清单、安装方式和在线示例
overview: true
---

`@halo-dev/components` 是 Halo 官方维护的基础组件库，Halo Console 和用户中心的界面均由这套组件构建。在插件中使用它可以获得与 Halo 一致的外观和交互。

## 安装

```bash
pnpm install @halo-dev/components
```

在 Vue 组件中按需引入：

```vue
<script lang="ts" setup>
import { VButton } from "@halo-dev/components";
</script>

<template>
  <VButton type="primary">Hello</VButton>
</template>
```

:::warning 适用范围
此组件库只适用于 Halo 和 Halo 插件，不建议作为通用组件库使用。
:::

## 组件列表

### 通用

| 组件                                      | 说明                               |
| ----------------------------------------- | ---------------------------------- |
| [按钮 VButton](./button.md)               | 触发操作，支持类型、尺寸、加载状态 |
| [间距 VSpace](./space.md)                 | 控制子元素之间的间距               |
| [卡片 VCard](./card.md)                   | 带标题、操作和页脚的内容容器       |
| [描述列表 VDescription](./description.md) | 以键值对形式展示详情               |
| [页头 VPageHeader](./header.md)           | 页面标题与操作区域                 |
| [标签 VTag](./tag.md)                     | 状态或分类标记                     |
| [状态点 VStatusDot](./status.md)          | 表示运行状态的小圆点               |
| [头像 VAvatar](./avatar.md)               | 用户或应用头像，支持头像组         |
| [空状态 VEmpty](./empty.md)               | 无数据时的占位提示                 |
| [加载中 VLoading](./loading.md)           | 加载动画                           |
| [提示 VAlert](./alert.md)                 | 页面内提示信息                     |
| [开关 VSwitch](./switch.md)               | 开关选择器                         |
| [日期选择 VDatePicker](./date-picker.md)  | 选择日期、日期时间与日期范围       |

### 导航与布局

| 组件                                | 说明                             |
| ----------------------------------- | -------------------------------- |
| [选项卡 VTabs](./tabs.md)           | 在同一区域切换不同内容           |
| [菜单 VMenu](./menu.md)             | 多级垂直菜单                     |
| [分页 VPagination](./pagination.md) | 列表分页与每页条数选择           |
| [下拉菜单 VDropdown](./dropdown.md) | 悬浮展开的操作菜单               |
| [浮层 VPopover](./popover.md)       | 展开包含表单或提示内容的浮动面板 |
| [抽屉 VDrawer](./drawer.md)         | 从屏幕边缘滑出的次级任务面板     |

### 反馈

| 组件                             | 说明                             |
| -------------------------------- | -------------------------------- |
| [弹窗 VModal](./modal.md)        | 模态对话框                       |
| [确认对话框 Dialog](./dialog.md) | 函数式调用的确认对话框           |
| [轻提示 Toast](./toast.md)       | 页面顶部的临时消息               |
| [文字提示 Tooltip](./tooltip.md) | 悬停提示，支持指令与组件两种用法 |

### 数据展示

| 组件                                             | 说明                                                 |
| ------------------------------------------------ | ---------------------------------------------------- |
| [表格 VTable](./table.md)                        | 多列数据表格，支持排序、选择、展开、多级表头与固定列 |
| [实体 VEntity](./entity.md)                      | 列表中的一行数据                                     |
| [筛选下拉 VFilterDropdown](./filter-dropdown.md) | 列表筛选栏中的下拉筛选，支持搜索、分组与一键清空     |

### 其他

| 组件                     | 说明                |
| ------------------------ | ------------------- |
| [图标 Icons](./icons.md) | Halo 内置的图标组件 |

业务组件（如 `UppyUpload`、`SearchInput` 等）已在 Console 中全局注册，可直接使用，文档请参阅[业务组件](../components/index.md)。
