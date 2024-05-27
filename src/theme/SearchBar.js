import React, { useEffect } from "react";
import SearchBar from "@theme-original/SearchBar";
import { docsearch } from "meilisearch-docsearch";
import "meilisearch-docsearch/css";

export default function SearchBarWrapper(props) {
  useEffect(() => {
    docsearch({
      container: "#docsearch",
      host: "https://docsearch.halo.run",
      // Default Search API Key
      // Use it to search from the frontend
      apiKey: "4b16205faa360eaa1ee5add67c0d265a4ca1e898ffbea199fe23d487a24c9bc8",
      indexUid: "docs",
    });
  }, []);
  return (
    <>
      <SearchBar {...props} />
      <div id="docsearch"></div>
    </>
  );
}
