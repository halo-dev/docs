---
title: 测试插件
description: 使用 Gradle、插件 UI 检查和本地 Halo 环境验证插件后端、前端、兼容性及生命周期行为
---

插件测试应覆盖源码级自动化检查、开发环境联调和最终 JAR 安装验证。`haloServer` 能快速加载开发目录，但不能代替对发布制品的安装测试；准备发布时还需要完成[插件发布验收清单](./release-checklist.md)。

## 选择验证层级

| 变更范围 | 开发时至少执行 | 交付或发布前补充 |
| --- | --- | --- |
| Java 后端 | `./gradlew test` | `./gradlew clean build`、本地 Halo 联调 |
| 插件 UI | UI 项目已有的检查任务 | `./gradlew check`、桌面和窄屏人工检查 |
| API 或生成客户端 | 后端测试、项目已有的客户端生成任务 | 审查生成差异、后端与 UI 联调 |
| 权限、扩展点、插件依赖 | 相关自动化测试 | 使用不同角色和依赖状态联调 |
| 生命周期、升级或数据迁移 | 相关自动化测试 | 使用最终 JAR 完成安装、启停、升级和卸载测试 |

优先运行与改动最相关的最小任务，再运行完整构建。不要因为页面可以打开，就跳过权限、失败路径和生命周期验证。

## 运行自动化检查

### 后端测试

Halo 插件通常使用 JUnit 5，测试代码位于 `src/test/java`。只验证后端时运行：

```bash
./gradlew test
```

测试应围绕实际行为编写，至少覆盖本次变更涉及的正常路径和失败路径。处理用户输入、权限、外部服务或响应式错误时，还应验证无权限、无效输入、依赖不可用和异常传播。

### UI 检查

推荐的插件工程会在 UI 子项目中注册 `pnpmCheck`，并把它接入 Gradle 的 `check` 生命周期：

```bash
./gradlew :ui:pnpmCheck
```

如果 UI 目录名为 `console`，将命令中的 `ui` 替换为 `console`。不同项目的 `pnpmCheck` 可能只运行单元测试，也可能同时运行格式、Lint 和类型检查；以仓库的 `ui/build.gradle`、`package.json` 和 CI 配置为准。接入方式参考 [UI 构建](./basics/ui/build.md)。

不要手动修改 OpenAPI 生成的 API client。API 契约变化时，应运行项目已有的生成任务，并把生成差异与后端契约一起审查。

### 完整检查

运行所有已接入 Gradle 验证生命周期的任务：

```bash
./gradlew check
```

发布前执行干净构建：

```bash
./gradlew clean build
```

标准 Java Gradle 工程的 `build` 会依赖 `check`，并在 `build/libs` 生成插件 JAR。自定义测试任务只有接入 `check` 后才会随完整构建执行，因此新增测试任务时需要同时检查任务依赖关系。

## 在本地 Halo 中联调

使用 [DevTools](./basics/devtools.md) 启动加载开发目录的 Halo：

```bash
./gradlew haloServer
```

修改插件后，可以重新加载或持续监听：

```bash
./gradlew reloadPlugin
# 或者持续监听
./gradlew watch
```

`haloServer` 和 `watch` 需要 Docker，并会复用项目的 `workplace` 目录。该目录中的数据会跨任务重启保留；需要验证首次安装或默认配置时，应使用新的测试数据目录或干净环境，不要把生产数据用于开发测试。

联调时至少检查：

- 插件能够启动，服务端和浏览器控制台没有未处理错误。
- API 的成功、无权限、无效输入和依赖失败路径符合预期。
- Console 或用户中心入口在不同角色下正确显示并限制操作。
- 配置保存、重新加载和 Halo 重启后仍然生效。
- 使用外部服务时，超时、认证失败和服务不可用不会破坏 Halo 的主要流程。
- [与主题集成](./theme-integration.md)并提供 Finder、模板或前台资源时，在实际主题中验证输出；声明插件依赖时，验证依赖缺失、停用、版本不满足和正常启用的状态。

## 验证兼容性和生命周期

至少在 [`plugin.yaml`](./basics/manifest.md) 的 `spec.requires` 所声明的最低 Halo 版本和计划支持的当前版本上验证关键路径。不要仅根据编译成功推断兼容范围。

禁用、重载和重启后，插件应能恢复工作，持久化业务数据不应被意外删除。升级和卸载测试应使用可丢弃环境，并按照[插件生命周期](./basics/server/lifecycle.md)确认运行时资源、预置资源和持久化数据的处理结果。

## 记录可复核结果

人工测试或 AI Agent 执行后，应保留能够复现结论的信息：

```text
Commit:
Halo versions tested:
Java, Node.js and pnpm versions:
Commands run:
Automated checks: pass/fail
Roles and dependency states checked:
Manual paths checked:
Known limitations:
```

命令失败、测试被跳过或环境与声明兼容范围不一致时，应明确记录，不能用“构建成功”概括未执行的验证。
