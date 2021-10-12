const path = require("path");

function pluginWwads() {
  return {
    name: "docusaurus-plugin-wwads",

    getClientModules() {
      return [path.resolve(__dirname, "./wwads")];
    },

    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: "script",
            attributes: {
              async: true,
              src: `https://cdn.wwads.cn/js/makemoney.js`,
            },
          },
        ],
      };
    },
  };
}

exports.default = pluginWwads;
