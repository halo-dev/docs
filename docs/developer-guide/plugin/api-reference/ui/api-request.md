---
title: API 请求 
description: 介绍如何在插件的 UI 中请求 API 接口
---

在 2.17.0 版本中，Halo 提供了新的 `@halo-dev/api-client` 包，用于简化在 Halo 内部、插件的 UI 中、外部应用程序中请求 Halo 接口的逻辑。此文档将介绍如何在插件的 UI 中使用 `@halo-dev/api-client` 包。

## 安装

```shell
pnpm install @halo-dev/api-client axios
```

## 模块介绍

在 `@halo-dev/api-client` 包中导出了以下模块：

```ts
import {
  coreApiClient,
  consoleApiClient,
  ucApiClient,
  publicApiClient,
  createCoreApiClient,
  createConsoleApiClient,
  createUcApiClient,
  createPublicApiClient,
  axiosInstance
} from "@halo-dev/api-client"
```

- **coreApiClient**: 为 Halo 所有自定义模型的 CRUD 接口封装的 API Client。
- **consoleApiClient**: 为 Halo 针对 Console 提供的接口封装的 API Client。
- **ucApiClient**: 为 Halo 针对 UC 提供的接口封装的 API Client。
- **publicApiClient**: 为 Halo 所有公开访问的接口封装的 API Client。
- **createCoreApiClient**: 用于创建自定义模型的 CRUD 接口封装的 API Client，需要传入 axios 实例。
- **createConsoleApiClient**: 用于创建 Console 接口封装的 API Client，需要传入 axios 实例。
- **createUcApiClient**: 用于创建 UC 接口封装的 API Client，需要传入 axios 实例。
- **createPublicApiClient**: 用于创建公开访问接口封装的 API Client，需要传入 axios 实例。
- **axiosInstance**: 内部默认创建的 axios 实例。

## 使用

在 Halo 的插件项目中，如果是调用 Halo 内部的接口，那么直接使用上面介绍的模块即可，无需任何配置，在 Halo 内部已经处理好了异常逻辑，包括登录失效、无权限等。

其中，`coreApiClient`、`consoleApiClient`、`ucApiClient`、`publicApiClient` 模块是对 Halo 内部所有 API 请求的封装，无需传入任何请求地址，比如：

```ts
import { coreApiClient } from "@halo-dev/api-client"

coreApiClient.content.post.listPost().then(response => {
  // handle response
})
```

如果需要调用插件提供的接口，可以直接使用 `axiosInstance` 实例，比如：

```ts
import { axiosInstance } from "@halo-dev/api-client"

axiosInstance.get("/apis/foo.halo.run/v1alpha1/bar").then(response => {
  // handle response
})
```

`@halo-dev/ui-plugin-bundler-kit` 会让插件复用 Halo 提供的 `@halo-dev/api-client` 和 `axios`。旧版 IIFE 通过兼容全局对象提供这些依赖，Halo 2.26.0 开始支持的 ESM 则通过共享运行时模块提供，插件代码都应继续使用标准的包导入。

直接从 `axios` 导入的是共享的标准 Axios 模块，不包含 Halo 的认证配置。请勿修改它的全局 defaults 或 interceptors；需要独立配置时使用 `axios.create()`。`@halo-dev/api-client` 导出的 `axiosInstance` 是另一个带有 Halo 认证和统一错误处理的实例，也不应修改它的 defaults 或 interceptors。

:::info 同步提高 Halo 版本要求
如果插件中使用了 `@halo-dev/api-client@2.17.0` 和 `@halo-dev/ui-plugin-bundler-kit@2.17.0`，需要提升 `plugin.yaml` 中的 `spec.requires` 版本为 `>=2.17.0`。
:::
