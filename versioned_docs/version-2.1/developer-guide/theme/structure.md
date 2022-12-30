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
│   ├── index.html
│   ├── post.html
│   ├── page.html
│   ├── tag.html
│   ├── tags.html
│   ├── category.html
│   ├── categories.html
│   └── archives.html
├── theme.yaml
└── settings.yaml
```

详细说明：

1. `/templates/` - 主题模板目录，存放主题模板文件，所有模板都需要放在这个目录。关于模板的详细说明，请查阅 [模板路由](./template-route-mapping)。
2. `/templates/assets/` - 主题静态资源目录，存放主题的静态资源文件，目前静态资源文件只能放在这个目录，引用方式请查阅 [静态资源](./static-resources)。
3. `/theme.yaml` - 主题配置文件，配置主题的基本信息，如主题名称、版本、作者等。详细文档请查阅 [配置文件](./config)。
4. `/settings.yaml` - 主题设置定义文件，配置主题的设置项表单。详细文档请查阅 [设置选项](./settings)。
