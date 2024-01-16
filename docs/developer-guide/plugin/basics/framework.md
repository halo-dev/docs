---
title: Halo 架构概览
description: Halo 架构概览
---

Halo 是一个基于 Spring Boot 的 Java Web 应用，Web 层不再使用 Servlet 技术，而是充分向异步和非阻塞的反应式编程靠拢，使用 Netty 作为 Web 服务器，使用 [Reactor](https://projectreactor.io/) 作为异步编程框架，使用 R2DBC 作为数据库访问框架，使用 WebFlux 作为 Web 层框架。

Halo 由以下几个核心模块组成：

- 安全模块：提供用户认证、授权、用户管理等功能。
- 插件模块：提供插件管理、插件加载、插件通信、扩展点等功能。
- 主题模块：提供主题管理、模板渲染、主题配置等功能。
- 内置内容管理模块：提供文章、分类、标签、评论、附件、页面、菜单、设置等功能。

## Halo 核心概念和 Extension

### 自定义模型 {#extension}

Extension 自定义模型提供了一种声明和管理数据模型的方法，它是 Halo 的核心概念之一。Halo 中的所有数据模型都是通过 Extension 来定义的，包括文章、分类、标签、评论、附件、页面、菜单、设置等，这便于插件系统可以灵活的进行数据模型的扩展，设计文档参考：[自定义模型设计](https://github.com/halo-dev/rfcs/tree/main/extension)。

每个自定义模型都有三大类属性：metadata、spec、和 status。

1. metadata 用于标识自定义模型，每个自定义模型都至少有三个 metadata 属性：name、creationTimestamp、version，除此之外还有 labels 用于标识自定义模型的标签，annotations 用于存放扩展信息，deletionTimestamp 用于标识自定义模型是否被删除，finalizers 用于标识自定义模型的是否可回收。
2. spec 描述用户期望达到的理想状态（Desired State），比如用户可以配置插件的 `spec.enable` 属性为 `true` 来启用插件或者为 `false` 来停用插件，这就是用户期望达到的理想状态，然后插件控制器会根据用户的期望状态来实现插件的启用或停用，它是声明式的，用户只需要声明期望状态，实际状态由具体的控制器来维护，最终达到用户期望的状态。
3. status 描述当前实际状态（Actual State），比如用户可以通过 `status.phase` 属性来查看插件启用进行到了哪一步，中间过程可能包含多个步骤，比如插件解析、加载、资源准备等，这些步骤都是由插件控制器来实现的，它是实际状态，只要插件控制器还在运行，它就会一直更新状态，最终达到用户期望的状态。

每个自定义模型注册后都会默认生成 CRUD APIs，通过这些 APIs 就可以对自定义模型对象进行增删改查的操作，然后只需要编写控制器来实现自定义模型的业务逻辑即可，这就是 Halo 的异步编程模型。

### 控制器 {#controller}

在 Halo 中，用户通过自定义模型定义资源的期望状态，Controller 负责监视资源的实际状态，当资源的实际状态和“期望状态”不一致时，Controller 则对系统进行必要的更改，以确保两者一致，这个过程被称之为调谐（Reconcile），而实现调谐的逻辑被称之为 Reconciler。Reconciler 获取对象的名称并返回是否需要重试（例如发生一些错误），如果需要重试，则 Controller 会在稍后再次调用 Reconciler，而这个过程会一直重复，直到 Reconciler 返回成功为止，这个过程被称之为调谐循环（Reconciliation Loop）。

### 自定义模型生命周期 {#extension-lifecycle}

所有 Halo 的自定义模型对象都遵循一个共同的生命周期，可以将其视为状态机，尽管某些特定的自定义模型扩展了这一点并提供了更多状态。要编写正确的控制器，了解公共对象生命周期非常重要。

所有自定义模型对象都存在以下状态之一：

- `DOES_NOT_EXIST`：Halo 不知道该对象。该状态不区分“尚未创建”和“已删除”。
- `ACTIVE`：Halo 知道该对象并且该对象尚未被删除（未设置 `metadata.deletionTimestamp`）。在此状态下，任何更新操作（PUT、PATCH、服务器端处理等）都将导致相同的状态。
- `DELETING`：Halo 知道该对象，该对象已被删除，但尚未完全删除。这可能是因为对象有一个或多个终结器（在 `metadata.finilizers` 中），客户端仍然可以访问该对象，并且可以看到它正在删除，因为设置了 `metadata.deleteTimestamp` 字段。当最后一个终结器被删除时，该对象将从存储中删除，并真正不存在。

下图描述了上述状态：

```text
                                  +---- object
                                  |     updated
                                  v        |
                           +----------+    |
                           |          +----+
          object --------->|  ACTIVE  |
          created          |          +-----------+
             |             +---+------+           |
             |                 |                  |
             |                 |                  |
+------------+---+             |                  |
|                |     object deleted             |
|                |<--- without finalizers         |
|                |                           object deleted
| DOES_NOT_EXIST |                           with finalizers
|                |                                |
|                |<--- finalizers removed         |
|                |             |                  |
+----------------+             |                  |
                               |                  |
                               |                  |
                           +---+------+           |
                           |          |           |
                           | DELETING |<----------+
                           |          |
                           +----------+
```

总结：自定义模型对象的删除并不是立即生效的，而是需要经过两个步骤，第一步是将对象的 `metadata.deletionTimestamp` 字段设置为当前时间，第二步是将对象的 `metadata.finalizers` 字段设置为空，这样对象才会真正被删除，第一步是由用户发起的，第二步是由 Halo 控制器发起的。

### Secret {#secret}

Secret 用于解决密码、token、密钥等敏感数据的配置问题，而不需要把这些敏感数据暴露到自定义模型的 Spec 中，或 API 响应中。

### ConfigMap {#configmap}

ConfigMap 自定义模型用来保存 key-value pair 配置数据，这个数据可以在 Reconciler 里使用，或者被用来为插件或者主题存储配置数据。

虽然 ConfigMap 跟 Secret 类似，但是 ConfigMap 更方便的处理不含敏感信息的字符串。

### Setting {#setting}

Setting 自定义模型用于提供用户配置声明，用户可以通过 Setting 来声明一些模板需要的配置，比如主题设置、插件设置、系统设置等都可以通过 Setting 来声明，就能在 UI 层面提供配置入口，用户可以通过 UI 来配置这些设置，而不需要修改配置文件。

### 基于角色的访问控制（RBAC）{#rbac}

Halo 使用基于角色的访问控制（Role-based Access Control，RBAC）来控制用户对资源的访问权限，RBAC 通过将角色分配给用户来实现访问控制，用户可以通过角色来访问资源，角色可以通过权限来访问资源。

RBAC 主要引入了角色（Role）和角色绑定（RoleBinding）的抽象概念，插件可以通过定义角色来提供用户对资源的分配入口，用户可以通过角色绑定来获取角色，从而获取资源的访问权限。

而对于底层角色，用户分配起来比较麻烦，因此 Halo 提供了**角色模板**的概念，通过将角色标记为模板来使用一组功能相关的角色，如文章查看的角色可能必须包含标签和分类的查看才算是一组完整的功能，因此可以将文章查看的角色标记为模板，并依赖标签和分类的查看角色，这样用户就可以通过角色模板来获取一组功能相关的角色，而不需要一个一个的分配角色。
