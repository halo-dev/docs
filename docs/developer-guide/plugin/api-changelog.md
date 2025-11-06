---
title: API 变更日志
description: 记录每一个版本的插件 API 变更记录，方便开发者适配
---

## 2.22.0

### `@halo-dev/console-shared` 工具库

在 2.22.0 中，Halo 在 `@halo-dev/console-shared` 包中提供一些常用工具，用于减少部分业务的开发工作量，目前提供：

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
   pnpm install @halo-dev/console-shared@2.22.0
   ```

2. 提升 [plugin.yaml#spec.requires](./basics/manifest.md#字段详解) 版本为 `>=2.22.0`。
3. 按照[最新文档](./extension-points/ui/attachment-selector-create.md)修改插件代码
