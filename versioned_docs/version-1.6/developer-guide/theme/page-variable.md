---
title: 页面变量
description: 每个页面所返回的变量
---

## 首页（index.ftl）

访问路径：`http://yourdomain`

### posts（List）

#### 语法

```html
<#list posts.content as post>
// do something
</#list>
```

#### 参数

```json
[{
    "content": [{
        "categories": [{
            "createTime": "2020-10-13T13:23:39.143Z",
            "description": "string",
            "fullPath": "string",
            "id": 0,
            "name": "string",
            "parentId": 0,
            "slug": "string",
            "thumbnail": "string"
        }],
        "commentCount": 0,
        "createTime": "2020-10-13T13:23:39.143Z",
        "disallowComment": true,
        "editTime": "2020-10-13T13:23:39.143Z",
        "editorType": "MARKDOWN",
        "fullPath": "string",
        "id": 0,
        "likes": 0,
        "metaDescription": "string",
        "metaKeywords": "string",
        "metas": {},
        "password": "string",
        "slug": "string",
        "status": "PUBLISHED",
        "summary": "string",
        "tags": [{
            "createTime": "2020-10-13T13:23:39.143Z",
            "fullPath": "string",
            "id": 0,
            "name": "string",
            "slug": "string",
            "thumbnail": "string"
        }],
        "template": "string",
        "thumbnail": "string",
        "title": "string",
        "topPriority": 0,
        "topped": true,
        "updateTime": "2020-10-13T13:23:39.143Z",
        "visits": 0,
        "wordCount": 0
    }],
    "empty": true,
    "first": true,
    "last": true,
    "number": 0,
    "numberOfElements": 0,
    "pageable": {
        "page": 0,
        "size": 0,
        "sort": [
            "string"
        ]
    },
    "size": 0,
    "sort": {
        "sort": [
            "string"
        ]
    },
    "totalElements": 0,
    "totalPages": 0
}]
```

#### 示例

遍历输出首页的文章：

```html
<#list posts.content as post>
    <a href="${post.fullPath!}">${post.title!}</a>
</#list>
```

输出：

```html
<a href="http://localhost:8090/archives/url1">title1</a>
<a href="http://localhost:8090/archives/url2">title2</a>
<a href="http://localhost:8090/archives/url3">title3</a>
```

## 文章页面（post.ftl）

访问路径不固定，视固定链接配置而定，目前可以配置的有：

- `http://yourdomain/archives/{slug}`（默认）
- `http://yourdomain/1970/01/{slug}`
- `http://yourdomain/1970/01/01/{slug}`
- `http://yourdomain/?p={id}`
- `http://yourdomain/archives/{id}`

### post（Object）

#### 语法

```html
${post.attribute}
```

注：attribute 代表具体属性。

#### 参数

```json
{
  "categories": [
    {
      "createTime": "2021-02-25T13:15:58.589Z",
      "description": "string",
      "fullPath": "string",
      "id": 0,
      "name": "string",
      "parentId": 0,
      "password": "string",
      "slug": "string",
      "thumbnail": "string"
    }
  ],
  "categoryIds": [
    0
  ],
  "commentCount": 0,
  "createTime": "2021-02-25T13:15:58.589Z",
  "disallowComment": true,
  "editTime": "2021-02-25T13:15:58.589Z",
  "editorType": "MARKDOWN",
  "formatContent": "string",
  "fullPath": "string",
  "id": 0,
  "likes": 0,
  "metaDescription": "string",
  "metaIds": [
    0
  ],
  "metaKeywords": "string",
  "metas": [
    {
      "createTime": "2021-02-25T13:15:58.589Z",
      "id": 0,
      "key": "string",
      "postId": 0,
      "value": "string"
    }
  ],
  "originalContent": "string",
  "password": "string",
  "slug": "string",
  "status": "DRAFT",
  "summary": "string",
  "tagIds": [
    0
  ],
  "tags": [
    {
      "createTime": "2021-02-25T13:15:58.589Z",
      "fullPath": "string",
      "id": 0,
      "name": "string",
      "slug": "string",
      "thumbnail": "string"
    }
  ],
  "template": "string",
  "thumbnail": "string",
  "title": "string",
  "topPriority": 0,
  "topped": true,
  "updateTime": "2021-02-25T13:15:58.589Z",
  "visits": 0,
  "wordCount": 0
}
```

