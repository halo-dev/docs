```ts
export interface Plugin {
  apiVersion: "plugin.halo.run/v1alpha1"
  kind: "Plugin"
  metadata: {
    annotations: {}
    creationTimestamp: string         // 创建时间
    labels: {}
    name: string                      // 唯一标识
    version: number
  }
  spec: {
    author: {                         // 作者信息
      name: string
      website: string
    }
    configMapName: string             // 关联的 ConfigMap 模型，用于存储配置
    description: string               // 插件描述
    displayName: string               // 插件名称
    enabled: boolean
    homepage: string                  // 插件主页
    license: Array<{                  // 插件协议
      name: string
      url: string
    }>
    logo: string
    pluginDependencies: {}
    repo: string                      // 插件仓库地址
    requires: string                  // 所依赖的 Halo 版本
    settingName: string               // 关联的 Setting 模型，用于渲染配置表单
    version: string                   // 插件版本
  }
  status: {
    conditions: Array<{
      lastTransitionTime: string
      message: string
      reason: string
      status: string
      type: string
    }>
    entry: string
    lastProbeState: string
    lastStartTime: string
    loadLocation: string
    logo: string                      // 插件 Logo 地址
    phase: string
    stylesheet: string
  }
}
```
