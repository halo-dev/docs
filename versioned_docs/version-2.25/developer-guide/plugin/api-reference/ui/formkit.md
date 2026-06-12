---
title: FormKit 扩展
description: 介绍如何通过插件注册自定义 FormKit 输入组件
---

从 Halo 2.25.0 开始，插件可以通过 UI 入口文件的 `formkit.inputs` 注册自定义 FormKit 输入组件。注册后，插件提供的 FormKit Schema 可以通过 `$formkit` 使用对应类型。

关于如何创建 FormKit 自定义输入组件，可参考 FormKit 官方文档：[Create a custom input](https://formkit.com/guides/create-a-custom-input)。

## 注册输入组件

```ts title="ui/src/index.ts"
import { createInput } from "@formkit/vue";
import { definePlugin } from "@halo-dev/ui-shared";
import { defineAsyncComponent } from "vue";

export default definePlugin({
  formkit: {
    inputs: {
      myPluginInput: createInput(
        defineAsyncComponent(() => import("./components/MyPluginInput.vue"))
      ),
    },
  },
});
```

## 在 FormKit Schema 中使用

```yaml
- $formkit: myPluginInput
  name: customField
  label: 自定义字段
```

## 注意事项

`formkit.inputs` 仅支持同步对象。如果输入组件需要懒加载，可以在 input definition 内部使用 `defineAsyncComponent`。

当插件注册的输入类型名称与 Halo 内置类型或更早加载的插件类型重复时，Halo 会保留已有类型，跳过冲突的插件类型并在控制台输出警告。建议使用带插件标识的类型名称，例如 `myPluginInput`。
