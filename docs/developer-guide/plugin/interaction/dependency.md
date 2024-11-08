---
title: 依赖其他插件
description: 介绍如何在 Halo 插件中声明和管理插件依赖关系，及提供插件依赖的项目结构示例。
---

在插件开发过程中，依赖管理是确保插件间协作和功能扩展的关键。
通过正确的依赖声明，插件能够依赖其他插件提供的功能，避免重复实现或资源浪费。
Halo 插件框架允许开发者通过 `plugin.yaml` 文件中的 `pluginDependencies` 字段来声明插件的依赖关系，从而确保插件在运行时能够正确加载所需的其他插件。

本节将介绍如何在 `plugin.yaml` 文件中声明插件依赖，包括强制依赖、可选依赖及其版本管理规则。我们还将讨论依赖关系如何影响插件的加载顺序及运行时行为。

## 插件依赖管理

Halo 插件系统支持在 `plugin.yaml` 文件中通过 `pluginDependencies` 字段声明插件依赖关系。这些依赖关系可以是强制性的，也可以是可选的。
依赖声明的规则非常灵活，能够满足不同的插件需求。

以下是如何在 `plugin.yaml` 文件中声明依赖的具体方式。

### 依赖声明方式

依赖关系通过 `pluginDependencies` 字段声明，采用 YAML 列表格式。每个依赖项包含插件名称和可选的版本号。

> 以下示例中将省略 `plugin.yaml` 文件中的其他字段，仅展示 `pluginDependencies` 字段。
>
> 下列提到的**插件名称**指的是 `plugin.yaml` 文件中的 `metadata.name` 字段。

以下是几种常见的依赖声明方式：

- **固定版本依赖**：如果插件依赖于另一个插件的特定版本，可以指定精确版本号。例如，`pluginA` 依赖于 `pluginB` 的版本 1.0.0：

  ```yaml
  # 省略其他字段
  spec:
    pluginDependencies:
      - pluginB@1.0.0
  ```

- **版本范围依赖**：如果插件对版本有一定的要求，可以指定版本范围。通过 `>=`（大于等于）和 `<`（小于）等符号，可以表示插件版本的区间。例如，`pluginA` 依赖于版本在 1.0.0 到 2.0.0 之间（不包括 2.0.0）：

    ```yaml
    spec:
      pluginDependencies:
        - pluginB@>=1.0.0 & <2.0.0
    ```

- **可选依赖**：某些情况下，插件的依赖是可选的，即使依赖未被满足，插件仍然可以加载。通过在插件名称后加上 `?` 来声明可选依赖。例如，`pluginA` 可选依赖于 `pluginB` 的 1.0 版本：

    ```yaml
    spec:
      pluginDependencies:
        - pluginB?@1.0
    ```

- **多个依赖声明**：一个插件可能依赖多个插件，所有依赖可以在同一列表中列出，使用逗号分隔。例如，`pluginA` 依赖于 `pluginB` 的 1.0.0 到 2.0.0 版本区间，以及 `pluginC` 的 0.0.1 到 0.1.0 版本区间：

    ```yaml
    spec:
      pluginDependencies:
        - pluginB@>=1.0.0 & <=2.0.0
        - pluginC@>=0.0.1 & <=0.1.0
    ```

### 依赖加载逻辑

在 Halo 插件系统中，插件的依赖关系会影响其加载顺序和运行时行为。具体来说，插件的加载只有在其所有强制依赖都得到满足时才会进行。

以下是依赖关系加载的关键点：

- **强制依赖**：插件的强制依赖必须在插件加载前完成。只有当所有指定的强制依赖被满足（即对应的插件及其指定版本存在并加载完成）时，插件才会被加载。否则，插件无法被启动。

- **可选依赖**：插件可以依赖某些插件，但这些依赖项是可选的。即便可选依赖没有被满足，插件仍会被加载并运行。在某些情况下，如果缺少某个可选插件的依赖，插件的某些功能可能会受到限制或无法启用，但插件本身不会失败。

- **版本匹配**：当插件依赖于其他插件的特定版本时，Halo 插件框架会根据声明的版本范围匹配所需的插件。如果版本范围要求匹配的插件版本不可用，插件将无法加载。如果插件指定了多个版本范围，框架会选择最适合的版本。如果多个版本都能满足要求，开发者需要确保没有版本冲突，以避免不一致的行为。

通过合理的依赖声明，插件的加载和运行将更加顺畅，能够确保所有必需的功能模块按预期协同工作。

### 依赖声明注意事项

