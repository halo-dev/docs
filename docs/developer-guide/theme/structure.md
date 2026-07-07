---
title: 目录结构
description: 主题的目录结构介绍
---

Halo 2.0 的主题基本目录结构如下：

```bash title="~/halo2-dev/themes/my-theme"
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
│   └── archives.html
├── screenshot.png
├── theme.yaml
└── settings.yaml
```

详细说明：

1. `/templates/` - 主题模板目录，存放主题模板文件，所有模板都需要放在这个目录。关于模板的详细说明，请查阅 [模板编写](./template-variables.md)。
2. `/templates/assets/` - 主题静态资源目录，存放主题的静态资源文件，目前静态资源文件只能放在这个目录，引用方式请查阅 [静态资源](./static-resources)。
3. `/templates/layout.html` - 可选的页面布局契约模板，从 Halo 2.26.0 开始可用于让插件前台页面复用当前主题的页面外壳。详细文档请查阅 [页面布局契约](./page-layout.md)。
4. `/screenshot.png` - 可选的主题预览图文件，支持 `screenshot.png`、`screenshot.jpeg`、`screenshot.jpg` 和 `screenshot.webp`。Halo 会按此顺序识别第一个可读文件，用于 Console 主题预览，并通过 `Theme.status.screenshot` 暴露访问地址。
5. `/theme.yaml` - 主题配置文件，配置主题的基本信息，如主题名称、版本、作者等。详细文档请查阅 [配置文件](./config)。
6. `/settings.yaml` - 主题设置定义文件，配置主题的设置项表单。详细文档请查阅 [设置选项](./settings)。
