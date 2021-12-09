const darkCodeTheme = require("prism-react-renderer/themes/palenight");

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(
  module.exports = {
    title: "Halo Documents",
    tagline: "Halo 博客系统的文档站点",
    url: "https://docs.halo.run",
    baseUrl: "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/favicon-96x96.png",
    i18n: {
      defaultLocale: "zh-Hans",
      locales: ["zh-Hans"],
    },
    organizationName: "halo-dev", // Usually your GitHub org/user name.
    projectName: "halo", // Usually your repo name.

    presets: [
      [
        "@docusaurus/preset-classic",
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            sidebarPath: require.resolve("./sidebars.js"),
            // Please change this to your repo.
            editUrl: "https://github.com/halo-dev/docs/edit/main/",
            routeBasePath: "/",
            showLastUpdateTime: true,
            showLastUpdateAuthor: true,
          },
          blog: false,
          theme: {
            customCss: require.resolve("./src/css/custom.css"),
          },
          sitemap: {
            changefreq: "weekly",
            priority: 0.5,
          },
        }),
      ],
    ],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        navbar: {
          title: "Halo Documents",
          logo: {
            alt: "Halo Logo",
            src: "https://halo.run/upload/2021/03/Adaptive256-463ca9b92e2d40268431018c07735842.png",
          },
          items: [
            {
              href: "https://halo.run",
              label: "官网",
            },
            {
              href: "https://bbs.halo.run",
              label: "论坛",
            },
            {
              href: "https://github.com/halo-dev/halo",
              label: "GitHub",
              position: "right",
            },
            {
              href: "https://gitee.com/halo-dev/halo",
              label: "Gitee",
              position: "right",
            },
          ],
        },
        footer: {
          style: "dark",
          copyright: `Copyright © ${new Date().getFullYear()} halo-dev, Inc. Built with Docusaurus.`,
          links: [
            {
              title: "关于",
              items: [
                {
                  label: "官网",
                  href: "https://halo.run",
                },
                {
                  label: "主题仓库",
                  href: "https://halo.run/themes.html",
                },
                {
                  label: "GitHub 组织",
                  href: "https://github.com/halo-dev",
                },
                {
                  label: "Gitee 组织",
                  href: "https://gitee.com/halo-dev",
                },
                {
                  label: "Server Status",
                  href: "https://status.halo.run",
                },
              ],
            },
            {
              title: "社区",
              items: [
                {
                  label: "官方论坛",
                  href: "https://bbs.halo.run",
                },
                {
                  label: "微信公众号",
                  href: "https://halo.run/upload/2021/03/B3C27F16-4890-4633-81CC-20BA4B28F94F-2415126255c749b290312ca22d9bdeb0.jpeg",
                },
                {
                  label: "微信群申请",
                  href: "https://wj.qq.com/s2/8434455/9170/",
                },
                {
                  label: "GitHub Issues",
                  href: "https://github.com/halo-dev/halo/issues",
                },
                {
                  label: "Telegram Channel",
                  href: "https://t.me/halo_dev",
                },
                {
                  label: "Telegram Group",
                  href: "https://t.me/HaloBlog",
                },
              ],
            },
          ],
        },
        prism: {
          theme: darkCodeTheme,
          darkTheme: darkCodeTheme,
        },
        googleAnalytics: {
          trackingID: "UA-110780416-7",
        },
        gtag: {
          trackingID: "UA-110780416-7",
        },
        algolia: {
          apiKey: "739f2a55c6d13d93af146c22a4885669",
          indexName: "docs",
          contextualSearch: true,
          appId: "OG53LY1OQH",
        },
      }),
    plugins: [
      [
        "@docusaurus/plugin-client-redirects",
        {
          redirects: [
            {
              to: "/getting-started/install/linux",
              from: [
                "/zh/install",
                "/install",
                "/zh/install/index",
                "/install/index",
                "/zh/install/linux",
                "/install/linux",
              ],
            },
            {
              to: "/getting-started/install/docker",
              from: ["/zh/install/docker", "/install/docker"],
            },
            {
              to: "/getting-started/install/other/bt-panel",
              from: ["/zh/install/bt-panel", "/install/bt-panel"],
            },
            {
              to: "/getting-started/install/other/oneinstack",
              from: ["/zh/install/oneinstack", "/install/oneinstack"],
            },
            {
              to: "/getting-started/install/other/tencent-cloudbase",
              from: [
                "/zh/install/tencent-cloudbase",
                "/install/tencent-cloudbase",
              ],
            },
            {
              to: "/getting-started/prepare",
              from: ["/zh/install/prepare", "/install/prepare"],
            },
            {
              to: "/getting-started/config",
              from: ["/zh/install/config", "/install/config"],
            },
            {
              to: "/getting-started/upgrade",
              from: ["/zh/install/upgrade", "/install/upgrade"],
            },
            {
              to: "/getting-started/downloads",
              from: ["/zh/install/downloads", "/install/downloads"],
            },
            {
              to: "/user-guide/backup-migration",
              from: ["/zh/user-guide/backup-migration"],
            },
            {
              to: "/user-guide/markdown",
              from: ["/zh/user-guide/markdown"],
            },
            {
              to: "/developer-guide/core/structure",
              from: ["/zh/developer-guide/core", "/developer-guide/core"],
            },
            {
              to: "/developer-guide/theme/prepare",
              from: ["/zh/developer-guide/theme", "/developer-guide/theme"],
            },
            {
              to: "/contribution/issue",
              from: ["/zh/contribution/issue"],
            },
            {
              to: "/contribution/pr",
              from: ["/zh/contribution/pr"],
            },
            {
              to: "/contribution/sponsor",
              from: ["/zh/contribution/sponsor"],
            },
          ],
        },
      ],
    ],
    scripts: [
      {
        src: "https://analytics.halo.run/umami.js",
        async: true,
        defer: true,
        "data-website-id": "7e8d48ad-973d-4b44-b36d-ea1f1df25baa",
      },
    ],
  }
);
