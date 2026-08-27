import * as path from 'node:path';
import { pluginSass } from '@rsbuild/plugin-sass';
import { defineConfig } from '@rspress/core';
import { transformerCompatibleMetaHighlight } from '@rspress/core/shiki-transformers';
import { pluginSitemap } from '@rspress/plugin-sitemap';
import fileTree from 'rspress-plugin-file-tree';
import ga from 'rspress-plugin-google-analytics';
import mermaid from 'rspress-plugin-mermaid';
import Icons from 'unplugin-icons/rspack';

const SITE_URL = 'https://docs.halo.run';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  themeDir: path.join(__dirname, 'theme'),
  lang: 'zh',
  title: 'Halo 文档',
  logoText: 'Halo 文档',
  icon: '/img/favicon-96x96.png',
  logo: 'https://www.halo.run/logo',
  llms: true,
  siteOrigin: SITE_URL,
  globalStyles: path.join(__dirname, 'styles/index.scss'),
  route: {
    cleanUrls: true,
  },
  markdown: {
    showLineNumbers: true,
    link: {
      checkDeadLinks: true,
    },
    shiki: {
      theme: 'github-dark',
      transformers: [transformerCompatibleMetaHighlight()],
    },
  },
  outDir: 'build',
  plugins: [
    pluginSitemap({
      siteUrl: SITE_URL,
    }),
    mermaid(),
    ga({
      id: 'UA-110780416-7',
    }),
    fileTree(),
  ],
  builderConfig: {
    plugins: [pluginSass()],
    html: {
      tags: [
        {
          tag: 'script',
          attrs: {
            src: 'https://track.halo.run/api/script.js',
            defer: true,
            'data-site-id': '3',
          },
        },
      ],
    },
    tools: {
      rspack: {
        plugins: [Icons({ compiler: 'jsx', jsx: 'react' })],
      },
    },
  },
  themeConfig: {
    lastUpdated: true,
    enableScrollToTop: true,
    editLink: {
      docRepoBaseUrl: 'https://github.com/halo-dev/docs/tree/main/docs',
    },
    socialLinks: [
      {
        icon: 'github',
        mode: 'github-stars',
        content: 'https://github.com/halo-dev/halo',
      },
    ],
  },
});
