---
title: API 权限控制
description: 了解如果对插件中的 API 定义角色模板以接入权限控制
---

插件中的 APIs 无论是自定义模型自动生成的 APIs 或者是通过 `@Controller` 自定义的 APIs 都只有超级管理员能够访问，如果想将这些 APIs 授权给其他用户访问，
则需要定义一些[角色模板](../../basics/framework.md#rbac)的资源以便可以在用户界面上将其分配给其他角色使用。

定义角色模板就是在插件的 `src/main/resources/extensions` 目录下声明角色的自定义模型资源并标记为模板的过程，文件名称可以任意，它的 kind 为 Role 但需要一个 label `halo.run/role-template: "true"` 来表示它是角色模板。

Halo 的权限控制对同一种资源一般只定义两个角色模板的自定义模型对象，一个是只读权限，另一个是管理权限，因此如果没有特殊情况需要更细粒度的控制，我们建议你也保持一致：

```yaml
apiVersion: v1
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
apiVersion: v1
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
- `verbs` 表示请求动词，可选值为 "create", "delete", "deletecollection", "get", "list", "patch", "update"。对应的 HTTP 请求方式如下表所示：

  | HTTP verb | request verb                                                 |
  | --------- | ------------------------------------------------------------ |
  | POST      | create                                                       |
  | GET, HEAD | get (for individual resources), list (for collections, including full object content), watch (for watching an individual resource or collection of resources) |
  | PUT       | update                                                       |
  | PATCH     | patch                                                        |
  | DELETE    | delete (for individual resources), deletecollection (for collections) |

`metadata.labels` 中必须包含 `halo.run/role-template: "true"` 以表示它此资源要作为角色模板。

`metadata.annotations` 中：

- `rbac.authorization.halo.run/dependencies`：用于声明角色间的依赖关系，例如管理角色必须要依赖查看角色，以避免分配了管理权限却没有查看权限的情况。
- `rbac.authorization.halo.run/module`：角色模板分组名称。在此示例中，管理 Person 的模板角色将和查看 Person 的模板角色将被在 UI 层面归为一组展示。
- `rbac.authorization.halo.run/display-name`：模板角色的显示名称，用于展示为用户可读的名称信息。
- `rbac.authorization.halo.run/ui-permissions`：用于控制 UI 权限，规则为 `plugin:{your-plugin-name}:scope-name`，使用示例为在插件前端部分入口文件 `index.ts` 中用于控制菜单是否显示或者控制页面按钮是否展示：

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

以上定义角色模板的方式适合资源型请求，即需要符合以下规则

- 以 `/api/<version>/<resource>[/<resourceName>/<subresource>]` 规则组成 APIs。
- 以 `/apis/<group>/<version>/<resource>[/<resourceName>/<subresource>]` 规则组成的 APIs。

注：`[]`包裹的部分表示可选，只有 Halo 自身使用的 APIs 可以没有 group，所以插件的 APIs 都是以 `/apis` 开头的。

:::tip Note
资源型的 API 通常是对自定义模型对象的操作，例如 `/apis/my-plugin.halo.run/v1alpha1/persons`，如果你自定义 APIs 则建议路径层级不要超过 `<subresource>` 层级，否则会导致角色模板无法生效，例如 `/apis/my-plugin.halo.run/v1alpha1/persons/zhangsan/post`，如果 `post` 后面还有路径则会导致角色模板无法生效。
:::

如果你的 API 不符合以上资源型 API 的规则，则被定型为非资源型 API，例如 `/healthz`，需要使用一下配置方式：

```yaml
rules:
 # nonResourceURL 中的 '*' 是一个全局通配符
  - nonResourceURLs: ["/healthz", "/healthz/*"]
    verbs: [ "get", "create"]
```

## 默认角色

在 Halo 中，每个访问者都至少有一个角色，包括未登陆的用户（被称为匿名用户）它们会拥有角色为 `anonymous` 的角色，而已登陆的用户则会至少拥有一个角色名为 `authenticated` 的角色，
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
# 这个角色绑定允许 "guqing" 用户拥有 "post-reader" 角色的权限，你需要在 Halo 中已经定义了一个名为 "post-reader" 的角色。
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
apiVersion: v1
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
