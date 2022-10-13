---
title: 模板标签
description: 用于获取数据的模板标签
---

:::note
模板标签可以运用在页面的任何地方。
:::

## 文章（postTag）

### 获取最新文章（latest）

#### 语法

```html
<@postTag method="latest" top="获取条数">
// do something
</@postTag>
```

参数：

1. method：latest
2. top：所需要获取的条数

#### 返回参数

posts:

```json
[{
    "categories": [{
        "createTime": "2020-10-11T05:22:08.264Z",
        "description": "string",
        "fullPath": "string",
        "id": 0,
        "name": "string",
        "parentId": 0,
        "slug": "string",
        "thumbnail": "string"
    }],
    "commentCount": 0,
    "createTime": "2020-10-11T05:22:08.264Z",
    "disallowComment": true,
    "editTime": "2020-10-11T05:22:08.264Z",
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
        "createTime": "2020-10-11T05:22:08.264Z",
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
    "updateTime": "2020-10-11T05:22:08.264Z",
    "visits": 0,
    "wordCount": 0
}]
```

#### 示例

```html
<@postTag method="latest" top="3">
    <#list posts as post>
        <a href="${post.fullPath!}">${post.title!}</a>
    </#list>
</@postTag>
```

输出：

```html
<a href="http://localhost:8090/archives/url1">title1</a>
<a href="http://localhost:8090/archives/url2">title2</a>
<a href="http://localhost:8090/archives/url3">title3</a>
```

### 获取所有文章的数量（count）

#### 语法

```html
<@postTag method="count">
// do something
</@postTag>
```

参数：

1. method：count

#### 返回参数

```json
count: long
```

#### 示例

```html
<@postTag method="count">
<span>文章数量：${count!0}</span>
</@postTag>
```

输出：

```html
<span>文章数量：20</span>
```

### 根据年份归档（archiveYear）

#### 语法

```html
<@postTag method="archiveYear">
// do something
</@postTag>
```

参数：

1. method：archiveYear

#### 返回参数

archives:

```json
[{
    "posts": [{
        "categories": [{
            "createTime": "2020-10-11T05:30:45.245Z",
            "description": "string",
            "fullPath": "string",
            "id": 0,
            "name": "string",
            "parentId": 0,
            "slug": "string",
            "thumbnail": "string"
        }],
        "commentCount": 0,
        "createTime": "2020-10-11T05:30:45.245Z",
        "disallowComment": true,
        "editTime": "2020-10-11T05:30:45.245Z",
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
            "createTime": "2020-10-11T05:30:45.245Z",
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
        "updateTime": "2020-10-11T05:30:45.245Z",
        "visits": 0,
        "wordCount": 0
    }],
    "year": 0
}]
```

#### 示例

```html
<@postTag method="archiveYear">
  <#list archives as archive>
      <h1>年份： ${archive.year?c}</h1>
      <ul>
          <#list archive.posts?sort_by("createTime")?reverse as post>
            <li>
              <a href="${post.fullPath!}">${post.title!}</a>
            </li>
          </#list>
      </ul>
  </#list>
</@postTag>
```

输出：

```html
<h1>2019</h1>
<ul>
  <li>
    <a href="http://localhost:8090/archives/url1">title1</a>
  </li>
  <li>
    <a href="http://localhost:8090/archives/url2">title2</a>
  </li>
</ul>
<h1>2018</h1>
<ul>
  <li>
    <a href="http://localhost:8090/archives/url3">title3</a>
  </li>
  <li>
    <a href="http://localhost:8090/archives/url4">title4</a>
  </li>
</ul>
```

### 根据年月归档（archiveMonth）

#### 语法

```html
<@postTag method="archiveMonth">
// do something
</@postTag>
```

参数：

1. method：archiveMonth

#### 返回参数

archives:

```json
[{
    "month": 0,
    "posts": [{
        "categories": [{
            "createTime": "2020-10-11T05:35:01.835Z",
            "description": "string",
            "fullPath": "string",
            "id": 0,
            "name": "string",
            "parentId": 0,
            "slug": "string",
            "thumbnail": "string"
        }],
        "commentCount": 0,
        "createTime": "2020-10-11T05:35:01.835Z",
        "disallowComment": true,
        "editTime": "2020-10-11T05:35:01.835Z",
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
            "createTime": "2020-10-11T05:35:01.835Z",
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
        "updateTime": "2020-10-11T05:35:01.835Z",
        "visits": 0,
        "wordCount": 0
    }],
    "year": 0
}]
```

#### 示例

```html
<@postTag method="archiveMonth">
  <#list archives as archive>
      <h1>${archive.year?c}-${archive.month?c}</h1>
      <ul>
          <#list archive.posts?sort_by("createTime")?reverse as post>
            <li>
              <a href="${post.fullPath!}">${post.title!}</a>
            </li>
          </#list>
      </ul>
  </#list>
</@postTag>
```

输出：

```html
<h1>2019-01</h1>
<ul>
  <li>
    <a href="http://localhost:8090/archives/url1">title1</a>
  </li>
  <li>
    <a href="http://localhost:8090/archives/url2">title2</a>
  </li>
</ul>
<h1>2018-12</h1>
<ul>
  <li>
    <a href="http://localhost:8090/archives/url3">title3</a>
  </li>
  <li>
    <a href="http://localhost:8090/archives/url3">title4</a>
  </li>
</ul>
```

### 归档（archive）

#### 语法

```html
<@postTag method="archive" type="year or month">
// do something
</@postTag>
```

参数：

1. method：archive
2. type: `year` 或者 `month`

#### 返回参数

archives(year):

```json
[{
    "posts": [{
        "categories": [{
            "createTime": "2020-10-11T05:30:45.245Z",
            "description": "string",
            "fullPath": "string",
            "id": 0,
            "name": "string",
            "parentId": 0,
            "slug": "string",
            "thumbnail": "string"
        }],
        "commentCount": 0,
        "createTime": "2020-10-11T05:30:45.245Z",
        "disallowComment": true,
        "editTime": "2020-10-11T05:30:45.245Z",
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
            "createTime": "2020-10-11T05:30:45.245Z",
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
        "updateTime": "2020-10-11T05:30:45.245Z",
        "visits": 0,
        "wordCount": 0
    }],
    "year": 0
}]
```

