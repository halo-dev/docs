---
title: 发布共享 Java API
description: 将 Halo 插件的稳定 Java 接口拆分为独立 Gradle 模块，供其他插件以 compileOnly 方式引用
---

当两个插件必须共享 Java 接口或数据类型时，可以把公共契约放入独立 API 模块。只为单个实现创建 API 模块没有收益；不需要共享类型时，优先使用事件或扩展点。

## 创建 API 模块

从 `create-halo-plugin` 1.6.0 开始，可以在已有插件项目的根目录中创建可发布的 Java 模块：

```bash
pnpm dlx create-halo-plugin@latest add module api
```

可以将 `api` 替换为实际模块名。命令会复用插件项目的 Java、Halo 和发布元数据，创建源码与测试目录、Gradle 发布配置、模块 README 和 `.github/workflows/publish.yml`，并自动配置模块依赖。

## 项目结构

```tree
my-plugin/
├── api/
│   ├── build.gradle
│   ├── README.md
│   └── src/
│       ├── main/java/com/example/api/package-info.java
│       └── test/java/
├── .github/workflows/publish.yml
├── src/main/resources/plugin.yaml
├── build.gradle
└── settings.gradle
```

插件实现和 `run.halo.plugin.devtools` 保留在根项目中，不要将插件开发插件应用到 `api` 模块。

## 编写 API

生成的 `api/build.gradle` 已经配置 `java-library`、Halo API 的 `compileOnly` 依赖、与根项目一致的 Java toolchain，以及 Maven Central 发布和签名。通常只需在模块中添加稳定接口和共享数据类型：

```java title="api/src/main/java/com/example/api/MyApi.java"
package com.example.api;

public interface MyApi {
    void doSomething();
}
```

## 配置实现和使用方

脚手架会在根插件中添加 API 模块依赖：

```groovy title="build.gradle"
dependencies {
    implementation project(':api')
}
```

其他插件通过 Maven artifact 编译，并在 `plugin.yaml` 中声明运行时插件依赖：

```groovy
dependencies {
    compileOnly 'com.example:api:1.2.0'
}
```

```yaml
spec:
  pluginDependencies:
    MyPlugin: ">=1.2.0 & <2.0.0"
```

使用 `compileOnly` 可以避免把同一 API 类型重复打入使用方插件。运行时由被依赖插件提供实现；依赖声明规则见[依赖其他插件](./dependency.md)。

## 发布

生成的 `.github/workflows/publish.yml` 会从 `main` 分支发布 SNAPSHOT 版本，并从 `v*` 标签发布正式版本。发布前需要配置以下 GitHub Actions 仓库密钥：

- `MAVEN_CENTRAL_USERNAME`
- `MAVEN_CENTRAL_PASSWORD`
- `SIGNING_KEY`
- `SIGNING_KEY_ID`
- `SIGNING_PASSWORD`

账号和签名设置可查阅 [Maven Central Portal 发布指南](https://central.sonatype.org/publish/publish-portal-gradle/)。

发布前检查：

1. API artifact 与插件版本的对应关系明确。
2. API 模块没有依赖插件实现类。
3. 使用方以 `compileOnly` 引用 API，并声明匹配的 `pluginDependencies`。
4. 破坏二进制兼容性的变更已经提高主版本。

具体配置参考 [create-halo-plugin 1.6.0 Java 模块模板](https://github.com/halo-sigs/create-halo-plugin/blob/1.6.0/template/_internal/java-library/build.gradle.template)。
