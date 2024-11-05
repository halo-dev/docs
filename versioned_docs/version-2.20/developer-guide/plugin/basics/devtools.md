---
title: Devtools
description: 了解 Halo 的 Devtools 插件开发工具的使用
---

Devtools 插件开发工具提供了一些 Task 用于辅助 Halo 插件的运行与调试，使用此工具的前提是需要具有 [Docker](https://docs.docker.com/get-docker/) 环境。

Devtools 还提供了一些其他的构建任务，如插件打包、插件检查等。

## 安装

Devtools 是使用 Java 开发的一个 [Gradle](https://gradle.org/) 插件，如果你使用的 [plugin-starter](https://github.com/halo-sigs/plugin-starter) 创建的插件项目，那么你无需任何操作，它已经默认集成了 Devtools 插件。

你可以在项目的 `build.gradle` 中找到它：

```groovy
plugins {
  // ...
  id "run.halo.plugin.devtools" version "0.4.0"
}
```

Release 版本和版本说明可以在 [GitHub Releases](https://github.com/halo-sigs/halo-gradle-plugin/releases) 上查看。

## 使用说明

当在项目中引入了 `devtools` 之后，就可以使用一些额外的构建任务来辅助插件的开发，参考 [构建任务详解](#任务)。

例如，正在开发 `plugin-starter` 插件时，可以通过 `haloServer` 任务启动 Halo 服务，来测试插件功能：

```shell
./gradlew haloServer
```

看到如下日志时表示 Halo 服务已经启动成功：

```shell
=======================================================================
> Halo 启动成功！                                                      
访问地址：http://localhost:8090/console?language=zh-CN                 
用户名：admin                                                          
密码：admin                                                            
API 文档：http://localhost:8090/swagger-ui.html                        
插件开发文档：https://docs.halo.run/developer-guide/plugin/introduction
=======================================================================
```

修改代码后，无需停止服务，只需执行：

```shell
./gradlew reload
```

即可应用改动。如果使用 watch 任务启动插件，则不需要执行 `reload`，它会自动监听并重载插件。

## 配置

可通过 `build.gradle` 文件中的 `halo {}` 块自定义 Devtools 启动 Halo 服务必要配置，示例如下：

```groovy
halo {
  version = '2.20'
  superAdminUsername = 'admin'
  superAdminPassword = 'admin'
  externalUrl = 'http://localhost:8090'
  docker {
    // windows 默认为 npipe:////./pipe/docker_engine
    url = 'unix:///var/run/docker.sock'
    apiVersion = '1.42'
  }
  port = 8090
  debug = true
  debugPort = 5005
}
```

- `version`：表示要使用的 Halo 版本，随着插件 API 的更新你可能需要更高的 Halo 版本来运行插件，可自行更改。
- `superAdminUsername`： Halo 的超级管理员用户名，当你启动插件时会自动根据此配置和 `superAdminPassword` 为你初始化 Halo 的超级管理员账户。
- `superAdminPassword`：Halo 的超级管理员用户密码。
- `externalUrl`：Halo 的外部访问地址，一般默认即可，但如果修改了端口号映射可能需要修改。
- `docker.url`：用于配置连接 Docker 的 url 信息，在 Mac 或 Linux 系统上默认是 `unix:///var/run/docker.sock`，在 windows 上默认是 `npipe:////./pipe/docker_engine`。
- `docker.apiVersion`：Docker 的 API 版本，使用 `docker version` 命令可以查看到，如果你的 Docker 版本过低可能需要更改此配置，示例：

  ```shell
  ➤ docker version
  Client:
  Version:           24.0.7
  API version:       1.43
  ```

- `port`：Halo 服务的端口号，如果你的 Halo 服务端口号不想使用默认的 `8090` 或者想使用多个 Halo 服务，可以修改此配置。
- `debug`：是否开启调试模式，开启后会在启动 Halo 服务时会自动开启调试模式，此时你可以使用 IDE 连接到 Halo 服务进行调试。
- `debugPort`：调试模式下的调试端口号，默认是自动分配端口号，你可以修改此配置来固定调试端口号。
- `suspend`：是否在启动时挂起，如果开启则会在启动时挂起直到有调试器连接到 Halo 服务。

:::warning
由于 Halo 2.20.0 版本更改了初始化和登录流程，如果 `halo.version` 指定 `2.20.x` 版本需要将 `run.halo.plugin.devtools` 版本升级到 `0.2.0` 及以上。
:::

## 任务

本插件提供了 `haloServer` 和 `watch` 两个任务，使用它们的前提条件是需要在本地配置 Docker 环境。

### 环境要求

- **Windows 和 Mac 用户**：可以直接安装 [Docker Desktop](https://www.docker.com/products/docker-desktop)。
- **Linux 用户**：请参考 [Docker 官方文档](https://docs.docker.com/engine/install/) 安装 Docker。

确保 Docker 服务已启动后，即可运行 `haloServer` 和 `watch` 任务。

### 工作目录

这两个任务会将 Halo 的工作目录挂载到插件项目的 `workplace` 目录下，以确保在重启任务时数据不会丢失。

### 自定义配置

如果需要修改 Halo 的配置，您可以在 `workplace` 目录下创建一个 `config` 目录，并添加一个 `application.yaml` 文件。在该文件中，您可以覆盖 Halo 的默认配置。例如：

```yaml
# workplace/config/application.yaml
logging:
  level:
    run.halo.app: DEBUG
```

更多配置项请参考 [Halo 配置列表](../../../getting-started/install/config.md#配置列表)。

### haloServer 任务

使用方式：

```shell
./gradlew haloServer
```

此任务用于启动 Halo 服务并自动将使用此 Gradle 插件的 Halo 插件项目以开发模式加载到 Halo 服务中，当你修改了插件的代码后，可以通过 `reload` 任务使更改生效。

#### haloServer 任务默认配置

`haloServer` 任务具有以下默认配置用于连接和操作 Halo 服务：

```groovy
halo {
  version = '2.9.1'
  superAdminUsername = 'admin'
  superAdminPassword = 'admin'
  externalUrl = 'http://localhost:8090'
  docker {
    // Windows 用户默认使用 npipe:////./pipe/docker_engine
    url = 'unix:///var/run/docker.sock'
    apiVersion = '1.42'
  }
}
```

如需修改，可以在 `build.gradle` 文件中进行配置。

### reload 任务

使用方式：

```shell
./gradlew reload
```

此任务用于重新加载当前正在开发的插件，修改代码后执行此任务以应用更改。

该任务基于以下配置调用 Halo API 重新加载插件：

```groovy
halo {
  // ...
  superAdminUsername = 'admin'
  superAdminPassword = 'admin'
  externalUrl = 'http://localhost:8090'
}
```

#### watch 任务

使用方式：

```shell
./gradlew watch
```

此任务用于监视 Halo 插件项目的变化并自动重新加载到 Halo 服务中。
默认只监听 `src/main/java` 和 `src/main/resources` 目录下的文件变化，如果需要监听其他目录，可以在项目的 `build.gradle` 中添加如下配置：

```groovy
haloPlugin {
  watchDomains {
    // consoleSource 为自定义的名称，可以随意取
    consoleSource {
      // 监听 console/src/ 目录下的文件变化
      files files('console/src/')
      // exclude '**/node_modules/**'
      // exclude '**/.idea/**'
      // exclude '**/.git/**'
      // exclude '**/.gradle/**'
      // exclude 'src/main/resources/console/**'
      // exclude 'build/**'
      // exclude 'gradle/**'
      // exclude 'dist/**'
      // exclude 'test/java/**'
      // exclude 'test/resources/**'
    }
    // ... 可以添加多个
  }
}
```

`exclude` 接收字符串用于排除不需要监听的文件或目录，可以使用 `**` 通配符。注释掉的是每个 `watchDomains` 都会默认排除的规则。

### 生成 API client

#### 什么是 API client

API client 是一种工具或库，旨在简化前端应用程序与后端服务器之间的通信，尤其是在使用 RESTful API 或 GraphQL API 的情况下。
它提供了一种简洁且类型安全的方式来调用服务器端的 API，并处理请求和响应。

在 TypeScript 环境中，使用 API client 有以下几个优点：

- 自动化 HTTP 请求：API 客户端封装了 HTTP 请求的细节，如构建 URL、设置请求头、处理查询参数等。开发者只需调用客户端提供的函数即可发送请求。

- 类型安全：通过结合 OpenAPI 等规范生成的 TypeScript 类型定义，API 客户端可以确保请求和响应的数据类型在编译时就能得到验证。这可以帮助减少运行时的错误，并提高代码的可读性和可维护性。

- 统一的错误处理：API 客户端可以提供统一的错误处理机制，比如自动重试、错误日志记录等，这样开发者无需在每个 API 调用中重复编写相同的错误处理逻辑。

- 提高开发效率：通过使用 API 客户端，开发者可以专注于业务逻辑的实现，而不用关心底层的 HTTP 细节。这不仅提高了开发效率，还减少了代码冗余。

#### 如何生成 API client {#how-to-generate-api-client}

本插件提供了一个 `generateApiClient` 任务，用于为插件项目生成 API client，生成规则基于 OpenAPI 规范来自动生成客户端代码。

能生成 API 客户端代码的前提是插件项目中需要对自定义的 API 进行文档声明如：

```java
final var tag = "CommentV1alpha1Console";
return SpringdocRouteBuilder.route()
  .GET("comments", this::listComments, builder -> {
    builder.operationId("ListComments")
      .description("List comments.")
      .tag(tag)
      .response(responseBuilder()
        .implementation(ListResult.generateGenericClass(ListedComment.class))
      );
    CommentQuery.buildParameters(builder);
  })
  .build();
```

或者是在插件中定义了自定义模型，自定义模型自动生成的 CRUD APIs 是已经支持的。

以下是如何配置和使用 `generateApiClient` 的详细步骤：

##### 配置 `generateApiClient`

在 build.gradle 文件中，使用 haloPlugin 块来配置 OpenAPI 文档生成和 API 客户端生成的相关设置：

```groovy
haloPlugin {
  openApi {
    // outputDir = file("$rootDir/api-docs/openapi/v3_0") // 指定 OpenAPI 文档的输出目录默认输出到 build 目录下，不建议修改，除非需要提交到代码仓库
    groupingRules {
      // 定义 API 分组规则，用于为插件项目中的 APIs 分组然后只对此分组生成 API 客户端代码
      // 定义了一个名为 extensionApis 的分组，task 会通过 /v3/api-docs/extensionApis 访问到 api docs 然后生成 API 客户端代码
      // extensionApis 名称可以替换为其他名称，但需要与 groupedApiMappings 中的名称一致
      extensionApis {
        // 分组显示名称，避免与其他分组重名建议替换 {your-plugin-name} 为插件名称
        displayName = 'Extension API for {your-plugin-name}'
        // 分组的 API 规则用于匹配插件项目中的 API 将其划分到此分组，它是一个 Ant 风格的路径匹配规则可以写多个
        pathsToMatch = ['/apis/staticpage.halo.run/v1alpha1/**']
      }
    }
    groupedApiMappings = [
      // 这里为固定写法，照搬即可，除非是 groupingRules 中 extensionApis 的名字修改了
      '/v3/api-docs/extensionApis': 'extensionApis.json'
    ]
    generator {
       // 指定 API 客户端代码的输出目录如 console 或 ui
      outputDir = file("${projectDir}/console/src/api/generated")

      // 定制生成，以下是默认配置可以不需要添加到 build.gradle 中
      additionalProperties = [
        useES6: true,
        useSingleRequestParameter: true,
        withSeparateModelsAndApi: true,
        apiPackage: "api",
        modelPackage: "models"
      ]
      // 类型映射，用于将 OpenAPI 中的类型映射到 TypeScript 中的类型，以下是默认配置可以不需要添加到 build.gradle 中
      typeMappings = [
        set: "Array"
      ]
    }
  }
}
```

当配置了 `openApi` 规则之后，`haloServer` 或 `watch` 启动可以通过 `http://localhost:8090/swagger-ui.html` 访问 API 文档，
并通过选择你配置的 `displayName` 分组来**检查你的规则是否正确**。
这一步检查有助于避免生成 API Client 为空或者生成 `roleTemplates.yaml` 为空的情况。

##### 执行 `generateApiClient`

在项目目录中执行以下命令即可生成 API 客户端代码到指定目录：

```shell
./gradlew generateApiClient
```

然后在 `openApi.generator.outputDir` 目录创建一个 `index.ts` 文件并创建实例，以瞬间插件为例

```typescript
// console/src/api/index.ts
// 先引入 axiosInstance 用于请求
import { axiosInstance } from "@halo-dev/api-client";
// 这里导入的是声明 API doc 时指定的 tag 名称，如上文中定义的 CommentV1alpha1Console
import {
  ConsoleApiMomentHaloRunV1alpha1MomentApi,
  MomentV1alpha1Api,
  UcApiMomentHaloRunV1alpha1MomentApi,
} from "./generated";

// MomentV1alpha1Api 是自定义模型生成的 API tag 这里创建了一个 momentsCoreApiClient 实例
const momentsCoreApiClient = {
  moment: new MomentV1alpha1Api(undefined, "", axiosInstance),
};

// ConsoleApiMomentHaloRunV1alpha1MomentApi 是用于在 console 端调用的 APIs 的 tag，这里创建了一个 momentsConsoleApiClient 实例用于在 console 端调用
const momentsConsoleApiClient = {
  moment: new ConsoleApiMomentHaloRunV1alpha1MomentApi(
    undefined,
    "",
    axiosInstance
  ),
};

// 用于在个人中心调用的 APIs，单独创建一个 momentsUcApiClient 实例
const momentsUcApiClient = {
  moment: new UcApiMomentHaloRunV1alpha1MomentApi(undefined, "", axiosInstance),
};
// 导出实例
export { momentsConsoleApiClient, momentsCoreApiClient, momentsUcApiClient };
```

使用定义的实例:

```typescript
import { momentsConsoleApiClient } from "@/api";

// 查询瞬间的标签
const { data } = await momentsConsoleApiClient.moment.listTags({
  name: props.keyword?.value,
});
```

:::tip
它会先执行 `generateOpenApiDocs` 任务根据配置访问 `/v3/api-docs/extensionApis` 获取 OpenAPI 文档，
并将 OpenAPI 的 Schema 文件保存到 `openApi.outputDir` 目录下，然后再由 `generateApiClient` 任务根据 Schema 文件生成 API 客户端代码到 `openApi.generator.outputDir` 目录下。
:::

:::warning
执行 `generateApiClient` 任务时会先删除 `openApi.generator.outputDir` 下的所有文件，因此建议将 API client 的输出目录设置为一个独立的目录，以避免误删其他文件。

执行 `generateApiClient` 前建议注释掉你所配置的 `build` 任务对应的 `dependsOn` 任务，以避免因依赖前端构建任务可能无法生成 API Client 的问题。
:::

### generateRoleTemplates 任务

在 Halo 插件开发中，权限管理是一个关键问题，尤其是配置[角色模板](https://docs.halo.run/developer-guide/plugin/security/rbac#%E8%A7%92%E8%89%B2%E6%A8%A1%E6%9D%BF)时，角色的 `rules` 部分往往让开发者感到困惑。具体来说，如何区分资源、apiGroup、verb 等概念是许多开发者的痛点。

`generateRoleTemplates` Task 的出现正是为了简化这一过程，该任务能够根据 [配置 Generate Api Client](#配置-generateapiclient) 中的配置获取到 OpenAPI docs 的 JSON 文件，并自动生成 Halo 的 Role YAML 文件，让开发者可以专注于自己的业务逻辑，而不是纠结于复杂的角色 `rules` 配置。

在生成的 `roleTemplate.yaml` 文件中，rules 部分是基于 OpenAPI docs 中 API 资源和请求方式自动生成的，覆盖了可能的操作。
然而，在实际的生产环境中，Role 通常会根据具体的需求被划分为不同的权限级别，例如：

- 查看权限的角色模板：通常只包含对资源的读取权限，如 get、list、watch 等。
- 管理权限的角色模板：则可能包含创建、修改、删除等权限，如 create、update、delete。

> watch verb 是对于 WebSocket API，不会在 roleTemplates.yaml 中体现为 watch，而是体现为 list，因此需要开发者根据实际情况进行调整。

因此，生成的 YAML 文件只是一个基础模板，涵盖了所有可用的操作。开发者需要根据自己的实际需求，对这些 rules 进行调整。比如，针对只需要查看资源的场景，开发者可以从生成的 YAML 中删除`修改`和`删除`相关的操作，保留读取权限。
而对于需要管理资源的场景，可以保留`创建`、`更新`和`删除`权限，对于角色模板的依赖关系和聚合关系，开发者也可以根据实际情况进行调整。

通过这种方式，开发者可以使用生成的 YAML 文件作为基础，快速定制出符合不同场景的权限配置，而不必从头开始编写复杂的规则以减少出错的可能性。

#### 如何使用

在 build.gradle 文件中，使用 haloPlugin 块来配置 OpenAPI 文档生成和 Role 模板生成的相关设置：

```groovy
haloPlugin {
  openApi {
    // 参考配置 generateApiClient 中的配置
  }
}
```

在项目目录中执行以下命令即可生成 `roleTemplates.yaml` 文件到 `worplace` 目录：

```shell
./gradlew generateRoleTemplates
```

## 调试后端代码

如果你想调试后端代码，可以在 `build.gradle` 中配置

```groovy
halo {
  debug = true
}
```

然后通过 IDEA 运行 `haloServer` 以便于配合 `IDEA` 进行调试。

![Use-Devtools](/img/developer-guide/plugin/use-devtools.png)

首先点击上图中 `1` 处的 `haloServer` 运行插件，然后点击 `2` 处的 `Attach debugger` 让 IDEA 连接到 Halo 服务，此时会打开一个调试窗口就可以开始打断点调试了。

可能会因为日志太快而点击不到 `Attach debugger`，那么你可以配置

```groovy
halo {
  debug = true
  suspend = true
}
```

这样，在点击 `haloServer` 启动插件时会挂起等待在 `Attach debugger` 处，直到你点击 `Attach debugger` 连接调试器后才会继续执行。

## 迁移

### 从旧版本升级到 0.2.x 及以上版本

如果 `run.halo.plugin.devtools` 从旧版本升级到 `0.2.0` 版本，需要先将 Gradle 版本升级到 `8.3` 以上，你可以通过以下命令升级 Gradle 版本：

在插件项目根目录下执行：

```shell
# 如将 Gradle 版本升级至 8.9
./gradlew wrapper --gradle-version=8.9 
```