#### 示例

获取文章标题：

```html
<span>${post.title!}</span>
```

输出：

```html
<span>示例文章</span>
```

### prevPost（Object）

#### 语法

```html
${prevPost.attribute}
```

注：attribute 代表具体属性。

#### 参数

```json
{
  "categories": [
    {
      "createTime": "2021-02-25T13:15:58.589Z",
      "description": "string",
      "fullPath": "string",
      "id": 0,
      "name": "string",
      "parentId": 0,
      "password": "string",
      "slug": "string",
      "thumbnail": "string"
    }
  ],
  "categoryIds": [
    0
  ],
  "commentCount": 0,
  "createTime": "2021-02-25T13:15:58.589Z",
  "disallowComment": true,
  "editTime": "2021-02-25T13:15:58.589Z",
  "editorType": "MARKDOWN",
  "formatContent": "string",
  "fullPath": "string",
  "id": 0,
  "likes": 0,
  "metaDescription": "string",
  "metaIds": [
    0
  ],
  "metaKeywords": "string",
  "metas": [
    {
      "createTime": "2021-02-25T13:15:58.589Z",
      "id": 0,
      "key": "string",
      "postId": 0,
      "value": "string"
    }
  ],
  "originalContent": "string",
  "password": "string",
  "slug": "string",
  "status": "DRAFT",
  "summary": "string",
  "tagIds": [
    0
  ],
  "tags": [
    {
      "createTime": "2021-02-25T13:15:58.589Z",
      "fullPath": "string",
      "id": 0,
      "name": "string",
      "slug": "string",
      "thumbnail": "string"
    }
  ],
  "template": "string",
  "thumbnail": "string",
  "title": "string",
  "topPriority": 0,
  "topped": true,
  "updateTime": "2021-02-25T13:15:58.589Z",
  "visits": 0,
  "wordCount": 0
}
```

#### 示例

获取上一篇文章的信息：

```html
<#if prevPost??>
    <a href="${prevPost.fullPath!}">上一篇：${prevPost.title!}</a>
</#if>
```

输出：

```html
<a href="http://localhost:8090/archives/url1">上一篇：title1</a>
```

### nextPost（Object）

#### 语法

```html
${nextPost.attribute}
```

注：attribute 代表具体属性。

#### 参数

```json
{
  "categories": [
    {
      "createTime": "2021-02-25T13:15:58.589Z",
      "description": "string",
      "fullPath": "string",
      "id": 0,
      "name": "string",
      "parentId": 0,
      "password": "string",
      "slug": "string",
      "thumbnail": "string"
    }
  ],
  "categoryIds": [
    0
  ],
  "commentCount": 0,
  "createTime": "2021-02-25T13:15:58.589Z",
  "disallowComment": true,
  "editTime": "2021-02-25T13:15:58.589Z",
  "editorType": "MARKDOWN",
  "formatContent": "string",
  "fullPath": "string",
  "id": 0,
  "likes": 0,
  "metaDescription": "string",
  "metaIds": [
    0
  ],
  "metaKeywords": "string",
  "metas": [
    {
      "createTime": "2021-02-25T13:15:58.589Z",
      "id": 0,
      "key": "string",
      "postId": 0,
      "value": "string"
    }
  ],
  "originalContent": "string",
  "password": "string",
  "slug": "string",
  "status": "DRAFT",
  "summary": "string",
  "tagIds": [
    0
  ],
  "tags": [
    {
      "createTime": "2021-02-25T13:15:58.589Z",
      "fullPath": "string",
      "id": 0,
      "name": "string",
      "slug": "string",
      "thumbnail": "string"
    }
  ],
  "template": "string",
  "thumbnail": "string",
  "title": "string",
  "topPriority": 0,
  "topped": true,
  "updateTime": "2021-02-25T13:15:58.589Z",
  "visits": 0,
  "wordCount": 0
}
```

