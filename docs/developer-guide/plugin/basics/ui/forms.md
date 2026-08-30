---
title: 插件设置与表单组件
description: 使用 Setting YAML 定义 Halo 插件设置，并在 Console 和用户中心 UI 中复用 FormKit、SearchInput、VEntity 等宿主能力
---

Halo 已经在 Console 和用户中心注册了 FormKit，并通过 `@halo-dev/components` 提供页面、列表、弹窗和反馈组件。插件应复用宿主能力，使交互、校验、权限和视觉样式与 Halo 保持一致。

Setting Schema 的字段、默认值、敏感数据边界以及 Halo 扩展输入组件统一参考[表单定义与组件速查](../../../form-schema.md)。本页只说明如何在插件中关联设置，以及何时使用 Setting 或自定义 Vue 表单。

## 先选择正确的表单入口

| 场景 | 推荐方式 |
| --- | --- |
| 插件详情中的普通设置 | 在 Setting YAML 中定义 FormKit Schema，由 Halo 自动渲染 |
| 创建、编辑资源的页面或弹窗 | 在 Vue SFC 中使用 `<FormKit type="form">` 和 FormKit 输入组件 |
| 搜索、筛选、列表和分页 | 使用 `SearchInput`、`FilterDropdown`、`VEntity`、`VPagination` 等宿主组件 |
| 单个列表选择、文件控件等轻量交互 | 邻近 Halo 页面采用原生控件时可以保持一致 |

插件通过 `plugin.yaml` 的 `spec.settingName` 和 `spec.configMapName` 关联 Setting 后，Halo 会在插件详情页自动渲染设置表单。插件 UI 不需要再注册普通设置路由，也不需要自行读取或更新 ConfigMap。只有 Setting Schema 无法表达的独立业务流程，才应创建自定义设置页面。

## 定义插件设置

在 `src/main/resources/plugin.yaml` 中声明 Setting 名称和用于保存配置的 ConfigMap 名称：

```yaml title="src/main/resources/plugin.yaml"
apiVersion: plugin.halo.run/v1alpha1
kind: Plugin
metadata:
  name: project-sync
spec:
  displayName: 项目同步
  settingName: project-sync-settings
  configMapName: project-sync-config
```

然后在 `src/main/resources/extensions/settings.yaml` 中提供对应的 Setting 资源：

```yaml title="src/main/resources/extensions/settings.yaml"
apiVersion: v1alpha1
kind: Setting
metadata:
  name: project-sync-settings
spec:
  forms:
    - group: sync
      label: 同步设置
      formSchema:
        - $formkit: switch
          name: enabled
          label: 启用自动同步
          value: false
        - $formkit: number
          name: interval
          label: 同步间隔（分钟）
          value: 30
          validation: required|min:5
```

`spec.settingName` 必须与 Setting 的 `metadata.name` 一致。`spec.configMapName` 应使用插件专属的稳定名称，并在后续版本中保持不变。插件安装或启动后，Halo 会加载 Setting，在插件详情页渲染表单，并将每个 `group` 的值保存到对应 ConfigMap。

服务端应通过 [`ReactiveSettingFetcher`](../../api-reference/server/setting-fetcher.md) 读取配置，不要直接操作配置 ConfigMap。密码、Token、API Key 等敏感信息必须使用 [`secret`](../../../form-schema.md#secret) 组件和 Halo Secret，不能直接保存在 Setting 中。

## 在 Vue 页面中使用 FormKit

FormKit 由 Halo 全局注册，插件不需要再次安装、初始化或自定义一套基础输入样式。页面和弹窗表单使用 Vue 3、`<script setup lang="ts">` 和 FormKit 的提交、校验机制：

```vue
<script setup lang="ts">
interface ProjectFormData {
  title: string;
  description?: string;
  homepage?: string;
}

async function handleSubmit(data: ProjectFormData) {
  // 使用当前插件的 API Client 保存数据
}
</script>

<template>
  <FormKit id="project-form" type="form" @submit="handleSubmit">
    <FormKit name="title" label="项目名称" type="text" validation="required" />
    <FormKit name="description" label="描述" type="textarea" />
    <FormKit name="homepage" label="项目主页" type="url" validation="url" />
  </FormKit>
</template>
```

表单数据只在确实与 API 模型不同的情况下定义单独类型。插件 API 的资源模型、列表结果和请求参数应使用[生成的 API Client](../devtools.md#how-to-generate-api-client)，不要再手写一份同名类型。

Halo 还提供附件、文章、单页面、分类、标签、菜单、图标和 Secret 等 FormKit 输入组件。可用类型及引入版本参考[表单定义与组件速查](../../../form-schema.md)。需要注册插件自定义输入时，再参考 [FormKit 扩展](../../api-reference/ui/formkit.md)。

## 复用页面和列表组件

插件 UI 应先在目标版本的 Halo Core 或当前官方插件中查找相同页面类型，再选择组件：

- 普通管理页使用 `VPageHeader` 和 `VCard`。
- 资源列表使用 `VEntityContainer`、`VEntity`、`VEntityField`、`VEmpty` 和 `VLoading`。
- 关键词搜索使用 [`SearchInput`](../../api-reference/ui/components/search-input.md)。
- 确认和删除操作使用 `Dialog`，操作结果使用 `Toast`。
- 创建和编辑弹窗使用 `VModal` 与 FormKit。

组件需要从 `@halo-dev/components` 导入时，应使用包的公开导出，不要复制 Halo 内部组件源码或重新实现按钮、输入框、弹窗、提示和颜色体系。

## 权限和验证

- 路由、菜单和按钮的权限应与后端 API 和 RoleTemplate 保持一致，UI 隐藏不能代替后端鉴权。
- 使用 FormKit 的 `required`、`url`、`min`、`max` 等规则提供即时校验，服务端仍必须验证所有不可信输入。
- 保存期间禁用重复提交，并使用宿主的 loading、Toast 和错误处理模式。
- 变更完成后检查桌面端和窄屏布局，以及 loading、空数据、错误和无权限状态。
