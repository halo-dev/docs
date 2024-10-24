---
title: UI 权限控制
description: 了解如何控制用户界面的操作权限。
---
UI（用户界面）权限控制是指在应用程序中，通过用户角色或身份的不同，控制用户界面上可见和可操作的元素。
这种权限控制的目的是根据用户的权限等级和角色，动态调整他们在应用中的操作权限，从而确保系统的安全性和功能的正确使用。

## 什么是 UI 权限控制

UI 权限控制基于后端的权限系统，将不同用户分组或分角色，并根据这些分组或角色，决定用户在界面中能够看到哪些内容、进行哪些操作。
与传统的后端权限控制相比，UI 权限控制侧重于前端展示层面的权限管理，例如隐藏按钮、禁用功能、调整界面元素等，以防止未经授权的用户误操作或访问敏感数据。

## UI 权限控制的核心概念

1. 用户角色（User Role）：UI 权限控制通常基于用户角色。例如，管理员可能拥有对系统所有模块的访问权限，而普通用户只能访问某些特定模块或功能。

2. 权限模型：权限模型规定了每个角色能够执行的操作以及能访问的资源。UI 权限控制根据这个模型，动态调整界面上展示的内容。

3. 可见性控制：UI 控制权限的一个常见方式是调整某些界面元素的可见性。例如，一个普通用户可能看不到“管理用户”或“高级设置”选项，而这些选项对管理员是可见的。

4. 操作控制：除了控制可见性外，UI 权限控制还可以控制用户能执行的操作。例如，某个表单中的提交按钮可能在用户没有相应权限时被禁用或移除。

5. 动态渲染：基于用户权限动态渲染 UI，是指前端应用在加载时会根据用户的权限信息来渲染不同的界面元素。这样确保用户只能看到和操作与其权限相符的部分。

## Halo 的 UI 权限控制

Halo 的 UI 权限控制是通过与角色模板结合来实现的，在角色模板的 `metadata.annotations` 中定义 `rbac.authorization.halo.run/ui-permissions` 来控制 UI 权限，这样可以在前端界面通过这个权限来控制菜单或者页面按钮是否展示。

值的规则为 `plugin:{your-plugin-name}:scope-name`, `scope-name` 为你自定义的权限名称，如下面的示例中的 `plugin:my-plugin:person:view`。

```yaml
apiVersion: v1alpha1
kind: Role
metadata:
  name: my-plugin-role-view-persons
  labels:
    halo.run/role-template: "true"
  annotations:
    # UI 权限控制
    rbac.authorization.halo.run/ui-permissions: |
      ["plugin:my-plugin:person:view"]
rules:
  - apiGroups: ["my-plugin.halo.run"]
    resources: ["my-plugin/persons"]
    verbs: ["*"]
```

当用户被分配了拥有 `my-plugin-role-view-persons` 权限的角色时，前端界面便会根据这个权限来控制菜单或者页面按钮是否展示。

### 菜单权限控制

你可以在 UI 层面使用这个权限来控制菜单是否展示：

```vue
export default definePlugin({
  components: {},
  routes: [
    {
      parentName: "Root",
      route: {
        path: "/example",
        name: "Example",
        component: HomeView,
        meta: {
          title: "示例页面",
          searchable: true,
          // 菜单权限控制
          permissions: ["plugin:my-plugin:person:view"],
          menu: {
            name: "示例页面",
            group: "示例分组",
            icon: markRaw(IconPlug),
            priority: 0,
          },
        },
      },
    },
  ],
  extensionPoints: {},
});
```

参考：[plugin-starter](https://github.com/halo-dev/plugin-starter/blob/5a4a25db252a7986900368a5fbf35e8d27f5257f/ui/src/index.ts#L6-L29)

> 该配置示例为在插件前端部分入口文件 `index.ts`

### 按钮或页面组件权限控制

在按钮或页面组件中使用 `HasPermission` 组件来控制组件的渲染，它不需要导入可以直接使用。

```vue
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
