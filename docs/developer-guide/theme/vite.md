---
title: 使用 Vite 开发主题
description: 使用 @halo-dev/vite-plugin-halo-theme 在 src 中开发 Halo 主题，并生成 templates 模板与静态资源
---

对于需要 TypeScript、CSS 工具链或模板复用能力的主题，推荐从 [theme-vite-starter](https://github.com/halo-dev/theme-vite-starter) 创建项目。它使用 `@halo-dev/vite-plugin-halo-theme` 将 `src` 中的源码构建为 Halo 实际读取的 `templates` 目录。

## 区分源码和构建产物

| 路径                  | 用途                     | 是否直接编辑 |
| --------------------- | ------------------------ | ------------ |
| `src/*.html`          | 页面模板源码             | 是           |
| `src/partials/`       | 构建期复用的模板片段     | 是           |
| `src/css/`、`src/js/` | 由 Vite 处理的前端资源   | 是           |
| `public/`             | 不经转换、原样复制的文件 | 是           |
| `templates/`          | Halo 读取的构建产物      | 否           |

:::warning 不要修改生成的模板
使用这套工程结构时，应修改 `src` 后重新构建，不要手动修改 `templates`。构建会清空并重新生成该目录。
:::

插件将 `public` 的内容复制到 `templates` 根目录。需要让原样复制的文件最终位于 `templates/assets` 时，请放入 `public/assets`，例如 `public/assets/images/logo.svg` 会生成 `templates/assets/images/logo.svg`。生成后的引用方式请参考[静态资源](./static-resources.md)。

## 配置插件

安装插件：

```bash
pnpm add -D @halo-dev/vite-plugin-halo-theme
```

在 Vite 配置中启用插件：

```ts title="vite.config.ts"
import { haloThemePlugin } from "@halo-dev/vite-plugin-halo-theme";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [haloThemePlugin()],
});
```

插件使用以下固定约定：

- 扫描 `src` 下的 HTML 页面，但跳过 `src/partials`。
- 将页面和构建后的资源输出到 `templates` 与 `templates/assets`。
- 从 `theme.yaml` 的 `metadata.name` 生成 `/themes/{metadata.name}` 资源基础路径。
- 从项目根目录的 `public` 复制无需转换的文件。

## 复用模板片段

`<include>`、`<slot>` 和 `{{prop}}` 由 Vite 插件在构建期处理，它们不是 Thymeleaf 语法。`{{prop}}` 只执行字符串替换，不会求值表达式；生成后的模板仍可继续使用 Thymeleaf 表达式和 Halo Finder API。

```html title="src/partials/layout.html"
<!doctype html>
<html th:lang="${#locale.toLanguageTag}">
  <head>
    <slot name="head"><title th:text="${site.title}">Site title</title></slot>
  </head>
  <body>
    <slot />
    <halo:footer />
  </body>
</html>
```

```html title="src/index.html"
<include src="layout.html">
  <template name="head">
    <title th:text="${site.title}">Home</title>
    <script type="module" src="./js/index.ts"></script>
  </template>

  <main>首页内容</main>
</include>
```

未带路径前缀的 `layout.html` 会优先从 `src/partials/layout.html` 解析。相对路径从当前文件解析，以 `/` 开头的路径从 `src` 解析。

## 开发和构建

官方模板提供以下命令：

```bash
# 监听源码变更并持续生成 templates
pnpm dev

# 只生成 templates
pnpm build-only

# 类型检查、生成 templates，并打包主题 ZIP
pnpm build
```

`--watch` 只负责在文件变化后重新构建；Halo 端仍需关闭 Thymeleaf 缓存并安装、启用当前主题，具体步骤请参考[准备工作](./prepare.mdx)。