- **版本管理**：在声明版本时，推荐使用明确的版本号或版本范围，避免使用过于宽松的版本要求（如 `pluginB@*`），以确保插件在不同环境中一致性地运行。
- **依赖冲突**：多个插件可能依赖于不同版本的同一插件，这可能导致版本冲突。为避免这种情况，开发者应该尽量保持插件版本的兼容性，必要时在 `plugin.yaml` 文件中使用具体的版本号范围进行严格控制。
- **插件间的依赖层级**：插件可能依赖于其他插件，而这些插件又可能依赖于其他插件。建议开发者清晰地管理依赖链，避免过于复杂的依赖层级。合理规划插件之间的依赖关系有助于减少维护难度和潜在的运行时问题。

通过以上方式，开发者可以灵活地声明和管理插件的依赖关系，确保插件的高效运行和模块化扩展。

## 提供依赖的插件项目结构

为了确保插件的可维护性、模块化和可扩展性，设计合理的项目结构是非常重要的。使用 Gradle 作为项目管理工具时，可以通过规范的目录结构来清晰地管理插件的依赖和代码。特别是当插件需要提供类型共享或者支持多个插件互相依赖时，合理的项目结构能够大大提高开发效率和代码复用性。

本节将介绍如何使用 Gradle 构建插件项目，并提供一些最佳实践，以确保插件项目结构清晰、模块化，**并便于其他插件进行引用**。

### 推荐项目结构 {#project-structure}

在 Gradle 项目中，推荐使用标准的项目结构，以便于插件代码的管理和依赖的声明。以下是一个典型的 Halo 插件项目结构示例：

```plaintext
my-halo-plugin/
├── build.gradle                    # 项目的构建配置
├── settings.gradle                 # Gradle 设置文件
├── src/
│   ├── main/
│   │   ├── java/                   # Java 源代码目录
│   │   └── resources/              # 插件资源文件目录
│   │       └── plugin.yaml         # 插件元数据配置文件
│   └── test/                       # 测试代码目录
└── README.md                       # 项目说明文件，提供项目的介绍、安装和使用文档
```

参考 [插件项目结构](../basics/structure.md) 了解更多关于 Halo 插件项目结构的信息。

### 类型定义文件的组织

当插件需要为其他插件提供类型时，项目结构需要进一步优化。特别是在使用 Gradle 构建时，可以将共享的类型和接口定义放置到专门的模块中，使其成为一个独立的依赖模块，供其他插件使用。

一个常见的做法是创建一个独立的 `api` 模块，专门存放所有的类型定义（例如接口、抽象类等）。这样，其他插件就可以通过引用这个 `api` 模块来共享这些类型，而不需要直接依赖实现模块。

以下是一个优化后的项目结构示例，包含 `api` 和 `plugin` 模块：

```plaintext
my-halo-plugin/
├── build.gradle                    # 根项目构建配置文件
├── settings.gradle                 # 设置文件，声明子模块
├── api/                            # 存放 API 类型的模块
│   ├── build.gradle                # API 模块的构建配置
│   ├── src/
│   │   ├── main/
│   │   │   └── java/               # API 类型定义文件
│   │   └── resources/              # API 模块的资源文件（如果有的话）
│   └── README.md                   # API 模块说明文档
├── plugin/                         # 插件实现模块
│   ├── build.gradle                # 插件实现模块的构建配置
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/               # 插件实现代码
│   │   │   └── resources/          # 插件资源文件，包括 plugin.yaml
│   │   └── test/                   # 插件的测试代码
│   └── README.md                   # 插件模块说明文档
└── README.md                       # 项目说明文件
```

#### API 模块构建配置

`api` 模块仅包含接口和类型定义，没有具体的实现逻辑。你可以通过 Gradle 将这个模块发布到 Maven 仓库，让其他插件能够依赖它。

`api/build.gradle` 配置如下：

