import { promises as fs } from "node:fs";
import * as path from "node:path";
import { define } from "rstack";

const SITE_URL = "https://docs.halo.run";

define.doc(async () => {
  const [
    { pluginSass },
    { transformerCompatibleMetaHighlight },
    { default: fileTree },
    { default: ga },
    { default: mermaid },
    { default: Icons },
  ] = await Promise.all([
    import("@rsbuild/plugin-sass"),
    import("@rspress/core/shiki-transformers"),
    import("rspress-plugin-file-tree"),
    import("rspress-plugin-google-analytics"),
    import("rspress-plugin-mermaid"),
    import("unplugin-icons/rspack"),
  ]);

  return {
    root: path.join(import.meta.dirname, "docs"),
    themeDir: path.join(import.meta.dirname, "theme"),
    lang: "zh",
    title: "Halo 文档",
    logoText: "Halo 文档",
    icon: "/img/favicon-96x96.png",
    logo: "https://www.halo.run/logo",
    siteOrigin: SITE_URL,
    globalStyles: path.join(import.meta.dirname, "styles/index.scss"),
    mediumZoom: {
      selector: ".rspress-doc img:not(.no-zoom)",
    },
    markdown: {
      showLineNumbers: true,
      link: {
        checkDeadLinks: true,
      },
      shiki: {
        theme: "github-dark",
        transformers: [transformerCompatibleMetaHighlight()],
      },
      image: {
        checkDeadImages: true,
      },
    },
    outDir: "build",
    plugins: [
      mermaid(),
      ga({
        id: "UA-110780416-7",
      }),
      fileTree(),
    ],
    builderConfig: {
      plugins: [pluginSass()],
      html: {
        tags: [
          {
            tag: "script",
            attrs: {
              src: "https://track.halo.run/api/script.js",
              defer: true,
              "data-site-id": "3",
            },
          },
        ],
      },
      tools: {
        rspack: {
          plugins: [
            Icons({
              compiler: "jsx",
              jsx: "react",
              customCollections: {
                custom: {
                  "bt-panel": () =>
                    fs.readFile("./theme/images/bt-panel-logo.svg", "utf-8"),
                },
              },
            }),
          ],
        },
      },
    },
    themeConfig: {
      lastUpdated: true,
      enableScrollToTop: true,
      editLink: {
        docRepoBaseUrl: "https://github.com/halo-dev/docs/tree/main/docs",
      },
      socialLinks: [
        {
          icon: "github",
          mode: "link",
          content: "https://github.com/halo-dev/halo",
        },
      ],
    },
  };
});

define.lint(({ js, ts }) => [js.configs.recommended, ts.configs.recommended]);

define.fmt({
  singleQuote: false,
  ignorePatterns: [".agents"],
});

define.staged({
  "*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}": ["rs lint --fix", "rs fmt"],
  "*.{json,jsonc,md,mdx,css,scss,less,html,yml,yaml}": "rs fmt",
});
