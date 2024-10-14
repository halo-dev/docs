目前 Halo 官方维护的 Docker 镜像仓库，可以根据自己的需求选择合适的镜像源：

- registry.fit2cloud.com/halo/halo
- [halohub/halo](https://hub.docker.com/r/halohub/halo)
- [ghcr.io/halo-dev/halo](https://github.com/halo-dev/halo/pkgs/container/halo)

:::info 注意
目前 Halo 2 并未更新 Docker 的 latest 标签镜像，主要因为 Halo 2 不兼容 1.x 版本，防止使用者误操作。我们推荐使用固定版本的标签，比如 `2.20` 或者 `2.20.0`。

- `registry.fit2cloud.com/halo/halo:2`：表示最新的 2.x 版本，即每次发布新版本都会更新此镜像。
- `registry.fit2cloud.com/halo/halo:2.20`：表示最新的 2.20.x 版本，即每次发布 patch 版本都会同时更新此镜像。
- `registry.fit2cloud.com/halo/halo:2.20.0`：表示一个具体的版本。

后续文档以 `registry.fit2cloud.com/halo/halo:2.20` 为例。
:::
