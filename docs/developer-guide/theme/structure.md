---
title: 目录结构
description: 了解 Halo 主题项目的标准目录结构，以及模板、静态资源、主题配置、设置表单、预览图和 Console、用户中心 UI 扩展各自的存放位置
---

Halo 2.0 的主题基本目录结构如下：

```tree title="~/halo2-dev/themes/my-theme"
my-theme
├── templates/
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       └── main.js
│   ├── layout.html
│   ├── index.html
│   ├── post.html
│   ├── page.html
│   ├── tag.html
│   ├── tags.html
│   ├── category.html
│   ├── categories.html
│   ├── archives.html
│   └── author.html
├── screenshot.png
├── i18n/                        # 可选的国际化消息
│   ├── default.properties
│   └── zh_CN.properties
├── theme.yaml
├── settings.yaml
└── ui-plugin/                # 可选的 Console / UC UI 扩展
    ├── package.json
    ├── src/
    │   └── index.ts
    └── dist/                 # Halo 只读取此构建目录
```

详细说明：

1. `/templates/` - 主题模板目录，存放主题模板文件，所有模板都需要放在这个目录。关于模板的详细说明，请查阅 [模板编写](./template-variables.md)。
2. `/templates/assets/` - 主题静态资源目录，存放主题的静态资源文件，目前静态资源文件只能放在这个目录，引用方式请查阅 [静态资源](./static-resources)。
3. `/templates/layout.html` - 可选的页面布局契约模板，从 Halo 2.26.0 开始可用于让插件前台页面复用当前主题的页面外壳。详细文档请查阅 [页面布局契约](./page-layout.md)。
4. `/screenshot.png` - 可选的主题预览图文件，支持 `screenshot.png`、`screenshot.jpeg`、`screenshot.jpg` 和 `screenshot.webp`。Halo 会按此顺序识别第一个可读文件，用于 Console 主题预览，并通过 `Theme.status.screenshot` 暴露访问地址。
5. `/i18n/` - 可选的主题国际化消息目录，详细文档请查阅[国际化](./i18n.md)。
6. `/theme.yaml` - 主题配置文件，配置主题的基本信息，如主题名称、版本、作者等。详细文档请查阅 [配置文件](./config)。
7. `/settings.yaml` - 主题设置定义文件，配置主题的设置项表单。详细文档请查阅 [设置选项](./settings)。
8. `/ui-plugin/` - 可选的 Console / UC UI 扩展项目。Halo 只读取其中的 `dist` 构建目录，详细文档请查阅 [UI 扩展](./ui-plugin.md)。

使用 Vite 等构建工具的主题通常还包含 `src` 和 `public`，并由构建命令生成 `templates`。这类项目应修改源码而不是生成目录，详细约定请参考[使用 Vite 开发主题](./vite.md)。