archives(month):

```json
[{
    "month": 0,
    "posts": [{
        "categories": [{
            "createTime": "2020-10-11T05:35:01.835Z",
            "description": "string",
            "fullPath": "string",
            "id": 0,
            "name": "string",
            "parentId": 0,
            "slug": "string",
            "thumbnail": "string"
        }],
        "commentCount": 0,
        "createTime": "2020-10-11T05:35:01.835Z",
        "disallowComment": true,
        "editTime": "2020-10-11T05:35:01.835Z",
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
            "createTime": "2020-10-11T05:35:01.835Z",
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
        "updateTime": "2020-10-11T05:35:01.835Z",
        "visits": 0,
        "wordCount": 0
    }],
    "year": 0
}]
```

#### 示例

```html
<@postTag method="archive" type="month">
  <#list archives as archive>
      <h1>${archive.year?c}-${archive.month?c}</h1>
      <ul>
          <#list archive.posts?sort_by("createTime")?reverse as post>
            <li>
              <a href="${post.fullPath!}">${post.title!}</a>
            </li>
          </#list>
      </ul>
  </#list>
</@postTag>
```

输出：

```html
<h1>2019-01</h1>
<ul>
  <li>
    <a href="http://localhost:8090/archives/url1">title1</a>
  </li>
  <li>
    <a href="http://localhost:8090/archives/url2">title2</a>
  </li>
</ul>
<h1>2018-12</h1>
<ul>
  <li>
    <a href="http://localhost:8090/archives/url3">title3</a>
  </li>
  <li>
    <a href="http://localhost:8090/archives/url3">title4</a>
  </li>
</ul>
```

### 根据分类 id 获取文章（listByCategoryId）

#### 语法

```html
<@postTag method="listByCategoryId" categoryId="分类 id">
// do something
</@postTag>
```

参数：

1. method：listByCategoryId
2. categoryId：分类 id

#### 返回参数

posts:

```json
[{
    "categories": [{
        "createTime": "2020-10-11T05:35:01.811Z",
        "description": "string",
        "fullPath": "string",
        "id": 0,
        "name": "string",
        "parentId": 0,
        "slug": "string",
        "thumbnail": "string"
    }],
    "commentCount": 0,
    "createTime": "2020-10-11T05:35:01.811Z",
    "disallowComment": true,
    "editTime": "2020-10-11T05:35:01.811Z",
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
        "createTime": "2020-10-11T05:35:01.811Z",
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
    "updateTime": "2020-10-11T05:35:01.811Z",
    "visits": 0,
    "wordCount": 0
}]
```

#### 示例

```html
<@postTag method="listByCategoryId" top="${category.id?c}">
      <span>分类 ${category.name!} 下的文章：</span>
    <#list posts as post>
        <a href="${post.fullPath!}">${post.title!}</a>
    </#list>
</@postTag>
```

输出：

```html
<a href="http://localhost:8090/archives/url1">title1</a>
<a href="http://localhost:8090/archives/url2">title2</a>
<a href="http://localhost:8090/archives/url3">title3</a>
```

### 根据分类 slug 获取文章（listByCategorySlug）

#### 语法

```html
<@postTag method="listByCategorySlug" categorySlug="分类 slug">
// do something
</@postTag>
```

参数：

1. method：listByCategorySlug
2. categorySlug：分类 slug

#### 返回参数

posts:

```json
[{
    "categories": [{
        "createTime": "2020-10-11T05:35:01.811Z",
        "description": "string",
        "fullPath": "string",
        "id": 0,
        "name": "string",
        "parentId": 0,
        "slug": "string",
        "thumbnail": "string"
    }],
    "commentCount": 0,
    "createTime": "2020-10-11T05:35:01.811Z",
    "disallowComment": true,
    "editTime": "2020-10-11T05:35:01.811Z",
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
        "createTime": "2020-10-11T05:35:01.811Z",
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
    "updateTime": "2020-10-11T05:35:01.811Z",
    "visits": 0,
    "wordCount": 0
}]
```

#### 示例

```html
<@postTag method="listByCategorySlug" categorySlug="${category.slug!}">
      <span>分类 ${category.name!} 下的文章：</span>
    <#list posts as post>
        <a href="${post.fullPath!}">${post.title!}</a>
    </#list>
</@postTag>
```

输出：

```html
<a href="http://localhost:8090/archives/url1">title1</a>
<a href="http://localhost:8090/archives/url2">title2</a>
<a href="http://localhost:8090/archives/url3">title3</a>
```

### 根据标签 id 获取文章（listByTagId）

#### 语法

```html
<@postTag method="listByTagId" tagId="标签 id">
// do something
</@postTag>
```

参数：

1. method：listByTagId
2. tagId：标签 id

#### 返回参数

posts:

```json
[{
    "categories": [{
        "createTime": "2020-10-11T05:35:01.811Z",
        "description": "string",
        "fullPath": "string",
        "id": 0,
        "name": "string",
        "parentId": 0,
        "slug": "string",
        "thumbnail": "string"
    }],
    "commentCount": 0,
    "createTime": "2020-10-11T05:35:01.811Z",
    "disallowComment": true,
    "editTime": "2020-10-11T05:35:01.811Z",
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
        "createTime": "2020-10-11T05:35:01.811Z",
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
    "updateTime": "2020-10-11T05:35:01.811Z",
    "visits": 0,
    "wordCount": 0
}]
```

#### 示例

```html
<@postTag method="listByTagId" tagId="${tag.id?c}">
      <span>标签 ${tag.name!} 下的文章：</span>
    <#list posts as post>
        <a href="${post.fullPath!}">${post.title!}</a>
    </#list>
</@postTag>
```

输出：

```html
<a href="http://localhost:8090/archives/url1">title1</a>
<a href="http://localhost:8090/archives/url2">title2</a>
<a href="http://localhost:8090/archives/url3">title3</a>
```

### 根据标签 slug 获取文章（listByTagSlug）