#### 示例

获取下一篇文章的信息：

```html
<#if nextPost??>
    <a href="${nextPost.fullPath!}">下一篇：${nextPost.title!}</a>
</#if>
```

输出：

```html
<a href="http://localhost:8090/archives/url3">下一篇：title3</a>
```

### categories（List）

#### 语法

```html
<#list categories as category>
// do something
</#list>
```

#### 参数

```json
[{
    "createTime": "2021-02-25T13:32:11.189Z",
    "description": "string",
    "fullPath": "string",
    "id": 0,
    "name": "string",
    "parentId": 0,
    "password": "string",
    "slug": "string",
    "thumbnail": "string"
}]
```

#### 示例

获取文章的分类列表：

```html
<#list categories as category>
    <a href="${category.fullPath!}">${category.name!}</a>
</#list>
```

输出：

```html
<a href="http://localhost:8090/categories/url1">name1</a>
<a href="http://localhost:8090/categories/url2">name2</a>
```

### tags（List）

#### 语法

```html
<#list tags as tag>
// do something
</#list>
```

#### 参数

```json
[{
    "createTime": "2021-02-25T13:34:48.779Z",
    "fullPath": "string",
    "id": 0,
    "name": "string",
    "slug": "string",
    "thumbnail": "string"
}]
```

#### 示例

获取文章的标签列表：

```html
<#list tags as tag>
    <a href="${tag.fullPath!}">${tag.name!}</a>
</#list>
```

输出：

```html
<a href="http://localhost:8090/tags/url1">name1</a>
<a href="http://localhost:8090/tags/url2">name2</a>
```

### metas（Object）

#### 语法

```html
${metas.key}
```

注：attribute 代表具体 key 值。

#### 参数

无

#### 示例

获取用户设置的音乐链接：

```html
<audio src="${metas.music_url}" controls="controls"></audio>
```

输出：

```html
<audio src="/music.mp3" controls="controls"></audio>
```

## 自定义页面（sheet.ftl）

访问路径不固定，视固定链接配置而定，默认为：`http://yourdomain/s/{slug}`

### sheet（Object）

#### 语法

```html
${sheet.attribute}
```

注：attribute 代表具体属性。

#### 参数

```json
{
  "commentCount": 0,
  "createTime": "2021-02-25T13:37:29.775Z",
  "disallowComment": true,
  "editTime": "2021-02-25T13:37:29.775Z",
  "editorType": "MARKDOWN",
  "formatContent": "string",
  "fullPath": "string",
  "id": 0,
  "likes": 0,
  "metaDescription": "string",
  "metaIds": [
    0
  ],
  "metaKeywords": "string",
  "metas": [
    {
      "createTime": "2021-02-25T13:37:29.775Z",
      "id": 0,
      "key": "string",
      "postId": 0,
      "value": "string"
    }
  ],
  "originalContent": "string",
  "password": "string",
  "slug": "string",
  "status": "DRAFT",
  "summary": "string",
  "template": "string",
  "thumbnail": "string",
  "title": "string",
  "topPriority": 0,
  "topped": true,
  "updateTime": "2021-02-25T13:37:29.775Z",
  "visits": 0,
  "wordCount": 0
}
```

#### 示例

获取页面标题：

```html
<span>${sheet.title!}</span>
```

输出：

```html
<span>示例页面</span>
```

### metas（Object）

#### 语法

```html
${metas.key}
```

注：attribute 代表具体 key 值。

#### 参数

无

#### 示例

获取用户设置的音乐链接：

