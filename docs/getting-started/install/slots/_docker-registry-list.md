Halo 主要区分为[社区版和付费版](../../prepare.md#发行版本)，这两个版本使用不同的 Docker 镜像，以下是 Docker Hub 的官方镜像地址：

- [Halo 付费版镜像](https://hub.docker.com/r/halohub/halo-pro/tags)：包括 [Halo 专业版](https://www.lxware.cn/halo) 和 [Halo 商业版](https://www.lxware.cn/halo)，可以使用所有开源版本的功能，但部分付费功能需要使用许可证激活
- [Halo 社区版镜像](https://hub.docker.com/r/halohub/halo/tags)：使用 Halo 的[开源仓库](https://github.com/halo-dev/halo)构建，不包含任何付费功能，也不支持激活许可证

镜像名称由以下组成：

```bash
# 付费版
halohub/halo-pro:<version>

# 社区版
halohub/halo:<version>
```

`<version>` 表示 Halo 的具体版本号，比如 `2.22.0`，版本命名方式遵循 [SemVer](https://semver.org/lang/zh-CN/)，即 `<major>.<minor>.<patch>`

除了具体版本号的标签之外，Halo 还提供了 `:<major>` 和 `:<major>.<minor>` 的标签，比如：

- `halohub/halo-pro:2`：代表整个 Halo 2 的最新版本
- `halohub/halo-pro:2.20`：代表 Halo 2.20 的最新版本

以上是 Docker Hub 的官方镜像地址，如果你的服务器因为网络原因导致拉取速度缓慢，也可以使用我们自行搭建的镜像库：

- 付费版：`registry.fit2cloud.com/halo/halo-pro`
- 社区版：`registry.fit2cloud.com/halo/halo`

后续文档将使用 `registry.fit2cloud.com/halo/halo-pro` 为例，如果你需要安装社区版，需要将 `halo-pro` 替换为 `halo`。
