function parseTitleFromMeta(meta) {
  if (!meta) {
    return "";
  }
  const kvList = meta.split(" ").filter(Boolean);
  for (const item of kvList) {
    const [k, v = ""] = item.split("=").filter(Boolean);
    if (k === "title" && v.length > 0) {
      return v.replace(/["'`]/g, "");
    }
  }
  return "";
}

/** @type {import('shiki').ShikiTransformer} */
export function transformerAddMeta() {
  return {
    name: "shiki-transformer:add-meta",
    pre(pre) {
      const title = parseTitleFromMeta(this.options.meta?.__raw);
      const lang = this.options.lang;
      if (title.length > 0) {
        pre.properties = {
          ...pre.properties,
          "data-title": title,
          "data-lang": lang,
        };
      }
      return pre;
    },
  };
}
