---
title: 准备工作
description: 开发环境的准备工作
---

## 环境要求

- [OpenJDK 17 LTS](https://github.com/openjdk/jdk)
- [Node.js 18 LTS](https://nodejs.org)
- [pnpm 8](https://pnpm.io/)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)（可选）

## 名词解释

### 工作目录

指 Halo 所依赖的工作目录，在 Halo 运行的时候会在系统当前用户目录下产生一个 halo-next 的文件夹，绝对路径为 ~/halo-next。里面通常包含下列目录或文件：

1. `db`：存放 H2 Database 的物理文件，如果你使用其他数据库，那么不会存在这个目录。
2. `themes`：里面包含用户所安装的主题。
2. `plugins`：里面包含用户所安装的插件。
5. `attachments`：附件目录。
4. `logs`：运行日志目录。
