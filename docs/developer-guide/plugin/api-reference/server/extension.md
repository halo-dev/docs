---
title: 自定义模型
description: 了解什么是自定义模型及如何创建
---

Halo 自定义模型主要参考自 [Kubernetes CRD](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/) 。自定义模型遵循 [OpenAPI v3](https://spec.openapis.org/oas/v3.1.0)。设计目的在于提供一种灵活可扩展的数据存储和使用方式，便于为插件提供自定义数据支持。
比如某插件需要存储自定义数据，同时也想读取和操作自定义数据。更多细节请参考 [自定义模型设计](https://github.com/halo-dev/rfcs/tree/main/extension)。

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
    
    @Schema(requireMode = Schema.RequireMode.REQUIRED)
    private Spec spec;

    @Schema(name="PersonSpec")
    public static class Spec {
      @Schema(description = "The description on name field", maxLength = 100)
      private String name;

      @Schema(description = "The description on age field", maximum = "150", minimum = "0")
      private Integer age;

      @Schema(description = "The description on gender field")
      private Gender gender;

      private Person otherPerson;
    }

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

一个自定义模型通常包括以下几个部分：

- `apiVersion`: 用于标识自定义模型的 API 版本，它由 `GVK` 注解的 `group` 和 `version` 组合而成。
- `kind`: 用于标识自定义模型的类型，它由 `GVK` 注解的 `kind` 声明。
- `metadata`: 用于标识自定义模型的元数据：
  - `name`: 用于标识自定义模型的名称。
  - `creationTimestamp`: 用于标识自定义模型的创建时间，无法修改，只在创建时自动生成。
  - `version`: 用于标识自定义模型的数据乐观锁版本，无法修改，由更新时自动填充，如果更新时指定了 `version` 且与当前 `version` 不一致则会更新失败。
  - `deletionTimestamp`: 用于标识自定义模型的删除时间，表示此自定义模型对象被声明为删除，此时仍然可以通过 API 访问到此对象，参考 [自定义模型对象生命周期](../../basics/framework.md#extension-lifecycle)
  - `finalizers`: 用于标识终结器，它是一个字符串集合，用于标识自定义模型对象是否可回收，参考 [自定义模型对象生命周期](../../basics/framework.md#extension-lifecycle)
  - `labels`: 用于标识自定义模型的标签，它是一个字符串键值对集合，用于标识自定义模型对象的标签，可以通过标签来查询自定义模型对象。
  - `annotations`: 用于存放扩展信息，它是一个字符串键值对集合，用于存放自定义模型对象的扩展信息。
- `spec`: 用于声明自定义模型对象的期望状态，它是声明式的，用户只需要声明期望状态，实际状态由具体的控制器来维护，最终达到用户期望的状态。
- `status`: 用于描述自定义模型对象资源状态的变化，和一些实际状态。

其中 `apiVersion`、`kind`、`metadata`都包含在了 AbstractExtension 类中，所以我们只需要关注 `spec` 和 `status` 即可，参考：[Halo 架构概览之自定义模型](../../basics/framework.md#extension)

## 声明自定义模型对象 {#declare-extension-object}

有了自定义模型后可以通过在插件项目的 `src/main/resources/extensions` 目录下声明 `yaml` 文件来创建一个自定义模型对象，
此目录下的所有自定义模型 `yaml` 都会在插件启动后被创建：

```yaml
apiVersion: my-plugin.halo.run/v1alpha1
kind: Person
metadata:
  name: fake-person
spec:
  name: halo
  age: 18
  gender: male
```

在该目录下声明自定义模型对象所使用的 `yaml` 文件的文件名是任意的，只根据 `kind` 和 `apiVersion` 来确定自定义模型对象的类型。

## 命名规范 {#naming-conventions}

### metadata name {#metadata-name}

`metadata.name` 它是自定义模型对象的唯一标识名，包含不超过 253 个字符，仅包含小写字母、数字或`-`，以字母或数字开头，以字母或数字结尾。

### labels

`labels` 它是一个字符串键值对集合， Key 的基本结构为 `<prefix>/<name>`，完整的 label 键通常包括一个可选的前缀和名称，二者通过斜杠（/）分隔。

- 前缀（可选）：通常是域名的反向表示形式，用于避免键名冲突。例如，halo.run/post-slug
- 名称：标识 label 的具体含义，如 post-slug。

前缀规则：

- 如果 label 用于特定于一个组织的资源，建议使用一个前缀，如 `plugin.halo.run/plugin-name`。
- 前缀必须是一个有效的 DNS 子域名（参考 metadata.name），且最多可包含 253 个字符。
- 保留了不带前缀的 label 键以及特定前缀（如 halo.run），因此插件不可使用。

名称规则：

- 名称必须是合法的 DNS 标签，最多可包含 63 个字符。
- 必须以字母数字字符开头和结尾。
- 可以包含 `-`、`.`、`_` 和`字母数字`字符。

通用规范:

- 避免使用容易引起混淆或误解的键名。
- 尽量保持简洁明了，易于理解。
- 使用易于记忆和识别的单词或缩写。

一致性和清晰性:

- 在整个项目或组织中保持一致的命名约定。
- labels 应直观地反映其代表的信息或用途。
- 不要在 labels 中包含敏感信息，例如用户凭据或个人识别信息。

## 使用索引 {#using-indexes}

自定义模型虽然带来了很大的灵活性可扩展性，但也引入了查询问题，自定义模型对象存储在数据库中是 `byte[]` 的形式存在的，从而实现不依赖于数据库特性，你可以使用 `MySQL`，`PostgreSQL`，`H2` 等数据库来来作为存储介质，但查询自定义模型对象时无法使用数据库的索引特性，这就导致了查询自定义模型对象的效率问题，Halo 自己实现了一套索引机制来解决这个问题。

索引是一种存储数据结构，可提供对数据集中字段的高效查找。索引将自定义模型中的字段映射到数据库行，以便在查询特定字段时不需要完整的扫描。查询数据之前，必须对需要查询的字段创建索引。索引可以包含一个或多个字段的值。索引可以包含唯一值或重复值。索引中的值按照索引中的顺序进行排序。

索引可以提高查询性能，但会占用额外的存储空间，因为它们需要存储索引字段的副本。索引的大小取决于字段的数据类型和索引的类型，因此，创建索引时应该考虑存储成本和性能收益。

你可以通过以下方式在注册自定义模型时声明索引：

```java
@Override
public void start() {
  schemeManager.register(Moment.class, indexSpecs -> {
    indexSpecs.add(new IndexSpec()
      .setName("spec.tags")
      .setIndexFunc(multiValueAttribute(Moment.class, moment -> {
          var tags = moment.getSpec().getTags();
          return tags == null ? Set.of() : tags;
      }))
  );
  // more index spec
}
```

`IndexSpec` 用于声明索引项，它包含以下属性：

- name：索引名称，在同一个自定义模型的索引中必须唯一，一般建议使用字段路径作为索引名称，例如 `spec.slug`。
- order：对索引值的排序方式，支持 `ASC` 和 `DESC`，默认为 `ASC`。
- unique：是否唯一索引，如果为 `true` 则索引值必须唯一，如果创建自定义模型对象时检测到此索引字段有重复值则会创建失败。
- indexFunc：索引函数，用于获取索引值，接收当前自定义模型对象，返回一个索引值，索引值必须是字符串任意类型，如果不是字符串类型则需要自己转为字符串，可以使用 `IndexAttributeFactory` 提供的静态方法来创建 `indexFunc`：
  - `simpleAttribute()`：用于得到一个返回单个值的索引函数，例如 `moment -> moment.getSpec().getSlug()`。
  - `multiValueAttribute()`：用于得到一个返回多个值的索引函数，例如 `moment -> moment.getSpec().getTags()`。

当注册自定义模型时声明了索引后，Halo 会在插件启动时构建索引，在构建索引期间插件出于未启动状态。

Halo 默认会为每个自定义模型建立以下几个索引，因此不需要为下列字段再次声明索引：

- `metadata.name` 创建唯一索引
- `metadata.labels`
- `metadata.creationTimestamp`
- `metadata.deletionTimestamp`

创建了索引的字段可以在查询时使用 `fieldSelector` 参数来查询，参考 [自定义模型 APIs](#extension-apis)。

## 自定义模型 APIs {#extension-apis}

定义好自定义模型并注册后，会根据 `GVK` 注解自动生成一组 `CRUD` APIs，规则为：
`/apis/<group>/<version>/<extension>/{extensionname}/<subextension>`

对于上述 Person 自定义模型将有以下 APIs：

```shell
# 用于列出所有 Person 自定义模型对象
GET /apis/my-plugin.halo.run/v1alpha1/persons

# 用于查询指定名称更新自定义模型对象
PUT /apis/my-plugin.halo.run/v1alpha1/persons/{name}

# 用于创建自定义模型对象
POST /apis/my-plugin.halo.run/v1alpha1/persons

# 用于根据指定名称删除自定义模型对象
DELETE /apis/my-plugin.halo.run/v1alpha1/persons/{name}
```

对于这组自动生成的 `CRUD` APIs，你可以通过定义[控制器](../../basics/framework.md#controller)来完成对数据修改后的业务逻辑处理来满足大部分的场景需求。

`GET /apis/my-plugin.halo.run/v1alpha1/persons` 这个 API 用于查询自定义模型对象，它支持以下参数：

- page：页码，从 1 开始。
- size：每页数据量，如果不传此参数默认为查询所有。
- sort：排序字段，格式为 `字段名,排序方式`，例如 `name,desc`，如果不传此参数默认为按照 `metadata.creationTimestamp` 降序排序，排序使用的字段必须是注册为索引的字段。
- labelSelector：标签选择器，格式为 `key=value`，例如 `labelSelector=name=halo`，如果不传此参数默认为查询所有，此标签选择器筛选的是 `metadata.labels`，支持的操作符有 `=`、 `!=`、`!` 和 `存在检查`：
  - `=` 表示等于，例如 `labelSelector=name=halo` 表示查询 `metadata.labels` 中 `name` 的值等于 `halo` 的自定义模型对象。
  - `!=` 表示不等于，例如 `labelSelector=name!=halo` 表示查询 `metadata.labels` 中 `name` 的值不等于 `halo`的自定义模型对象。
  - `!` 表示不存在 key，例如 `labelSelector=!name` 表示查询 `metadata.labels` 不存在 `name` 这个 key 的自定义模型对象。
  - `存在检查` 表示查询存在 key 的对象，例如 `labelSelector=name` 表示查询 `metadata.labels` 存在 `name` 这个 key 的自定义模型对象。
- fieldSelector：字段选择器，格式与 `labelSelector` 类似，但需要确保对应的字段是注册为索引的字段，例如 `fieldSelector=spec.name=slug` 表示查询 `spec.slug` 的值等于 `halo` 的自定义模型对象，支持的操作符有 `=`、`!=` 和 `in`。
  - `=` 表示等于，例如 `fieldSelector=spec.slug=halo` 表示查询 `spec.slug` 的值等于 `halo` 的自定义模型对象。
  - `!=` 表示不等于，例如 `fieldSelector=spec.slug!=halo` 表示查询 `spec.slug` 的值不等于 `halo` 的自定义模型对象。
  - `in` 表示在集合中，例如 `fieldSelector=spec.slug=(halo,halo2)` 表示查询 `spec.slug` 的值在 `halo` 和 `halo2` 中的自定义模型对象。

这些查询参数是 `AND` 的关系，例如 `page=1&size=10&sort=name,desc&labelSelector=name=halo&fieldSelector=spec.slug=halo` 表示查询 `metadata.labels` 中 `name` 的值等于 `halo` 且 `spec.slug` 的值等于 `halo` 的自定义模型对象，并按照 `name` 字段降序排序，查询第 1 页，每页 10 条数据。

## 自定义 API

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

操作自定义模型对象的自定义 APIs 的路由规则建议遵循以下规则：

1. 以 `/apis/<group>/<version>/<plural>[/<resourceName>/<subresource>]` 规则组成 APIs。
2. 由于自动生成的 APIs 不能覆盖，因此通过不同的 group 来区分，自定义的 APIs 的 group 建议遵循以下规则：

- 在 Console 端使用的自定义 APIs 的 group 规则 `console.api.<group>`，例如对于 Person 自定义模型需要一个一个在 Console 端使用的自定义 API 的 group 为 `console.api.my-plugin.halo.run`。
- 在个人中心使用的自定义 APIs 的 group 规则 `uc.api.<group>`，例如 `uc.api.my-plugin.halo.run`。
- 为主题端提供的公开的自定义 APIs 的 group 规则 `api.<group>`，例如 `api.my-plugin.halo.run`。