#### 语法

```html
<@postTag method="listByTagSlug" tagSlug="标签 slug">
// do something
</@postTag>
```

参数：

1. method：listByTagSlug
2. tagSlug：标签 slug

#### 返回参数

posts:

```json
[{
    "categories": [{
        "createTime": "2020-10-11T05:35:01.811Z",
        "description": "string",
        "fullPath": "string",
        "id": 0,
        "name": "string",
        "parentId": 0,
        "slug": "string",
        "thumbnail": "string"
    }],
    "commentCount": 0,
    "createTime": "2020-10-11T05:35:01.811Z",
    "disallowComment": true,
    "editTime": "2020-10-11T05:35:01.811Z",
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
        "createTime": "2020-10-11T05:35:01.811Z",
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
    "updateTime": "2020-10-11T05:35:01.811Z",
    "visits": 0,
    "wordCount": 0
}]
```

#### 示例

```html
<@postTag method="listByTagSlug" tagSlug="${tag.slug!}">
      <span>标签 ${tag.name!} 下的文章：</span>
    <#list posts as post>
        <a href="${post.fullPath!}">${post.title!}</a>
    </#list>
</@postTag>
```

输出：

```html
<a href="http://localhost:8090/archives/url1">title1</a>
<a href="http://localhost:8090/archives/url2">title2</a>
<a href="http://localhost:8090/archives/url3">title3</a>
```

## 评论（commentTag）

### 获取最新评论（latest）

#### 语法

```html
<@commentTag method="latest" top="获取条数">
// do something
</@commentTag>
```

参数：

1. method：latest
2. top：所需要获取的条数

#### 返回参数

comments:

```json
[{
    "allowNotification": true,
    "author": "string",
    "authorUrl": "string",
    "content": "string",
    "createTime": "2020-10-13T12:35:54.974Z",
    "email": "string",
    "gravatarMd5": "string",
    "id": 0,
    "ipAddress": "string",
    "isAdmin": true,
    "parentId": 0,
    "post": {
        "createTime": "2020-10-13T12:35:54.974Z",
        "editTime": "2020-10-13T12:35:54.974Z",
        "editorType": "MARKDOWN",
        "fullPath": "string",
        "id": 0,
        "metaDescription": "string",
        "metaKeywords": "string",
        "slug": "string",
        "status": "PUBLISHED",
        "title": "string",
        "updateTime": "2020-10-13T12:35:54.974Z"
    },
    "status": "PUBLISHED",
    "userAgent": "string"
}]
```

#### 示例

```html
<@commentTag method="latest" top="获取条数">
    <ul>
        <#list comments.content as comment>
            <li>${comment.author!}：${comment.content!}</li>
        </#list>
    </ul>
</@commentTag>
```

输出：

```html
<ul>
    <li>author1：content1</li>
    <li>author2：content2</li>
</ul>
```

### 获取所有评论的数量（count）

#### 语法

```html
<@commentTag method="count">
// do something
</@commentTag>
```

参数：

1. method：count

#### 返回参数

```json
count: long
```

#### 示例

```html
<@commentTag method="count">
<span>评论数量：${count!0}</span>
</@commentTag>
```

输出：

```html
<span>文章数量：20</span>
```

## 分类目录（categoryTag）

### 获取所有分类目录（list）

#### 语法

```html
<@categoryTag method="list">
// do something
</@categoryTag>
```

参数：

1. method：list

#### 返回参数

categories:

```json
[{
    "createTime": "2020-10-11T05:59:40.622Z",
    "description": "string",
    "fullPath": "string",
    "id": 0,
    "name": "string",
    "parentId": 0,
    "slug": "string",
    "thumbnail": "string",
    "postCount": 0
}]
```

#### 示例

```html
<@categoryTag method="list">
  <#list categories as category>
    <a href="${category.fullPath!}">${category.name!}（${category.postCount!}）</a>
  </#list>
</@categoryTag>
```

输出：

```html
<a href="http://localhost:8090/categories/url1">name1（2）</a>
<a href="http://localhost:8090/categories/url2">name2（12）</a>
```

### 获取分类目录树结构（tree）

#### 语法

```html
<@categoryTag method="tree">
// do something
</@categoryTag>
```

参数：

1. method：tree

#### 返回参数

categories:

```json
[
  {
    "children": [
      {
        "children": [],
        "createTime": "2022-02-12T14:11:06.376Z",
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
    "createTime": "2022-02-12T14:11:06.376Z",
    "description": "string",
    "fullPath": "string",
    "id": 0,
    "name": "string",
    "parentId": 0,
    "password": "string",
    "slug": "string",
    "thumbnail": "string"
  }
]
```

#### 示例

```html
<@categoryTag method="tree">
    <ul>
        <#list categories as category>
            <li>
                <a href="${category.fullPath!}">
                    ${category.name!}
                </a>
            </li>

            <#if category.children?? && category.children?size gt 0>
                <@renderCategories category.children></@renderCategories>
            </#if>
        </#list>
    </ul>
</@categoryTag>

<#macro renderCategories categories>
    <ul>
        <#list categories as category>
            <li>
                <a  href="${category.fullPath!}">
                    ${(category.name)!}
                </a>
                <#if category.children?? && category.children?size gt 0>
                    <@renderCategories category.children></@renderCategories>
                </#if>
            </li>
        </#list>
    </ul>
</#macro>
```

输出：

```html
<ul>
    <li>
        <a href="http://localhost:8090/categories/parent">
            父级分类
        </a>
    </li>
    <ul>
        <li>
            <a href="http://localhost:8090/categories/child">
                子分类
            </a>
        </li>
    </ul>
</ul>
```

### 获取文章的所有分类（listByPostId）

#### 语法

```html
<@categoryTag method="listByPostId" postId="文章 id">
// do something
</@categoryTag>
```

参数：

1. method：listByPostId
2. postId：文章 id

#### 返回参数

categories:

```json
[{
    "createTime": "2020-10-11T05:59:40.622Z",
    "description": "string",
    "fullPath": "string",
    "id": 0,
    "name": "string",
    "parentId": 0,
    "slug": "string",
    "thumbnail": "string"
}]
```

