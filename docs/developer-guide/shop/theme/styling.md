---
title: 定制样式
description: 通过 custom-styles 模板和商城 CSS 变量定制品牌色、容器宽度、表单、暗色模式和响应式布局。
---

本页以 Halo 商城版 2.27 内置模板的样式为基线。

## 添加样式覆盖文件

在主题中创建 `templates/shop/modules/custom-styles.html`。内置商城页面会在基础资源之后引用它，因此只调整外观时，无需复制所有页面：

```html
<style>
  :root {
    --shop-color-primary: #2563eb;
    --shop-color-primary-content: #fff;
    --shop-color-primary-light: #eff6ff;
    --shop-color-accent: #1d4ed8;
    --shop-container-max: 72rem;
    --shop-border-radius: 10px;
    --shop-sticky-offset: 88px;
  }
</style>
```

也可以在该文件中引入独立 CSS，路径遵循[主题静态资源](../../theme/static-resources.md)规则：

```html
<link rel="stylesheet" th:href="@{/assets/css/shop.css}" />
```

如果你覆盖了完整页面，需要在自定义页面中保留 `shop/modules/custom-styles` 的引用，或者从自己的样式入口引入这些规则。

## 常用变量

| 变量                                                                         | 用途                                     |
| ---------------------------------------------------------------------------- | ---------------------------------------- |
| `--shop-color-primary`、`--shop-color-primary-content`                       | 主按钮背景和文字                         |
| `--shop-color-primary-light`                                                 | 选中状态的浅色背景                       |
| `--shop-color-accent`                                                        | 强调色及部分悬停状态                     |
| `--shop-color-base-100`、`--shop-color-base-200`、`--shop-color-base-300`    | 基础背景层级                             |
| `--shop-color-base-content`                                                  | 基础文字颜色                             |
| `--shop-gray-50` 至 `--shop-gray-900`                                        | 文字、边框、占位和背景使用的灰阶         |
| `--shop-color-success`、`--shop-color-warning`、`--shop-color-error`         | 状态颜色                                 |
| `--shop-border-radius`、`--shop-border-radius-sm`、`--shop-border-radius-lg` | 圆角                                     |
| `--shop-spacing-xs` 至 `--shop-spacing-xl`                                   | 间距                                     |
| `--shop-font-family`、`--shop-font-size-base`                                | 字体与基础字号                           |
| `--shop-container-max`                                                       | `.shop-entry` 内容最大宽度，默认 `80rem` |
| `--shop-sticky-offset`                                                       | 吸顶区域距离顶部的偏移，默认 `100px`     |

完整变量见匹配版本源码中的 `ui/src/styles/_vars.scss`，模块样式位于 `ui/src/styles/`。

## 避免样式冲突

商城组件没有 Shadow DOM 隔离。主题中针对 `button`、`input`、`table`、`img` 的全局规则会影响商城，应在实际页面检查。

需要精确覆盖时，使用 `.shop-entry` 或商城组件标签限定范围。例如：

```css
.shop-entry .shop-product-card__image img {
  object-fit: contain;
}
```

结构类名会随模板版本变化，升级时需要复查。不要依赖生成的 Svelte 类名，也不要给所有按钮或输入框增加全站覆盖规则。

## 暗色模式与窄屏

内置变量以浅色为基线。支持暗色模式的主题应在自己的暗色选择器下同时调整背景、文字、灰阶、边框和状态色；只改变背景可能导致文字或表单不可读。

针对固定头部调整 `--shop-sticky-offset`，并在窄屏检查：商品图库、规格按钮、购物车数量输入、地址表单、支付二维码、订单金额和长卡密均可正常查看。避免通过固定宽度限制整个结算区域。
