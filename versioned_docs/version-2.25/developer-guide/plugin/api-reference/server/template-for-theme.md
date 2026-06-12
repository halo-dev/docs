---
title: 在插件中提供主题模板
description: 了解如何为主题扩充模板。
---

当你在插件中创建了自己的自定义模型后，你可能需要在主题端提供一个模板来展示这些数据，这一般有两种方式：

1. 插件规定模板名称，由主题选择性适配，如瞬间插件提供了 `/moments` 的路由渲染 `moment.html` 模板，主题可以选择性的提供 `moment.html` 模板来展示瞬间数据。
2. 插件提供默认模板，当主题没有提供对应的模板时，使用默认模板，主题提供了对应的模板时，使用主题提供的模板。

## 创建一个模板

首先，你需要在插件的 `resources` 目录下创建一个 `templates` 目录，然后在 `templates` 目录下提供你的模板，例如：

```text
├── templates
│   ├── moment.html
```

然后提供一个路由用于渲染这个模板，例如：

```java
import run.halo.app.theme.TemplateNameResolver;

@RequiredArgsConstructor
@Configuration(proxyBeanMethods = false)
public class MomentRouter {
   private final TemplateNameResolver templateNameResolver;

   @Bean
   RouterFunction<ServerResponse> momentRouterFunction() {
      return route(GET("/moments"), this::renderMomentPage).build();
   }

    Mono<ServerResponse> renderMomentPage(ServerRequest request) {
        // 或许你需要准备你需要提供给模板的默认数据，非必须
        var model = new HashMap<String, Object>();
        model.put("moments", List.of());
        return templateNameResolver.resolveTemplateNameOrDefault(request.exchange(), "moments")
            .flatMap(templateName -> ServerResponse.ok().render(templateName, model));
    }
}
```

使用 `TemplateNameResolver` 来解析模板名称，如果主题提供了对应的模板，那么就使用主题提供的模板，否则使用插件提供的模板，如果直接返回模板名称，那么只会使用主题提供的模板，如果主题没有提供对应的模板，那么会抛出异常。

## 模板片段

如果你的默认模板不止一个，你可能需要通过模板片段来抽取一些公共的部分，例如，你的插件提供了一个 `moment.html` 模板，你可能需要抽取一些公共的部分，例如头部、尾部等，你可以这样做：

```text
├── templates
│   ├── moment.html
│   ├── fragments
│   │   ├── layout.html
```

然后定义一个 `layout.html` 模板，例如：

```html
<!DOCTYPE html th:fragment="layoutHtml(content)">
<html lang="zh-CN" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title th:text="${title}">Moment</title>
</head>
<body>
  <div class="container">
    <th:block th:replace="${content}" />
  </div>
</body>
</html>
```

那么使用 `layout.html` 模板中提供的 `fragment` 时，你需要这样做：

```html
<div th:replace="~{plugin:plugin-moment:fragments/layout :: layoutHtml(content = ~{::content})}">
  <th:block th:fragment="content"> Hello World </th:block>
</div>
```

`plugin:plugin-moment:fragments/layout` 即为使用 `layout.html` 模板的路径，必须以 `plugin:<your-plugin-name>:`前缀作为开头，`fragments/layout` 为模板相对于 `resources/templates` 的路径，`<your-plugin-name>` 即为你的插件名称。

**总结：**

1. 定义模板片段时与主题端定义模板片段时一样
2. 使用模板片段时，必须以 `plugin:<your-plugin-name>:` 前缀作为开头，后跟模板相对于 `resources/templates` 的路径，例如 `plugin:plugin-moment:fragments/layout`，`plugin-moment` 即为你的插件名称，`fragments/layout` 为模板相对于 `resources/templates` 的路径。

参考：[Thymeleaf 模板片段](https://www.thymeleaf.org/doc/tutorials/3.1/usingthymeleaf.html#including-template-fragments)
