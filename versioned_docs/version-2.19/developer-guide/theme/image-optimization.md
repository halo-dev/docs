---
title: 图片优化
description: 本文档介绍如何使用 Halo 的缩略图特性来优化图片。
---

从 Halo 2.19 开始，Halo 支持了附件图片缩略图生成功能。通过缩略图功能，可以在不改变原图的情况下，生成预设尺寸的缩略图，以减少图片的大小，提高页面加载速度。

此文档将介绍如何在 Halo 的主题模板中利用此功能结合浏览器 [响应式图片](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) 的特性来优化图片资源。

## 为什么使用响应式图片？

- 响应式设计：支持根据不同设备的分辨率和屏幕大小，自动选择最佳的图片尺寸。这种机制确保了在高分辨率设备上显示高质量图片的同时，也能够在低分辨率设备上节省带宽。
- 提升加载性能：通过为图片提供多个尺寸的缩略图，浏览器可以选择最适合当前视窗的图片进行加载，从而减少不必要的带宽使用，提升页面加载速度，改善用户体验。
- 兼容性好：响应式图片是基于 HTML 标准的实现，不需要额外的 JavaScript 或 CSS，因此兼容性非常好。

:::info
建议详细阅读 [响应式图片](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) 文档，以了解更多关于响应式图片的知识，以及如何在不同场景下使用。
:::

## Finder API

### `thumbnail.gen(uri, size)`

获取指定图片和尺寸的缩略图地址。

#### 参数

- `uri:string` - 图片地址。
- `size:string` - 缩略图尺寸，支持以下值：
  - `s` - 宽度 400px
  - `m` - 宽度 800px
  - `l` - 宽度 1200px
  - `xl` - 宽度 1600px

#### 示例

```html
<img
  th:src="${post.spec.cover}"
  th:srcset="|${thumbnail.gen(post.spec.cover, 's')} 400w,
              ${thumbnail.gen(post.spec.cover, 'm')} 800w,
              ${thumbnail.gen(post.spec.cover, 'l')} 1200w,
              ${thumbnail.gen(post.spec.cover, 'xl')} 1600w|"
  sizes="(max-width: 1600px) 100vw, 1600px"
/>
```

:::info
文章内容无需在主题模板中处理，Halo 会自动为文章内容中的图片生成响应式图片的 HTML 代码。
:::

## HTTP API

如果你需要在主题模板之外的地方生成缩略图地址，比如异步加载图片的场景下，可以使用 HTTP API。

### 接口地址

`GET /apis/api.storage.halo.run/v1alpha1/thumbnails/-/via-uri?uri=${uri}&size={size}`

#### 参数

- `uri:string` - 图片地址。
- `size:string` - 缩略图尺寸，支持以下值：
  - `s` - 宽度 400px
  - `m` - 宽度 800px
  - `l` - 宽度 1200px
  - `xl` - 宽度 1600px

#### 示例

```html
<img
  src="/upload/post-cover.png"
  srcset="|/apis/api.storage.halo.run/v1alpha1/thumbnails/-/via-uri?uri=/upload/post-cover.png&size=s 400w,
           /apis/api.storage.halo.run/v1alpha1/thumbnails/-/via-uri?uri=/upload/post-cover.png&size=m 800w,
           /apis/api.storage.halo.run/v1alpha1/thumbnails/-/via-uri?uri=/upload/post-cover.png&size=l 1200w,
           /apis/api.storage.halo.run/v1alpha1/thumbnails/-/via-uri?uri=/upload/post-cover.png&size=xl 1600w|"
  sizes="(max-width: 1600px) 100vw, 1600px"
/>
```
