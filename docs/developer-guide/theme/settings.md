---
title: 设置选项
description: 介绍主题如何定义以及使用设置选项。
---

此文档将讲解如何在主题中定义和使用设置项，如 [表单定义](../form-schema) 中所说，目前 Halo 的 Console 端的所有表单都使用了 [FormKit](https://github.com/formkit/formkit) 的方案。

:::tip
有关 FormKit 定义表单的更多信息，请参考 [表单定义](../form-schema)，此文档仅针对主题中的设置项进行讲解。
:::

## 定义表单

在主题中要使用设置项非常简单，只需要在主题根目录提供 `settings.yaml`，然后在 `theme.yaml` 中配置 `spec.settingName` 和 `spec.configMapName` 即可，在安装或者初始化主题的时候会自动识别并在 Console 端的主题设置中生成表单。

### 示例

```yaml title="theme-foo/theme.yaml" {14,15}
apiVersion: theme.halo.run/v1alpha1
kind: Theme
metadata:
  name: theme-foo
spec:
  displayName: 示例主题
  author:
    name: halo-dev
    website: https://halo.run
  description: 一个示例主题
  logo: https://halo.run/logo
  website: https://github.com/halo-sigs/theme-foo
  repo: https://github.com/halo-sigs/theme-foo.git
  settingName: "theme-foo-setting"
  configMapName: "theme-foo-configMap"
  version: 1.0.0
  require: 2.0.0
```

:::tip
`settingName` 和 `configMapName` 必须同时配置，且可以自定义名称，但是 `settingName` 必须和 Setting 的 `metadata.name` 一致。
:::

```yaml title="theme-foo/settings.yaml" {4}
apiVersion: v1alpha1
kind: Setting
metadata:
  name: theme-foo-setting
spec:
  forms:
    - group: style
      label: 样式
      formSchema:
        - $formkit: radio
          name: color_scheme
          label: 默认配色
          value: system
          options:
            - label: 跟随系统
              value: system
            - label: 深色
              value: dark
            - label: 浅色
              value: light
        - $formkit: color
          name: background_color
          label: 背景颜色
          value: "#f2f2f2"
    - group: layout
      label: 布局
      formSchema:
        - $formkit: radio
          name: nav
          label: 导航栏布局
          value: "single"
          options: 
            - label: 单栏
              value: "single"
            - label: 双栏
              value: "double"
```

:::tip
Setting 资源的 `metadata.name` 必须和 `theme.yaml` 中的 `spec.settingName` 一致。
:::

### 在主题模板中使用

在主题模板中，需要以 `theme.config.[group].[name]` 的形式进行调用。

其中：

1. `group`: 即 `spec.forms[].group`，如上面示例中的 `style` 和 `layout`。
2. `name`: 即 `spec.forms[].formSchema[].name`，如上面示例中的 `color_scheme` 和 `nav`。

示例：

```html
<body th:class="${theme.config.style.color_scheme}">
    <!-- do something -->
</body>
```

```html
<ul th:if="${theme.config.layout.nav == 'single'}">
    <!-- do something -->
</ul>

<div th:if="${theme.config.layout.nav == 'double'}">
    <!-- do something -->
</div>
```