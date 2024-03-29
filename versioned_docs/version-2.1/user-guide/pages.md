---
title: 页面
description: 页面管理相关功能说明
---

Halo 中存在两种类型的页面，`功能页面` 和 `自定义页面`。

### 功能页面

功能页面通常由各个插件提供，页面功能及在控制台呈现的内容由具体提供该页面的插件决定。

例如[链接插件](https://github.com/halo-sigs/plugin-links)便实现了一个站点链接管理功能，用户可以通过该插件更加方便地管理与站点相关的友情链接。安装该插件后，在功能页面会出现列表会出现如下条目。

![链接功能页面](/img/user-guide/pages/page-links.png)

点击这个条目即可进入到链接插件提供的配置管理页面。

![链接功能页面](/img/user-guide/pages/page-links-edit.png)

你可以在这个页面中管理链接分组和链接条目。链接信息维护完成后，通过 `$HALO_EXTERNAL_URL/links/` 便可访问到对应的页面。

:::info
对于 `links` 页面的访问需要主题端支持，即安装使用的主题需要有对应的 `links.html` 模板，且在模板中正确处理链接插件提供的数据。
:::

### 自定义页面

自定义页面与文章类似，同样包含页面标题和富文本形式的页面内容。与文章不同的是自定义页面无法设置所属分类和标签信息，一般用于站点中单一展示功能的页面，例如常见的站点关于页面、联系我们页面等。

自定义页面的访问链接为 `$HALO_EXTERNAL_URL/{slug}/` 其中 `slug` 为自定义页面的别名。

对于如下的关于页面，便可以通过 `$HALO_EXTERNAL_URL/page/` 地址进行访问。
![链接功能页面](/img/user-guide/pages/page-about.png)

:::info
自定义页面默认使用主题端的 `page.html` 模板进行渲染，如果主题中提供了针对自定义页面的其他模板，用户可以通过修改自定义页面高级设置中的自定义模板设置进行使用。
:::

#### 自定义页面操作

对于自定义页面的新建、设置、发布及删除等操作，与文章操作基本一致，具体操作请参考[《用户指南-文章》](./posts.md)章节，此处不再赘述。
