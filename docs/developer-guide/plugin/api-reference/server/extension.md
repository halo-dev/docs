---
title: 自定义模型
description: 了解什么是自定义模型及如何创建
---

Halo 自定义模型主要参考自 [Kubernetes CRD](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/) 。自定义模型遵循 [OpenAPI v3](https://spec.openapis.org/oas/v3.1.0)。设计目的在于提供一种灵活可扩展的数据存储和使用方式，便于为插件提供自定义数据支持。比如某插件需要存储自定义数据，同时也想读取和操作自定义数据。

一个典型的自定义模型 `Java` 代码示例如下：

```java
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import run.halo.app.extension.AbstractExtension;
import run.halo.app.extension.GVK;
import run.halo.app.extension.GroupKind;

@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@GVK(group = "my-plugin.halo.run",
        version = "v1alpha1",
        kind = "Person",
        plural = "persons",
        singular = "person")
public class Person extends AbstractExtension {

    @Schema(description = "The description on name field", maxLength = 100)
    private String name;

    @Schema(description = "The description on age field", maximum = "150", minimum = "0")
    private Integer age;

    @Schema(description = "The description on gender field")
    private Gender gender;

    private Person otherPerson;

    public enum Gender {
        MALE, FEMALE,
    }
}
```

要创建一个自定义模型需要三步：

1. 创建一个类继承 `run.halo.app.extension.AbstractExtension`。
2. 使用 `GVK` 注解。
3. 在插件 `start()` 生命周期方法中注册自定义模型：

```java
@Autowired
private SchemeManager schemeManager;

@Override
public void start() {
  schemeManager.register(Person.class);
}
```

有了自定义模型后可以通过在插件项目的 `src/main/resources/extensions` 目录下声明 `yaml` 文件来创建一个自定义模型对象，此目录下的所有自定义模型 `yaml` 都会在插件启动后被创建：

```yaml
groupVersion: my-plugin.halo.run/v1alpha1
kind: Person
metadata:
  name: fake-person
name: halo
age: 18
gender: male
```

:::tip 释义

- @GVK：此注解标识该类为一个自定义模型，同时必须继承 `AbstractExtension`。
  - kind：表示自定义模型所表示的 REST 资源。
  - group：表示一组公开的资源，通常采用域名形式，Halo 项目保留使用空组和任何以 `*.halo.run` 结尾的组名供其单独使用。
  选择群组名称时，我们建议选择你的群组或组织拥有的子域，例如 `widget.mycompany.com`，而这里提到的公开并不是指你的自定义资源可以被任何人访问，
  而是指你的自定义模型对象可以被以 APIs 的形式访问。
  - version：API 的版本，它与 group 组合使用为 `apiVersion=GROUP/VERSION`，例如`api.halo.run/v1alpha1`。
  - singular: 资源的单数名称，这允许客户端不透明地处理复数和单数，必须全部小写，通常是将 `kind` 的值转换为小写作为 `singular` 的值。
  - plural： 资源的复数名称，自定义资源在 `/apis/<group>/<version>/.../<plural>` 下提供，必须为全部小写，通常是将 `kind` 的值转换为小写并转为复数形式作为 `plural` 的值。
- @Schema：属性校验注解，会在创建/修改资源前对资源进行简单校验，参考 [schema-validator](https://www.openapi4j.org/schema-validator.html)。
:::

### 自定义模型 APIs

定义好自定义模型并注册后，会根据 `GVK` 注解自动生成一组 `CRUD` APIs，规则为：
`/apis/<group>/<version>/<extension>/{extensionname}/<subextension>`

对于上述 Person 自定义模型将有以下 APIs：

```text
GET /apis/my-plugin.halo.run/v1alpha1/persons
PUT /apis/my-plugin.halo.run/v1alpha1/persons/{name}
POST /apis/my-plugin.halo.run/v1alpha1/persons
DELETE /apis/my-plugin.halo.run/v1alpha1/persons/{name}
```

对于这组自动生成的 `CRUD` APIs，你可以通过定义[控制器](../../basics/framework.md#controller)来完成对数据修改后的业务逻辑处理来满足大部分的场景需求。

### 自定义 API

在一些场景下，只有自动生成的 `CRUD` API 往往是不够用的，此时可以通过自定义一些 APIs 来满足功能。

你可以使用 [Spring Framework Web](https://docs.spring.io/spring-framework/reference/web/webflux/new-framework.html) 的 Adaptive 写法来暴露 APIs，不同的是需要添加 `@ApiVersion` 注解，没有此注解的 `Controller` 将被忽略：

```java
@ApiVersion("fake.halo.run/v1alpha1")
@RequestMapping("/apples")
@RestController
public class AppleController {

    @PostMapping("/starting")
    public void starting() {
    }
}
```

当插件被启动时，Halo 将会为此 AppleController 生成一个 API：

```text
/apis/fake.halo.run/v1alpha1/apples/starting
```

但我们**更推荐使用** [Functional Endpoints](https://docs.spring.io/spring-framework/reference/web/webflux-functional.html) 写法来提供 APIs，这是一种轻量级函数式编程写法：

```java
RouterFunction<ServerResponse> route = route()
    .GET("/person/{id}", accept(APPLICATION_JSON), this::getPerson) 
    .GET("/person", accept(APPLICATION_JSON), this::listPeople) 
    .POST("/person", this::createPerson) 
    .add(otherRoute) 
    .build();

public Mono<ServerResponse> listPeople(ServerRequest request) {
  // ...
}

public Mono<ServerResponse> createPerson(ServerRequest request) {
  // ...
}

public Mono<ServerResponse> getPerson(ServerRequest request) {
  // ...
}
```

HTTP 请求通过 HandlerFunction 处理：这是一个接收 ServerRequest 并返回延迟的 ServerResponse（即 `Mono<ServerResponse>`）的函数。
请求和响应对象都有不可变的约定，它们提供了对 HTTP 请求和响应的 JDK 8 友好访问。HandlerFunction 相当于基于注解的编程模型中 @RequestMapping 方法的主体。

传入的请求通过 RouterFunction 路由到一个处理函数：这是一个接收 ServerRequest 并返回延迟的 HandlerFunction（即 `Mono<HandlerFunction>`）的函数。
当路由函数匹配时，返回一个处理函数；否则返回一个空的 Mono。RouterFunction 相当于 `@RequestMapping` 注解，但主要区别在于路由函数不仅提供数据，还提供行为。

ServerRequest 和 ServerResponse 是不可变的接口，它们提供了对 HTTP 请求和响应的 JDK 8 友好访问。请求和响应都针对主体流提供了
[Reactive Streams](https://www.reactive-streams.org/) 的背压（back pressure）。请求主体用 Reactor Flux 或 Mono 表示。
响应主体可用任何响应式流发布者（Publisher）表示，包括 Flux 和 Mono。
更多相关信息，请参见 [Reactor 3 Reference Guide](https://projectreactor.io/docs/core/release/reference/) 和 [Webflux](https://docs.spring.io/spring-framework/reference/web/webflux.html)。
