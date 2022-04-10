---
title: 配置文件
description: 主题配置文件的说明
---

> Halo 的主题模块使用 yaml 来对主题进行配置，`theme.yaml` 里面主要描述主题的名称，开发者的信息，开源地址等等。`settings.yaml` 包含了主题所有的配置选项，需要注意的是，这些选项仅仅是用于构建配置表单，并不起到对主题的配置作用。

## theme.yaml

```yaml
id: 主题id，唯一，不能与其他主题一样。我们建议设置为 `作者名_主题名称`
name: 主题名称
author:
  name: 作者名称
  website: 作者网址
description: 主题描述
logo: 主题 Logo 地址
website: 主题地址，可填写为 git 仓库地址
repo: 主题 git 仓库地址，如有填写，后台可在线更新
version: 版本号
require: 最低支持的 Halo 版本，如：1.3.0，那么如果用户的版本为 1.3.0 以下，则无法安装

postMetaField:              文章自定义 meta 变量
  - meta_key  

sheetMetaField:
  - meta_key                页面自定义 meta 变量
```

示例：

```yaml
id: caicai_anatole
name: Anatole
author:
  name: Caicai
  website: https://www.caicai.me
description: A other Halo theme
logo: https://avatars1.githubusercontent.com/u/1811819?s=460&v=4
website: https://github.com/halo-dev/halo-theme-anatole
repo: https://github.com/halo-dev/halo-theme-anatole
version: 1.0.0
require: 1.3.0
postMetaField:
  - music_url               # 假设在文章页面需要播放背景音乐，用户可以自己填写音乐地址。
  - download_url            # 假设在文章页有一个下载按钮，那么用户也可以自己填写加载地址。

sheetMetaField:
  - music_url 
  - download_url
```

### 自定义 meta

这个为 1.2.0 引入的功能，用户可以在文章设置中设置自定义 meta，我们在 `theme.yaml` 中填写的 `postMetaField` 和 `sheetMetaField` 为预设项，当用户激活当前主题之后，在文章设置中即可看到预先设置好的项，然后填写对应的值即可。

关于这个 meta 变量如何调用的问题，会在后面的模板变量中阐述。

## settings.yaml

```yaml
# Tab 节点
group1:
  label: 第一个 Tab 名称
  # 表单项
  items:
    # 省略
group2:
  label: 第二个 Tab 名称
  # 表单项
  items:
    # 省略
```

## settings.yaml#items

> settings.yaml 的 items 下即为所有表单元素，所支持的表单元素如下

```yaml
items:

    # 普通文本框
    item1:
      name: item1               // 设置项的 name 值，在页面可通过 ${settings.item1!} 获取值。
      label: item1              // 表单项的 label
      type: text                // 表单项类型：普通文本框
      placeholder: ''           // 表单项的 placeholder，一般给用户提示
      default: ''               // 表单项的默认值
      description: ''           // 描述，一般用于说明该设置的具体用途
      
    # 颜色选择框
    item1:
      name: item1               // 设置项的 name 值，在页面可通过 ${settings.item1!} 获取值。
      label: item1              // 表单项的 label
      type: color               // 表单项类型：颜色选择框
      placeholder: ''           // 表单项的 placeholder，一般给用户提示
      default: ''               // 表单项的默认值
      description: ''           // 描述，一般用于说明该设置的具体用途
    
    # 附件选择框
    item1:
      name: item1               // 设置项的 name 值，在页面可通过 ${settings.item1!} 获取值。
      label: item1              // 表单项的 label
      type: attachment               // 表单项类型：颜色选择框
      placeholder: ''           // 表单项的 placeholder，一般给用户提示
      default: ''               // 表单项的默认值
      description: ''           // 描述，一般用于说明该设置的具体用途
      
    # 多行文本框
    item2:                      // 设置项的 name 值，在页面可通过 ${settings.item2!} 获取值。
      name: item2
      label: item2              // 同上
      type: textarea            // 表单项类型：多行文本框
      placeholder: ''           // 同上
      default: ''               // 同上
      description: ''           // 描述，一般用于说明该设置的具体用途

    # 单选框
    item3:
      name: item3               // 同上
      label: item3_label        // 同上
      type: radio               // 表单项类型：单选框
      data-type: bool           // 数据类型：bool，string，long，double
      default: value1           // 同上
      description: ''           // 描述，一般用于说明该设置的具体用途
      options:                  // 选项
        - value: value1         // 值
          label: label1         // 说明
        - value: value2
          label: label2

    # 下拉框
    item4:
      name: item4               // 同上
      label: item4              // 同上
      type: select              // 表单项类型：下拉框
      data-type: bool           // 数据类型：bool，string，long，double
      default: value1           // 同上
      description: ''           // 描述，一般用于说明该设置的具体用途
      options:                  // 选项
        - value: value1         // 值
          label: label1         // 说明
        - value: value2
          label: label2
```

### 一个例子

假设我们的配置文件如下：

```yaml
general:
  label: 基础设置
  items:
    index_title:
      name: index_title           
      label: 首页标题
      type: text 
      description: '注意：将覆盖博客标题'
    background_cover:
      name: background_cover
      label: 首页背景图
      type: attachment
      default: '/casper/assets/images/blog-cover.jpg'
      description: '设置首页的背景图，你可以点击右边的选择按钮选择图片。'
    background_color:
      name: background_color
      label: 首页背景颜色
      type: color
      default: '#fff'
    music_enabled:
      name: music_enabled
      label: 背景音乐
      type: radio
      data-type: bool
      default: false
      description: '是否开启背景音乐，默认为 false'
      options:
        - value: true
          label: 开启
        - value: false
          label: 关闭
    code_pretty:
      name: code_pretty
      label: 文章代码高亮主题
      type: select
      default: Default
      options:
        - value: Default
          label: Default
        - value: Coy
          label: Coy
        - value: Dark
          label: Dark
        - value: Okaidia
          label: Okaidia
        - value: Solarized Light
          label: Solarized Light
        - value: Tomorrow Night
          label: Tomorrow Night
        - value: Twilight
          label: Twilight
```

页面取值：

```html
// 获取首页标题

<#if settings.index_title?? && settings.index_title != ''>
    <h1>${settings.index_title!}</h1>
</#if>
```

```html
// 获取背景图片

<#if settings.background_cover?? && settings.background_cover != ''>
    <img src="${settings.background_cover!}">
</#if>
```

```html
// 获取背景颜色

<style>
    body{
        <#if settings.background_color?? && settings.background_color != ''>
            background-color: ${settings.background_color!}
        <#else>
            background-color: #fff
        </#if>
    }
</style>

或者

<style>
    body{
        background-color: ${settings.background_color!'#fff'}
    }
</style>

```

```html
// 判断是否开启背景音乐

<#if settings.music_enabled!false>
    do something...
</#if>
```

```html
// 获取代码高亮主题

<link rel="stylesheet" type="text/css" href="${theme_base!}/assets/prism/css/prism-${settings.code_pretty!'Default'}.css" />
<script type="text/javascript" src="${theme_base!}/assets/prism/js/prism.js"></script>
```

更多实例可参考：<https://github.com/halo-dev/halo-theme-material/blob/master/settings.yaml>。
