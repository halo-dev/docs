---
title: Todo List
description: 这个例子展示了如何开发 Todo List 插件
---

本章节我们通过一个 TodoList 示例来更近一步了解 Halo 的插件开发。

## 创建一个自定义模型

首先我们希望 TODOList 能够被持久化以避免重启后数据丢失，Halo 提供了一种[自定义模型机制](https://github.com/halo-dev/rfcs/tree/main/extension)
自定义模型允许你只需要创建一个资源类别即可获得一组 CRUD APIs。

首先创建一个 `class` 名为 `Todo` 并写入如下内容：

```java
package run.halo.tutorial;

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

然后在 `HelloWorldPlugin` 的 `start` 生命周期方法中注册此自定义模型到 Halo 中。

```diff
// ...
+ import run.halo.app.extension.SchemeManager;

@Component
public class HelloWorldPlugin extends BasePlugin {
+   private final SchemeManager schemeManager;

-    public HelloWorldPlugin(PluginWrapper wrapper) {
+    public HelloWorldPlugin(PluginWrapper wrapper, SchemeManager schemeManager) {
        super(wrapper);
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

然后 build 项目，重启 Halo，访问 `http://localhost:8090/webjars/swagger-ui/index.html`，
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

至此我们完成了一个自定义模型的创建和使用插件生命周期方法实现了自定义模型的注册和删除，下一步我们将编写用户界面使用这些 APIs 完成 TodoList 功能。

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

使用模板仓库创建的项目中与 `src` 目录同级有一个 `console` 目录，它即为用户界面的源码目录。

在实现用户界面前我们需要先修改 `console/vite.config.ts` 中的 `pluginName` 为 `plugin.yaml` 中的 `metadata.name`，它用来标识此用户界面所属于插件名 pluginName 标识的插件，以便 Halo 加载 console 目录打包产生的文件。

修改完成后执行

```groovy
./gradlew build 
```

修改前端项目不需要重启 Halo，只需要 build 然后刷新页面，此时能看到多出来一个菜单项：

![starter-ui-example](/img/starter-ui-example.png)

而我们需要实现的目标中也需要一个菜单项，所以直接修改它即可。

打开 `console/src/index.ts` 文件，修改如下：

```diff
export default definePlugin({
-  name: "PluginStarter",
+  name: "plugin-hello-world",
  components: [],
  routes: [
    {
      parentName: "Root",
      route: {
-       path: "/hello-world",
+       path: "/todos", // TodoList 的路由 path
        children: [
          {
            path: "",
-            name: "HelloWorld",
+            name: "TodoList",// 菜单标识名
            component: DefaultView,
            meta: {
-              permissions: ["plugin:apples:view"],
-              title: "HelloWorld",
+              title: "Todo List",//菜单页的浏览器 tab 标题
              searchable: true,
              menu: {
-               name: "迁移",
+               name: "Todo List",// TODO 菜单显示名称
-               group: "From PluginStarter",
=               group: "工具",// 所在组名
                icon: markRaw(IconGrid),
                priority: 0,
              },
            },
          },
        ],
      },
    },
  ],
  extensionPoints: {},
  activated() {},
  deactivated() {},
});
```

配置好之后还是一样重新 Build:

```groovy
./gradlew build 
```

完成此步骤后 Console 左侧菜单多了一个名 `工具` 的组，其下有 `Todo List`，浏览器标签页名称也是 `Todo List`。

接来下我们需要在右侧内容区域实现 [目标](#目标) 中图示的 Todo 样式，为了快速上手，我们使用 [todomvc](https://todomvc.com/examples/vue/) 提供的 Vue 标准实现。
编辑 `console/src/views/DefaultView.vue` 文件，清空它的内容，并拷贝 [examples/#todomvc](https://vuejs.org/examples/#todomvc) 的所有代码粘贴到此文件中，并执行以下步骤：

1. `cd console` 切换到 `console` 目录。
2. ` pnpm install todomvc-app-css `。
3. 修改 `console/src/views/DefaultView.vue` 最底部的 `style` 标签。

```diff
- <style>
+ <style scoped>
-  @import "https://unpkg.com/todomvc-app-css@2.4.1/index.css";
+  @import "todomvc-app-css/index.css";
  </style>
```

4. 重新 Build 后刷新页面，便能看到目标图所示效果。

通过以上步骤就实现了一个 Todo List 的用户界面功能，但 `Todo` 数据只是被临时存放到了 `LocalStorage` 中，下一步我们将通过自定义模型生成的 APIs 来让用户界面与服务端交互。

### 与服务端数据交互

本章节我们将通过使用 `Axios` 来完成与插件后端 APIs 进行数据交互，文档参考 [axios-http](https://axios-http.com/docs)。

首先需要安装 `Axios`， 在 console 目录下执行命令：

```shell
pnpm install axios
```

为了更好的看懂代码，将用 TypeScript 改造之前的 todomvc 示例：

1. 创建 types 文件 `console/src/types/index.ts`

```typescript
export interface Metadata {
  name: string;
  labels?: {
    [key: string]: string;
  } | null;
  annotations?: {
    [key: string]: string;
  } | null;
  version?: number | null;
  creationTimestamp?: string | null;
  deletionTimestamp?: string | null;
}

export interface TodoSpec {
  title: string;
  done?: boolean;
}

/**
 * 与自定义模型 Todo 对应
 */
export interface Todo {
  spec: TodoSpec;
  apiVersion: "todo.plugin.halo.run/v1alpha1"; // apiVersion=自定义模型的 group/version
  kind: "Todo"; // Todo 自定义模型中 @GVK 注解中的 kind
  metadata: Metadata;
}

/**
 * Todo 自定义模型生成 list API 所对应的类型
 */
export interface TodoList {
  page: number;
  size: number;
  total: number;
  items: Array<Todo>;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  totalPages: number;
}
```

编辑 `console/src/views/DefaultView.vue` 文件，将所有内容替换为如下写法：

```typescript
<script setup lang="ts">
import axios from "axios";
import type { Todo, TodoList } from "../types";
import { computed, onMounted, ref } from "vue";

const http = axios.create({
  baseURL: "/",
  timeout: 1000,
});

interface Tab {
  label: string;
}

const todos = ref<TodoList>({
  page: 1,
  size: 20,
  total: 0,
  items: [],
  first: true,
  last: false,
  hasNext: false,
  hasPrevious: false,
  totalPages: 0,
});

const tabs = [
  {
    label: "All",
  },
  {
    label: "Active",
  },
  {
    label: "Completed",
  },
];

const activeTab = ref("All");

/**
 * 列表展示的数据
 */
const todoList = computed(() => {
  if (activeTab.value === "All") {
    return todos.value.items;
  }
  if (activeTab.value === "Active") {
    return filterByDone(false);
  }
  if (activeTab.value === "Completed") {
    return filterByDone(true);
  }
  return [];
});

const filterByDone = (done: boolean) => {
  return todos.value.items.filter((todo) => todo.spec.done === done);
};

// 查看 http://localhost:8090/swagger-ui.html
function handleFetchTodos() {
  http
    .get<TodoList>("/apis/todo.plugin.halo.run/v1alpha1/todos")
    .then((response) => {
      todos.value = response.data;
    });
}

onMounted(handleFetchTodos);

// 创建的逻辑

const title = ref("");

function handleCreate(e: Event) {
  http
    .post<Todo>("/apis/todo.plugin.halo.run/v1alpha1/todos", {
      metadata: {
        // 根据 'todo-' 前缀自动生成 todo 的名称作为唯一标识，可以理解为数据库自动生成主键 id
        generateName: "todo-",
      },
      spec: {
        title: title.value,
        done: false,
      },
      kind: "Todo",
      apiVersion: "todo.plugin.halo.run/v1alpha1",
    })
    .then((response) => {
      title.value = "";
      handleFetchTodos();
    });
}

// 更新的逻辑
const selectedTodo = ref<Todo | undefined>();
const handleUpdate = () => {
  http
    .put<Todo>(
      `/apis/todo.plugin.halo.run/v1alpha1/todos/${selectedTodo.value?.metadata.name}`,
      selectedTodo.value
    )
    .then((response) => {
      handleFetchTodos();
    });
};

function handleDoneChange(todo: Todo) {
  todo.spec.done = !todo.spec.done;
  http
    .put<Todo>(
      `/apis/todo.plugin.halo.run/v1alpha1/todos/${todo.metadata.name}`,
      todo
    )
    .then((response) => {
      handleFetchTodos();
    });
}

// 删除
const handleDelete = (todo: Todo) => {
  http
    .delete(`/apis/todo.plugin.halo.run/v1alpha1/todos/${todo.metadata.name}`)
    .then((response) => {
      handleFetchTodos();
    });
};
</script>

<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        autofocus
        v-model="title"
        placeholder="What needs to be done?"
        @keyup.enter="handleCreate"
      />
    </header>
    <section class="main" v-show="todos.items.length">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        :checked="filterByDone(false).length > 0"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          v-for="(todo, index) in todoList"
          class="todo"
          :key="index"
          :class="{ completed: todo.spec.done, editing: todo === selectedTodo }"
        >
          <div class="view">
            <input
              class="toggle"
              type="checkbox"
              :checked="todo.spec.done"
              @click="handleDoneChange(todo)"
            />
            <label @dblclick="selectedTodo = todo">{{ todo.spec.title }}</label>
            <button class="destroy" @click="handleDelete(todo)"></button>
          </div>
          <input
            v-if="selectedTodo"
            class="edit"
            type="text"
            v-model="selectedTodo.spec.title"
            @vnode-mounted="({ el }) => el.focus()"
            @blur="handleUpdate()"
            @keyup.enter="handleUpdate()"
            @keyup.escape="selectedTodo = undefined"
          />
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="todos.total">
      <span class="todo-count">
        <strong>{{ filterByDone(false).length }}</strong>
        <span>
          {{ filterByDone(false).length === 1 ? " item" : " items" }} left</span
        >
      </span>
      <ul class="filters">
        <li v-for="(tab, index) in tabs" :key="index">
          <a
            href="javascript:void(0);"
            @click="activeTab = tab.label"
            :class="{ selected: activeTab === tab.label }"
          >
            {{ tab.label }}
          </a>
        </li>
      </ul>
      <button
        class="clear-completed"
        @click="() => filterByDone(true).map((todo) => handleDelete(todo))"
        v-show="todos.items.length > filterByDone(false).length"
      >
        Clear completed
      </button>
    </footer>
  </section>
</template>

<style scoped>
@import "todomvc-app-css/index.css";
</style>
```

这在原先的基础上替换为了 `TypeScipt` 写法，并去除了数据保存到 `LocalStorage` 的逻辑，这也是我们推荐的方式，可读性更强，且有 `TypeScript` 提供类型提示。

至此我们就完成了与插件后端 APIs 实现 Todo List 数据交互的部分。

### 使用 Icon

目前 Todo 的菜单还是默认的网格样式 Icon，在 `console/src/index.ts` 文件中配置有一个 `icon: markRaw(IconGrid)`。以此为例说明该如何使用其他 `Icon`。

1. 安装 [unplugin-icons](https://github.com/antfu/unplugin-icons)。

```shell
pnpm install -D unplugin-icons
pnpm install -D @iconify/json
pnpm install -D @vue/compiler-sfc
```

2. 编辑 `console/vite.config.ts`，在 `defineConfig` 的 `plugins` 中添加配置，修改如下。

```diff
+ import Icons from "unplugin-icons/vite";

// https://vitejs.dev/config/
export default defineConfig({
-  plugins: [vue(), vueJsx()],
+  plugins: [vue(), vueJsx(), Icons({ compiler: "vue3" })],
```

3. 在 `console/tsconfig.app.json` 中加入 `unplugni-icons` 的 `types` 配置。

```diff
{
  // ...
  "compilerOptions": {
    // ...
    "paths": {
      "@/*": ["./src/*"]
-    }
+    },
+    "types": ["unplugin-icons/types/vue"]
  }
}
```

4. 到 [icones](https://icones.js.org/) 搜索你想要使用的图标，并点击它，然后选择 `Unplugin Icons`，会复制到剪贴板。

![unplugin icons selector](/img/unplugin-icons-example.png)

5. 编辑 `console/src/index.ts` 在 `import` 区域粘贴，并 `icon` 属性。

```diff
- import { IconGrid } from "@halo-dev/components";
+ import VscodeIconsFileTypeLightTodo from "~icons/vscode-icons/file-type-light-todo";

export default definePlugin({
  routes: [
    {
     // ...
      route: {
        path: "/todos",
        children: [
          {
            // ...
            meta: {
              // ...
              menu: {
                // ...
-               icon: markRaw(IconGrid),
+               icon: markRaw(VscodeIconsFileTypeLightTodo),
                priority: 0,
              },
            },
          },
        ],
      },
    },
  ],
  // ...
});
```

### 用户界面使用静态资源

如果你想在用户界面中使用图片，你可以放到 `console/src/assets` 中，例如 `logo.png`，并将其作为 Todo 的 Logo 放到标题旁边

![todo logo example](/img/todo-logo-check-48.png)

需要修改 `console/src/views/DefaultView.vue` 示例如下：

```diff
+ import Logo from "../assets/logo.png";
// ...
<template>
  <section class="todoapp">
    <header class="header">
      <h1>
+        <img :src="Logo" alt="logo" style="display: inline; width: 64px" />
        todos
      </h1>
//...
```