#### 示例

```html
<@categoryTag method="listByPostId" postId="${post.id?c}">
  <#list categories as category>
    <a href="${category.fullPath!}">${category.name}</a>
  </#list>
</@categoryTag>
```

输出：

```html
<a href="http://localhost:8090/categories/url1">name1</a>
<a href="http://localhost:8090/categories/url2">name2</a>
```

### 获取所有分类的数量（count）

#### 语法

```html
<@categoryTag method="count">
// do something
</@categoryTag>
```

参数：

1. method：count

#### 返回参数

```json
count: long
```

#### 示例

```html
<@categoryTag method="count">
<span>分类数量：${count!0}</span>
</@categoryTag>
```

输出：

```html
<span>分类数量：20</span>
```

## 标签（tagTag）

### 获取所有标签（list）

#### 语法

```html
<@tagTag method="list">
// 返回参数：tags
</@tagTag>
```

参数：

1. method：list

#### 返回参数

tags:

```json
[{
    "createTime": "2020-10-11T06:14:30.595Z",
    "fullPath": "string",
    "id": 0,
    "name": "string",
    "slug": "string",
    "thumbnail": "string",
    "postCount": 0
}]
```

#### 示例

```html
<@tagTag method="list">
  <#list tags as tag>
    <a href="${tag.fullPath!}">${tag.name!}（${tag.postCount!}）</a>
  </#list>
</@tagTag>
```

输出：

```html
<a href="http://localhost:8090/tags/url1">name1（1）</a>
<a href="http://localhost:8090/tags/url2">name2（20）</a>
```

### 获取文章的所有标签（listByPostId）

#### 语法

```html
<@tagTag method="listByPostId" postId="文章 id">
// do something
</@tagTag>
```

参数：

1. method：listByPostId
2. postId：文章 id

#### 返回参数

tags:

```json
[{
    "createTime": "2020-10-11T06:14:30.595Z",
    "fullPath": "string",
    "id": 0,
    "name": "string",
    "slug": "string",
    "thumbnail": "string"
}]
```

#### 示例

```html
<@tagTag method="listByPostId" postId="${post.id?c}">
  <#list tags as tag>
    <a href="${tag.fullPath!}">${tag.name}</a>
  </#list>
</@tagTag>
```

输出：

```html
<a href="http://localhost:8090/tags/url1">name1</a>
<a href="http://localhost:8090/tags/url2">name2</a>
```

### 获取所有标签的数量（count）

#### 语法

```html
<@tagTag method="count">
// do something
</@tagTag>
```

参数：

1. method：count

#### 返回参数

```json
count: long
```

#### 示例

```html
<@tagTag method="count">
<span>标签数量：${count!0}</span>
</@tagTag>
```

输出：

```html
<span>标签数量：20</span>
```

## 菜单（menuTag）

### 获取所有菜单（list）

#### 语法

```html
<@menuTag method="list">
// do something
</@menuTag>
```

参数：

1. method：list

#### 返回参数

menus:

```json
[{
    "icon": "string",
    "id": 0,
    "name": "string",
    "parentId": 0,
    "priority": 0,
    "target": "string",
    "team": "string",
    "url": "string"
}]
```

#### 示例

```html
<@menuTag method="list">
  <ul>
    <#list menus as menu>
      <li>
        <a href="${menu.url!}" target="${menu.target!}">${menu.name!}</a>
      </li>
    </#list>
  </ul>
</@menuTag>
```

输出：

```html
<ul>
  <li>
    <a href="/" target="_blank">首页</a>
  </li>
  <li>
    <a href="/archives" target="_blank">归档</a>
  </li>
</ul>
```

### 获取多级菜单（tree）

#### 语法

```html
<@menuTag method="tree">
// do something
</@menuTag>
```

参数：

1. method：tree

#### 返回参数

menus:

```json
[{
    "children": [{
        "children": [{}],
        "icon": "string",
        "id": 0,
        "name": "string",
        "parentId": 0,
        "priority": 0,
        "target": "string",
        "team": "string",
        "url": "string"
    }],
    "icon": "string",
    "id": 0,
    "name": "string",
    "parentId": 0,
    "priority": 0,
    "target": "string",
    "team": "string",
    "url": "string"
}]
```

#### 示例

```html
<@menuTag method="tree">
  <ul>
    <#list menus as menu>
      <li>
        <a href="${menu.url!}" target="${menu.target!}">${menu.name!}</a>
        <#if menu.children?? && menu.children?size gt 0>
            <ul>
              <#list menu.children as child>
                <li>
                  <a href="${child.url!}" target="${menu.target!}">${child.name!}</a>
                </li>
              </#list>
            </ul>
        </#if>
      </li>
    </#list>
  </ul>
</@menuTag>
```

输出：

```html
<ul>
  <li>
    <a href="/" target="_blank">首页</a>
  </li>
  <li>
    <a href="/archives" target="_blank">归档</a>
    <ul>
        <li>
          <a href="/categories/study" target="_blank">学习笔记</a>
        </li>
        <li>
          <a href="/categories/java" target="_blank">Java</a>
        </li>
    </ul>
  </li>
</ul>
```

### 根据分组获取菜单（listByTeam）

#### 语法

```html
<@menuTag method="listByTeam" team="team 名称">
// do something
</@menuTag>
```

参数：

1. method：listByTeam
2. team：team 名称

#### 返回参数

menus:

```json
[{
    "icon": "string",
    "id": 0,
    "name": "string",
    "parentId": 0,
    "priority": 0,
    "target": "string",
    "team": "string",
    "url": "string"
}]
```

#### 示例

```html
<@menuTag method="listByTeam" team="main">
  <ul>
    <#list menus as menu>
      <li>
        <a href="${menu.url!}" target="${menu.target!}">${menu.name!}</a>
      </li>
    </#list>
  </ul>
</@menuTag>
```

输出：

```html
<ul>
  <li>
    <a href="/" target="_blank">首页</a>
  </li>
  <li>
    <a href="/archives" target="_blank">归档</a>
  </li>
</ul>
```

### 根据分组获取多级菜单（treeByTeam）