```html
<audio src="${metas.music_url}" controls="controls"></audio>
```

输出：

```html
<audio src="/music.mp3" controls="controls"></audio>
```

## 文章归档页面（archives.ftl）

访问路径不固定，视固定链接配置而定，默认为：`http://yourdomain/archives`

### posts（List）

#### 语法

```html
<#list posts.content as post>
// do something
</#list>
```

#### 参数

```json
[{
    "content": [{
        "categories": [{
            "createTime": "2020-10-13T13:23:39.143Z",
            "description": "string",
            "fullPath": "string",
            "id": 0,
            "name": "string",
            "parentId": 0,
            "slug": "string",
            "thumbnail": "string"
        }],
        "commentCount": 0,
        "createTime": "2020-10-13T13:23:39.143Z",
        "disallowComment": true,
        "editTime": "2020-10-13T13:23:39.143Z",
        "editorType": "MARKDOWN",
        "fullPath": "string",
        "id": 0,
        "likes": 0,
        "metaDescription": "string",
        "metaKeywords": "string",
        "metas": {},
        "password": "string",
        "slug": "string",
        "status": "PUBLISHED",
        "summary": "string",
        "tags": [{
            "createTime": "2020-10-13T13:23:39.143Z",
            "fullPath": "string",
            "id": 0,
            "name": "string",
            "slug": "string",
            "thumbnail": "string"
        }],
        "template": "string",
        "thumbnail": "string",
        "title": "string",
        "topPriority": 0,
        "topped": true,
        "updateTime": "2020-10-13T13:23:39.143Z",
        "visits": 0,
        "wordCount": 0
    }],
    "empty": true,
    "first": true,
    "last": true,
    "number": 0,
    "numberOfElements": 0,
    "pageable": {
        "page": 0,
        "size": 0,
        "sort": [
            "string"
        ]
    },
    "size": 0,
    "sort": {
        "sort": [
            "string"
        ]
    },
    "totalElements": 0,
    "totalPages": 0
}]
```

#### 示例

遍历输出归档页面的文章（无年份分组）：

```html
<#list posts.content as post>
    <a href="${post.fullPath!}">${post.title!}</a>
</#list>
```

输出：

```html
<a href="http://localhost:8090/archives/url1">title1</a>
<a href="http://localhost:8090/archives/url2">title2</a>
<a href="http://localhost:8090/archives/url3">title3</a>
```

### archives（List）

#### 语法

```html
<#list archives.content as archive>
// do something
</#list>
```

#### 参数

```json
{
    "content": [{
        "posts": [{
            "categories": [{
                "createTime": "2021-03-07T05:45:06.271Z",
                "description": "string",
                "fullPath": "string",
                "id": 0,
                "name": "string",
                "parentId": 0,
                "password": "string",
                "slug": "string",
                "thumbnail": "string"
            }],
            "commentCount": 0,
            "createTime": "2021-03-07T05:45:06.271Z",
            "disallowComment": true,
            "editTime": "2021-03-07T05:45:06.271Z",
            "editorType": "MARKDOWN",
            "fullPath": "string",
            "id": 0,
            "likes": 0,
            "metaDescription": "string",
            "metaKeywords": "string",
            "metas": {},
            "password": "string",
            "slug": "string",
            "status": "DRAFT",
            "summary": "string",
            "tags": [{
                "createTime": "2021-03-07T05:45:06.271Z",
                "fullPath": "string",
                "id": 0,
                "name": "string",
                "slug": "string",
                "thumbnail": "string"
            }],
            "template": "string",
            "thumbnail": "string",
            "title": "string",
            "topPriority": 0,
            "topped": true,
            "updateTime": "2021-03-07T05:45:06.271Z",
            "visits": 0,
            "wordCount": 0
        }],
        "year": 0
    }],
    "hasContent": true,
    "hasNext": true,
    "hasPrevious": true,
    "isEmpty": true,
    "isFirst": true,
    "page": 0,
    "pages": 0,
    "rpp": 0,
    "total": 0
}
```

