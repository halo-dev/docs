---
title: 主题调试与测试
description: 在主题开发过程中定位 Thymeleaf、路由、静态资源和集成问题，并用页面状态矩阵验证主题行为
---

主题开发中的测试应覆盖 Halo 实际渲染结果，而不只是前端源码能够构建。发布前还需要使用最终 ZIP 完成[主题发布验收](./release-checklist.md)。

## 建立开发反馈循环

1. 按[准备工作](./prepare.md)关闭 Thymeleaf 缓存，并安装、启用当前主题。
2. 使用 Vite 工程时执行 `pnpm dev` 持续生成 `templates`；不使用构建工具时直接修改主题源码。
3. 修改 `theme.yaml` 或设置表单后，在 Console 中重载主题配置。
4. 同时观察 Halo 日志以及浏览器 Console 和 Network，不能只根据页面是否显示判断结果。

使用 [theme-vite-starter](https://github.com/halo-dev/theme-vite-starter) 时，只修改 `src`、`public` 和配置等源文件，不要修改生成的 `templates`。具体目录边界参考[使用 Vite 开发主题](./vite.md#区分源码和构建产物)。

## 定位常见问题

| 现象 | 优先检查 |
| --- | --- |
| 模板解析或表达式错误 | Halo 日志中的模板路径和异常；当前页面的[模板变量](./template-variables/home.md)是否存在；可选值是否需要判空 |
| 页面返回 404 | 实际 permalink、Console 中的路由设置以及[模板路由](./template-route-mapping.md)，不要在模板中拼接可配置路径 |
| CSS、脚本或图片返回 404 | 文件是否位于 `templates/assets`；是否使用 `@{}` 或 `#theme.assets()`；Vite 输出是否来自最新源码 |
| 修改后页面没有变化 | Thymeleaf 缓存是否关闭；监听构建是否仍在运行；Halo 当前启用的主题是否为正在修改的目录 |
| 缺少插件后模板报错 | 访问插件 Finder 或模板之前是否使用 `pluginFinder.available()` 检查插件状态 |
| 页面布局或 `<head>` 内容重复 | 主题布局、插件页面布局、Head/Footer 处理器和 SEO 插件是否同时输出相同内容 |

不要用空字符串或异常捕获隐藏必需变量错误。只有插件、设置或内容字段确实可选时，才提供降级结果。

## 覆盖页面和状态

开发过程中至少验证与本次改动相关的组合：

- 首页、文章、独立页面、归档、分类、标签、作者和错误页面。
- 空列表、单条内容、多页内容以及上一页、下一页 URL。
- 无摘要、无封面、长标题、代码块、表格和嵌入媒体。
- 主题设置的默认值、空值、关闭和开启状态，以及重载配置后的结果。
- 主题声明的每种语言和窄屏下的长文本。
- 可选插件未安装、已停用、版本不满足和正常启用的状态。
- 桌面与窄屏布局、键盘操作、可见焦点、图片替代文本、颜色对比度和水平滚动。

与插件集成时，按照[与插件集成](./plugin-integration.md#验证兼容性)验证 Finder、模板、页面布局和静态资源；不要只测试插件始终可用的理想状态。

## 记录可复核结果

人工测试或 AI Agent 执行后，至少记录：

```text
Commit:
Theme and Halo versions:
Commands run:
Routes and content states checked:
Settings checked:
Optional plugin states checked:
Browser and viewport:
Known limitations:
```

记录失败的命令、未覆盖的页面和环境差异，不能用“页面正常”概括没有执行的验证。
