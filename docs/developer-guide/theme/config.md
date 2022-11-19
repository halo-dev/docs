---
title: 配置文件
---

目前 Halo 2.0 的主题必须在根目录包含 `theme.yaml`，用于配置主题的基本信息，如主题名称、版本、作者等。

## 格式示例

```yaml title="theme.yaml"
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
  customTemplates:
    post:
      - name: 文档
        description: 文档类型的文章
        screenshot: 
        file: post_documentation.html
    category:
      - name: 知识库
        description: 知识库类型的分类
        screenshot: 
        file: category_knowledge.html
    page:
      - name: 关于
        description: 关于页面
        screenshot:
        file: page_about.html
  version: 1.0.0
  require: 2.0.0
```

## 字段详解

| 字段                            | 描述                                                                          | 是否必填 |
| ------------------------------- | ----------------------------------------------------------------------------- | -------- |
| `metadata.name`                 | 主题的唯一标识                                                                | 是       |
| `spec.displayName`              | 显示名称                                                                      | 是       |
| `spec.author.name`              | 作者名称                                                                      | 否       |
| `spec.author.website`           | 作者网站                                                                      | 否       |
| `spec.description`              | 主题描述                                                                      | 否       |
| `spec.logo`                     | 主题 Logo                                                                     | 否       |
| `spec.website`                  | 主题网站                                                                      | 否       |
| `spec.repo`                     | 主题托管地址                                                                  | 否       |
| `spec.settingName`              | 设置表单定义的名称，需要同时创建对应的 `settings.yaml` 文件                   | 否       |
| `spec.configMapName`            | 设置持久化配置的 ConfigMap 名称                                               | 否       |
| `spec.customTemplates.post`     | 文章的自定义模板配置，详细文档可查阅 [模板路由](./template-route-mapping#custom-templates)     | 否       |
| `spec.customTemplates.category` | 分类的自定义模板配置，详细文档可查阅 [模板路由](./template-route-mapping#custom-templates)     | 否       |
| `spec.customTemplates.page`     | 独立页面的自定义模板配置，详细文档可查阅 [模板路由](./template-route-mapping#custom-templates) | 否       |
| `spec.version`                  | 主题版本                                                                      | 是       |
| `spec.require`                  | 所需 Halo 的运行版本                                                          | 是       |
