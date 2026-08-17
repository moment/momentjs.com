const loadDocs = require("../../data/docs");

module.exports = function () {
  return {
    docs: loadDocs("docs", "moment-timezone"),
    guides: loadDocs("guides", "moment-timezone"),
    navigation: [
      { title: "Home", href: "/timezone/" },
      { title: "Docs", href: "/timezone/docs/" },
      { title: "Guides", href: "/timezone/guides/" },
    ],
    permalink: function (data) {
      return data.page.inputPath.endsWith("/index.hbs")
        ? "/timezone/"
        : "/timezone/" + data.page.fileSlug + "/";
    },
  };
};
