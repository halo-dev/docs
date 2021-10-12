import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

export default (function () {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  return {
    onRouteUpdate() {
      setTimeout(() => {
        const ad = document.getElementsByClassName("table-of-contents");
        const adnode = document.createElement("div");
        adnode.setAttribute("class", "wwads-cn wwads-vertical");
        adnode.setAttribute("data-id", "80");
        adnode.setAttribute("style", "max-width:200px");
        ad[0].parentNode.appendChild(adnode);
      }, 2000);
    },
  };
})();
