---
title: 主题发布验收清单
description: 在发布 Halo 主题前验证构建产物、安装升级、页面模板、设置、插件兼容性和浏览器表现
---

本清单用于验证准备发布的主题 ZIP，而不只是开发目录。先按[构建与打包](./packaging.md)生成并检查制品，再在 `theme.yaml` 的 `spec.requires` 所声明的 Halo 版本范围内完成安装和页面验收。

## 构建并确认制品

使用仓库已经提供的脚本；没有对应脚本时跳过，不要临时发明另一套发布流程：

```bash
pnpm install --frozen-lockfile
pnpm check # package.json 提供该脚本时执行
pnpm build
unzip -l dist/theme-name-version.zip
git status --short
```

确认以下结果：

- 构建和检查命令成功，生成模板来自本次源码。
- ZIP 名称、`theme.yaml` 的 `spec.version` 和准备发布的版本一致。
- ZIP 根目录直接包含 `theme.yaml`，并包含完整的 `templates`、配置、国际化资源及需要的 `ui-plugin/dist`。
- ZIP 不包含源码、开发配置、凭据、私钥或其他无关文件。
- 构建后只有预期的产物变化，没有手工修改生成的 `templates`。

## 验证安装和升级

至少准备一个干净的 Halo 实例和一个安装了上一正式版主题的实例：

1. 上传 ZIP，完成安装、启用和首次访问。
2. 重载主题配置，确认 `theme.yaml`、`settings.yaml` 和默认值生效。
3. 从上一正式版升级，确认已有设置仍可读取，新设置有安全的默认值。
4. 切换到其他主题再切回，确认主题无需手工修复即可恢复工作。
5. 完成停用和卸载流程，确认不影响站点内容和其他主题。
6. 在声明范围内的最低 Halo 版本和计划支持的当前版本上重复关键路径；只在新版可用的片段应使用 [`#halo.matchVersion`](./global-variables.md#halomatchversionconstraint) 保护。

不要根据“模板能编译”推断兼容范围。`spec.requires` 应只覆盖实际验证过且功能可接受的 Halo 版本。

## 覆盖页面和内容状态

| 范围 | 至少验证 |
| --- | --- |
| 核心页面 | 首页、文章、单页面、文章归档、分类列表与分类归档、标签列表与标签归档、作者归档、错误页 |
| 自定义模板 | `theme.yaml` 中声明的每一个文章、单页面和分类模板 |
| 内容边界 | 空列表、单条内容、多页内容、长标题、无摘要、无封面、宽表格、代码块和嵌入媒体 |
| 分页与链接 | 上一页、下一页、详情链接、面包屑、菜单、站内搜索入口和不存在的地址 |
| 主题设置 | 默认配置、每个开关、空值、自定义颜色或图片，以及重载配置后的结果 |
| 国际化 | 主题声明的每种语言、日期和数字格式，以及窄屏下的长文本 |

页面不能出现服务端错误、失效入口、资源 404、明显布局溢出或阻断主要操作的 JavaScript 错误。

## 验证集成和浏览器表现

- 按[与插件集成](./plugin-integration.md#验证兼容性)分别测试插件未安装、已停用、版本不满足和正常启用的状态。
- 如果提供 `templates/layout.html`，用实际插件前台页面验证[页面布局契约](./page-layout.md)，不能只测试主题自己的页面。
- 检查桌面和窄屏布局、键盘操作、可见焦点、图片替代文本、颜色对比度和水平滚动。
- 检查浏览器 Console 和 Network，确认没有未处理异常、混合内容、重复请求或意外外部资源。
- 按[主题 SEO](./seo.md#验证最终结果)检查最终 `<head>`，尤其是标题、描述、`noindex`、canonical 和社交分享信息。
- 关闭模板缓存进行开发验证后，再用接近生产的缓存配置完成一次冒烟测试。

## 记录发布证据

发布记录至少保留以下信息，方便人工复核或 AI Agent 在后续版本中比较：

```text
Commit:
Theme version:
Halo versions tested:
Clean install: pass/fail
Upgrade from: version, pass/fail
Commands run:
Routes checked:
Optional plugins checked:
Known limitations:
Artifact path and SHA-256:
```

macOS 可以使用 `shasum -a 256 dist/theme-name-version.zip` 生成摘要。发现以下任一问题时应停止发布：构建或打包失败、无法安装或启用、主要页面返回服务端错误、缺少可选插件时主题不可用、制品版本不一致，或 ZIP 中包含不应分发的敏感文件。

验收通过后，再根据[发布应用](../app-store/publish-app.md)准备版本说明、截图、许可证和应用市场资料。
