import "meilisearch-docsearch/css";
import React, { useEffect } from "react";

export default function SearchBarWrapper(props) {
  useEffect(() => {
    const docsearch = require("meilisearch-docsearch").default;

    const destroy = docsearch({
      container: "#docsearch",
      host: "https://docsearch.halo.run",
      // Default Search API Key
      // Use it to search from the frontend
      apiKey:
        "883d046131979fa8bc9bbc7d006ccb13a353cb5ce847cca50a49fad4f35b3f77",
      indexUid: "docs",
    });

    return () => destroy();
  }, []);
  return (
    <>
      <div id="docsearch"></div>
    </>
  );
}
