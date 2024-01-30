---
title: 静态资源代理
description: 了解如果使用静态资源代理来访问插件中的静态资源
---

插件中的静态资源如图片等如果想被外部访问到，需要放到 `src/main/resources` 目录下，并通过创建 `ReverseProxy` 自定义模型对象来进行静态资源代理访问。

例如 `src/main/resources` 下的 `static` 目录下有一张 `halo.jpg`:

1. 首先需要在 `src/main/resources/extensions` 下创建一个 `yaml`，文件名可以任意。
2. 声明 `ReverseProxy` 对象如下：

  ```yaml
  apiVersion: plugin.halo.run/v1alpha1
  kind: ReverseProxy
  metadata:
    # 为了避免与其他插件冲突，推荐带上插件名称前缀
    name: my-plugin-fake-reverse-proxy
  rules:
    - path: /res/**
      file:
        directory: static
        # 如果想代理 static 下所有静态资源则省略 filename 配置
        filename: halo.jpg
  ```

插件启动后会根据 `/plugins/{plugin-name}/assets/**` 规则生成访问路径，
因此该 `ReverseProxy` 的访问路径为: `/plugins/my-plugin/assets/res/halo.jpg`。

- `rules` 下可以添加多组规则。
- `path` 为路径前缀。
- `file` 表示访问文件系统，目前暂时仅支持这一种。
- `directory` 表示要代理的目标文件目录，它相对于 `src/main/resources/` 目录。
- `filename` 表示要代理的目标文件名。

`directory` 和 `filename` 都是可选的，但必须至少有一个被配置。
