---
title: 介绍
description: 插件开发的准备工作
---
插件是由社区创建的程序或应用程序，用于扩展 Halo 的功能。插件在 Halo 中运行并执行一项或多项用户操作。它们允许用户根据自己的喜好扩展或修改 Halo。

## 插件管理

### 支持

Halo 不提供对第三方应用程序的支持。作为插件的开发者，你有责任帮助插件的用户解决技术问题（issues）。
当提交插件到 [awesome-halo](https://github.com/halo-sigs/awesome-halo) 时，
您需要添加服务支持联系人（Support contact）。这可以是用户可以联系的电子邮件地址，也可以是网站或帮助中心的链接。

### 版本控制

为了保持 Halo 生态系统的健康、可靠和安全，每次您对自己拥有的插件进行重大更新时，我们建议在遵循 [semantic versioning spec](http://semver.org/) 的基础上，
发布新版本。遵循语义版本控制规范有助于其他依赖你代码的开发人员了解给定版本的更改程度，并在必要时调整自己的代码。

我们建议你的包版本从1.0.0开始并递增，如下：

| Code status                               | Stage         | Rule                                         | Example version |
| ----------------------------------------- | ------------- | -------------------------------------------- | --------------- |
| First release                             | New product   | 从 1.0.0 开始                                | 1.0.0           |
| Backward compatible bug fixes             | Patch release | 增加第三位数字                               | 1.0.1           |
| Backward compatible new features          | Minor release | 增加中间数字并将最后一位重置为零             | 1.1.0           |
| Changes that break backward compatibility | Major release | 增加第一位数字并将中间和最后一位数字重置为零 | 2.0.0           |
