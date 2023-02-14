---
title: 自定义模型
description: 了解什么是自定义模型及如何创建
---

Halo 自定义模型主要参考自 [Kubernetes CRD](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/) 。自定义模型遵循 [OpenAPI v3](https://spec.openapis.org/oas/v3.1.0)。设计目的在于为插件提供自定义数据支持。比如某插件需要存储自定义数据，同时也想读取和操作自定义数据。

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

1. 创建一个类继承 `AbstractExtension`。
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

有了自定义模型后可以通过在插件项目的 `src/main/resources/extensions` 目录下声明 `yaml` 文件来创建一个实例，此目录下的所有自定义模型 `yaml` 都会在插件启动时被创建：

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
  - group：表示一组公开的资源，通常采用域名形式，Halo 项目保留使用空组和任何以“*.halo.run”结尾的组名供其单独使用。
  选择群组名称时，我们建议选择你的群组或组织拥有的子域，例如“widget.mycompany.com”。
  - version：API 的版本，它与 group 组合使用为 apiVersion=“GROUP/VERSION”，例如“api.halo.run/v1alpha1”。
  - singular: 资源的单数名称，这允许客户端不透明地处理复数和单数，必须全部小写。通常为小写的“kind”。
  - plural： 资源的复数名称，自定义资源在 `/apis/<group>/<version>/.../<plural>` 下提供，必须为全部小写。
- @Schema：属性校验注解，会在创建/修改资源前对资源校验，参考 [schema-validator](https://www.openapi4j.org/schema-validator.html)。
:::

### 自定义模型 API

定义好自定义模型并注册后，会根据 `GVK` 注解自动生成一组 `CRUD` API，规则为：
`/apis/<group>/<version>/<extension>/{extensionname}/<subextension>`

对于上述 Person 自定义模型将有以下 APIs：

```text
GET /apis/my-plugin.halo.run/v1alpha1/persons
PUT /apis/my-plugin.halo.run/v1alpha1/persons/{name}
POST /apis/my-plugin.halo.run/v1alpha1/persons
DELETE /apis/my-plugin.halo.run/v1alpha1/persons/{name}
```

### 自定义 API

在一些场景下，只有自动生成的 `CRUD` API 往往是不够用的，此时可以通过自定义一些 API 来满足功能。

你可以使用 `SpringBoot` 的控制器写法来暴露 API，不同的是需要添加 `@ApiVersion` 注解，没有此注解的 `Controller` 将被忽略：

```java
@ApiVersion("v1alpha1")
@RequestMapping("/apples")
@RestController
public class AppleController {

    @PostMapping("/starting")
    public void starting() {
    }
}
```

当插件被启动时，Halo 将会为此 AppleController 生成统一路径的 API。API 前缀组成规则如下：

```text
/apis/plugin.api.halo.run/{version}/plugins/{plugin-name}/**
```

示例：

```text
/apis/plugin.api.halo.run/v1alpha1/plugins/my-plugin/apples/starting
```