#### 示例

遍历输出归档页面的文章（有年份分组）：

```html
<#list archives.content as archive>
  <h1>${archive.year?c}</h1>
  <#list archive.posts as post>
      <a href="${post.fullPath!}">${post.title!}</a>
  </#list>
</#list>
```

输出：

```html
<h1>2021</h1>
<a href="http://localhost:8090/archives/url1">title1</a>
<a href="http://localhost:8090/archives/url2">title2</a>
<a href="http://localhost:8090/archives/url3">title3</a>
<h1>2020</h1>
<a href="http://localhost:8090/archives/url4">title4</a>
<a href="http://localhost:8090/archives/url5">title5</a>
<a href="http://localhost:8090/archives/url6">title6</a>
```

## 分类目录页面（categories.ftl）

访问路径不固定，视固定链接配置而定，默认为：`http://yourdomain/categories`

此页面无页面变量，可以使用 [模板标签](/developer-guide/theme/template-tag) 获取分类列表。

## 单个分类所属文章页面（category.ftl）

访问路径不固定，视固定链接配置而定，默认为：`http://yourdomain/categories/{slug}`

### posts（List）

#### 语法

```html
<#list posts.content as post>
// do something
</#list>
```

#### 参数

```json
[{
    "content": [{
        "categories": [{
            "createTime": "2020-10-13T13:23:39.143Z",
            "description": "string",
            "fullPath": "string",
            "id": 0,
            "name": "string",
            "parentId": 0,
            "slug": "string",
            "thumbnail": "string"
        }],
        "commentCount": 0,
        "createTime": "2020-10-13T13:23:39.143Z",
        "disallowComment": true,
        "editTime": "2020-10-13T13:23:39.143Z",
        "editorType": "MARKDOWN",
        "fullPath": "string",
        "id": 0,
        "likes": 0,
        "metaDescription": "string",
        "metaKeywords": "string",
        "metas": {},
        "password": "string",
        "slug": "string",
        "status": "PUBLISHED",
        "summary": "string",
        "tags": [{
            "createTime": "2020-10-13T13:23:39.143Z",
            "fullPath": "string",
            "id": 0,
            "name": "string",
            "slug": "string",
            "thumbnail": "string"
        }],
        "template": "string",
        "thumbnail": "string",
        "title": "string",
        "topPriority": 0,
        "topped": true,
        "updateTime": "2020-10-13T13:23:39.143Z",
        "visits": 0,
        "wordCount": 0
    }],
    "empty": true,
    "first": true,
    "last": true,
    "number": 0,
    "numberOfElements": 0,
    "pageable": {
        "page": 0,
        "size": 0,
        "sort": [
            "string"
        ]
    },
    "size": 0,
    "sort": {
        "sort": [
            "string"
        ]
    },
    "totalElements": 0,
    "totalPages": 0
}]
```

#### 示例

遍历输出某个分类的文章：

```html
<#list posts.content as post>
    <a href="${post.fullPath!}">${post.title!}</a>
</#list>
```

输出：

```html
<a href="http://localhost:8090/archives/url1">title1</a>
<a href="http://localhost:8090/archives/url2">title2</a>
<a href="http://localhost:8090/archives/url3">title3</a>
```

### category（Object）

#### 语法

```html
${category.attribute}
```

注：attribute 代表具体属性。

#### 参数

```json
{
    "createTime": "2020-10-11T05:59:40.622Z",
    "description": "string",
    "fullPath": "string",
    "id": 0,
    "name": "string",
    "parentId": 0,
    "slug": "string",
    "thumbnail": "string",
    "postCount": 0
}
```

#### 示例

```html
<a href="${category.fullPath!}">分类：${category.name!}</a>
```

输出：

```html
<a href="http://localhost:8090/categories/url1">分类：name1</a>
```

## 标签页面（tags.ftl）

