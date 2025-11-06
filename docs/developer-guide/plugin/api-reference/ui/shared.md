---
title: 共享工具库
description: 介绍 @halo-dev/console-shared 包中的共享工具库
---

从 Halo 2.22 开始，Halo 为插件的 UI 部分提供了共享的工具库并放置在了 `@halo-dev/console-shared` 中，利用这些工具，可以减少部分开发工作量。

使用这些工具需要将插件项目的 `@halo-dev/console-shared` 依赖升级到 2.22.0。并在发布新版本插件时，将 [plugin.yaml#spec.requires](../../basics/manifest.md#字段详解) 提升到 `>=2.22.0`。

## stores

用于共享常用的全局状态，使用此工具，需要先安装 Pinia 依赖：

```bash
pnpm install pinia
```

### currentUser

用于获取当前登录用户的信息，示例：

```vue title="ui/src/MyComponent.vue"
<script lang="ts" setup>
import { stores } from "@halo-dev/console-shared"
import { storeToRefs } from "pinia"

const userStore = stores.currentUser()

// 获取当前用户信息，在插件中通常无需手动调用，此方法会在 /console 和 /uc 初始化页面时调用一次，用户更新自己资料后也会同步更新。
await userStore.fetchCurrentUser()

// 访问用户数据
console.log(userStore.currentUser?.user.metadata.name)

// 检查是否为匿名用户
console.log(userStore.isAnonymous)

// 或使用 storeToRefs 保持响应性
const { currentUser, isAnonymous } = storeToRefs(stores.currentUser())
</script>
```

#### 属性

- `currentUser`: 当前登录用户的详细信息，类型为 `DetailedUser | undefined`
- `isAnonymous`: 是否为匿名用户，类型为 `boolean`

#### 方法

- `fetchCurrentUser()`: 从服务器获取当前用户信息，返回 `Promise<void>`

### globalInfo

用于获取当前网站的全局配置信息，示例：

```vue title="ui/src/MyComponent.vue"
<script lang="ts" setup>
import { stores } from "@halo-dev/console-shared"
import { storeToRefs } from "pinia"

const globalInfoStore = stores.globalInfo()

// 获取全局信息，在插件中通常无需手动调用，此方法会在 /console 和 /uc 初始化页面时调用一次
await globalInfoStore.fetchGlobalInfo()

// 访问全局配置
console.log(globalInfoStore.globalInfo?.externalUrl)
console.log(globalInfoStore.globalInfo?.siteTitle)

// 或使用 storeToRefs 保持响应性
const { globalInfo } = storeToRefs(stores.globalInfo())
</script>
```

#### 属性

- `globalInfo`: 全局配置信息，类型为 `GlobalInfo | undefined`，包含以下字段：
  - `externalUrl`: 外部访问地址
  - `siteTitle`: 站点标题
  - `timeZone`: 时区
  - `locale`: 语言区域
  - `allowComments`: 是否允许评论
  - `allowAnonymousComments`: 是否允许匿名评论
  - `allowRegistration`: 是否允许注册
  - `useAbsolutePermalink`: 是否使用绝对路径
  - `userInitialized`: 用户是否已初始化
  - `dataInitialized`: 数据是否已初始化
  - `favicon`: 网站图标
  - `postSlugGenerationStrategy`: 文章 Slug 生成策略
  - `mustVerifyEmailOnRegistration`: 注册时是否必须验证邮箱
  - `socialAuthProviders`: 社交认证提供商列表

#### 方法

- `fetchGlobalInfo()`: 从服务器获取全局配置信息，返回 `Promise<void>`

## utils

提供了一些常用的工具方法，包括时间日期格式化、权限判断、附件处理、ID 生成等。

### date

日期时间处理工具，基于 [dayjs](https://day.js.org/) 实现。

#### format(date, format?)

格式化日期为字符串。

**参数：**

- `date`: 要格式化的日期（string | Date | undefined | null）
- `format`: 格式化字符串，默认为 `"YYYY-MM-DD HH:mm"`

**返回值：** 格式化后的日期字符串，如果日期为空则返回空字符串

**示例：**

```ts
import { utils } from "@halo-dev/console-shared"

utils.date.format(new Date()) // "2025-11-05 14:30"
utils.date.format("2025-10-22", "YYYY/MM/DD") // "2025/10/22"
utils.date.format(null) // ""
```

#### toISOString(date)

将日期转换为 ISO 8601 格式字符串。

**参数：**

- `date`: 要转换的日期（string | Date | undefined | null）

**返回值：** ISO 8601 格式的日期字符串

**示例：**

```ts
import { utils } from "@halo-dev/console-shared"

utils.date.toISOString(new Date("2025-10-22")) // "2025-10-22T00:00:00.000Z"
```

#### toDatetimeLocal(date)

将日期转换为 HTML5 datetime-local 输入框格式。

**参数：**

- `date`: 要转换的日期（string | Date | undefined | null）

**返回值：** datetime-local 格式的字符串（YYYY-MM-DDTHH:mm）

**示例：**

```ts
import { utils } from "@halo-dev/console-shared"

utils.date.toDatetimeLocal(new Date("2025-10-22 14:30")) // "2025-10-22T14:30"
```

#### timeAgo(date)

获取从当前时间到指定日期的相对时间描述。

**参数：**

- `date`: 目标日期（string | Date | undefined | null）

**返回值：** 人类可读的相对时间字符串（如 "2 小时后"、"3 天前"）

**示例：**

```ts
import { utils } from "@halo-dev/console-shared"

// 假设当前时间是 2025-10-22
utils.date.timeAgo("2025-10-23") // "1 天后"
utils.date.timeAgo("2025-10-21") // "1 天前"
utils.date.timeAgo("2025-11-22") // "1 个月后"
```

#### dayjs()

原始的 dayjs 实例，如果上述方法不能满足需求，可以手动调用 dayjs 方法，具体使用文档可查阅：[Day.js](https://day.js.org/zh-CN/)。

### permission

权限判断工具，用于检查当前用户是否具有指定的权限。

#### has(permissions, any?)

检查用户是否具有指定的权限。

**参数：**

- `permissions`: 要检查的权限数组（Array\<string\>）
- `any`: 是否满足任意一个权限即可，默认为 `true`
  - `true`: 只要有任意一个权限匹配即返回 true
  - `false`: 必须所有权限都匹配才返回 true

**返回值：** boolean

**特殊情况：**

- 如果用户拥有通配符权限 `*`，则始终返回 true
- 如果不需要检查任何权限（空数组），则返回 true
- 如果用户没有任何权限，则返回 false

**示例：**

```ts
import { utils } from "@halo-dev/console-shared"

// 检查是否拥有任意一个权限
utils.permission.has(["core:posts:manage"], true) // true
utils.permission.has(["core:posts:delete"], true) // false

// 检查是否拥有所有权限
utils.permission.has([
  "core:posts:manage",
  "core:attachments:view"
], false) // true

utils.permission.has([
  "core:posts:manage",
  "core:posts:delete"
], false) // false
```

#### getUserPermissions()

获取当前设置的用户权限列表。

**返回值：** Array\<string\> | undefined

**示例：**

```ts
import { utils } from "@halo-dev/console-shared"

const permissions = utils.permission.getUserPermissions()
console.log(permissions) // ["core:posts:manage", "core:attachments:view"]
```

### attachment

附件处理工具，提供附件 URL 获取、缩略图获取、数据格式转换等功能。

#### getThumbnailUrl(url, size)

为指定的图片 URL 生成缩略图 URL。

**参数：**

- `url`: 原始图片 URL（string）
- `size`: 缩略图尺寸（"XL" | "L" | "M" | "S"）
  - `"XL"`: 1600px
  - `"L"`: 1200px
  - `"M"`: 800px
  - `"S"`: 400px

**返回值：** 缩略图 URL（string）

**处理逻辑：**

1. 如果 URL 是当前域名或相对路径：添加 `?width={尺寸}` 查询参数
2. 如果 URL 是外部链接：通过 Halo 的缩略图 API 代理

**示例：**

```ts
import { utils } from "@halo-dev/console-shared"

// 本地图片
utils.attachment.getThumbnailUrl("/uploads/image.jpg", "M")
// 返回: "/uploads/image.jpg?width=800"

// 当前域名图片
utils.attachment.getThumbnailUrl("https://example.com/image.jpg", "S")
// 返回: "https://example.com/image.jpg?width=400" (如果当前域名是 example.com)
```

#### getUrl(attachment)

从附件对象中提取 URL。

**参数：**

- `attachment`: 附件对象（string | Attachment | AttachmentSimple）

**返回值：** URL 字符串（string | undefined）

**示例：**

```ts
import { utils } from "@halo-dev/console-shared"

// 字符串 URL
utils.attachment.getUrl("https://example.com/image.jpg")
// 返回: "https://example.com/image.jpg"

// Attachment 对象
utils.attachment.getUrl(attachmentObject)
// 返回: attachmentObject.status?.permalink

// AttachmentSimple 对象
utils.attachment.getUrl({ url: "https://example.com/image.jpg" })
// 返回: "https://example.com/image.jpg"
```

#### convertToSimple(attachment)

将附件对象转换为简化格式。

**参数：**

- `attachment`: 附件对象（string | Attachment | AttachmentSimple）

**返回值：** AttachmentSimple | undefined

**AttachmentSimple 类型：**

```ts
interface AttachmentSimple {
  url: string
  alt?: string
  mediaType?: string
}
```

**示例：**

```ts
import { utils } from "@halo-dev/console-shared"

// 字符串 URL
utils.attachment.convertToSimple("https://example.com/image.jpg")
// 返回: { url: "https://example.com/image.jpg" }

// Attachment 对象
utils.attachment.convertToSimple(attachmentObject)
// 返回: {
//   url: attachmentObject.status?.permalink || "",
//   alt: attachmentObject.spec.displayName,
//   mediaType: attachmentObject.spec.mediaType
// }

// AttachmentSimple 对象
utils.attachment.convertToSimple({
  url: "https://example.com/image.jpg",
  alt: "Image"
})
// 返回: { url: "https://example.com/image.jpg", alt: "Image" }
```

### id

ID 生成工具，用于生成唯一且可排序的标识符。基于 [uuid](https://github.com/uuidjs/uuid) 包实现。

#### uuid()

生成一个 RFC 4122 版本 7 的 UUID 字符串。

**返回值：** UUID v7 字符串（string）

**特点：**

- UUID v7 保持创建顺序与时间顺序大致一致
- 适合用于需要按时间排序的场景（如数据库记录、日志条目等）
- 符合 RFC 4122 标准

**示例：**

```ts
import { utils } from "@halo-dev/console-shared"

const id = utils.id.uuid()
console.log(id) // "018f1c2e-4fcb-7d04-9f21-1a2b3c4d5e6f"

// 可以用于生成唯一的资源标识
const resourceId = utils.id.uuid()
```

## events

全局的事件总线，目前仅提供插件配置更新的事件，用于在插件中及时知晓用户修改了插件配置，然后重新获取插件配置数据。

### 使用示例

```vue title="ui/src/MyComponent.vue"
<script lang="ts" setup>
import { events } from "@halo-dev/console-shared"

// 监听事件
events.on("core:plugin:configMap:updated", (data) => {
  console.log(`插件 ${data.pluginName} 的配置已更新`)
  console.log(`配置组：${data.group}`)
})
</script>
```

### 可用事件

- `core:plugin:configMap:updated`: 当插件的配置映射更新时触发
  - `pluginName`: 插件名称（string）
  - `group`: 配置组名称（string）
