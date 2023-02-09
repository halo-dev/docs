---
title: API 权限控制
description: 了解如果对插件中的 API 定义角色模板以接入权限控制
---

插件中的 APIs 无论是自定义模型自动生成的 APIs 或者是通过 Controller 自定义的 APIs 都只有超级管理员能够访问，如果想将这些 APIs 授权给其他用户访问则需要定义一些 RoleTemplate 的资源以便可以在用户界面上将其分配给其他角色使用。

RoleTemplate 的 yaml 资源也需要放到 `src/main/resources/extensions` 目录下，文件名称可以任意，它的 kind 为 Role 但需要一个 label `halo.run/role-template: "true"` 来表示它是角色模板。

Halo 的权限控制对同一种资源一般只定义两个 RoleTemplate，一个是只读权限，另一个是管理权限，因此如果没有特殊情况需要更细粒度的控制，我们建议你也保持一致：

```yaml
apiVersion: v1
kind: Role
metadata:
  # 使用 plugin name 作为前缀防止与其他插件冲突
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

上述便是根据 [自定义模型](./extension.md) 章节中定义的 Person 自定义模型配置角色模板的示例。

定义了一个用于管理 Person 资源的角色模板 `my-plugin-role-manage-persons`，它具有所有权限，同时定义了一个只允许查询 Person 资源的角色模板 `my-plugin-role-view-persons`。

下面让我们回顾一下这些配置：

`rules` 是个数组，它允许配置多组规则：

- `apiGroups` 对应 `GVK` 中的 `group` 所声明的值。
- `resources` 对应 API 中的 resource 部分，`my-plugin` 表示插件名称。
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

- 以 `/api/<version>/<resource>[/<resourceName>/<subresource>/<subresourceName>]` 规则组成 APIs。
- 以 `/apis/<group>/<version>/<resource>[/<resourceName>/<subresource>/<subresourceName>]` 规则组成的 APIs。

注：`[]`包裹的部分表示可选

如果你的 API 不符合以上资源型 API 的规则，则被定型为非资源型 API，例如 `/healthz`，需要使用一下配置方式：

```yaml
rules:
 # nonResourceURL 中的 '*' 是一个全局通配符
  - nonResourceURLs: ["/healthz", "/healthz/*"]
    verbs: [ "get", "create"]
```
