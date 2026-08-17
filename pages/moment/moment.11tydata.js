const loadDocs = require("../../data/docs");
const { applyMomentCdn, loadMomentCdn } = require("../../data/moment-cdn");

module.exports = async function () {
  const docs = loadDocs("docs", "moment");
  const momentCdn = await loadMomentCdn();

  return {
    docs: applyMomentCdn(docs, momentCdn),
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
