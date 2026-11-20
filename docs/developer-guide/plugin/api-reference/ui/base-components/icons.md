---
title: 图标 Icons
description: 使用 @halo-dev/components 内置的图标组件在 Halo 插件界面中展示图标，包含完整图标清单
---

基础组件库内置了一组基于 [Remix Icon](https://remixicon.com/) 的图标组件，可以直接引入使用。图标会继承当前文字颜色和字体大小。

## 引入

```ts
import { IconAddCircle, IconDeleteBin } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import {
  IconAddCircle,
  IconDeleteBin,
  IconSearch,
  VButton,
} from "@halo-dev/components";
</script>

<template>
  <div class="flex items-center gap-4 text-xl text-gray-600">
    <IconAddCircle />
    <IconSearch />
    <IconDeleteBin />
  </div>
</template>
```

### 在按钮中使用

```vue preview
<script lang="ts" setup>
import { IconAddCircle, VButton } from "@halo-dev/components";
</script>

<template>
  <VButton type="primary">
    <template #icon>
      <IconAddCircle />
    </template>
    新建
  </VButton>
</template>
```

### 通过组件动态渲染

```vue preview
<script lang="ts" setup>
import {
  IconDashboard,
  IconPages,
  IconSettings,
  IconTeam,
} from "@halo-dev/components";

const icons = [
  { name: "概览", component: IconDashboard },
  { name: "内容", component: IconPages },
  { name: "用户", component: IconTeam },
  { name: "设置", component: IconSettings },
];
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
    <div
      v-for="icon in icons"
      :key="icon.name"
      class="flex items-center gap-2 rounded-base bg-gray-50 px-3 py-2 text-sm text-gray-600"
    >
      <component :is="icon.component" class="text-lg" />
      {{ icon.name }}
    </div>
  </div>
</template>
```

## 图标清单

| 组件                        | 对应的 Remix Icon               |
| --------------------------- | ------------------------------- |
| `IconAccountCircleLine`     | `ri/account-circle-line`        |
| `IconAddCircle`             | `ri/add-circle-line`            |
| `IconArrowDownCircleLine`   | `ri/arrow-down-circle-line`     |
| `IconArrowDown`             | `ri/arrow-down-s-fill`          |
| `IconArrowDownLine`         | `ri/arrow-down-s-line`          |
| `IconArrowLeftRightLine`    | `ri/arrow-left-right-line`      |
| `IconArrowLeft`             | `ri/arrow-left-s-line`          |
| `IconArrowRight`            | `ri/arrow-right-s-line`         |
| `IconArrowUpCircleLine`     | `ri/arrow-up-circle-line`       |
| `IconArrowUpDownLine`       | `ri/arrow-up-down-line`         |
| `IconArrowUpLine`           | `ri/arrow-up-s-line`            |
| `IconBookRead`              | `ri/book-read-line`             |
| `IconCalendar`              | `ri/calendar-line`              |
| `IconCharacterRecognition`  | `ri/character-recognition-line` |
| `IconCheck`                 | `ri/check-line`                 |
| `IconCheckboxFill`          | `ri/checkbox-circle-fill`       |
| `IconCheckboxCircle`        | `ri/checkbox-circle-line`       |
| `IconClipboardLine`         | `ri/clipboard-line`             |
| `IconCloseCircle`           | `ri/close-circle-line`          |
| `IconClose`                 | `ri/close-line`                 |
| `IconCodeBoxLine`           | `ri/code-box-line`              |
| `IconComputer`              | `ri/computer-line`              |
| `IconDashboard`             | `ri/dashboard-3-line`           |
| `IconDatabase2Line`         | `ri/database-2-line`            |
| `IconDeleteBin`             | `ri/delete-bin-2-line`          |
| `IconMotionLine`            | `ri/emotion-line`               |
| `IconErrorWarning`          | `ri/error-warning-line`         |
| `IconExchange`              | `ri/exchange-line`              |
| `IconExternalLinkLine`      | `ri/external-link-line`         |
| `IconEye`                   | `ri/eye-line`                   |
| `IconEyeOff`                | `ri/eye-off-line`               |
| `IconFolder`                | `ri/folder-2-line`              |
| `IconForbidLine`            | `ri/forbid-line`                |
| `IconGitBranch`             | `ri/git-branch-line`            |
| `IconGitHub`                | `ri/github-fill`                |
| `IconGrid`                  | `ri/grid-line`                  |
| `IconHistoryLine`           | `ri/history-line`               |
| `IconImageAddLine`          | `ri/image-add-line`             |
| `IconInformation`           | `ri/information-line`           |
| `IconLink`                  | `ri/link`                       |
| `IconListSettings`          | `ri/list-settings-line`         |
| `IconList`                  | `ri/list-unordered`             |
| `IconLockPasswordLine`      | `ri/lock-password-line`         |
| `IconLogoutCircleRLine`     | `ri/logout-circle-r-line`       |
| `IconMagic`                 | `ri/magic-line`                 |
| `IconMessage`               | `ri/message-3-line`             |
| `IconMore`                  | `ri/more-line`                  |
| `IconNotificationBadgeLine` | `ri/notification-badge-line`    |
| `IconPages`                 | `ri/pages-line`                 |
| `IconPalette`               | `ri/palette-line`               |
| `IconRiPencilFill`          | `ri/pencil-fill`                |
| `IconPlug`                  | `ri/plug-2-line`                |
| `IconRefreshLine`           | `ri/refresh-line`               |
| `IconReplyLine`             | `ri/reply-line`                 |
| `IconRocketLine`            | `ri/rocket-line`                |
| `IconSave`                  | `ri/save-line`                  |
| `IconSearch`                | `ri/search-2-line`              |
| `IconSendPlaneFill`         | `ri/send-plane-fill`            |
| `IconServerLine`            | `ri/server-line`                |
| `IconSettings3Line`         | `ri/settings-3-line`            |
| `IconSettings`              | `ri/settings-4-line`            |
| `IconShieldUser`            | `ri/shield-user-line`           |
| `IconPhone`                 | `ri/smartphone-line`            |
| `IconStopCircle`            | `ri/stop-circle-line`           |
| `IconTablet`                | `ri/tablet-line`                |
| `IconTeam`                  | `ri/team-fill`                  |
| `IconTerminalBoxLine`       | `ri/terminal-box-line`          |
| `IconThumbUpLine`           | `ri/thumb-up-line`              |
| `IconTimerLine`             | `ri/timer-line`                 |
| `IconToolsFill`             | `ri/tools-fill`                 |
| `IconRiUpload2Fill`         | `ri/upload-2-fill`              |
| `IconUpload`                | `ri/upload-cloud-2-line`        |
| `IconUserFollow`            | `ri/user-follow-line`           |
| `IconUserLine`              | `ri/user-line`                  |
| `IconUserSettings`          | `ri/user-settings-line`         |
| `IconWindowLine`            | `ri/window-line`                |
| `IconZoomInLine`            | `ri/zoom-in-line`               |
| `IconZoomOutLine`           | `ri/zoom-out-line`              |

`IconCheck` 从 2.28.0 开始提供。
