---
title: Todo List
description: 这个例子展示了如何开发 Todo List 插件
---

本示例用于展示如何从插件模板创建一个插件并写一个 Todo List：

首先通过模板仓库创建一个插件，例如叫 `halo-plugin-todolist`

## 配置你的插件

1. 修改 `build.gradle` 中的 `group` 为你自己的，如:

  ```groovy
  group = 'run.halo.tutorial'
  ```

2. 修改 `settings.gradle` 中的 `rootProject.name`

  ```groovy
  rootProject.name = 'halo-plugin-todolist'
  ```

3. 修改插件的描述文件 `plugin.yaml`，它位于 `src/main/resources/plugin.yaml`。示例：

  ```yaml
  apiVersion: plugin.halo.run/v1alpha1
  kind: Plugin
  metadata:
    name: todolist
  spec:
    enabled: true
    requires: ">=2.0.0"
    author:
      name: halo-dev
      website: https://halo.run
    logo: https://halo.run/logo
    homepage: https://github.com/guqing/halo-plugin-hello-world
    displayName: "插件 Todo List"
    description: "插件开发的 hello world，用于学习如何开发一个简单的 Halo 插件"
    license:
      - name: "MIT"
  ```

参考链接：

- [SemVer expression](https://github.com/zafarkhaja/jsemver#semver-expressions-api-ranges)
- [表单定义](../form-schema.md)

此时我们已经准备好了可以开发一个 TodoList 插件的一切，下面让我们正式进入 TodoList 插件开发教程。

## 运行插件

为了看到效果，首先我们需要让插件能最简单的运行起来。

1. 在 `src/main/java` 下创建包，如 `run.halo.tutorial`，在创建一个类 `TodoListPlugin`，它继承自 `BasePlugin` 类内容如下：

```java
package run.halo.tutorial;

import org.pf4j.PluginWrapper;
import org.springframework.stereotype.Component;
import run.halo.app.plugin.BasePlugin;

@Component
public class TodoListPlugin extends BasePlugin {
    public TodoListPlugin(PluginWrapper wrapper) {
        super(wrapper);
    }
}
```

`src/main/java` 下的文件结构如下：

```text
.
└── run
    └── halo
        └── tutorial
            └── TodoListPlugin.java
```

然后在项目目录执行命令

```shell
./gradlew build 
```

使用 `IntelliJ IDEA` 打开 Halo，参考 [Halo 开发环境运行](../core/run.md) 及 [插件入门](../hello-world.md) 配置插件的运行模式和路径：

```yaml
halo:
  plugin:
    runtime-mode: development
    fixed-plugin-path:
      # 配置为插件绝对路径
      - /Users/guqing/halo-plugin-todolist
```

启动 Halo，然后访问 `http://localhost:8090/console`

在插件列表将能看到插件已经被正确启用
![plugin-todolist-in-list-view](/img/todolist-in-list.png)

## 创建一个自定义模型

我们希望 TodoList 能够被持久化以避免重启后数据丢失，因此需要创建一个自定义模型来进行数据持久化。

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

然后在 `TodoListPlugin` 的 `start` 生命周期方法中注册此自定义模型到 Halo 中。

```diff
// ...
+ import run.halo.app.extension.SchemeManager;

@Component
public class TodoListPlugin extends BasePlugin {
+   private final SchemeManager schemeManager;

-    public TodoListPlugin(PluginWrapper wrapper) {
+    public TodoListPlugin(PluginWrapper wrapper, SchemeManager schemeManager) {
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

使用模板仓库创建的项目中与 `src` 目录同级有一个 `console` 目录，它即为用户界面的源码目录。

在实现用户界面前我们需要先修改 `console/vite.config.ts` 中的 `pluginName` 为 `plugin.yaml` 中的 `metadata.name`，它用来标识此用户界面所属于插件名 pluginName 标识的插件，以便 Halo 加载 console 目录打包产生的文件。

修改完成后执行

```groovy
./gradlew build 
```

修改前端项目不需要重启 Halo，只需要 build 然后刷新页面，此时能看到多出来一个菜单项：

![hello-world-in-plugin-list](/img/plugin-hello-world.png)

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
-       path: "/example",
+       path: "/todos", // TodoList 的路由 path
        children: [
          {
            path: "",
-            name: "Example",
+            name: "TodoList",// 菜单标识名
            component: DefaultView,
            meta: {
-              permissions: ["plugin:apples:view"],
-              title: "示例页面",
+              title: "Todo List",//菜单页的浏览器 tab 标题
              searchable: true,
              menu: {
-               name: "示例页面",
+               name: "Todo List",// TODO 菜单显示名称
-               group: "示例分组",
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

为了符合最佳实践，将用 TypeScript 改造之前的 todomvc 示例：

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

至此，我们完成了从零开始创建一个 TodoList 插件的所有步骤，希望可以帮助你对 Halo 的插件开发有一个整体的了解。