#### 语法

```html
<@menuTag method="treeByTeam" team="team 名称">
// do something
</@menuTag>
```

参数：

1. method：treeByTeam
2. team：team 名称

#### 返回参数

menus:

```json
[{
    "children": [{
        "children": [{}],
        "icon": "string",
        "id": 0,
        "name": "string",
        "parentId": 0,
        "priority": 0,
        "target": "string",
        "team": "string",
        "url": "string"
    }],
    "icon": "string",
    "id": 0,
    "name": "string",
    "parentId": 0,
    "priority": 0,
    "target": "string",
    "team": "string",
    "url": "string"
}]
```

#### 示例

```html
<@menuTag method="treeByTeam" team="main">
  <ul>
    <#list menus as menu>
      <li>
        <a href="${menu.url!}" target="${menu.target!}">${menu.name!}</a>
        <#if menu.children?? && menu.children?size gt 0>
            <ul>
              <#list menu.children as child>
                <li>
                  <a href="${child.url!}" target="${menu.target!}">${child.name!}</a>
                </li>
              </#list>
            </ul>
        </#if>
      </li>
    </#list>
  </ul>
</@menuTag>
```

输出：

```html
<ul>
  <li>
    <a href="/" target="_blank">首页</a>
  </li>
  <li>
    <a href="/archives" target="_blank">归档</a>
    <ul>
        <li>
          <a href="/categories/study" target="_blank">学习笔记</a>
        </li>
        <li>
          <a href="/categories/java" target="_blank">Java</a>
        </li>
    </ul>
  </li>
</ul>
```

## 友情链接（linkTag）

### 获取所有友情链接（list）

#### 语法

```html
<@linkTag method="list">
// do something
</@linkTag>
```

参数：

1. method：list

#### 返回参数

links:

```json
[{
    "id": 0,
    "name": "string",
    "url": "string",
    "logo": "string",
    "description": "string",
    "team": "string",
    "priority": 0,
    "createTime": "2021-01-10 20:48:00",
    "updateTime": "2021-01-10 20:48:00"
}]
```

#### 示例

```html
<ul>
  <@linkTag method="list">
    <#list links as link>
        <li>
            <a href="${link.url!}" target="_blank">
                ${link.name!}
            </a>
        </li>
    </#list>
  </@linkTag>
</ul>
```

输出：

```html
<ul>
  <li>
      <a href="https://halo.run" target="_blank">
          Halo
      </a>
  </li>
  <li>
      <a href="https://bbs.halo.run" target="_blank">
          Halo BBS
      </a> 
  </li>
</ul>
```

### 乱序获取所有友情链接（listByRandom）

#### 语法

```html
<@linkTag method="listByRandom">
// do something
</@linkTag>
```

参数：

1. method：listByRandom

#### 返回参数

```json
[{
    "id": 0,
    "name": "string",
    "url": "string",
    "logo": "string",
    "description": "string",
    "team": "string",
    "priority": 0,
    "createTime": "2021-01-10 20:48:00",
    "updateTime": "2021-01-10 20:48:00"
}]
```

#### 示例

```html
<ul>
  <@linkTag method="list">
    <#list links as link>
        <li>
            <a href="${link.url!}" target="_blank">
                ${link.name!}
            </a>
        </li>
    </#list>
  </@linkTag>
</ul>
```

输出：

```html
<ul>
  <li>
      <a href="https://bbs.halo.run" target="_blank">
          Halo BBS
      </a> 
  </li>
  <li>
      <a href="https://halo.run" target="_blank">
          Halo
      </a>
  </li>
</ul>
```

### 获取分组友情链接（listTeams）

#### 语法

```html
<@linkTag method="listTeams">
// do something
</@linkTag>
```

参数：

1. method：listTeams

#### 返回参数

teams:

```json
[{
    "team": "string",
    "links": [{
        "id": 0,
        "name": "string",
        "url": "string",
        "logo": "string",
        "description": "string",
        "team": "string",
        "priority": 0
    }]
}]
```

#### 示例

```html
<@linkTag method="listTeams">
  <#list teams as team>
      <h1>${team.team}</h1>
    <ul>
      <#list team.links as link>
        <li>
          <a href="${link.url!}" target="_blank">
          ${link.name!}
          </a>
        </li>
      </#list>
    </ul>
  </#list>
</@linkTag>
```

输出：

```html
<h1>Halo 相关</h1>
<ul>
  <li>
      <a href="https://bbs.halo.run" target="_blank">
          Halo BBS
      </a> 
  </li>
  <li>
      <a href="https://halo.run" target="_blank">
          Halo
      </a>
  </li>
</ul>
<h1>网友们</h1>
<ul>
  <li>
      <a href="https://ryanc.cc" target="_blank">
          Ryan Wang's Blog
      </a> 
  </li>
  <li>
      <a href="https://johnniang.me" target="_blank">
          JohnNiang's Blog
      </a>
  </li>
</ul>
```

### 乱序获取分组友情链接（listTeamsByRandom）

#### 语法

```html
<@linkTag method="listTeamsByRandom">
// do something
</@linkTag>
```

参数：

1. method：listTeamsByRandom

#### 返回参数

teams:

```json
[{
    "team": "string",
    "links": [{
        "id": 0,
        "name": "string",
        "url": "string",
        "logo": "string",
        "description": "string",
        "team": "string",
        "priority": 0
    }]
}]
```

#### 示例

```html
<@linkTag method="listTeamsByRandom">
  <#list teams as team>
      <h1>${team.team}</h1>
    <ul>
      <#list team.links as link>
        <li>
          <a href="${link.url!}" target="_blank">
          ${link.name!}
          </a>
        </li>
      </#list>
    </ul>
  </#list>
</@linkTag>
```

输出：

```html
<h1>Halo 相关</h1>
<ul>
  <li>
      <a href="https://bbs.halo.run" target="_blank">
          Halo BBS
      </a> 
  </li>
  <li>
      <a href="https://halo.run" target="_blank">
          Halo
      </a>
  </li>
</ul>
<h1>网友们</h1>
<ul>
  <li>
      <a href="https://ryanc.cc" target="_blank">
          Ryan Wang's Blog
      </a> 
  </li>
  <li>
      <a href="https://johnniang.me" target="_blank">
          JohnNiang's Blog
      </a>
  </li>
</ul>
```

