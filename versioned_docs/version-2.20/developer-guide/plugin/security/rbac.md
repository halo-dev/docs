---
title: 基于角色的权限控制
description: 了解 Halo 的基于角色的权限控制机制。
---

基于角色的权限控制（Role-Based Access Control，RBAC）是一种广泛应用的访问控制机制，旨在通过定义用户的角色来简化和增强权限管理。
在 Halo 中，RBAC 通过限制对系统资源的访问来确保系统的安全性和可管理性。

## RBAC 的基本概念

RBAC 通过三个核心概念来管理权限：

1. **角色（Role）** ：角色定义了一组操作权限，这些操作可以包括对某些资源的“读”、“写”或“执行”等权限。在 Halo 中，角色可以绑定到用户，从而赋予它们相应的权限，同时角色可以依赖于其他角色，从而实现权限的继承以简化权限管理。

2. **用户（User）** ：用户是实际使用 Halo 资源的实体。

3. **角色绑定（RoleBinding）** ：角色绑定是将用户与特定的角色关联起来。通过角色绑定，某个用户可以获得与角色相关的权限。

通过上述三者的结合，RBAC 可以灵活地控制用户对 Halo 资源的访问权限。

## 什么是基于角色的权限控制

RBAC 的核心思想是将权限分配给角色，而不是直接分配给用户。用户通过被分配一个或多个角色来获得相应的权限。每个角色都定义了可以执行的操作，如读取、写入、删除等操作。这种设计具有以下几个优点：

1. 简化权限管理：管理员可以通过管理少数角色来控制大量用户的权限，而不需要为每个用户单独配置权限。
2. 权限最小化：用户只会被赋予完成工作所需的最低权限，减少了安全风险。
3. 易于扩展：新增用户或变更权限只需要调整角色，无需修改大量的用户配置。

## Role 和 RoleBinding

在 Halo 中，Role 是通过自定义模型来定义的。一个典型的 Role 的 YAML 配置如下：

```yaml
apiVersion: v1alpha1
kind: Role
metadata:
  name: example-role
rules:
  - apiGroups: [""]
    resources: ["menus"]
    verbs: ["get", "list"]
```

上面的例子定义了一个名为 example-role 的角色。该角色允许用户对菜单资源执行 get 和 list 操作。

- `apiGroups` 定义了资源所属的 API 组，`""` 表示核心 API 组。
- `resources` 是指定角色可以操作的资源类型。
- `verbs` 表示可以执行的操作，比如 get、create、delete 等。

## RoleBinding 与角色的关联

定义好角色后，我们需要通过 `RoleBinding` 将其与某个用户关联，`RoleBinding` 绑定了 `Role` 并指定了哪些用户可以获得该角色的权限。
在 Halo 为用户分配角色也是通过 `RoleBinding` 来实现的。一个典型的 RoleBinding 的 YAML 配置如下：

```yaml
apiVersion: v1alpha1
kind: RoleBinding
metadata:
  name: fake-user-binding
subjects:
  # 绑定的用户，这是一个数组，可以绑定多个用户
  - kind: User
    name: fake-user
    apiGroup: ""
roleRef:
  kind: Role
  name: example-role
  apiGroup: ""
```

## 角色模板

虽然角色已经定义了一组操作权限，但是粒度太细的角色会导致权限管理复杂，如文章管理的角色可能需要包含了文章、分类、标签、用户等多个资源的操作权限才能提供完整的功能，而这些操作权限可能会被多个角色共享。
为了简化权限管理，Halo 提供了角色模板的功能，角色模板是一组操作权限的集合，可以被多个角色共享。同时，角色模板也可以继承其他角色模板，从而实现权限的继承。

### 创建角色模板

角色模板是通过一个特殊的 label 来标识 Role 对象实现的，一个典型的角色模板的 YAML 配置如下：

```yaml
apiVersion: v1alpha1
kind: Role
metadata:
  name: example-role
  labels:
    # 通过 halo.run/role-template: "true" 标识为角色模板
    halo.run/role-template: "true"
rules:
  - apiGroups: [""]
    resources: ["menus"]
    verbs: ["get", "list"]
```

Halo 在用户界面只会显示非模板角色，这样可以避免用户误操作角色模板，同时也可以简化用户对角色的管理。
用户创建角色时通过选择`角色模板`来创建角色，角色模板在用户界面以`权限`的概念展示，比如`文章管理`、`用户管理`等。

## 继承角色/角色模板

可以在角色的 `annotations` 中添加 `rbac.authorization.halo.run/dependencies` 来声明角色间的依赖关系，例如菜单管理必须要依赖菜单查看，以避免分配了管理权限却没有查看权限的情况。
当角色依赖于其他角色时，Halo 会自动将依赖的角色的权限合并到当前角色中以实现权限的继承。

```yaml
apiVersion: v1alpha1
kind: Role
metadata:
  name: example-role
  labels:
    halo.run/role-template: "true"
  annotations:
    rbac.authorization.halo.run/dependencies: |
      [ "view-menu" ]
rules:
  - apiGroups: [""]
    resources: ["menus"]
    verbs: [ "create", "update", "delete" ]
---
apiVersion: v1alpha1
kind: Role
metadata:
  name: view-menu
  labels:
    halo.run/role-template: "true"
rules:
  - apiGroups: [""]
    resources: ["menus"]
    verbs: ["get", "list"]
```

## 聚合角色

