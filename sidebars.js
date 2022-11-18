/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  tutorialSidebar: [
    "intro",
    {
      type: "category",
      label: "入门",
      collapsed: false,
      items: [
        "getting-started/prepare",
        {
          type: "category",
          label: "安装指南",
          items: [
            // "getting-started/install/linux",
            "getting-started/install/docker",
            "getting-started/install/docker-compose",
          ],
        },
        // "getting-started/config",
        // "getting-started/upgrade",
        // "getting-started/downloads",
      ],
    },
    // {
    //   type: "category",
    //   label: "用户指南",
    //   items: [
    //     "user-guide/backup-migration",
    //     "user-guide/markdown",
    //     "user-guide/faq",
    //   ],
    // },
    {
      type: "category",
      label: "开发者指南",
      items: [
        {
          type: "category",
          label: "系统开发",
          items: [
            // "developer-guide/core/structure",
            "developer-guide/core/prepare",
            "developer-guide/core/run",
            // "developer-guide/core/code-style",
          ],
        },
        {
          type: "category",
          label: "插件开发",
          items: ["developer-guide/plugin/prepare"],
        },
        {
          type: "category",
          label: "主题开发",
          items: [
            "developer-guide/theme/prepare",
            "developer-guide/theme/structure",
            "developer-guide/theme/config",
            "developer-guide/theme/settings",
            "developer-guide/theme/static-resources",
            "developer-guide/theme/template-route-mapping",
            "developer-guide/theme/template-variables",
            "developer-guide/theme/finder-apis",
            "developer-guide/theme/code-snippets",
          ],
        },
        // {
        //   type: "link",
        //   label: "REST API",
        //   href: "https://api.halo.run",
        // },
      ],
    },
    {
      type: "category",
      label: "参与贡献",
      items: ["contribution/issue", "contribution/pr"],
    },
    "about",
  ],
};
