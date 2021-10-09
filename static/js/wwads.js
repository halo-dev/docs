window.onload = function () {
  const ad = document.getElementsByClassName("table-of-contents");
  const adnode = document.createElement("div");
  adnode.setAttribute("class", "wwads-cn wwads-vertical");
  adnode.setAttribute("data-id", "80");
  adnode.setAttribute('style',"max-width:200px")
  ad[0].parentNode.appendChild(adnode);
};
