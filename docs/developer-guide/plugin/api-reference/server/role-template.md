---
title: API 权限控制
description: 了解如果对插件中的 API 定义角色模板以接入权限控制
---

插件中的 APIs 无论是自定义模型自动生成的 APIs 或者是通过 `@Controller` 自定义的 APIs 都只有超级管理员能够访问，如果想将这些 APIs 授权给其他用户访问，
则需要定义一些[角色模板](../../basics/framework.md#rbac)的资源以便可以在用户界面上将其分配给其他角色使用。

## 角色模板定义

定义角色模板需要遵循一定的规范：

- **文件位置和标记**：角色模板定义文件存放于 `src/main/resources/extensions`，文件名可以任意，它的 kind 为 Role 且必须具有标签 `halo.run/role-template: "true"` 来标识其为模板。
- **角色类型**：通常，我们为同一种资源定义两种角色模板：只读权限和管理权限，分别对应 `view` 和 `manage`，如果需要更细粒度的控制，可以定义更多的角色模板。
- **角色名称**：角色名称必须以插件名作为前缀，以避免与其他插件冲突，例如 `my-plugin-role-view-persons`。
- **角色依赖**：如果一个角色需要依赖于另一个角色，可以通过 `rbac.authorization.halo.run/dependencies` 作为 key 的 `metadata.annotations` 来声明依赖关系。
- **UI 权限**：如果需要在前端界面上控制某个角色的权限，可以通过 `rbac.authorization.halo.run/ui-permissions` 作为 key 的 `metadata.annotations` 来声明。
- **角色模板分组**：如果需要将多个角色模板归为一组显示，可以通过 `rbac.authorization.halo.run/module` 作为 key 的 `metadata.annotations` 来声明分组名称。
- **角色显示名称**：如果需要在前端界面上显示角色的友好名称，可以通过 `rbac.authorization.halo.run/display-name` 作为 key 的 `metadata.annotations` 来声明显示名称。
- **隐藏角色模板**：如果不想在前端界面上显示某个角色模板，可以通过 `halo.run/hidden: "true"` 的 `metadata.labels` 来隐藏角色模板。

角色模板定义的基本框架如下：

```yaml
apiVersion: v1alpha1
kind: Role
metadata:
  name: role-template-name
  labels:
    halo.run/role-template: "true"
rules:
  - apiGroups: []
    resources: []
    resourceNames: []
    verbs: []
  - nonResourceURLs: []
    verbs: []
```

在遵循上述规范的基础上，最重要的是定义 `rules` 字段，它是一个数组，用于定义角色模板的权限规则，规则分为两种类型：[资源型](#resource-rules)和[非资源型](#non-resource-rules)。

### 资源型规则 {#resource-rules}

资源型规则用于定义对资源的操作权限，API 符合以下特征:

- 以 `/api` 开头，且以 `/api/<version>/<resource>[/<resourceName>/<subresource>]` 规则组成 APIs，最少路径层级为 3 即 `/api/<version>/<resource>`，最多路径层级为 5 即包含 `<resourceName>` 和 `<subresource>`，例如 `/api/v1/posts`。
- 以 `/apis/<group>/<version>/<resource>[/<resourceName>/<subresource>]` 规则组成的 APIs，最少路径层级为 4 即 `/apis/<group>/<version>/<resource>`，最多路径层级为 6 即包含 `<resourceName>` 和 `<subresource>`，例如 `/apis/my-plugin.halo.run/v1alpha1/persons`。

:::info 注
`[]`包裹的部分表示可选，`/api` 前缀被 Halo 保留，不允许插件定义以 `/api` 开头的资源型 APIs，所以插件的资源型 APIs 都是以 `/apis` 开头的。
:::

通常可以通过 `apiGroups`、`resources`、`resourceNames`、`verbs` 来组合定义。
例如对于资源型 API `GET /apis/my-plugin.halo.run/v1alpha1/persons`，可以定义如下规则：

```yaml
rules:
  - apiGroups: [ "my-plugin.halo.run" ]
    resources: [ "my-plugin/persons" ]
    verbs: [ "list" ]
```

而对于资源型 API `GET /apis/my-plugin.halo.run/v1alpha1/persons/zhangsan`，可以定义如下规则：

```yaml
rules:
  - apiGroups: [ "my-plugin.halo.run" ]
    resources: [ "my-plugin/persons" ]
    resourceNames: [ "zhangsan" ]
    verbs: [ "get" ]
```

关于 `verbs` 的详细说明请参考 [Verbs 详解](#verbs)。

### 非资源型规则 {#non-resource-rules}

凡是不符合资源型 APIs 规则的 APIs 都被定型为非资源型 APIs，例如 `/healthz`，可以使用以下配置方式：

```yaml
rules:
  - nonResourceURLs: ["/healthz", "/healthz/*"]
    verbs: [ "get", "create"]
```

非资源型规则使用 `nonResourceURLs` 来定义，其中 `nonResourceURLs` 是一个字符串数组，用于定义非资源型 APIs 的路径，`verbs` 用于定义非资源型 APIs 的请求动词。

`nonResourceURL` 中的 `*` 是一个全局通配符，表示匹配所有路径，如 `/healthz/*` 表示匹配 `/healthz/` 下的所有路径。

### 示例：定义人员管理角色模板

以下 YAML 文件展示了如何定义用于人员管理的角色模板：

```yaml
apiVersion: v1alpha1
kind: Role
metadata:
  # 使用 plugin name 作为前缀防止与其他插件冲突，比如这里的 my-plugin
  name: my-plugin-role-view-persons
  labels:
    halo.run/role-template: "true"
  annotations:
    rbac.authorization.halo.run/module: "Persons Management"
    rbac.authorization.halo.run/display-name: "Person Manage"
    rbac.authorization.halo.run/ui-permissions: |
      ["plugin:my-plugin:person:view"]
rules:
  - apiGroups: ["my-plugin.halo.run"]
    resources: ["my-plugin/persons"]
    verbs: ["*"]
---
apiVersion: v1alpha1
kind: Role
metadata:
  name: my-plugin-role-manage-persons
  labels:
    halo.run/role-template: "true"
  annotations:
    rbac.authorization.halo.run/dependencies: |
     [ "role-template-view-person" ]
    rbac.authorization.halo.run/module: "Persons Management"
    rbac.authorization.halo.run/display-name: "Person Manage"
    rbac.authorization.halo.run/ui-permissions: |
      ["plugin:my-plugin:person:manage"]
rules:
  - apiGroups: [ "my-plugin.halo.run" ]
    resources: [ "my-plugin/persons" ]
    verbs: [ "get", "list" ]
```

上述便是根据 [自定义模型](./extension.md) 章节中定义的 Person 自定义模型来配置角色模板的示例。

1. 定义了一个用于管理 Person 自定义模型对象的角色模板 `my-plugin-role-manage-persons`，它具有所有权限。
2. 定义了一个只允许查询 Person 资源的角色模板 `my-plugin-role-view-persons`。
3. `metadata.name` 的命名规则参考 [metadata name 命名规范](../server/extension.md#metadata-name)。

下面让我们回顾一下这些配置：

`rules` 是个数组，它允许配置多组规则：

- `apiGroups` 对应 `GVK` 中的 `group` 所声明的值。
- `resources` 对应 API 中的 resource 部分。
- `verbs` 表示请求动词，可选值为 "create", "delete", "deletecollection", "get", "list", "patch", "update", "watch"。参考 [Verbs 详解](#verbs)。

`metadata.labels` 中必须包含 `halo.run/role-template: "true"` 以表示它此资源要作为角色模板。

`metadata.annotations` 中：

- `rbac.authorization.halo.run/dependencies`：用于声明角色间的依赖关系，例如管理角色必须要依赖查看角色，以避免分配了管理权限却没有查看权限的情况。
- `rbac.authorization.halo.run/module`：角色模板分组名称。在此示例中，管理 Person 的模板角色将和查看 Person 的模板角色将被在 UI 层面归为一组展示。
- `rbac.authorization.halo.run/display-name`：模板角色的显示名称，用于展示为用户可读的名称信息。

### UI 权限控制 {#ui-permissions}

通过在角色模板的 `metadata.annotations` 中定义 `rbac.authorization.halo.run/ui-permissions` 来控制 UI 权限，这样可以在前端界面通过这个权限来控制菜单或者页面按钮是否展示。

值的规则为 `plugin:{your-plugin-name}:scope-name`, `scope-name` 为你自定义的权限名称，如上面的示例中的 `plugin:my-plugin:person:view` 和 `plugin:my-plugin:person:manage`。

你可以在 UI 层面使用这个权限来控制菜单是否展示：
  
  ```javascript
  {
    path: "",
    name: "HelloWorld",
    component: DefaultView,
    meta: {
      permissions: ["plugin:my-plugin:person:view"]
    }
  }
  ```

> 该配置示例为在插件前端部分入口文件 `index.ts`。

或者在按钮或页面组件中使用这个权限来控制是否展示：

```html
<template>
  <!-- HasPermission 组件不需要导入，直接使用即可 -->
  <HasPermission :permissions="['plugin:my-plugin:person:view']">
    <UserFilterDropdown
      v-model="selectedUser"
      label="用户"
    />
  </HasPermission>
</template>
```

### Verbs 详解 {#verbs}

`verbs` 字段用于指定用户或服务在特定资源上能执行的操作类型。这些操作被定义为一组“动词”，每个动词与相应的 HTTP 请求方法相对应。为了更好地理解如何确定合适的 `verbs`，以下是详细的解释和每种动词的具体用途：

动词和对应的 HTTP 方法:

- create: 对应 HTTP 的 POST 方法。用于创建一个新的资源实例，如果是创建子资源且不需要资源名称可以使用 `-` 表示缺省，如 `POST /apis/my-plugin.halo.run/v1alpha1/persons/-/subresource`，同时需要注意 `POST /apis/my-plugin.halo.run/v1alpha1/persons/{some-name}` 不是一个符合规范的 create 操作，创建资源不应该包含资源名称。
- get: 对应 HTTP 的 GET 方法。用于获取单个资源的详细信息，即 API 中包含 resourceName 部分如 `GET /apis/my-plugin.halo.run/v1alpha1/persons/zhangsan`。
- list: 同样对应 HTTP 的 GET 方法，但用于获取资源的集合（列表），这通常涵盖了多个资源实例的摘要或详细信息，如 `GET /apis/my-plugin.halo.run/v1alpha1/persons`。
- watch: 也是对应 HTTP 的 GET 方法。用于实时监控资源或资源集合的变化，通常是通过 WebSocket 连接来实现的，如 `ws://localhost:8090/apis/my-plugin.halo.run/v1alpha1/persons`。
- update: 对应 HTTP 的 PUT 方法。用于更新现有资源的全部内容。
- patch: 对应 HTTP 的 PATCH 方法。用于对现有资源进行部分更新。
- delete: 对应 HTTP 的 DELETE 方法。用于删除单个资源, 即 API 中包含 resourceName 部分如 `DELETE /apis/my-plugin.halo.run/v1alpha1/persons/zhangsan`。
- deletecollection: 同样对应 HTTP 的 DELETE 方法，但用于删除一个资源集合。

可以使用如下表格来简化理解：

| Verb               | HTTP Method(s) | Description              |
|--------------------|----------------|--------------------------|
| `create`           | POST           | 创建新资源实例           |
| `get`              | GET            | 获取单个资源详细信息     |
| `list`             | GET            | 获取资源列表             |
| `watch`            | GET            | 监控资源或资源集合的变化 |
| `update`           | PUT            | 更新现有资源             |
| `patch`            | PATCH          | 部分更新资源             |
| `delete`           | DELETE         | 删除单个资源             |
| `deletecollection` | DELETE         | 删除资源集合             |

## 默认角色

在 Halo 中，每个访问者都至少有一个角色，包括未登录的用户（被称为匿名用户）它们会拥有角色为 `anonymous` 的角色，而已登录的用户则会至少拥有一个角色名为 `authenticated` 的角色，
但这两个角色不会显示在角色列表中。

`anonymous` 角色的定义参考 [anonymous 角色](https://github.com/halo-dev/halo/blob/main/application/src/main/resources/extensions/role-template-anonymous.yaml)。

`authenticated` 角色的定义参考 [authenticated 角色](https://github.com/halo-dev/halo/blob/main/application/src/main/resources/extensions/role-template-authenticated.yaml)。

进入角色列表页面，你会看到一些内置角色，用于方便你快速的分配权限给用户，并可以基于这些角色来创建新的角色：

- 超级管理员：拥有所有权限，不可删除，不可编辑。
- 访客：拥有默认的 `anonymous` 和 `authenticated` 角色的权限。
- 投稿者：拥有“允许投稿”的权限。
- 作者：拥有“允许管理自己的文章”和”允许发布自己的文章“的权限。
- 文章管理员：拥有“允许管理所有文章”的权限。

## 角色绑定

角色绑定用于将角色中定义的权限授予一个或一组用户。它包含主体列表（用户）以及对所授予角色的引用。

角色绑定示例：

```yaml
apiVersion: v1alpha1
# 这个角色绑定允许 "guqing" 用户拥有 "post-reader" 角色的权限
# 你需要在 Halo 中已经定义了一个名为 "post-reader" 的角色。
kind: RoleBinding
metadata:
  name: guqing-post-reader-binding
roleRef:
  # "roleRef" 指定了绑定到的角色
  apiGroup: ''
  # 这里必须是 Role
  kind: Role
  # 这里的 name 必须匹配到一个已经定义的角色
  name: post-reader
subjects:
- apiGroup: ''
  kind: User
  # 这里的 name 是用户的 username
  name: guqing
```

在 Halo 中，当你给一个用户分配角色后，实际上就是创建了一个 ”RoleBinding” 对象来完成的。

## 聚合角色

你可以聚合角色来将多个角色的权限聚合到一个已有的角色中，这样你就不需要再为每个用户分配多个角色了。

聚合角色是通过在你定义的角色模板中添加 `"rbac.authorization.halo.run/aggregate-to-` 开头的 label 来实现的，例如

```yaml
apiVersion: v1alpha1
kind: "Role"
metadata:
  name: role-template-view-categories
  labels:
    halo.run/role-template: "true"
    rbac.authorization.halo.run/aggregate-to-editor: "true"
  annotations:
    rbac.authorization.halo.run/ui-permissions: |
      [ "system:categories:view", "uc:categories:view" ]
rules:
  - apiGroups: [ "content.halo.run" ]
    resources: [ "categories" ]
    verbs: [ "get", "list" ]
```

`rbac.authorization.halo.run/aggregate-to-editor` 表示将 `role-template-view-categories` 角色聚合到 `editor` 角色中，这样所有拥有 `editor` 角色的用户都会拥有 `role-template-view-categories` 角色的权限。

如果你想将你写的资源型 APIs 公开给所有用户访问，这时你可以通过聚合角色来将你的资源型 APIs 的角色聚合到 `anonymous` 角色中，这样所有用户都可以访问你的资源型 APIs 了。

```yaml
apiVersion: v1alpha1
kind: Role
metadata:
  name: my-plugin-role-view-persons
  labels:
    halo.run/role-template: "true"
    rbac.authorization.halo.run/aggregate-to-anonymous: "true"
  annotations:
    rbac.authorization.halo.run/module: "Persons Management"
    rbac.authorization.halo.run/display-name: "Person Manage"
    rbac.authorization.halo.run/ui-permissions: |
      ["plugin:my-plugin:person:view"]
rules:
  - apiGroups: ["my-plugin.halo.run"]
    resources: ["my-plugin/persons"]
    verbs: ["*"]
```

`rbac.authorization.halo.run/aggregate-to-anonymous` 的写法就表示将 `my-plugin-role-view-persons` 角色聚合到 `anonymous` 角色中。
