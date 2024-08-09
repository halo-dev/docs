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

## 更新配置

与 `theme.yaml` 一样，`settings.yaml` 也是持久化存储在数据库中的，不会在修改之后主动更新。同样在主题详情页面点击 `重载主题配置` 即可。

![重载主题配置](/img/theme/reload-theme-config.png)

## 从 1.x 迁移

为了方便主题开发者从 1.x 迁移，我们提供了工具用于迁移设置表单配置文件。

工具仓库地址：[https://github.com/halo-sigs/convert-theme-config-to-next](https://github.com/halo-sigs/convert-theme-config-to-next)

```bash
# 1.x 版本主题
cd path/to/theme

npx @halo-dev/convert-theme-config-to-next settings
```

执行完成之后即可看到主题目录下生成了 `settings.2.0.yaml` 文件，重命名为 `settings.yaml` 即可。

:::tip
转换完成之后需要修改 `metadata.name` 字段。
:::
