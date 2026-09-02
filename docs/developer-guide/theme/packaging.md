---
title: 构建与打包
description: 使用 @halo-dev/theme-package-cli 将 Halo 主题的模板、配置、国际化资源和 UI 扩展打包为可安装 ZIP
---

Halo 主题以 ZIP 文件分发。推荐使用 `@halo-dev/theme-package-cli` 从主题根目录生成结构一致的安装包。

## 配置打包命令

安装 CLI：

```bash
pnpm add -D @halo-dev/theme-package-cli
```

普通主题可以直接将它作为构建命令；工程化主题应先生成模板，再执行打包：

```json title="package.json"
{
  "scripts": {
    "build": "vite build && theme-package",
    "package": "theme-package"
  }
}
```

如果项目已经提供 `build` 脚本，应保留其中的类型检查和主题构建步骤。以 [theme-vite-starter](https://github.com/halo-dev/theme-vite-starter) 为例，执行 `pnpm build` 即可完成构建和打包。

## 默认打包内容

运行以下命令：

```bash
pnpm exec theme-package
```

CLI 默认只收集主题运行和发布所需的内容：

- `templates/**`
- `ui-plugin/dist/**`
- 根目录的 `*.yaml`、`*.yml`
- `i18n/**`
- `README.md`、`LICENSE`
- 根目录的 `screenshot.png`、`screenshot.jpeg`、`screenshot.jpg` 或 `screenshot.webp`

CLI 会校验根目录存在 `theme.yaml`，并读取 `metadata.name` 与 `spec.version`，输出：

```text
dist/{metadata.name}-{spec.version}.zip
```

例如 `theme-foo` 的版本为 `1.2.0` 时，输出文件为 `dist/theme-foo-1.2.0.zip`。

## 谨慎使用 --all

```bash
pnpm exec theme-package --all
```

`--all` 会打包项目中的其他文件，仅排除 `dist`、`node_modules`、`.git`、`.github`、`.idea` 和 `.DS_Store` 等常见路径。它可能把源码、开发配置或其他不应分发的文件加入 ZIP，因此通常应使用默认模式；只有确认需要额外文件并检查过内容时才使用 `--all`。

## 发布前检查

```bash
pnpm build
unzip -l dist/theme-foo-1.2.0.zip
```

发布前至少确认：

1. `theme.yaml` 的 `spec.version` 与本次发布版本一致。
2. ZIP 根目录直接包含 `theme.yaml`，没有多余的外层文件夹。
3. `templates` 来自当前源码的最新构建，且包含主题需要的静态资源。
4. 如果提供主题 UI 扩展，ZIP 中包含完整的 `ui-plugin/dist`。
5. 在目标 Halo 版本上通过上传 ZIP、安装、启用和主要页面访问检查。

完整的页面、升级和兼容性验证请参考[主题发布验收清单](./release-checklist.md)。

通过 GitHub Actions 发布并同步到应用市场的配置，请参考[发布应用](../app-store/publish-app.mdx#使用-github-actions-自动构建和发布)。
