const loadDocs = require("../../data/docs");
const loadNews = require("../../data/news");
const { applyMomentCdn, loadMomentCdn } = require("../../data/moment-cdn");

module.exports = async function () {
  const docs = loadDocs("docs", "moment");
  const momentCdn = await loadMomentCdn();

  return {
    docs: applyMomentCdn(docs, momentCdn),
    guides: loadDocs("guides", "moment"),
    news: loadNews("news", "moment"),
    navigation: [
      { title: "Home", href: "/" },
      { title: "Docs", href: "/docs/" },
      { title: "Guides", href: "/guides/" },
      { title: "News", href: "/news/" },
    ],
    permalink: function (data) {
      return data.page.inputPath.endsWith("/index.hbs")
        ? "/"
        : "/" + data.page.fileSlug + "/";
    },
  };
};
