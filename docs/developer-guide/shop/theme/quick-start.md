---
title: 快速开始
description: 准备 Halo 商城版开发环境，在主题中复用商品列表模板并验证适配结果。
---

本页适用于 Halo 商城版 2.27，目标是在现有主题中完成第一个商城页面。

## 准备开发环境

1. 安装并激活 [Halo 商城版](../../../guide/shop/prepare.mdx)，按[主题开发准备](../../theme/prepare.mdx)配置本地主题目录。
2. 在控制台创建并发布测试商品，设置 SKU、价格和库存。需要测试交易时，再配置[支付方式](../../../guide/shop/payments.mdx)与[销售渠道](../../../guide/shop/sales-channels.mdx)。
3. 激活待适配的主题，访问 `/shop/products`，确认内置页面能显示商品。
4. 按目标 Halo 版本选择 [shop-templates 分支](https://github.com/lxware-dev/shop-templates/branches)，用于查看相应模板和样式。

单纯复用内置模板不需要安装商城 UI 依赖或运行其构建任务。主题原有静态资源仍按自己的构建流程处理。

## 创建商品列表页面

在主题中创建 `templates/shop/products.html`：

```html
<!doctype html>
<html xmlns:th="https://www.thymeleaf.org" th:lang="${site.language}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title th:text="|商城 - ${site.title}|"></title>
    <th:block th:replace="~{shop/modules/style}" />
    <th:block th:replace="~{shop/modules/script}" />
    <th:block th:replace="~{shop/modules/custom-styles}" />
  </head>
  <body>
    <header><a th:href="@{/}" th:text="${site.title}"></a></header>
    <main>
      <th:block th:replace="~{shop/modules/products}" />
    </main>
  </body>
</html>
```

这里的 `shop/modules/products` 由 Halo 提供，无需复制到主题。页面稳定后，可以把示例中的页头替换为主题自己的[布局片段](../../theme/page-layout.md)。

## 验证效果

重新访问 `/shop/products`，确认页头已经出现，商品分类、搜索、排序和分页仍能工作。点击商品后应进入详情页；此时详情页仍使用内置模板。

在浏览器开发者工具中检查：

- `/shop-dist/style.css` 与 `/shop-dist/main.iife.js` 请求成功。
- 商品链接使用后端提供的 `permalink`，能打开对应商品。
- 控制台没有模板错误或重复注册自定义元素的错误。

## 继续适配

按相同方式创建 `product.html`、`cart.html`、`checkout.html`、`payments.html` 和 `order.html`，分别引入对应的 `shop/modules/` 模块。模板名与访问地址并不完全相同，具体对应关系见[页面与变量](./pages-and-variables.md)。

如果只想修改默认页面颜色和宽度，可以直接添加[样式覆盖文件](./styling.md)，无需创建全部页面。
