---
title: 源码二次开发
description: 将 shop-templates 的 Svelte UI 集成到 Halo 主题，处理 workspace 依赖、资源构建、图库与升级维护。
---

当需要改变交易组件内部结构或交互时，可以把 [shop-templates](https://github.com/lxware-dev/shop-templates) 的 UI 源码集成到主题。以下以 Halo 商城版 2.27 为基线；可结合[二次开发示例主题](https://github.com/lxware-dev/theme-shop-advanced-starter)阅读。

## 准备源码与工具

需要熟悉 pnpm workspace、主题静态资源构建和 Svelte。也可以采用其他框架，但需要自行实现[前台交易流程](./storefront-api.md)。

先从[分支列表](https://github.com/lxware-dev/shop-templates/branches)选择与运行版本一致的 release 分支。`main` 可能包含尚未发布的功能，记录所用提交，便于以后同步更新。

把选定版本的 **整个 `ui/` 目录**复制到主题根目录，保留其中的配置和本地依赖包。`@halo-dev/api-client` 在该项目中通过本地 `.tgz` 引用，不能只复制 `ui/src/`，也不要直接替换为不含商城模型的客户端版本。

## 合并 workspace 与依赖

在主题的 `pnpm-workspace.yaml` 中加入 `ui`，保留主题已有配置：

```yaml
packages:
  - ui
```

这只是 workspace 的目录部分。还需要核对所选源码的根配置：如果 `ui` 的构建配置或依赖使用了 `vite-plus`、`catalog:`、`overrides` 等内容，将对应依赖与配置合并到主题中。不要只复制上面的目录配置就假设构建环境已经完整。

在主题根 `package.json` 的 `dependencies` 中加入：

```json
{
  "@halo-dev/shop-ui": "workspace:*"
}
```

随后安装依赖并构建 UI：

```bash
pnpm install
pnpm --filter @halo-dev/shop-ui run build
```

使用所选源码和主题声明的 Node.js、pnpm 与构建工具版本。依赖清单或锁文件变化应由包管理器生成。

## 接入主题资源入口

在主题 JavaScript 或 TypeScript 入口加入：

```ts
import "@halo-dev/shop-ui";
import "@halo-dev/shop-ui/dist/index.css";
```

UI 包会注册购买、购物车、结算和支付组件。然后按照主题原有方式构建资源，例如：

```bash
pnpm build
```

主题应按上述顺序先构建 UI，再构建引用它的主题入口。

资源输出位置与模板引用方式参见[主题 Vite 集成](../../theme/vite.md)。不要手动修改构建后的 JavaScript 或 CSS。

## 处理图库与模板

复制或改写需要接管的 `templates/shop/` 页面与模块，并使用主题自己的脚本和样式入口替换内置资源引用。

:::warning 避免重复注册组件
加载自己构建的 `@halo-dev/shop-ui` 后，不要再加载 `shop/modules/script` 提供的内置脚本。否则两份代码会注册相同的 `shop-*` 自定义元素。
:::

此外，`shop-ui` 入口只注册商城组件；默认商品详情图库还使用 Swiper 和图片放大。需要保留这部分效果时，参考同版本仓库的根 `src/index.ts`，安装并初始化对应的 Swiper、medium-zoom 依赖，或替换为主题已有图库。

逐个检查未覆盖的页面：它们仍可能通过内置页面外壳加载内置脚本。如果采用统一布局或全局入口注册自编译组件，应确保这些页面不会再次加载内置组件。

## 开发与验证

UI 的常用命令：

```bash
pnpm --filter @halo-dev/shop-ui run check
pnpm --filter @halo-dev/shop-ui run dev
pnpm --filter @halo-dev/shop-ui run build
```

UI 开发服务器便于调试组件，但其代理配置不等同于完整 Halo 主题环境。特别是 2.27 前台购物车、结算和订单请求使用 `/shop/**`，需要检查代理是否覆盖该路径；登录、Cookie、CSRF 和服务器表单跳转仍应在真实 Halo 主题页面验证。

## 维护改动

- UI 文案位于 `ui/src/i18n/locales/`，修改时同步所支持的语言。
- 样式位于 `ui/src/styles/`，优先保留 `shop-` 前缀以减少主题冲突。
- 价格显示需要精确小数处理，最终金额使用后端计算结果。
- 升级时同时比较模板、组件属性、API 模型与依赖包；仅更新生成的客户端并不能保证交易流程兼容。
- 将需要覆盖的模板和构建产物纳入主题打包规则，按[测试与发布](./testing.md)完成验证。
