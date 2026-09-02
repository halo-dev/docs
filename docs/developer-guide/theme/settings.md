---
title: 设置选项
description: 通过 settings.yaml 和 FormKit 表单定义 Halo 主题设置项，关联 Setting 与 ConfigMap，并在 Thymeleaf 模板中读取配置和重载更新
---

本文讲解如何在主题中关联、读取和更新设置项。Setting Schema 的字段、默认值和输入组件统一参考 [表单定义与组件速查](../form-schema)，本页只说明主题特有的配置边界和使用方式。

## 区分系统设置与主题设置

主题设置只应描述主题自身的外观、布局和组件行为。Halo 已经提供的站点级能力应继续使用系统设置，避免同一项配置出现多个入口或产生冲突。

| 能力                                      | 配置位置                   | 主题中的用法                                                           |
| ----------------------------------------- | -------------------------- | ---------------------------------------------------------------------- |
| 站点 Logo、favicon                        | Console 系统设置           | `site.logo`、`site.favicon`                                            |
| 站点标题、描述、关键词和搜索引擎策略      | Console 系统设置           | 使用 `site` 变量，并遵循[搜索引擎优化](./seo.md)中的自动注入规则       |
| 全局 `<head>`、内容页 `<head>` 和页脚代码 | Console 系统设置的代码注入 | Halo 自动处理 head 注入；公共布局在 `</body>` 前提供 `<halo:footer />` |
| 配色、布局、卡片样式和主题组件开关        | 主题设置                   | `theme.config.[group].[name]`                                          |
| 仅该主题需要的品牌变体                    | 可选主题设置               | 明确标为覆盖项，并回退到对应的 `site` 值                               |

`theme.yaml` 中的 `spec.logo` 是 Console 中用于展示主题自身的图标，不是站点前台 Logo。前台默认应使用 `site.logo`：

```html
<img
  th:if="${not #strings.isEmpty(site.logo)}"
  th:src="${site.logo}"
  th:alt="${site.title}"
/>
```

如果主题确实需要深色专用 Logo，可以只提供可选覆盖项，并回退到系统 Logo：

```html
<img
  th:src="${theme.config.brand?.dark_logo ?: site.logo}"
  th:alt="${site.title}"
/>
```

不要在主题设置中再次提供通用的 head、body 或页脚代码注入。主题自己的 CSS、布局模式等仍可以作为主题设置，但不应取代系统级站点配置。

## 定义表单

在主题中使用设置项时，需要在主题根目录提供包含 Setting 的 YAML 文件，并在 `theme.yaml` 中配置 `spec.settingName` 和 `spec.configMapName`。安装或重载主题时，Halo 会识别对应 Setting，并在 Console 的主题设置中生成表单。

### 示例

```yaml title="theme-foo/theme.yaml" {14,15}
apiVersion: theme.halo.run/v1alpha1
kind: Theme
metadata:
  name: theme-foo
spec:
  displayName: 示例主题
  author:
    name: Halo
    website: https://www.halo.run
  description: 一个示例主题
  logo: https://www.halo.run/logo
  homepage: https://github.com/halo-sigs/theme-foo
  repo: https://github.com/halo-sigs/theme-foo.git
  issues: https://github.com/halo-sigs/theme-foo/issues
  settingName: "theme-foo-setting"
  configMapName: "theme-foo-configMap"
  version: 1.0.0
  requires: 2.0.0
  license:
    - name: "GPL-3.0"
      url: "https://github.com/halo-sigs/theme-foo/blob/main/LICENSE"
```

:::tip 保持配置名称一致
`settingName` 必须和 Setting 的 `metadata.name` 一致。`configMapName` 应使用主题专属的稳定名称，并在后续版本中保持不变。

`settingName` 指向设置表单定义，`configMapName` 指向设置数据的存储位置。Halo 在缺少 `configMapName` 时会自动生成名称并回写当前 Theme，但重新安装主题时会生成新的名称，之前 ConfigMap 中的设置值不会自动与新 Theme 关联。因此，发布主题时应显式配置 `configMapName`，不要依赖自动生成。
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

:::tip 保持 Setting 名称一致
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

:::tip 修改转换后的资源名称
转换完成之后需要修改 `metadata.name` 字段。
:::
