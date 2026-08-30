---
title: Todo List
description: 这个例子展示了如何开发 Todo List 插件
---

本示例用于展示如何从插件模板创建一个插件并写一个 Todo List：

首先参考 [入门 - 创建插件项目](../hello-world.md#创建插件项目) 文档创建一个新的插件项目并运行。

如果能在插件列表中看到插件已经被正确启用，则说明插件已经运行成功。

![plugin-todolist-in-list-view](/img/todolist-in-list.png)

## 创建一个自定义模型

我们希望 TodoList 能够被持久化以避免重启后数据丢失，因此需要创建一个自定义模型来进行数据持久化。

首先创建一个 `class` 名为 `Todo` 并写入如下内容：

```java
package com.example.tutorial;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import run.halo.app.extension.AbstractExtension;
import run.halo.app.extension.GVK;

@Data
@EqualsAndHashCode(callSuper = true)
@GVK(kind = "Todo", group = "todo.plugin.halo.run",
    version = "v1alpha1", singular = "todo", plural = "todos")
public class Todo extends AbstractExtension {

    @Schema(requiredMode = REQUIRED)
    private TodoSpec spec;

    @Data
    public static class TodoSpec {

        @Schema(requiredMode = REQUIRED, minLength = 1)
        private String title;

        @Schema(defaultValue = "false")
        private Boolean done;
    }
}
```

然后在 `TodoListPlugin` 的 `start` 生命周期方法中注册此自定义模型到 Halo 中。

```diff
// ...
+ import run.halo.app.extension.SchemeManager;

@Component
public class TodoListPlugin extends BasePlugin {
+   private final SchemeManager schemeManager;

-    public TodoListPlugin(PluginContext pluginContext) {
+    public TodoListPlugin(PluginContext pluginContext, SchemeManager schemeManager) {
        super(pluginContext);
+       this.schemeManager = schemeManager;
    }

    @Override
    public void start() {
+       // 插件启动时注册自定义模型
+       schemeManager.register(Todo.class);
        System.out.println("Hello world 插件启动了!");
    }

     @Override
    public void stop() {
+      // 插件停用时取消注册自定义模型
+      Scheme todoScheme = schemeManager.get(Todo.class);
+      schemeManager.unregister(todoScheme);
      System.out.println("Hello world 被停止!");
    }
    // ....
}
```

然后 build 项目，重启 Halo，访问 `http://localhost:8090/swagger-ui.html`，
可以找到如下 Todo APIs：

![hello world plugin swagger api for toto](/img/halo-plugin-hello-world-todo-swagger-api.png)

由于所有以 `/api` 和 `/apis` 开头的 APIs 都需要认证才能访问，因此先在 Swagger UI 界面顶部点击 `Authorize` 认证，然后尝试访问
`GET /apis/todo.plugin.halo.run/v1alpha1/todos` 可以看到如下结果：

```json
{
  "page": 0,
  "size": 0,
  "total": 0,
  "items": [],
  "first": true,
  "last": true,
  "hasNext": false,
  "hasPrevious": false,
  "totalPages": 1
}
```

至此我们完成了一个自定义模型的创建和使用插件生命周期方法实现了自定义模型的注册和删除，下一步我们将编写用户界面，使用这些 APIs 完成 TodoList 功能。

## 编写用户界面

### 目标

我们希望实现如下的用户界面：

- 在左侧菜单添加一个名为 `Todo List` 的菜单项，它属于一个`工具`的组。
- 内容页为一个简单的 Todo List，它实现以下功能：
  - 添加 `Todo item`
  - 将一个 `Todo item` 标记为完成，也可以取消完成状态
  - 列表有三个 `Tab` 可供切换，用于过滤数据展示

![todo user interface](/img/todo-ui.png)

### 实现

使用模板仓库创建的项目中与 `src` 目录同级有一个 `ui` 目录，它即为用户界面的源码目录。

打开 `ui/src/index.ts` 文件，修改如下：

```diff
export default definePlugin({
  components: {},
  routes: [
    {
      parentName: "Root",
      route: {
-       path: "/example",
+       path: "/todos", // TodoList 的路由 path
-       name: "Example",
+       name: "TodoList",// 菜单标识名
        component: HomeView,
        meta: {
-         title: "示例页面",
+         title: "Todo List",//菜单页的浏览器 tab 标题
          searchable: true,
          menu: {
-           name: "示例页面",
+           name: "Todo List",// TODO 菜单显示名称
-           group: "示例分组",
=           group: "工具",// 所在组名
            icon: markRaw(IconPlug),
            priority: 0,
          },
        },
      },
    },
  ],
  extensionPoints: {},
});
```

完成此步骤后 Console 左侧菜单多了一个名 `工具` 的组，其下有 `Todo List`，浏览器标签页名称也是 `Todo List`。

接来下我们需要在右侧内容区域实现 [目标](#目标) 中图示的 Todo 样式，为了快速上手，我们使用 [todomvc](https://todomvc.com/examples/vue/) 提供的 Vue 标准实现。
编辑 `ui/src/views/HomeView.vue` 文件，清空它的内容，并拷贝 [examples/#todomvc](https://vuejs.org/examples/#todomvc) 的所有代码粘贴到此文件中，并执行以下步骤：

1. `cd ui` 切换到 `ui` 目录。
2. ` pnpm install todomvc-app-css `。
3. 修改 `ui/src/views/HomeView.vue` 最底部的 `style` 标签。

   ```vue
   - <style>
   + <style scoped>
   -  @import "https://unpkg.com/todomvc-app-css@2.4.1/index.css";
   +  @import "todomvc-app-css/index.css";
     </style>
   ```

4. 重新 Build 后刷新页面，便能看到目标图所示效果。

通过以上步骤就实现了一个 Todo List 的用户界面功能，但 `Todo` 数据只是被临时存放到了 `LocalStorage` 中，下一步我们将通过自定义模型生成的 APIs 来让用户界面与服务端交互。

### 与服务端数据交互

自定义模型已经由 Halo 暴露为 CRUD API。不要在 UI 中手写 `Metadata`、`TodoList`、请求参数和接口路径；应通过插件的 OpenAPI 文档生成 TypeScript 类型与 API 类。

#### 配置并生成 API Client

在项目已有的 `haloPlugin` 配置中添加 OpenAPI 分组和生成目录：

```groovy title="build.gradle"
haloPlugin {
  openApi {
    groupingRules {
      todoApi {
        displayName = "Extension API for Todo Plugin"
        pathsToMatch = ["/apis/todo.plugin.halo.run/v1alpha1/**"]
      }
    }
    groupedApiMappings = [
      "/v3/api-docs/todoApi": "todoApi.json"
    ]
    generator {
      outputDir = file("${projectDir}/ui/src/api/generated")
    }
  }
}
```

完整配置和任务行为参考[开发工具 > 生成 API client](../basics/devtools.md#how-to-generate-api-client)。执行：

```shell
./gradlew generateApiClient
```

生成目录由任务维护，不要手动修改。模型或接口变化时，应修改 Java 源码后重新运行任务。

#### 创建 API Client 实例

创建 `ui/src/api/index.ts`，让生成的 API 类复用 Halo 已配置认证和统一错误处理的 `axiosInstance`：

```ts title="ui/src/api/index.ts"
import { axiosInstance } from "@halo-dev/api-client"
import { TodoV1alpha1Api } from "./generated"

const todoCoreApiClient = {
  todo: new TodoV1alpha1Api(undefined, "", axiosInstance),
}

export { todoCoreApiClient }
```

#### 替换 LocalStorage 数据逻辑

删除 TodoMVC 示例中读写 LocalStorage 的代码，在 `HomeView.vue` 的 `<script setup>` 中使用生成的类型和方法：

```vue
<script setup lang="ts">
import { todoCoreApiClient } from "@/api";
import type { Todo, TodoList } from "@/api/generated";
import { computed, onMounted, ref } from "vue";

interface Tab {
  label: string;
}

const tabs: Tab[] = [
  { label: "All" },
  { label: "Active" },
  { label: "Completed" },
];

const activeTab = ref("All");
const title = ref("");
const selectedTodo = ref<Todo>();
const todos = ref<TodoList>({
  page: 1,
  size: 20,
  total: 0,
  items: [],
  first: true,
  last: true,
  hasNext: false,
  hasPrevious: false,
  totalPages: 0,
});

function filterByDone(done: boolean) {
  return todos.value.items.filter((todo) => todo.spec.done === done);
}

const todoList = computed(() => {
  if (activeTab.value === "Active") {
    return filterByDone(false);
  }
  if (activeTab.value === "Completed") {
    return filterByDone(true);
  }
  return todos.value.items;
});

async function handleFetchTodos() {
  const { data } = await todoCoreApiClient.todo.listTodo({
    page: 1,
    size: 20,
  });
  todos.value = data;
}

async function handleCreate() {
  const todoTitle = title.value.trim();
  if (!todoTitle) {
    return;
  }

  await todoCoreApiClient.todo.createTodo({
    todo: {
      apiVersion: "todo.plugin.halo.run/v1alpha1",
      kind: "Todo",
      metadata: {
        generateName: "todo-",
      },
      spec: {
        title: todoTitle,
        done: false,
      },
    },
  });

  title.value = "";
  await handleFetchTodos();
}

async function handleUpdate() {
  const todo = selectedTodo.value;
  const name = todo?.metadata.name;
  if (!todo || !name) {
    return;
  }

  await todoCoreApiClient.todo.updateTodo({ name, todo });
  selectedTodo.value = undefined;
  await handleFetchTodos();
}

async function handleDoneChange(todo: Todo) {
  const name = todo.metadata.name;
  if (!name) {
    return;
  }

  await todoCoreApiClient.todo.updateTodo({
    name,
    todo: {
      ...todo,
      spec: {
        ...todo.spec,
        done: !todo.spec.done,
      },
    },
  });
  await handleFetchTodos();
}

async function handleDelete(todo: Todo, refresh = true) {
  const name = todo.metadata.name;
  if (!name) {
    return;
  }

  await todoCoreApiClient.todo.deleteTodo({ name });
  if (refresh) {
    await handleFetchTodos();
  }
}

async function handleClearCompleted() {
  await Promise.all(filterByDone(true).map((todo) => handleDelete(todo, false)));
  await handleFetchTodos();
}

onMounted(handleFetchTodos);
</script>
```

模板继续沿用上一节的 TodoMVC 结构，但列表键和清理操作应改为稳定的资源名称和单次刷新：

```diff
- <li v-for="(todo, index) in todoList" :key="index">
+ <li v-for="todo in todoList" :key="todo.metadata.name">

- <li v-for="(tab, index) in tabs" :key="index">
+ <li v-for="tab in tabs" :key="tab.label">

- @click="() => filterByDone(true).map((todo) => handleDelete(todo))"
+ @click="handleClearCompleted"
```

此示例只有一个轻量的 Todo 文本输入，因此保留 TodoMVC 的原生控件。包含多个字段、校验或提交状态的插件页面和弹窗应使用[插件设置与表单组件](../basics/ui/forms.md)中介绍的 FormKit。

至此，UI 使用生成的类型和 API 方法完成了 Todo 数据交互；接口路径、参数和响应类型会随服务端 OpenAPI 契约一起更新。
### 用户界面使用静态资源

如果你想在用户界面中使用图片，你可以放到 `ui/src/assets` 中，例如 `logo.svg`，并将其作为 Todo 的 Logo 放到标题旁边。

需要修改 `ui/src/views/HomeView.vue` 示例如下：

```vue
// [!code ++]
import Logo from "@/assets/logo.svg";
// ...
<template>
  <section class="todoapp">
    <header class="header">
      <h1>
// [!code ++]
        <img :src="Logo" alt="logo" style="display: inline; width: 64px" />
        todos
      </h1>
//...
```

至此，我们完成了从零开始创建一个 TodoList 插件的所有步骤，希望可以帮助你对 Halo 的插件开发有一个整体的了解。
