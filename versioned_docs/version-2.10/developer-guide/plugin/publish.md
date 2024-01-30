---
title: 发布插件
description: 了解如何与我们的社区分享你的插件
---

了解如何与我们的社区分享你的插件。

## 创建 Release

当你完成了你的插件并进行充分测试后，就可以在 GitHub 上创建新的 Release，其中版本规范可以参考[版本控制](./introduction.md#版本控制)。

## 自动构建

如果你是基于 [halo-dev/plugin-starter](https://github.com/halo-dev/plugin-starter) 创建的插件项目，那么已经包含了适用于 GitHub Action 的 `workflow.yaml` 文件，里面包含了构建插件和发布插件资源到 Release 的步骤，可以根据自己的实际需要进行修改，以下是示例：

```yaml
name: Build Plugin JAR File

on:
  push:
    branches:
      - main
    paths:
      - "**"
      - "!**.md"
  release:
    types:
      - created
  pull_request:
    branches:
      - main
    paths:
      - "**"
      - "!**.md"

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true
      - name: Set up JDK 17
        uses: actions/setup-java@v2
        with:
          distribution: 'temurin'
          cache: 'gradle'
          java-version: 17
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - uses: pnpm/action-setup@v2.0.1
        name: Install pnpm
        id: pnpm-install
        with:
          version: 8
          run_install: false
      - name: Get pnpm store directory
        id: pnpm-cache
        run: |
          echo "::set-output name=pnpm_cache_dir::$(pnpm store path)"
      - uses: actions/cache@v3
        name: Setup pnpm cache
        with:
          path: ${{ steps.pnpm-cache.outputs.pnpm_cache_dir }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/widget/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-
      - name: Install Frontend Dependencies
        run: |
          ./gradlew pnpmInstall
      - name: Build with Gradle
        run: |
          # Set the version with tag name when releasing
          version=${{ github.event.release.tag_name }}
          version=${version#v}
          sed -i "s/version=.*-SNAPSHOT$/version=$version/1" gradle.properties
          ./gradlew clean build -x test
      - name: Archive plugin-starter jar
        uses: actions/upload-artifact@v2
        with:
          name: plugin-starter
          path: |
            build/libs/*.jar
          retention-days: 1

  github-release:
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'release'
    steps:
      - name: Download plugin-starter jar
        uses: actions/download-artifact@v2
        with:
          name: plugin-starter
          path: build/libs
      - name: Get Name of Artifact
        id: get_artifact
        run: |
          ARTIFACT_PATHNAME=$(ls build/libs/*.jar | head -n 1)
          ARTIFACT_NAME=$(basename ${ARTIFACT_PATHNAME})
          echo "Artifact pathname: ${ARTIFACT_PATHNAME}"
          echo "Artifact name: ${ARTIFACT_NAME}"
          echo "ARTIFACT_PATHNAME=${ARTIFACT_PATHNAME}" >> $GITHUB_ENV
          echo "ARTIFACT_NAME=${ARTIFACT_NAME}" >> $GITHUB_ENV
          echo "RELEASE_ID=${{ github.event.release.id }}" >> $GITHUB_ENV
      - name: Upload a Release Asset
        uses: actions/github-script@v2
        if: github.event_name == 'release'
        with:
          github-token: ${{secrets.GITHUB_TOKEN}}
          script: |
            console.log('environment', process.versions);

            const fs = require('fs').promises;

            const { repo: { owner, repo }, sha } = context;
            console.log({ owner, repo, sha });

            const releaseId = process.env.RELEASE_ID
            const artifactPathName = process.env.ARTIFACT_PATHNAME
            const artifactName = process.env.ARTIFACT_NAME
            console.log('Releasing', releaseId, artifactPathName, artifactName)

            await github.repos.uploadReleaseAsset({
              owner, repo,
              release_id: releaseId,
              name: artifactName,
              data: await fs.readFile(artifactPathName)
            });
```

## 发布你的插件

用户可以在你的仓库 Release 下载使用，但为了方便让 Halo 的用户知道你的插件，可以在以下渠道发布：

1. [halo-sigs/awesome-halo](https://github.com/halo-sigs/awesome-halo)：你可以向这个仓库发起一个 PR 提交的插件的信息即可。
2. [Halo 应用市场](https://www.halo.run/store/apps)：Halo 官方的应用市场，但目前还不支持开发者注册和发布，如果你想发布到应用市场，可以在 PR 上说明一下，我们会暂时帮你发布。
3. [Halo 论坛](https://bbs.halo.run/t/plugins)：你可以在 Halo 官方社区的插件板块发布你的插件。
