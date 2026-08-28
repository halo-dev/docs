---
title: 插件发布验收清单
description: 在发布 Halo 插件前验证 Gradle 构建、JAR 内容、版本信息、安装升级、生命周期和 CI/CD 流程
---

本清单用于验证准备发布的插件 JAR，而不只是开发目录。先完成[插件测试](./testing.md)，再使用最终制品在 `plugin.yaml` 的 `spec.requires` 所声明的 Halo 版本范围内完成验收。

## 构建发布制品

使用准备发布的版本号执行干净构建：

```bash
./gradlew clean build -Pversion=1.2.3
git status --short
```

Windows 环境将 `./gradlew` 替换为 `gradlew.bat`。构建完成后，插件 JAR 通常位于 `build/libs`。

确认以下结果：

- `clean build` 成功，并运行了所有接入 `check` 的后端和 UI 检查。
- JAR 文件名、Gradle 项目版本和准备发布的版本一致。
- `git status --short` 只显示预期的源码变化；不要手动修改或提交 `build` 中的生成文件。
- 多模块项目只发布 Halo 插件 JAR，不要把 API 模块、测试夹具或其他 JAR 误当作插件制品。

## 检查 JAR 内容

将示例文件名替换为实际制品：

```bash
jar tf 'build/libs/plugin-name-1.2.3.jar'
unzip -p 'build/libs/plugin-name-1.2.3.jar' plugin.yaml
unzip -p 'build/libs/plugin-name-1.2.3.jar' META-INF/MANIFEST.MF
```

确认以下内容来自本次构建：

- JAR 根目录包含 `plugin.yaml`，其中 `metadata.name`、`spec.version`、`spec.requires`、插件依赖、Logo、主页、问题反馈地址和许可证正确。
- Manifest 包含正确的 `Plugin-Main-Class` 和 `Implementation-Version`。
- 后端类、`extensions`、设置、模板、静态资源和其他运行时资源完整。
- 包含 UI 的插件应打包完整的 `ui` 目录；使用 ESM 输出时，`ui/ui-plugin.json` 记录的入口、样式和异步资源均存在。旧项目可能使用 `console` 目录，具体规则参考 [UI 构建](./basics/ui/build.md#output-format)。
- JAR 不包含凭据、私钥、`.env`、本地工作目录、测试数据或其他不应分发的文件。

不要解压后修改 JAR 或构建目录来修正版本和资源。发现问题时应修改源文件或构建配置，然后重新构建完整制品。

## 验证安装和升级

至少准备一个干净的 Halo 实例；已经发布过插件时，再准备一个安装了上一正式版的实例：

1. 以默认的 `deployment` 模式上传 JAR，完成安装和启用。
2. 检查插件信息、默认配置、权限、Console 或用户中心入口及主要功能。
3. 重启 Halo，再次验证插件启动、配置和持久化数据。
4. 禁用后重新启用插件，确认运行时资源能够释放和恢复。
5. 从上一正式版升级，确认配置、业务数据、API 和 UI 能够兼容或按文档完成迁移。
6. 在可丢弃环境中卸载插件，按照[插件生命周期](./basics/server/lifecycle.md)核对运行时资源、预置资源、外部资源和持久化数据的处理结果。
7. 在声明范围内的最低 Halo 版本和计划支持的当前版本上重复关键路径。

如果插件依赖其他插件、外部服务或主题模板，还需要覆盖依赖缺失、停用、版本不满足、认证失败和正常可用的状态。

## 核对 CI/CD

Halo 的可复用插件 CI 工作流运行 `./gradlew clean build`，能够执行检查并生成制品。插件 CD 工作流会根据 GitHub Release tag 注入版本号，并使用 `-x check` 构建 JAR，因此 CD 构建不能替代发布前的 CI 和测试。

使用可复用工作流时确认：

- 发布 commit 的 CI 已通过，没有被跳过或允许失败的必要检查。
- Release tag 去掉可选的 `v` 前缀后，与 JAR 文件名和 `plugin.yaml` 中的 `spec.version` 一致。
- `artifacts-path` 只匹配计划发布的制品。
- 首次上架前不自动同步应用市场；首次审核通过后再配置应用 ID 和最小权限的个人令牌。

CI/CD 配置和应用市场流程参考[发布应用](../app-store/publish-app.md#使用-github-actions-自动构建和发布)。

## 记录发布证据

发布记录至少保留以下信息：

```text
Commit and tag:
Plugin version:
Halo versions tested:
Clean install: pass/fail
Upgrade from: version, pass/fail
Commands run:
Roles and dependency states checked:
Known limitations:
Artifact path and SHA-256:
```

macOS 可以使用 `shasum -a 256 'build/libs/plugin-name-1.2.3.jar'`，Linux 可以使用 `sha256sum 'build/libs/plugin-name-1.2.3.jar'` 生成摘要。

发现以下任一问题时应停止发布：检查或构建失败、JAR 无法安装或启用、版本信息不一致、主要功能或权限失效、升级导致数据损坏，或制品包含不应分发的敏感文件。验收通过后，再根据[发布应用](../app-store/publish-app.md)准备版本说明、截图、许可证和应用市场资料。