角色定义依赖关系适合于定义角色模板时复用 `rules` 或者用户创建角色时绑定其他角色，但是如果想要将一个角色的权限合并到另一个已有的角色中（如 Halo 提供的），这种情况下角色依赖关系就无法满足需求了。
例如，当插件开发者想要将自己插件的角色权限合合并到 Halo 的角色中时，无法修改 Halo 的角色定义，这时可以通过聚合角色来实现。

聚合角色通过 `rbac.authorization.halo.run/aggregate-to-{role-name}` 的 `annotations` 来声明，其中的 `{role-name}` 占位符表示要聚合到的角色名。

例如插件开发者想要将插件的某些 API 资源公开给所有人访问即不需要授权，可以通过将角色聚合到 `anonymous` 角色来实现。

```yaml
apiVersion: v1alpha1
kind: Role
metadata:
  name: template-moment-anonymous-resrouces
  labels:
    halo.run/role-template: "true"
  annotations:
    rbac.authorization.halo.run/aggregate-to-anonymous: "true"
rules:
  - apiGroups: ["api.moment.halo.run"]
    resources: ["moments"]
    verbs: ["get", "list"]
```

上述配置将 `template-moment-anonymous-resrouces` 角色聚合到 `anonymous` 角色中，用户无需登录即可访问 `api.moment.halo.run` 下的 `moments` 资源。

`rbac.authorization.halo.run/aggregate-to-editor` 表示将 `role-template-view-categories` 角色聚合到 `editor` 角色中，这样所有拥有 `editor` 角色的用户都会拥有 `role-template-view-categories` 角色的权限。

在 Halo 中，`anonymous` 角色是一个特殊的角色，表示未登录的匿名访客。

## 隐藏角色模板

Halo 提供了隐藏角色模板的功能，隐藏的角色模板不会在用户界面的权限列表中显示，对于聚合角色来说，隐藏角色模板是非常有用的，它可以避免用户在权限列表中看到不应该看到的角色模板。

隐藏角色模板通过 `halo.run/hidden: "true"` 的 `labels` 来标识，**它必须是一个角色模板**。

```yaml
apiVersion: v1alpha1
kind: Role
metadata:
  name: template-moment-anonymous-resrouces
  labels:
    # 声明为角色模板
    halo.run/role-template: "true"
    # 声明为隐藏
    halo.run/hidden: "true"
  annotations:
    # 聚合到 anonymous 角色
    rbac.authorization.halo.run/aggregate-to-anonymous: "true"
rules:
  - apiGroups: ["api.moment.halo.run"]
    resources: ["moments"]
    verbs: ["get", "list"]
```

## Halo 中的特殊角色

### anonymous 角色

在 Halo 中，任何访问者都会被赋予一个特殊的角色，这个角色是 `anonymous`，表示未登录的匿名访客。`anonymous` 角色是一个特殊的角色，它不需要绑定到用户，用户无需登录即可获得 `anonymous` 角色的权限。

`anonymous` 角色的定义参考 [anonymous 角色](https://github.com/halo-dev/halo/blob/main/application/src/main/resources/extensions/role-template-anonymous.yaml)。

### authenticated 角色

`authenticated` 角色表示已登录的用户，用户登录后会被赋予 `authenticated` 角色。`authenticated` 角色的权限是 Halo 中所有用户的最小权限，即所有登录用户都会获得 `authenticated` 角色的权限。

如果开发插件时但凡登录用户都需要具备的权限集合，可以通过将角色聚合到 `authenticated` 角色来实现。这样便不需要为每个用户单独配置权限，只需要将角色聚合到 `authenticated` 角色即可。

`authenticated` 角色的定义参考 [authenticated 角色](https://github.com/halo-dev/halo/blob/main/application/src/main/resources/extensions/role-template-authenticated.yaml)。

## Halo 中的内置角色

Halo 中内置了一些角色，管理员可以在创建用户时直接分配这些角色。内置角色的权限是固定的，不可修改。

### 超级管理员

超级管理员的角色名为 `super-role`，它包含了 Halo 中所有资源的所有权限。超级管理员可以访问 Halo 中的所有资源，包括系统资源和插件资源。

```yaml
apiVersion: v1alpha1
kind: Role
metadata:
  name: super-role
  labels:
    rbac.authorization.halo.run/system-reserved: "true"
  annotations:
    rbac.authorization.halo.run/display-name: "超级管理员"
    rbac.authorization.halo.run/ui-permissions: |
      ["*"]
rules:
  - apiGroups: ["*"]
    resources: ["*"]
    nonResourceURLs: ["*"]
    verbs: ["*"]
```

### 访客角色

访客角色的角色名为 `guest`，它没有任何权限，当用户被分配了访客角色时，用户只具有 `anonymous` 和 `authenticated` 角色的权限，由于 `anonymous` 和 `authenticated` 角色是不可分配的，因此访客角色用来表示用户的这种状态。

```yaml
apiVersion: v1alpha1
kind: Role
metadata:
  name: guest
  labels:
    rbac.authorization.halo.run/system-reserved: "true"
  annotations:
    rbac.authorization.halo.run/display-name: "访客"
    rbac.authorization.halo.run/disallow-access-console: "true"
rules: []
```

### 文章内置角色

文章是 Halo 的核心功能之一，因此 Halo 内置了一些文章相关的角色，以便个人中心功能的正常运行。

- 文章作者：文章作者允许用户管理自己的文章，包括投稿、创建、修改、发布、删除等操作。
- 投稿者：投稿者允许用户投稿文章，但是不能直接发布文章，需要管理员审核后才能发布。
- 文章管理员：文章管理员允许用户管理所有文章，包括修改、发布、删除等文章关联的所有操作。

## 参考

关于角色模板的配置详解请参考[API 权限控制](./role-template.md)。
