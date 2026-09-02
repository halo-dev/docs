---
title: 准备工作
description: 准备 Halo 核心开发环境，列出 OpenJDK、Node.js、pnpm、IntelliJ IDEA、Git 等工具要求，并说明工作目录及数据、主题、插件、附件和日志结构。
---

## 环境要求

- [OpenJDK 21 LTS](https://github.com/openjdk/jdk)
- [Node.js 20 LTS](https://nodejs.org)
- [pnpm 10](https://pnpm.io/)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)（可选）

## 名词解释

### 工作目录

指 Halo 所依赖的工作目录，在 Halo 运行的时候会在系统当前用户目录下产生一个 halo-next 的文件夹，绝对路径为 ~/halo-next。里面通常包含下列目录或文件：

1. `db`：存放 H2 Database 的物理文件，如果你使用其他数据库，那么不会存在这个目录。
2. `themes`：里面包含用户所安装的主题。
3. `plugins`：里面包含用户所安装的插件。
4. `attachments`：附件目录。
5. `logs`：运行日志目录。
