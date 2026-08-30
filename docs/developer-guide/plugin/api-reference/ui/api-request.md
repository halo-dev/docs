---
title: API 请求
description: 在 Halo 插件 UI 中优先使用 OpenAPI 生成的插件客户端和 @halo-dev/api-client，仅在无法生成的一次性接口中直接使用 axiosInstance
---

Halo 插件 UI 通常需要调用插件自己的接口和 Halo Core 接口。先根据接口归属选择客户端，不要为 Halo 请求自行创建 Axios 实例或手写可生成的资源类型和路径。

## 选择客户端

| 接口 | 推荐方式 |
| --- | --- |
| 插件自定义模型的 CRUD API | 使用 `generateApiClient` 生成的模型和 API 类 |
| 插件通过 `SpringdocRouteBuilder` 描述的自定义端点 | 使用 `generateApiClient` 生成的 API 类 |
| Halo Core、Console、用户中心或公开 API | 使用 `@halo-dev/api-client` 已提供的客户端 |
| 暂时没有 OpenAPI 描述的一次性插件接口 | 最后才直接使用 `axiosInstance` |
| 与 Halo 无关的独立外部服务 | 根据该服务要求创建独立客户端，不复用或修改 Halo 的 `axiosInstance` |

## 使用插件生成的 API Client

插件的 Java 模型是 API 类型的来源。自定义模型会生成 CRUD API；自定义端点需要使用 `SpringdocRouteBuilder` 定义稳定的 `operationId`、参数和响应，才能进入 OpenAPI 文档。

在 `build.gradle` 中配置 `haloPlugin.openApi` 后运行：

```shell
./gradlew generateApiClient
```

完整的分组、生成目录和任务说明参考[开发工具 > 生成 API client](../../basics/devtools.md#how-to-generate-api-client)。生成目录必须专用于 API Client，不要手动编辑其中的类型或请求代码。

为生成的类复用 Halo 已配置认证和统一错误处理的 `axiosInstance`：

```ts title="ui/src/api/index.ts"
import { axiosInstance } from "@halo-dev/api-client"
import { TodoV1alpha1Api } from "./generated"

const todoCoreApiClient = {
  todo: new TodoV1alpha1Api(undefined, "", axiosInstance),
}

export { todoCoreApiClient }
```

调用方法时使用生成的请求参数和响应类型：

```ts
import { todoCoreApiClient } from "@/api"

const { data } = await todoCoreApiClient.todo.listTodo({ page: 1, size: 20 })
```

当接口或模型变化时，修改 Java 源码或 OpenAPI 描述并重新运行生成任务。不要在 UI 中复制 `Metadata`、资源模型、列表结果或接口参数来绕过生成器。

## 使用 Halo API Client

从 Halo 2.17.0 开始，`@halo-dev/api-client` 提供以下客户端：

```ts
import {
  axiosInstance,
  consoleApiClient,
  coreApiClient,
  publicApiClient,
  ucApiClient,
} from "@halo-dev/api-client"
```

- `coreApiClient`：Halo 自定义模型 CRUD API。
- `consoleApiClient`：Halo Console API。
- `ucApiClient`：Halo 用户中心 API。
- `publicApiClient`：Halo 公开 API。
- `axiosInstance`：带有 Halo 认证和统一错误处理的 Axios 实例。

调用 Halo 已提供的接口无需配置基础地址：

```ts
import { coreApiClient } from "@halo-dev/api-client"

const { data } = await coreApiClient.content.post.listPost({ page: 1, size: 20 })
```

## 直接使用 axiosInstance

只有接口暂时无法进入 OpenAPI 且调用点很少时，才直接使用路径：

```ts
import { axiosInstance } from "@halo-dev/api-client"

const { data } = await axiosInstance.get("/apis/foo.halo.run/v1alpha1/bar")
```

当该接口需要复用、拥有稳定模型或包含多个参数时，应补充 OpenAPI 描述并改用生成客户端。

不要为 `/api` 或 `/apis` 下的 Halo 请求调用 `axios.create()`。从 `axios` 直接创建的实例不包含 Halo 登录状态、权限失败和统一错误处理配置；也不要修改 `axiosInstance` 的全局 defaults 或 interceptors。

`@halo-dev/ui-plugin-bundler-kit` 会让插件复用 Halo 提供的 `@halo-dev/api-client` 和 Axios。旧版 IIFE 通过兼容全局对象提供依赖，Halo 2.26.0 开始支持的 ESM 通过共享运行时模块提供，插件代码都应继续使用标准包导入。

:::info 同步提高 Halo 版本要求
如果插件使用 `@halo-dev/api-client@2.17.0` 或更高版本，需要让 `plugin.yaml` 的 `spec.requires` 覆盖对应 Halo 版本。新项目应以脚手架生成的依赖和版本要求为准。
:::
