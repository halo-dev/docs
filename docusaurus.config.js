const darkCodeTheme = require("prism-react-renderer/themes/palenight");
const VersionsArchived = require("./versionsArchived.json");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Halo 文档",
  tagline: "Halo 的文档站点",
  url: "https://docs.halo.run",
  baseUrl: "/",
  favicon: "img/favicon-96x96.png",
  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans"],
  },
  organizationName: "halo-dev", // Usually your GitHub org/user name.
  projectName: "halo", // Usually your repo name.

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/halo-dev/docs/edit/main/",
          routeBasePath: "/",
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          lastVersion: "2.13",
          versions: {
            current: {
              label: "2.14.0-SNAPSHOT",
              path: "2.14.0-SNAPSHOT",
            },
          },
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: [
            "/2.0/**",
            "/2.1/**",
            "/2.2/**",
            "/2.3/**",
            "/2.4/**",
            "/2.5/**",
            "/2.6/**",
          ],
        },
        googleAnalytics: {
          trackingID: "UA-110780416-7",
        },
        gtag: {
          trackingID: "UA-110780416-7",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          autoCollapseCategories: true,
        },
      },
      navbar: {
        title: "Halo 文档",
        logo: {
          alt: "Halo Logo",
          src: "https://halo.run/upload/2021/03/Adaptive256-463ca9b92e2d40268431018c07735842.png",
        },
        items: [
          {
            type: "docSidebar",
            position: "left",
            sidebarId: "tutorial",
            label: "使用指南",
          },
          {
            type: "docSidebar",
            position: "left",
            sidebarId: "developer",
            label: "开发者指南",
          },
          {
            type: "docsVersionDropdown",
            position: "right",
            dropdownActiveClassDisabled: true,
            dropdownItemsAfter: [
              ...Object.entries(VersionsArchived).map(
                ([versionName, versionUrl]) => ({
                  label: versionName,
                  href: versionUrl,
                })
              ),
              {
                to: "https://v1.legacy-docs.halo.run",
                label: "1.x",
              },
              {
                to: "/versions",
                label: "All versions",
              },
            ],
          },
          {
            href: "https://halo.run",
            label: "官网",
            position: "right",
          },
          {
            href: "https://bbs.halo.run",
            label: "论坛",
            position: "right",
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
        copyright: `Copyright © 2023 凌霞软件. Built with Docusaurus.`,
        links: [
          {
            title: "关于",
            items: [
              {
                label: "官网",
                href: "https://halo.run",
              },
              {
                label: "应用市场",
                href: "https://halo.run/store/apps",
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
        additionalLanguages: ["java"],
      },
      algolia: {
        apiKey: "739f2a55c6d13d93af146c22a4885669",
        indexName: "docs",
        contextualSearch: true,
        appId: "OG53LY1OQH",
      },
      zoom: {
        selector: ".markdown :not(a) > img",
      },
    }),
  plugins: [
    require.resolve("docusaurus-plugin-image-zoom"),
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            to: "/getting-started/install/docker",
            from: ["/zh/install/docker", "/install/docker"],
          },
          {
            to: "/getting-started/prepare",
            from: ["/zh/install/prepare", "/install/prepare"],
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
        ],
        createRedirects(existingPath) {
          if (existingPath.startsWith("/2.14.0-SNAPSHOT/")) {
            return [
              existingPath.replace("/2.14.0-SNAPSHOT/", "/2.0.0-SNAPSHOT/"),
              existingPath.replace("/2.14.0-SNAPSHOT/", "/2.1.0-SNAPSHOT/"),
              existingPath.replace("/2.14.0-SNAPSHOT/", "/2.2.0-SNAPSHOT/"),
              existingPath.replace("/2.14.0-SNAPSHOT/", "/2.3.0-SNAPSHOT/"),
              existingPath.replace("/2.14.0-SNAPSHOT/", "/2.4.0-SNAPSHOT/"),
              existingPath.replace("/2.14.0-SNAPSHOT/", "/2.5.0-SNAPSHOT/"),
              existingPath.replace("/2.14.0-SNAPSHOT/", "/2.6.0-SNAPSHOT/"),
              existingPath.replace("/2.14.0-SNAPSHOT/", "/2.7.0-SNAPSHOT/"),
              existingPath.replace("/2.14.0-SNAPSHOT/", "/2.8.0-SNAPSHOT/"),
              existingPath.replace("/2.14.0-SNAPSHOT/", "/2.9.0-SNAPSHOT/"),
              existingPath.replace("/2.14.0-SNAPSHOT/", "/2.10.0-SNAPSHOT/"),
              existingPath.replace("/2.14.0-SNAPSHOT/", "/2.11.0-SNAPSHOT/"),
              existingPath.replace("/2.14.0-SNAPSHOT/", "/2.12.0-SNAPSHOT/"),
              existingPath.replace("/2.14.0-SNAPSHOT/", "/2.13.0-SNAPSHOT/"),
            ];
          }
          return undefined;
        },
      },
    ],
  ],
  scripts: [
    {
      src: "https://analytics.halo.run/script.js",
      async: true,
      "data-website-id": "f9995c32-81e9-4e07-91f2-c276a0d63c9f",
    },
  ],
};

module.exports = config;