```gradle
plugins {
    id 'java-library'
    id 'maven-publish'
}

group = 'com.example'
version = '1.0.0'

repositories {
    mavenCentral()                     // 使用 Maven Central 仓库
}

dependencies {
    // API 模块可能需要的一些依赖
    // 例如：如果需要一些常用的库
}

publishing {
    publications {
        mavenJava(MavenPublication) {
            from components.java   // 发布 Java 项目组件
            artifactId = 'my-halo-api'   // API 模块的 artifactId
            version = project.hasProperty('version') ? project.property('version') : 'unspecified'

            // pom 额外信息，这是可选的
            pom {
                // POM 中的插件信息，一般为插件的 displayName
                name = 'My Halo Plugin'
                // POM 中的插件描述
                description = 'A sample plugin for Halo'
                // 插件的官网 URL
                url = 'https://example.com/my-halo-plugin'

                licenses {
                  license {
                    // 插件的开源许可协议
                    name = 'Apache License 2.0'
                    // 许可协议的 URL
                    url = 'https://opensource.org/licenses/Apache-2.0'
                  }
                }

                developers {
                  developer {
                    id = 'guqing'  // 开发者的 ID
                    name = 'guqing'  // 开发者姓名
                    email = 'guqing@example.com'  // 开发者邮箱
                  }
                }

                scm {
                   // Git 仓库连接
                  connection = 'scm:git:git@github.com:halo-sigs/my-halo-plugin.git'
                  // Git 仓库连接，用于开发者
                  developerConnection = 'scm:git:git@github.com:halo-sigs/my-halo-plugin.git'
                  // Git 仓库 URL
                  url = 'https://github.com/halo-sigs/my-halo-plugin'
                }
            }
        }
    }
    repositories {
        maven {
          // 以 -SNAPSHOT 结尾的版本发布到快照仓库，否则发布到正式仓库
          url = version.endsWith('-SNAPSHOT') ? 'https://s01.oss.sonatype.org/content/repositories/snapshots/' :
                    'https://s01.oss.sonatype.org/content/repositories/releases/'
            credentials {
                // 从 gradle.properties 中读取 或者从环境变量中读取
                username = project.findProperty("ossr.user") ?: System.getenv("OSSR_USERNAME")
                password = project.findProperty("ossr.password") ?: System.getenv("OSSR_PASSWORD")
            }
        }
    }
}
```

API 模块的代码应该是接口或抽象类，用于插件之间共享。例如：

```java
// src/main/java/com/example/api/MyApi.java
package com.example.api;

public interface MyApi {
    void doSomething();
}
```

当你完成上述配置后，可以通过 Gradle 发布 API 模块到 Maven 仓库。以下是发布的步骤：

1. Maven 现已支持通过 GiHub 账号注册并发布包，你可以在 [Maven Central](https://central.sonatype.org/register/central-portal) 注册账号并获取凭证。
2. 得到你可以通过在 `~/.gradle/gradle.properties` 文件中添加以下内容来配置 Maven 仓库的凭证：

    ```properties
    ossr.user=your-username
    ossr.password=your-password
    ```

3. 发布 API 模块到 Maven 仓库：

    ```bash
    ./gradlew :api:publish
    ```

除了手动发布到 Maven 仓库，你也可以使用 GitHub Actions 等 CI/CD 工具自动发布 API 模块，以避免出错。

以下是一个 GitHub Actions 的示例配置：

```yaml
# .github/workflows/publish-api.yml
name: Publish plugin API module to Maven

on:
  release:
    types: [published]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Cache Gradle packages
        uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
          restore-keys: |
            ${{ runner.os }}-gradle-

      - name: Extract version from GitHub tag
        id: extract_version
        run: |
          tag_name=${{ github.event.release.tag_name }}
          VERSION=${tag_name#v}
          echo "Extracted Version: $VERSION"
          echo "VERSION=$VERSION" >> $GITHUB_ENV

      - name: Build with Gradle
        run: ./gradlew clean build -Pversion=${{ env.VERSION }}

      - name: Publish to Maven
        env:
          OSSR_USERNAME: ${{ secrets.MAVEN_USERNAME }}
          OSSR_PASSWORD: ${{ secrets.MAVEN_PASSWORD }}
        run: ./gradlew :api:publish -Pversion=${{ env.VERSION }}
```

它会在创建新的 Release 时自动发布 API 模块到 Maven 仓库。

你需要在仓库的 `Settings` -> `Secrets and variables` -> `Actions` -> `New Repository secret` 中添加 `MAVEN_USERNAME` 和 `MAVEN_PASSWORD` 两个密钥，分别对应 Maven 仓库的用户名和密码。

#### plugin 模块构建配置

`plugin` 模块是插件的具体实现，它依赖于 `api` 模块，并包含插件的具体功能和业务逻辑。

它的结构与 [推荐项目结构](#project-structure) 中的 `plugin` 模块基于一致，但需要在 `build.gradle` 中声明对 `api` 模块的依赖：

需要注意的是 `run.halo.plugin.devtools` Gradle 插件应该始终在 `plugin` 模块中引入，不能放在项目根目录的 `build.gradle` 或 `api` 模块的 `build.gradle` 中，以确保插件在开发模式下能够正确运行。

## 版本管理

API 模块和插件模块的版本应该保持一致，以确保插件在不同环境中的一致性。

版本的发布应该遵循 [插件语义化版本规范](../publish.md#version-control)，以确保插件的版本号能够清晰地表达插件的变化和向后兼容性。
