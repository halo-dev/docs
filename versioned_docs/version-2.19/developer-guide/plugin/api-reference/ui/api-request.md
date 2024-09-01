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

- **coreApiClient**: 为 Halo 所有自定义模型的 CRUD 接口封装的 api client。
- **consoleApiClient**: 为 Halo 针对 Console 提供的接口封装的 api client。
- **ucApiClient**: 为 Halo 针对 UC 提供的接口封装的 api client。
- **publicApiClient**: 为 Halo 所有公开访问的接口封装的 api client。
- **createCoreApiClient**: 用于创建自定义模型的 CRUD 接口封装的 api client，需要传入 axios 实例。
- **createConsoleApiClient**: 用于创建 Console 接口封装的 api client，需要传入 axios 实例。
- **createUcApiClient**: 用于创建 UC 接口封装的 api client，需要传入 axios 实例。
- **createPublicApiClient**: 用于创建公开访问接口封装的 api client，需要传入 axios 实例。
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

此外，在最新的 `@halo-dev/ui-plugin-bundler-kit@2.17.0` 中，已经排除了 `@halo-dev/api-client`、`axios` 依赖，所以最终产物中的相关依赖会自动使用 Halo 本身提供的依赖，无需关心最终产物大小。

:::info 提醒
如果插件中使用了 `@halo-dev/api-client@2.17.0` 和 `@halo-dev/ui-plugin-bundler-kit@2.17.0`，需要提升 `plugin.yaml` 中的 `spec.requires` 版本为 `>=2.17.0`。
:::