访问路径不固定，视固定链接配置而定，默认为：`http://yourdomain/tags`

此页面无页面变量，可以使用 [模板标签](/developer-guide/theme/template-tag) 获取标签列表。

## 单个标签所属文章页面（tag.ftl）

访问路径不固定，视固定链接配置而定，默认为：`http://yourdomain/tags/{slug}`

### posts（List）

#### 语法

```html
<#list posts.content as post>
// do something
</#list>
```

#### 参数

```json
[{
    "content": [{
        "categories": [{
            "createTime": "2020-10-13T13:23:39.143Z",
            "description": "string",
            "fullPath": "string",
            "id": 0,
            "name": "string",
            "parentId": 0,
            "slug": "string",
            "thumbnail": "string"
        }],
        "commentCount": 0,
        "createTime": "2020-10-13T13:23:39.143Z",
        "disallowComment": true,
        "editTime": "2020-10-13T13:23:39.143Z",
        "editorType": "MARKDOWN",
        "fullPath": "string",
        "id": 0,
        "likes": 0,
        "metaDescription": "string",
        "metaKeywords": "string",
        "metas": {},
        "password": "string",
        "slug": "string",
        "status": "PUBLISHED",
        "summary": "string",
        "tags": [{
            "createTime": "2020-10-13T13:23:39.143Z",
            "fullPath": "string",
            "id": 0,
            "name": "string",
            "slug": "string",
            "thumbnail": "string"
        }],
        "template": "string",
        "thumbnail": "string",
        "title": "string",
        "topPriority": 0,
        "topped": true,
        "updateTime": "2020-10-13T13:23:39.143Z",
        "visits": 0,
        "wordCount": 0
    }],
    "empty": true,
    "first": true,
    "last": true,
    "number": 0,
    "numberOfElements": 0,
    "pageable": {
        "page": 0,
        "size": 0,
        "sort": [
            "string"
        ]
    },
    "size": 0,
    "sort": {
        "sort": [
            "string"
        ]
    },
    "totalElements": 0,
    "totalPages": 0
}]
```

#### 示例

遍历输出某个标签的文章：

```html
<#list posts.content as post>
    <a href="${post.fullPath!}">${post.title!}</a>
</#list>
```

输出：

```html
<a href="http://localhost:8090/archives/url1">title1</a>
<a href="http://localhost:8090/archives/url2">title2</a>
<a href="http://localhost:8090/archives/url3">title3</a>
```

### tag（Object）

#### 语法

```html
${tag.attribute}
```

注：attribute 代表具体属性。

#### 参数

```json
{
    "createTime": "2020-10-11T06:14:30.595Z",
    "fullPath": "string",
    "id": 0,
    "name": "string",
    "slug": "string",
    "thumbnail": "string"
}
```

#### 示例

```html
<a href="${tag.fullPath!}">标签：${tag.name!}</a>
```

输出：

```html
<a href="http://localhost:8090/tags/url1">标签：name1</a>
```

## 文章搜索结果页面（search.ftl）

访问路径：`http://yourdomain/search?keyword=keyword`

### keyword（String）

#### 语法

```html
${keyword!}
```

#### 参数

无

#### 示例

```html
搜索关键字为：${keyword!}
```

### posts（List）

#### 语法

```html
<#list posts.content as post>
// do something
</#list>
```

#### 参数

