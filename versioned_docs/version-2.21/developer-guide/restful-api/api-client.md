---
title: API Client 请求库
description: 介绍使用 API Client 请求库发起 API 请求的方式
---

在 2.17.0 版本中，Halo 提供了新的 `@halo-dev/api-client` JS 库，用于简化在 Halo 内部、插件的 UI 中、外部应用程序中请求 Halo 接口的逻辑。

此文档将介绍如何通过 `@halo-dev/api-client` 发起 API 请求。

## 安装

```shell
pnpm install @halo-dev/api-client axios
```

:::info 提示
推荐在项目中引入 TypeScript，可以获得更好的类型提示。
:::

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

- **coreApiClient**: 为 Halo 所有[自定义模型](https://github.com/halo-dev/rfcs/tree/main/extension)的 CRUD 接口封装的 API Client。
- **consoleApiClient**: 为 Halo 针对 Console 提供的接口封装的 API Client。
- **ucApiClient**: 为 Halo 针对 UC 提供的接口封装的 API Client。
- **publicApiClient**: 为 Halo 所有公开访问的接口封装的 API Client。
- **createCoreApiClient**: 用于创建[自定义模型](https://github.com/halo-dev/rfcs/tree/main/extension)的 CRUD 接口封装的 API Client，需要传入 axios 实例。
- **createConsoleApiClient**: 用于创建 Console 接口封装的 API Client，需要传入 axios 实例。
- **createUcApiClient**: 用于创建 UC 接口封装的 API Client，需要传入 axios 实例。
- **createPublicApiClient**: 用于创建公开访问接口封装的 API Client，需要传入 axios 实例。
- **axiosInstance**: 内部默认创建的 axios 实例。

## 使用

### 在 Halo 插件中使用

参考：[插件开发 / API 请求](../plugin/api-reference/ui/api-request.md#使用)

### 在 Halo 内部使用

如果需要在 Halo 核心模块中使用 `@halo-dev/api-client`，可以直接使用 `coreApiClient`、`consoleApiClient`、`ucApiClient`、`publicApiClient`，无需单独处理异常逻辑和认证逻辑。

示例

```ts
import { coreApiClient } from "@halo-dev/api-client"

coreApiClient.content.post.listPost().then(response => {
  // handle response
})
```

### 在外部程序中使用

在外部程序中使用时，需要自行创建 axios 实例，并使用 `createCoreApiClient`、`createConsoleApiClient`、`createUcApiClient`、`createPublicApiClient` 创建 API Client，这样可以方便处理异常逻辑和认证逻辑。

```javascript
import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "http://localhost:8090",
  headers: {
    // 使用个人令牌进行认证
    Authorization: 'Bearer pat_1234567890abcdef',
  }
})

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // handle error
  }
);

const coreApiClient = createCoreApiClient(axiosInstance)

coreApiClient.content.post.listPost().then(response => {
  // handle response
})
```

:::info 提示
认证方式的说明请参考：[认证方式](./introduction.md#认证方式)
:::
