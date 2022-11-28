---
title: 创建一个插件
description: 一步步介绍如何开发一个插件
---

Halo 提供了一个模板仓库用于创建插件：

1. 打开 [plugin-starter](https://github.com/halo-dev/plugin-starter)。
2. 点击 `Use this template` -> `Create a new repository`。
3. 如图所示填写仓库名后点击 `Create repository from template`。
![create-repository-for-hello-world-plugin](/img/create-repository-for-hello-world-plugin.png)

你现在已经基于 Halo 插件模板创建了自己的存储库。接下来，你需要将它 `git clone` 到你的计算机上并使用 `IntelliJ IDEA` 打开它。

## 配置你的插件

1. 修改 `build.gradle` 中的 `group` 为你自己的，如:

  ```groovy
  group = 'io.github.guqing'
  ```

2. 修改 `settings.gradle` 中的 `rootProject.name`

  ```groovy
  rootProject.name = 'halo-plugin-hello-world'
  ```

3. 修改插件的描述文件 `plugin.yaml`，它位于 `src/main/resources/plugin.yaml`。示例：

  ```yaml
  apiVersion: plugin.halo.run/v1alpha1
  kind: Plugin
  metadata:
    # 它是插件的唯一标识名
    # 包含不超过 253 个字符，仅包含小写字母、数字、“-”或“.”，以字母或数字开头，以字母或数字结尾
    name: hello-world
  spec:
    enabled: true
    # 支持的 Halo 版本，SemVer expression, e.g. ">=2.0.0"
    requires: ">=2.0.0"
    # 插件作者名
    author: halo-dev
    # 插件 logo，可以是域名或相对于项目 src/main/resources 目录的相对文件路径
    logo: https://halo.run/logo
    # 插件配置表单名称，参考表单定义，不需要则可删除，这里先注释它
    # settingName: hello-world-settings
    # 表单定义对应的值标识名, 推荐命名为 "插件名-configmap"，没有配置 settingName 则可删除此项
    # configMapName: hello-world-configmap
    # 通常为插件的 Github 仓库链接，或可联系到插件作者或插件官网或帮助中心链接等
    homepage: https://github.com/guqing/halo-plugin-hello-world
    # 插件的显示名称，它通常是以少数几个字来概括插件的用途
    displayName: "插件 Hello world"
    # 插件描述，用一段话来介绍插件的用途
    description: "插件开发的 hello world，用于学习如何开发一个简单的 Halo 插件"
    # 插件使用的软件协议 https://en.wikipedia.org/wiki/Software_license
    license:
      - name: "MIT"
  ```

参考链接：

- [SemVer expression](https://github.com/zafarkhaja/jsemver#semver-expressions-api-ranges)
- [表单定义](../form-schema.md)

4. 删除 `resources/extensions/` 目录。
5. 删除 `resources/static` 目录。
6. 删除 `src/main/java` 下的所有文件。

此时我们已经准备好了可以开发一个 hello world 插件的一切，下面让我们正式进入 hello world 插件开发教程。

## 运行插件

为了看到效果，首先我们需要让插件能最简单的运行起来。

1. 在 `src/main/java` 下创建包，如 `io.github.guqing`，在创建一个类 `HelloWorldPlugin`，它继承自 `BasePlugin` 类内容如下：

```java
package io.github.guqing;

import org.pf4j.PluginWrapper;
import org.springframework.stereotype.Component;
import run.halo.app.plugin.BasePlugin;

@Component
public class HelloWorldPlugin extends BasePlugin {
    public HelloWorldPlugin(PluginWrapper wrapper) {
        super(wrapper);
    }
}
```

`src/main/java` 下的文件结构如下：

```text
.
└── io
    └── github
        └── guqing
            └── HelloWorldPlugin.java
```

然后在项目目录执行命令

```shell
./gradlew build 
```

使用 `IntelliJ IDEA` 打开 Halo，参考 [Halo 开发环境运行](../core/run.md)并对 `application-local.yaml` 做如下配置：

```yaml
halo:
  plugin:
    runtime-mode: development
    plugins-root: ${halo.work-dir}/plugins
    fixed-plugin-path:
      # 配置为插件绝对路径
      - /Users/guqing/halo-plugin-hello-world
```

使用此 local profile 启动 Halo，然后访问 `http://localhost:8090/console`

在插件列表将能看到插件已经被正确启动
![hello-world-in-plugin-list](/img/hello-world-plugin-list.png)

## 插件的生命周期

让我们继续修改一下 `HelloWorldPlugin` 这个类

```diff
@Component
public class HelloWorldPlugin extends BasePlugin {
    public HelloWorldPlugin(PluginWrapper wrapper) {
        super(wrapper);
    }

+    @Override
+    public void start() {
+        System.out.println("Hello world 插件启动了!");
+    }
+
+    @Override
+    public void stop() {
+        System.out.println("Hello world 被停止!");
+    }
+
+    @Override
+    public void delete() {
+        System.out.println("Hello world 被卸载");
+    }
}
```

可以看到我们覆盖了 `BasePlugin` 的三个方法，它们就是插件的生命周期方法：

- start: 在插件被启用时执行
- stop: 在插件被停用时执行
- delete: 在插件被卸载时执行

然后重新 build 一下代码

```shell
./gradlew build 
```

再重启 Halo，将在控制台看到以下日志

```text
2022-11-28T16:29:03.494+08:00  INFO 81006 --- [nReconciler-t-1] run.halo.app.plugin.HaloPluginManager    : Start plugin 'hello-world@1.0.0-SNAPSHOT'
Hello world 插件启动了!
```

接下来我们通过一个 TODOList 示例来更近一步了解 Halo 的插件开发并实际应用插件的生命周期。

## 创建一个自定义模型

首先我们希望 TODOList 能够被持久化以避免重启后数据丢失，Halo 提供了一种[自定义模型机制](https://github.com/halo-dev/rfcs/tree/main/extension)
自定义模型允许你只需要创建一个资源类别即可获得一组 CRUD APIs。

首先创建一个 `class` 名为 `Todo` 并写入如下内容：

```java
package io.github.guqing;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import run.halo.app.extension.AbstractExtension;
import run.halo.app.extension.GVK;

@Data
@EqualsAndHashCode(callSuper = true)
@GVK(kind = "Todo", group = "todo.guqing.github.io",
    version = "v1alpha1", singular = "todo", plural = "todos")
public class Todo extends AbstractExtension {

    @Schema(requiredMode = REQUIRED)
    private TodoSpec spec;

    @Data
    public static class TodoSpec {

        @Schema(requiredMode = REQUIRED, minLength = 1)
        private String title;

        @Schema(defaultValue = "false")
        private Boolean done;
    }
}
```

:::tip 释义

- @GVK：此注解标识该类为一个自定义模型，同时必须继承 `AbstractExtension`。
  - kind：表示自定义模型所表示的 REST 资源。
  - group：表示一组公开的资源，通常采用域名形式，Halo 项目保留使用空组和任何以“*.halo.run”结尾的组名供其单独使用。
  选择群组名称时，我们建议选择你的群组或组织拥有的子域，例如“widget.mycompany.com”。
  - version：API 的版本，它与 group 组合使用为 apiVersion=“GROUP/VERSION”，例如“api.halo.run/v1alpha1”。
  - singular: 资源的单数名称，这允许客户端不透明地处理复数和单数，必须全部小写。通常为小写的“kind”。
  - plural： 资源的复数名称，自定义资源在 `/apis/<group>/<version>/.../<plural>` 下提供，必须为全部小写。
- @Schema：属性校验注解，会在创建/修改资源前对资源校验，参考 [schema-validator](https://www.openapi4j.org/schema-validator.html)。
:::

然后在 `HelloWorldPlugin` 的 `start` 生命周期方法中注册此自定义模型到 Halo 中。

```diff
// ...
+ import run.halo.app.extension.SchemeManager;

@Component
public class HelloWorldPlugin extends BasePlugin {
+   private final SchemeManager schemeManager;

-    public HelloWorldPlugin(PluginWrapper wrapper) {
+    public HelloWorldPlugin(PluginWrapper wrapper, SchemeManager schemeManager) {
        super(wrapper);
+       this.schemeManager = schemeManager;
    }

    @Override
    public void start() {
+       // 插件启动时注册自定义模型
+       schemeManager.register(Todo.class);
        System.out.println("Hello world 插件启动了!");
    }

     @Override
    public void stop() {
+      // 插件停用时取消注册自定义模型
+      Scheme todoScheme = schemeManager.get(Todo.class);
+      schemeManager.unregister(todoScheme);
      System.out.println("Hello world 被停止!");
    }
    // ....
}
```

然后 build 项目，重启 Halo，访问 `http://localhost:8090/webjars/swagger-ui/index.html`，
可以找到如下 Todo APIs：

![hello world plugin swagger api for toto](/img/halo-plugin-hello-world-todo-swagger-api.png)

由于所有以 `/api` 和 `/apis` 开头的 APIs 都需要认证才能访问，因此先在 Swagger UI 界面顶部点击 `Authorize` 认证，然后尝试访问
`GET /apis/todo.guqing.github.io/v1alpha1/todos` 可以看到如下结果：

```json
{
  "page": 0,
  "size": 0,
  "total": 0,
  "items": [],
  "first": true,
  "last": true,
  "hasNext": false,
  "hasPrevious": false,
  "totalPages": 1
}
```

至此我们完成了一个自定义模型的创建和使用插件生命周期方法实现了自定义模型的注册和删除，下一步我们将编写用户界面使用这些 APIs 完成 TodoList 功能。

## 编写用户界面

TODO...
