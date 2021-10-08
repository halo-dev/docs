const darkCodeTheme = require("prism-react-renderer/themes/dracula");

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
            editUrl:
              "https://github.com/facebook/docusaurus/edit/main/website/",
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
            trailingSlash: false,
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
            alt: "Halo Documents Logo",
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
                  label: 'Gitee 组织',
                  href: "https://gitee.com/halo-dev",
                },
                {
                  label: 'Server Status',
                  href: "https://status.halo.run",
                }
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
                  label: "微信 & QQ群申请",
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
          apiKey: "YOUR_API_KEY",
          indexName: "YOUR_INDEX_NAME",

          // Optional: see doc section below
          contextualSearch: true,

          // Optional: see doc section below
          appId: "YOUR_APP_ID",

          // Optional: Algolia search parameters
          searchParameters: {},

          //... other Algolia params
        },
      }),
    plugins: ["@docusaurus/plugin-ideal-image"],
  }
);
