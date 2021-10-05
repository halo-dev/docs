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
    favicon: "img/favicon.ico",
    i18n: {
      defaultLocale: 'zh-CN',
      locales: ['zh-CN']
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
            showLastUpdateAuthor: true
          },
          blog: {
            showReadingTime: true,
            // Please change this to your repo.
            editUrl:
              "https://github.com/facebook/docusaurus/edit/main/website/blog/",
          },
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
            src: "https://docs.halo.run/assets/adaptive2.png",
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
          ],
        },
        footer: {
          style: "dark",
          copyright: `Copyright © ${new Date().getFullYear()} halo-dev, Inc. Built with Docusaurus.`,
        },
        prism: {
          theme: darkCodeTheme,
          darkTheme: darkCodeTheme,
        },
      }),
  }
);
