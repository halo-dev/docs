---
title: 自定义 API
description: 使用 CustomEndpoint 或 ApiVersion 为 Halo 插件提供响应式业务 API，并配置作用域、校验、权限和 OpenAPI 文档
---

自动生成的自定义模型 CRUD API 不能满足聚合查询或业务动作时，可以定义响应式自定义 API。简单资源读写仍应优先使用[自定义模型 API](./extension.md#extension-apis)。

## 选择 API Group {#custom-api-group-spec}

自定义 API 的 group 决定主要使用范围和 OpenAPI 分组：

| 使用范围             | group 示例                       |
| -------------------- | -------------------------------- |
| Console              | `console.api.my-plugin.halo.run` |
| UC 个人中心          | `uc.api.my-plugin.halo.run`      |
| 主题或其他公开调用方 | `api.my-plugin.halo.run`         |

自定义 API 仍需配置最小权限。使用公开 group 不会自动允许匿名访问，权限规则见[角色模板](../../security/role-template.md)。

## 使用 CustomEndpoint

`CustomEndpoint` 从 Halo 2.0.0 开始提供，为 `RouterFunction` 自动添加 group 和 version 前缀：

```java
import static org.springframework.http.MediaType.APPLICATION_JSON;

import java.util.Map;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import run.halo.app.core.extension.endpoint.CustomEndpoint;
import run.halo.app.extension.GroupVersion;

@Component
public class PersonEndpoint implements CustomEndpoint {

    @Override
    public RouterFunction<ServerResponse> endpoint() {
        return RouterFunctions.route()
            .GET("/persons/{name}", this::getPerson)
            .build();
    }

    private Mono<ServerResponse> getPerson(ServerRequest request) {
        return ServerResponse.ok()
            .contentType(APPLICATION_JSON)
            .bodyValue(Map.of("name", request.pathVariable("name")));
    }

    @Override
    public GroupVersion groupVersion() {
        return new GroupVersion("console.api.my-plugin.halo.run", "v1alpha1");
    }
}
```

最终路径为 `/apis/console.api.my-plugin.halo.run/v1alpha1/persons/{name}`。保持资源型 API 路径不超过角色模板支持的层级；复杂筛选使用查询参数。

## 使用带注解的控制器

`ApiVersion` 从 Halo 2.0.0 开始提供。需要注解风格时，可以使用 `@RestController`，并通过 `@ApiVersion` 添加 Halo API group 和 version 前缀。缺少该注解时，控制器仍可能按原始 `@RequestMapping` 路径注册，因此不能用省略注解的方式禁用 API：

```java
@ApiVersion("console.api.my-plugin.halo.run/v1alpha1")
@RequestMapping("/persons")
@RestController
public class PersonController {

    @GetMapping("/{name}")
    public Mono<Map<String, String>> get(@PathVariable String name) {
        return Mono.just(Map.of("name", name));
    }
}
```

Halo 基于 WebFlux；控制器不能返回阻塞调用。无法替换的阻塞工作应按[响应式服务端开发](../../basics/server/reactive-development.md)隔离。

## 处理列表参数

需要支持分页、排序和选择器时，可以在 Halo 2.5.0 及以上版本继承 `SortableRequest`，复用 Halo 的查询参数解析：

```java
public class PersonQuery extends SortableRequest {

    public PersonQuery(ServerWebExchange exchange) {
        super(exchange);
    }

    public String getKeyword() {
        return queryParams.getFirst("keyword");
    }

    @Override
    public ListOptions toListOptions() {
        var builder = ListOptions.builder(super.toListOptions());
        if (StringUtils.isNotBlank(getKeyword())) {
            builder.andQuery(contains("spec.name", getKeyword()));
        }
        return builder.build();
    }
}
```

`spec.name` 必须已经注册索引。查询与分页调用见 [ReactiveExtensionClient](./extension-client.md#query)。

## 校验请求体 {#using-java-bean-validation}

自定义 API 的输入属于信任边界。使用 Jakarta Bean Validation 或等价的显式校验，不要只依赖 OpenAPI 描述：

```java
public class PersonParam {
    @NotBlank
    @Size(max = 100)
    private String name;

    @Min(0)
    @Max(150)
    private int age;
}
```

WebFlux Functional Endpoint 不会仅凭字段上的约束注解自动执行校验。先在插件应用上下文中提供 Validator：

```java
@Configuration
public class PluginConfig {

    @Bean
    public LocalValidatorFactoryBean validator() {
        return new LocalValidatorFactoryBean();
    }
}
```

然后在读取请求体后显式调用：

```java
private final Validator validator;

private Mono<ServerResponse> createPerson(ServerRequest request) {
    return request.bodyToMono(PersonParam.class)
        .doOnNext(this::validate)
        .flatMap(param -> ServerResponse.ok().bodyValue(param));
}

private void validate(PersonParam param) {
    var errors = new BeanPropertyBindingResult(param, "person");
    validator.validate(param, errors);
    if (errors.hasErrors()) {
        throw new ServerWebInputException(errors.toString());
    }
}
```

这里的 `Validator` 为 `org.springframework.validation.Validator`。校验失败时返回可定位的 4xx 错误，不能把无效输入写入自定义模型。涉及当前用户语言时，在请求范围内设置 Locale，并在结束后恢复。

## 生成 OpenAPI 文档

需要让 Functional Endpoint 出现在 Swagger 和生成的 API Client 中时，使用 `SpringdocRouteBuilder` 描述 operationId、tag、参数和响应。operationId 应稳定且唯一，tag 建议包含资源 Kind、版本和作用域。

OpenAPI 分组与 API group 对应。生成客户端的步骤见 [DevTools](../../basics/devtools.md#how-to-generate-api-client)。不要手动修改生成的 `api-client` 或 `api-docs`。

## 源码参考

- [CustomEndpoint](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/api/src/main/java/run/halo/app/core/extension/endpoint/CustomEndpoint.java)
- [ApiVersion](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/api/src/main/java/run/halo/app/plugin/ApiVersion.java)
- [SortableRequest](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/api/src/main/java/run/halo/app/extension/router/SortableRequest.java)