### 获取所有友情链接的数量（count）

#### 语法

```html
<@linkTag method="count">
// do something
</@linkTag>
```

参数：

1. method：count

#### 返回参数

```json
count: long
```

#### 示例

```html
<@linkTag method="count">
<span>友情链接数量：${count!0}</span>
</@linkTag>
```

输出：

```html
<span>友情链接数量：20</span>
```

## 图库（photoTag）

### 获取所有图片（list）

#### 语法

```html
<@photoTag method="list">
// do something
</@photoTag>
```

参数：

1. method：list

#### 返回参数

photos:

```json
[{
    "id": 0,
    "name": "string",
    "description": "string",
    "takeTime": "2021-01-10 20:48:00",
    "location": "string",
    "thumbnail": "string",
    "url": "string",
    "team": "string",
    "createTime": "2021-01-10 20:48:00",
    "updateTime": "2021-01-10 20:48:00"
}]
```

#### 示例

```html
<@photoTag method="list">
    <#list photos as photo>
        <img alt="${photo.description}" src="${photo.url}"/>
    </#list>
</@photoTag>
```

输出：

```html
<img alt="山川" src="https://youdomain.com/upload/2021/01/1.png"/>
<img alt="河流" src="https://youdomain.com/upload/2021/01/2.png"/>
<img alt="绿树" src="https://youdomain.com/upload/2021/01/3.png"/>
```

### 获取所有分组图片（listTeams）

#### 语法

```html
<@photoTag method="listTeams">
// do something
</@photoTag>
```

参数：

1. method：listTeams

#### 返回参数

teams:

```json
[{
    "team": "string",
    "photos": [{
        "id": 0,
        "name": "string",
        "thumbnail": "string",
        "takeTime": "2021-01-10 20:48:00",
        "url": "string",
        "team": "string",
        "location": "string",
        "description": "string"
    }]
}]
```

#### 示例

```html
<@photoTag method="listTeams">
    <#list teams as team>
        <h1>${team.team}</h1>
    <#list team.photos as photo>
        <img alt="${photo.description}" src="${photo.url}"/>
    </#list>
    </#list>
</@photoTag>
```

输出：

```html
<h1>风景</h1>
<img alt="山川" src="https://youdomain.com/upload/2021/01/1.png"/>
<img alt="河流" src="https://youdomain.com/upload/2021/01/2.png"/>
<img alt="绿树" src="https://youdomain.com/upload/2021/01/3.png"/>
<h1>旅行</h1>
<img alt="四川" src="https://youdomain.com/upload/2021/02/1.png"/>
<img alt="重庆" src="https://youdomain.com/upload/2021/02/2.png"/>
<img alt="深圳" src="https://youdomain.com/upload/2021/02/3.png"/>
```

### 根据分组获取图片（listByTeam）

#### 语法

```html
<@photoTag method="listByTeam" team="team 名称">
// do something
</@photoTag>
```

参数：

1. method：listByTeam
2. team：team 名称

#### 返回参数

photos:

```json
[{
    "id": 0,
    "name": "string",
    "description": "string",
    "takeTime": "2021-01-10 20:48:00",
    "location": "string",
    "thumbnail": "string",
    "url": "string",
    "team": "string",
    "createTime": "2021-01-10 20:48:00",
    "updateTime": "2021-01-10 20:48:00"
}]
```

#### 示例

```html
<@photoTag method="listByTeam" team="风景">
  <#list photos as photo>
      <img alt="${photo.description}" src="${photo.url}"/>
  </#list>
</@photoTag>
```

输出：

```html
<img alt="山川" src="https://youdomain.com/upload/2021/01/1.png"/>
<img alt="河流" src="https://youdomain.com/upload/2021/01/2.png"/>
<img alt="绿树" src="https://youdomain.com/upload/2021/01/3.png"/>
```

### 获取所有图片的数量（count）

#### 语法

```html
<@photoTag method="count">
// do something
</@photoTag>
```

参数：

1. method：count

#### 返回参数

```json
count: long
```

#### 示例

```html
<@linkTag method="count">
<span>图片数量：${count!0}</span>
</@linkTag>
```

输出：

```html
<span>图片数量：20</span>
```

## 分页（paginationTag）

### 获取首页文章列表的分页数据（index）

#### 语法

```html
<@paginationTag method="index" page="${posts.number}" total="${posts.totalPages}" display="3">
// do something
</@paginationTag>
```

参数：

1. method：index
2. page：当前页，通过 `${posts.number}` 得到
3. total：总页数，通过 `${posts.totalPages}` 得到
4. display：页码展示数量

#### 返回参数

pagination：

```json
{
    "nextPageFullPath": "string",
    "prevPageFullPath": "string",
    "hasPrev": true,
    "hasNext": true,
    "rainbowPages": [{
        "page": 0,
        "fullPath": "string",
        "isCurrent": true
    }]
}
```

#### 示例

```html
<ul class="pagination">
    <@paginationTag method="index" page="${posts.number}" total="${posts.totalPages}" display="3">
        <#if pagination.hasPrev>
            <li>
                <a href="${pagination.prevPageFullPath!}">上一页</a>  
            </li>
        </#if>
        <#list pagination.rainbowPages as number>
            <#if number.isCurrent>
                <li>
                    <span class="current">${number.page!}</span>
                </li>
            <#else>
                <li>
                    <a href="${number.fullPath!}">${number.page!}</a>
                </li>
            </#if>
        </#list>
        <#if pagination.hasNext>
            <li>
                <a href="${pagination.nextPageFullPath!}">下一页</a>  
            </li>
        </#if>
    </@paginationTag>
</ul>
```

输出：

```html
<ul class="pagination">
    <li>
        <a href="http://localhost:8090/page/1">上一页</a>
    </li>
    <li>
        <a href="http://localhost:8090/page/1">1</a>
    </li>
    <li>
        <span class="current">2</span>
    </li>
    <li>
        <a href="http://localhost:8090/page/3">3</a>
    </li>
    <li>
        <a href="http://localhost:8090/page/3">下一页</a>
    </li>
</ul>
```

