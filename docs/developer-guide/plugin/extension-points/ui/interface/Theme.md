```ts
export interface Theme {
  apiVersion: "theme.halo.run/v1alpha1"
  kind: "Theme"
  metadata: {
    annotations: {}
    creationTimestamp: string
    labels: {}
    name: string                                // 主题的唯一标识
    version: number
  }
  spec: {
    author: {                                   // 主题作者信息
      name: string
      website: string
    }
    configMapName: string                       // 关联的 ConfigMap 模型，用于存储配置
    customTemplates: {                          // 自定义模板信息
      category: Array<{
        description: string
        file: string
        name: string
        screenshot: string
      }>
      page: Array<{
        description: string
        file: string
        name: string
        screenshot: string
      }>
      post: Array<{
        description: string
        file: string
        name: string
        screenshot: string
      }>
    }
    description: string                         // 主题描述
    displayName: string                         // 主题名称
    homepage: string                            // 主题主页
    license: Array<{                            // 主题许可证信息
      name: string
      url: string
    }>
    logo: string                                // 主题 Logo
    repo: string                                // 主题仓库地址
    requires: string                            // 所依赖的 Halo 版本
    settingName: string                         // 关联的 Setting 模型，用于渲染配置表单
    version: string                             // 主题版本
  }
  status: {
    conditions: Array<{
      lastTransitionTime: string
      message: string
      reason: string
      status: string
      type: string
    }>
    location: string
    phase: string
  }
}
```