```json
[{
    "content": [{
        "categories": [{
            "createTime": "2020-10-13T13:23:39.143Z",
            "description": "string",
            "fullPath": "string",
            "id": 0,
            "name": "string",
            "parentId": 0,
            "slug": "string",
            "thumbnail": "string"
        }],
        "commentCount": 0,
        "createTime": "2020-10-13T13:23:39.143Z",
        "disallowComment": true,
        "editTime": "2020-10-13T13:23:39.143Z",
        "editorType": "MARKDOWN",
        "fullPath": "string",
        "id": 0,
        "likes": 0,
        "metaDescription": "string",
        "metaKeywords": "string",
        "metas": {},
        "password": "string",
        "slug": "string",
        "status": "PUBLISHED",
        "summary": "string",
        "tags": [{
            "createTime": "2020-10-13T13:23:39.143Z",
            "fullPath": "string",
            "id": 0,
            "name": "string",
            "slug": "string",
            "thumbnail": "string"
        }],
        "template": "string",
        "thumbnail": "string",
        "title": "string",
        "topPriority": 0,
        "topped": true,
        "updateTime": "2020-10-13T13:23:39.143Z",
        "visits": 0,
        "wordCount": 0
    }],
    "empty": true,
    "first": true,
    "last": true,
    "number": 0,
    "numberOfElements": 0,
    "pageable": {
        "page": 0,
        "size": 0,
        "sort": [
            "string"
        ]
    },
    "size": 0,
    "sort": {
        "sort": [
            "string"
        ]
    },
    "totalElements": 0,
    "totalPages": 0
}]
```

#### 示例

遍历输出某个搜索结果的文章：

```html
<#list posts.content as post>
    <a href="${post.fullPath!}">${post.title!}</a>
</#list>
```

输出：

```html
<a href="http://localhost:8090/archives/url1">title1</a>
<a href="http://localhost:8090/archives/url2">title2</a>
<a href="http://localhost:8090/archives/url3">title3</a>
```

## 友情链接页面（links.ftl）

访问路径不固定，视固定链接配置而定，默认为：`http://yourdomain/links`

此页面无页面变量，可以使用 [模板标签](/developer-guide/theme/template-tag) 获取友情链接列表。

## 图库页面（photos.ftl）

访问路径不固定，视固定链接配置而定，默认为：`http://yourdomain/photos`

### photos（List）

#### 语法

```html
<#list photos.content as photo>
// do something
</#list>
```

#### 参数

```json
{
    "content": [{
        "description": "string",
        "id": 0,
        "location": "string",
        "name": "string",
        "takeTime": "2021-03-07T05:28:12.352Z",
        "team": "string",
        "thumbnail": "string",
        "url": "string"
    }],
    "hasContent": true,
    "hasNext": true,
    "hasPrevious": true,
    "isEmpty": true,
    "isFirst": true,
    "page": 0,
    "pages": 0,
    "rpp": 0,
    "total": 0
}
```

#### 示例

```html
<#list photos.content as photo>
    <img alt="${photo.description!}" src="${photo.url!}"/>
</#list>
```

输出：

```html
<img alt="山川"  src="https://youdomain.com/upload/2021/01/1.png"/>
<img alt="河流"  src="https://youdomain.com/upload/2021/01/2.png"/>
<img alt="绿树"  src="https://youdomain.com/upload/2021/01/3.png"/>
```

## 日志页面（journals.ftl）

访问路径不固定，视固定链接配置而定，默认为：`http://yourdomain/journals`

### journals（List）

#### 语法

```html
<#list journals.content as journal>
// do something
</#list>
```

#### 参数

```json
{
    "content": [{
        "commentCount": 0,
        "content": "string",
        "createTime": "2021-03-07T05:32:06.365Z",
        "id": 0,
        "likes": 0,
        "sourceContent": "string",
        "type": "INTIMATE"
    }],
    "hasContent": true,
    "hasNext": true,
    "hasPrevious": true,
    "isEmpty": true,
    "isFirst": true,
    "page": 0,
    "pages": 0,
    "rpp": 0,
    "total": 0
}
```

#### 示例

```html
<ul>
  <#list journals.content as journal>
    <li>
        ${journal.createTime?string('yyyy年MM月dd日')}：${journal.content!}
    </li>
  </#list>
</ul>
```

输出：

```html
<ul>
  <li>
      2021年3月7日：内容1
  </li>
  <li>
      2021年3月7日：内容2
  </li>
</ul>
```