### 获取文章归档列表的分页数据（archives）

#### 语法

```html
<@paginationTag method="archives" page="${posts.number}" total="${posts.totalPages}" display="3">
// do something
</@paginationTag>
```

参数：

1. method：archives
2. page：当前页，通过 `${posts.number}` 得到
3. total：总页数，通过 `${posts.totalPages}` 得到
4. display：页码展示数量

#### 返回参数

pagination：

```json
{
    "nextPageFullPath": "string",
    "prevPageFullPath": "string",
    "hasPrev": true,
    "hasNext": true,
    "rainbowPages": [{
        "page": 0,
        "fullPath": "string",
        "isCurrent": true
    }]
}
```

#### 示例

```html
<ul class="pagination">
    <@paginationTag method="archives" page="${posts.number}" total="${posts.totalPages}" display="3">
        <#if pagination.hasPrev>
            <li>
                <a href="${pagination.prevPageFullPath!}">上一页</a>  
            </li>
        </#if>
        <#list pagination.rainbowPages as number>
            <#if number.isCurrent>
                <li>
                    <span class="current">${number.page!}</span>
                </li>
            <#else>
                <li>
                    <a href="${number.fullPath!}">${number.page!}</a>
                </li>
            </#if>
        </#list>
        <#if pagination.hasNext>
            <li>
                <a href="${pagination.nextPageFullPath!}">下一页</a>  
            </li>
        </#if>
    </@paginationTag>
</ul>
```

输出：

```html
<ul class="pagination">
    <li>
        <a href="http://localhost:8090/archives/page/1">上一页</a>
    </li>
    <li>
        <a href="http://localhost:8090/archives/page/1">1</a>
    </li>
    <li>
        <span class="current">2</span>
    </li>
    <li>
        <a href="http://localhost:8090/archives/page/3">3</a>
    </li>
    <li>
        <a href="http://localhost:8090/archives/page/3">下一页</a>
    </li>
</ul>
```

### 获取搜索结果文章列表的分页数据（search）

#### 语法

```html
<@paginationTag method="search" page="${posts.number}" total="${posts.totalPages}" keyword="${keyword}" display="3">
// do something
</@paginationTag>
```

参数：

1. method：search
2. page：当前页，通过 `${posts.number}` 得到
3. total：总页数，通过 `${posts.totalPages}` 得到
4. keyword: 关键词
5. display：页码展示数量

#### 返回参数

pagination：

```json
{
    "nextPageFullPath": "string",
    "prevPageFullPath": "string",
    "hasPrev": true,
    "hasNext": true,
    "rainbowPages": [{
        "page": 0,
        "fullPath": "string",
        "isCurrent": true
    }]
}
```

#### 示例

```html
<ul class="pagination">
    <@paginationTag method="search" page="${posts.number}" total="${posts.totalPages}" keyword="${keyword}" display="3">
        <#if pagination.hasPrev>
            <li>
                <a href="${pagination.prevPageFullPath!}">上一页</a>  
            </li>
        </#if>
        <#list pagination.rainbowPages as number>
            <#if number.isCurrent>
                <li>
                    <span class="current">${number.page!}</span>
                </li>
            <#else>
                <li>
                    <a href="${number.fullPath!}">${number.page!}</a>
                </li>
            </#if>
        </#list>
        <#if pagination.hasNext>
            <li>
                <a href="${pagination.nextPageFullPath!}">下一页</a>  
            </li>
        </#if>
    </@paginationTag>
</ul>
```

输出：

```html
<ul class="pagination">
    <li>
        <a href="http://localhost:8090/search/page/1?keyword=keyword">上一页</a>
    </li>
    <li>
        <a href="http://localhost:8090/search/page/1?keyword=keyword">1</a>
    </li>
    <li>
        <span class="current">2</span>
    </li>
    <li>
        <a href="http://localhost:8090/search/page/3?keyword=keyword">3</a>
    </li>
    <li>
        <a href="http://localhost:8090/search/page/3?keyword=keyword">下一页</a>
    </li>
</ul>
```

### 获取标签下文章列表的分页数据（tagPosts）

#### 语法

```html
<@paginationTag method="tagPosts" slug="${tag.slug!}" page="${posts.number}" total="${posts.totalPages}" display="3">
// do something
</@paginationTag>
```

参数：

1. method：tagPosts
2. page：当前页，通过 `${posts.number}` 得到
3. total：总页数，通过 `${posts.totalPages}` 得到
4. display：页码展示数量
5. slug：标签 slug

#### 返回参数

pagination：

```json
{
    "nextPageFullPath": "string",
    "prevPageFullPath": "string",
    "hasPrev": true,
    "hasNext": true,
    "rainbowPages": [{
        "page": 0,
        "fullPath": "string",
        "isCurrent": true
    }]
}
```

#### 示例

```html
<ul class="pagination">
    <@paginationTag method="tagPosts" slug="${tag.slug!}" page="${posts.number}" total="${posts.totalPages}" display="3">
        <#if pagination.hasPrev>
            <li>
                <a href="${pagination.prevPageFullPath!}">上一页</a>  
            </li>
        </#if>
        <#list pagination.rainbowPages as number>
            <#if number.isCurrent>
                <li>
                    <span class="current">${number.page!}</span>
                </li>
            <#else>
                <li>
                    <a href="${number.fullPath!}">${number.page!}</a>
                </li>
            </#if>
        </#list>
        <#if pagination.hasNext>
            <li>
                <a href="${pagination.nextPageFullPath!}">下一页</a>  
            </li>
        </#if>
    </@paginationTag>
</ul>
```

输出：

```html
<ul class="pagination">
    <li>
        <a href="http://localhost:8090/tags/demo/page/1">上一页</a>
    </li>
    <li>
        <a href="http://localhost:8090/tags/demo/page/1">1</a>
    </li>
    <li>
        <span class="current">2</span>
    </li>
    <li>
        <a href="http://localhost:8090/tags/demo/page/3">3</a>
    </li>
    <li>
        <a href="http://localhost:8090/tags/demo/page/3">下一页</a>
    </li>
</ul>
```

