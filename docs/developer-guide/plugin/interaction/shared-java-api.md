---
title: 发布共享 Java API
description: 将 Halo 插件的稳定 Java 接口拆分为独立 Gradle 模块，供其他插件以 compileOnly 方式引用
---

当两个插件必须共享 Java 接口或数据类型时，可以把公共契约放入独立 API 模块。只为单个实现创建 API 模块没有收益；不需要共享类型时，优先使用事件或扩展点。

## 项目结构

```tree
my-plugin/
├── api/
│   ├── build.gradle
│   └── src/main/java/com/example/api/MyApi.java
├── plugin/
│   ├── build.gradle
│   └── src/main/resources/plugin.yaml
├── build.gradle
└── settings.gradle
```

`run.halo.plugin.devtools` 只应用于 `plugin` 模块，不要放入根项目或 `api` 模块。

## 配置 API 模块

当前 Halo 插件脚手架使用 Java 21。API 模块应与插件模块使用相同 toolchain：

```groovy title="api/build.gradle"
plugins {
    id 'java-library'
    id 'maven-publish'
}

group = 'com.example'
version = rootProject.version

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
    withSourcesJar()
}

tasks.withType(JavaCompile).configureEach {
    options.encoding = 'UTF-8'
    options.release = 21
}

publishing {
    publications {
        mavenJava(MavenPublication) {
            from components.java
            artifactId = 'my-plugin-api'
        }
    }
}
```

公共模块只放稳定接口和共享数据类型：

```java title="api/src/main/java/com/example/api/MyApi.java"
package com.example.api;

public interface MyApi {
    void doSomething();
}
```

## 配置实现和使用方

实现插件在多模块项目中依赖 API：

```groovy title="plugin/build.gradle"
dependencies {
    implementation project(':api')
}
```

其他插件通过 Maven artifact 编译，并在 `plugin.yaml` 中声明运行时插件依赖：

```groovy
dependencies {
    compileOnly 'com.example:my-plugin-api:1.2.0'
}
```

```yaml
spec:
  pluginDependencies:
    MyPlugin: ">=1.2.0 & <2.0.0"
```

使用 `compileOnly` 可以避免把同一 API 类型重复打入使用方插件。运行时由被依赖插件提供实现；依赖声明规则见[依赖其他插件](./dependency.md)。

## 发布

发布仓库、签名和凭证属于 Maven 仓库配置，不是 Halo 插件契约。按照 [Maven Central Portal 发布指南](https://central.sonatype.org/publish/publish-portal-gradle/)配置当前发布流程，不要复制旧 OSSRH `s01.oss.sonatype.org` 示例。

发布前检查：

1. API artifact 与插件版本的对应关系明确。
2. API 模块没有依赖插件实现类。
3. 使用方以 `compileOnly` 引用 API，并声明匹配的 `pluginDependencies`。
4. 破坏二进制兼容性的变更已经提高主版本。

当前 Java 版本和 Gradle 写法参考 [create-halo-plugin 模板](https://github.com/halo-sigs/create-halo-plugin/blob/30725763aeffbcea1390c75c1a2fc3d1c31e2857/template/build.gradle.template)。
