---
title: 主题附带资源
description: 在 Halo 主题根目录提供 AnnotationSetting、NotificationTemplate、Setting 和 ConfigMap，并了解加载白名单与清理边界
---

主题可以在根目录中提供 `.yaml` 或 `.yml` 资源，例如使用 `AnnotationSetting` 为文章、分类或菜单项增加主题专属字段。

本文描述 Halo 2.26.0 的资源加载契约。主题 API 随版本演进时，应同时核对[主题 API 变更](./api-changelog.md)和目标 Halo 源码。

## 提供资源

除 `theme.yaml` 外，Halo 会扫描主题根目录中的 YAML 文件。文件名没有固定要求，同一文件也可以使用 `---` 声明多个资源：

```yaml title="annotation-setting.yaml"
apiVersion: v1alpha1
kind: AnnotationSetting
metadata:
  name: theme-foo-post-style
spec:
  targetRef:
    group: content.halo.run
    kind: Post
  formSchema:
    - $formkit: select
      name: layout
      label: 页面布局
      options:
        - label: 默认
          value: default
        - label: 宽屏
          value: wide
```

在模板中读取字段的方法参考[模型元数据](./annotations.md)。

## 允许的资源

Halo 只会加载以下资源：

- `AnnotationSetting`
- `NotificationTemplate`
- `metadata.name` 与 `spec.settingName` 匹配的 `Setting`
- `metadata.name` 与 `spec.configMapName` 匹配的 `ConfigMap`

其他 Kind 会被忽略。主题不能借此安装任意自定义模型或权限资源；需要这些能力时应使用插件。

## 加载和更新

安装或重载主题时，Halo 会创建不存在的允许资源，并以主题包中的声明更新同名资源，同时添加 `theme.halo.run/theme-name` 标签标记资源所属主题。

因此，不要在附带资源中保存用户会直接修改且需要长期保留的数据；下次重载主题可能覆盖这些修改。主题设置值应存放在 `spec.configMapName` 对应的 ConfigMap 中。

## 卸载边界

卸载主题时，Halo 会清理主题文件、`spec.settingName` 对应的 Setting，以及带主题标签的 AnnotationSetting。不要假设其他附带资源一定会随主题卸载而删除；NotificationTemplate 等共享名称资源应使用主题专属名称，并在发布说明中写明升级和卸载影响。

发布前至少验证安装、重载、升级和卸载四个场景，并确认没有覆盖其他主题或插件的同名资源。

## 源码参考

- [ThemeUtils 资源扫描](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/application/src/main/java/run/halo/app/theme/service/ThemeUtils.java)
- [ThemeReconciler 白名单与生命周期](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/application/src/main/java/run/halo/app/core/reconciler/ThemeReconciler.java)