### 获取分类下文章列表的分页数据（categoryPosts）

#### 语法

```html
<@paginationTag method="categoryPosts" slug="${category.slug!}" page="${posts.number}" total="${posts.totalPages}" display="3">
// do something
</@paginationTag>
```

参数：

1. method：categoryPosts
2. page：当前页，通过 `${posts.number}` 得到
3. total：总页数，通过 `${posts.totalPages}` 得到
4. display：页码展示数量
5. slug：标签 slug

#### 返回参数

pagination：

```json
{
    "nextPageFullPath": "string",
    "prevPageFullPath": "string",
    "hasPrev": true,
    "hasNext": true,
    "rainbowPages": [{
        "page": 0,
        "fullPath": "string",
        "isCurrent": true
    }]
}
```

#### 示例

```html
<ul class="pagination">
    <@paginationTag method="categoryPosts" slug="${category.slug!}" page="${posts.number}" total="${posts.totalPages}" display="3">
        <#if pagination.hasPrev>
            <li>
                <a href="${pagination.prevPageFullPath!}">上一页</a>  
            </li>
        </#if>
        <#list pagination.rainbowPages as number>
            <#if number.isCurrent>
                <li>
                    <span class="current">${number.page!}</span>
                </li>
            <#else>
                <li>
                    <a href="${number.fullPath!}">${number.page!}</a>
                </li>
            </#if>
        </#list>
        <#if pagination.hasNext>
            <li>
                <a href="${pagination.nextPageFullPath!}">下一页</a>  
            </li>
        </#if>
    </@paginationTag>
</ul>
```

输出：

```html
<ul class="pagination">
    <li>
        <a href="http://localhost:8090/categories/demo/page/1">上一页</a>
    </li>
    <li>
        <a href="http://localhost:8090/categories/demo/page/1">1</a>
    </li>
    <li>
        <span class="current">2</span>
    </li>
    <li>
        <a href="http://localhost:8090/categories/demo/page/3">3</a>
    </li>
    <li>
        <a href="http://localhost:8090/categories/demo/page/3">下一页</a>
    </li>
</ul>
```

### 获取图库页面图片列表的分页数据（photos）

#### 语法

```html
<@paginationTag method="photos" page="${photos.number}" total="${photos.totalPages}" display="3">
// do something
</@paginationTag>
```

参数：

1. method：photos
2. page：当前页，通过 `${photos.number}` 得到
3. total：总页数，通过 `${photos.totalPages}` 得到
4. display：页码展示数量

#### 返回参数

pagination：

```json
{
    "nextPageFullPath": "string",
    "prevPageFullPath": "string",
    "hasPrev": true,
    "hasNext": true,
    "rainbowPages": [{
        "page": 0,
        "fullPath": "string",
        "isCurrent": true
    }]
}
```

#### 示例

```html
<ul class="pagination">
    <@paginationTag method="photos" page="${photos.number}" total="${photos.totalPages}" display="3">
        <#if pagination.hasPrev>
            <li>
                <a href="${pagination.prevPageFullPath!}">上一页</a>  
            </li>
        </#if>
        <#list pagination.rainbowPages as number>
            <#if number.isCurrent>
                <li>
                    <span class="current">${number.page!}</span>
                </li>
            <#else>
                <li>
                    <a href="${number.fullPath!}">${number.page!}</a>
                </li>
            </#if>
        </#list>
        <#if pagination.hasNext>
            <li>
                <a href="${pagination.nextPageFullPath!}">下一页</a>  
            </li>
        </#if>
    </@paginationTag>
</ul>
```

输出：

```html
<ul class="pagination">
    <li>
        <a href="http://localhost:8090/photos/page/1">上一页</a>
    </li>
    <li>
        <a href="http://localhost:8090/photos/page/1">1</a>
    </li>
    <li>
        <span class="current">2</span>
    </li>
    <li>
        <a href="http://localhost:8090/photos/page/3">3</a>
    </li>
    <li>
        <a href="http://localhost:8090/photos/page/3">下一页</a>
    </li>
</ul>
```

### 获取日志页面日志列表的分页数据（journals）

#### 语法

```html
<@paginationTag method="journals" page="${journals.number}" total="${journals.totalPages}" display="3">
// do something
</@paginationTag>
```

参数：

1. method：journals
2. page：当前页，通过 `${journals.number}` 得到
3. total：总页数，通过 `${journals.totalPages}` 得到
4. display：页码展示数量

#### 返回参数

pagination：

```json
{
    "nextPageFullPath": "string",
    "prevPageFullPath": "string",
    "hasPrev": true,
    "hasNext": true,
    "rainbowPages": [{
        "page": 0,
        "fullPath": "string",
        "isCurrent": true
    }]
}
```

#### 示例

```html
<ul class="pagination">
    <@paginationTag method="journals" page="${journals.number}" total="${journals.totalPages}" display="3">
        <#if pagination.hasPrev>
            <li>
                <a href="${pagination.prevPageFullPath!}">上一页</a>  
            </li>
        </#if>
        <#list pagination.rainbowPages as number>
            <#if number.isCurrent>
                <li>
                    <span class="current">${number.page!}</span>
                </li>
            <#else>
                <li>
                    <a href="${number.fullPath!}">${number.page!}</a>
                </li>
            </#if>
        </#list>
        <#if pagination.hasNext>
            <li>
                <a href="${pagination.nextPageFullPath!}">下一页</a>  
            </li>
        </#if>
    </@paginationTag>
</ul>
```

输出：

```html
<ul class="pagination">
    <li>
        <a href="http://localhost:8090/journals/page/1">上一页</a>
    </li>
    <li>
        <a href="http://localhost:8090/journals/page/1">1</a>
    </li>
    <li>
        <span class="current">2</span>
    </li>
    <li>
        <a href="http://localhost:8090/journals/page/3">3</a>
    </li>
    <li>
        <a href="http://localhost:8090/journals/page/3">下一页</a>
    </li>
</ul>
```
