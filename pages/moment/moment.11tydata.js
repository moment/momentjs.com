const loadDocs = require("../../data/docs");

module.exports = function () {
  return {
    docs: loadDocs("docs", "moment"),
    guides: loadDocs("guides", "moment"),
    navigation: [
      { title: "Home", href: "/" },
      { title: "Docs", href: "/docs/" },
      { title: "Guides", href: "/guides/" },
      { title: "Tests", href: "/tests/" },
    ],
    permalink: function (data) {
      return data.page.inputPath.endsWith("/index.hbs")
        ? "/"
        : "/" + data.page.fileSlug + "/";
    },
  };
};
