---
title: API 变更日志
description: 记录每一个版本的插件 API 变更记录，方便开发者适配
---

## 2.22.0

### `@halo-dev/console-shared` 改名

从 Halo 2.11 支持个人中心以后，插件的 UI 项目能同时扩展 Console 和 UC，所以为了避免歧义，我们在 Halo 2.22 中将 UI 的 `@halo-dev/console-shared` 依赖更名为 `@halo-dev/ui-shared`，虽然在 Halo 中兼容了旧版依赖，但仍然推荐使用新版依赖，迁移方案：

```bash
pnpm uninstall @halo-dev/console-shared
pnpm install @halo-dev/ui-shared
```

然后在插件项目全局搜索 `@halo-dev/console-shared` 并替换为 `@halo-dev/ui-shared` 即可，同时需要将 `plugin.yaml` 的 `spec.requires` 字段修改为 `>=2.22.0`。

### `@halo-dev/ui-shared` 工具库

在 2.22.0 中，Halo 在 `@halo-dev/ui-shared` 包中提供一些常用工具，用于减少部分业务的开发工作量，目前提供：

1. `stores`
   1. `currentUser`：用于获取当前用户信息
   2. `globalInfo`：用于获取网站一些公开的信息，比如外部访问地址
2. utils
   1. `date`：时间日期格式化工具
   2. `permission`：用户权限检查工具
   3. `id`：uuid 生成工具
   4. `attachment`：附件相关工具，比如获取附件缩略图地址
3. events
   1. `core:plugin:configMap:updated`：用于监听插件配置变更

详细文档可查阅：[共享工具库](./api-reference/ui/shared.md)

### UI 扩展点 > 附件选择选项卡类型更新

在 2.22.0 中，我们为 `AttachmentLike` 复合类型添加了 `mediaType` 字段，用于区分文件类型，方便在插入到文章时显示正确的媒体类型，如不填写，所选择的文件将作为链接插入到编辑器，所以实现了此扩展点的插件都需要进行改动，具体步骤：

1. 升级依赖

   ```bash
   pnpm install @halo-dev/ui-shared@2.22.0
   ```

2. 提升 [plugin.yaml#spec.requires](./basics/manifest.md#字段详解) 版本为 `>=2.22.0`。
3. 按照[最新文档](./extension-points/ui/attachment-selector-create.md)修改插件代码

### 表单定义 > 新增 Iconify 图标选择器

在 2.22.0 中，我们为 FormKit 表单提供了通用的图标选择器，基于 [Iconify](https://icon-sets.iconify.design/)，详细文档可查阅：[表单定义#Iconify](../../developer-guide/form-schema.md#iconify)
