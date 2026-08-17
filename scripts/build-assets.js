const fs = require("fs");
const path = require("path");
const sass = require("sass");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");

function ensureParent(destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
}

function copy(source, destination) {
  ensureParent(destination);
  fs.copyFileSync(source, destination);
}

function concatenate(sources, destination, transform) {
  const content = sources
    .map(function (source) {
      const value = fs.readFileSync(source, "utf8");
      return transform ? transform(value, source) : value;
    })
    .join("\n");

  ensureParent(destination);
  fs.writeFileSync(destination, content);
}

function libraryFile(name, filename) {
  return path.join(
    path.dirname(require.resolve(name + "/package.json")),
    filename
  );
}

module.exports = async function () {
  fs.mkdirSync("build", { recursive: true });
  fs.cpSync("assets/img", "build/static/img", { recursive: true });
  copy("CNAME", "build/CNAME");
  fs.writeFileSync("build/.nojekyll", "");

  const scripts = {
    "core-home.js": ["assets/js/core-home.js"],
    "docs.js": ["assets/js/docs.js"],
    "news.js": ["assets/js/news.js"],
    "timezone-home.js": ["assets/js/timezone-home.js"],
    "global.js": [
      libraryFile("moment", "moment.js"),
      libraryFile("moment", "min/locales.js"),
      libraryFile("moment-timezone", "builds/moment-timezone-with-data.js"),
      "assets/js/global.js",
    ],
  };

  for (const [name, sources] of Object.entries(scripts)) {
    concatenate(sources, path.join("build/static/js", name));
  }

  const css = sass.compile("assets/css/style.scss", {
    style: "compressed",
    silenceDeprecations: ["import", "global-builtin"],
  }).css;
  const prefixed = await postcss([
    autoprefixer({ overrideBrowserslist: ["> 1%", "last 2 versions", "IE 9"] }),
  ]).process(css, {
    from: "assets/css/style.scss",
    to: "build/static/css/style.css",
  });
  ensureParent("build/static/css/style.css");
  fs.writeFileSync("build/static/css/style.css", prefixed.css);

  const downloads = {
    "moment.js": libraryFile("moment", "moment.js"),
    "moment.min.js": libraryFile("moment", "min/moment.min.js"),
    "moment-with-locales.js": libraryFile(
      "moment",
      "min/moment-with-locales.js"
    ),
    "moment-with-locales.min.js": libraryFile(
      "moment",
      "min/moment-with-locales.min.js"
    ),
    "moment-timezone.js": libraryFile("moment-timezone", "moment-timezone.js"),
    "moment-timezone.min.js": libraryFile(
      "moment-timezone",
      "builds/moment-timezone.min.js"
    ),
    "moment-timezone-with-data.js": libraryFile(
      "moment-timezone",
      "builds/moment-timezone-with-data.js"
    ),
    "moment-timezone-with-data.min.js": libraryFile(
      "moment-timezone",
      "builds/moment-timezone-with-data.min.js"
    ),
    "moment-timezone-with-data-1970-2030.js": libraryFile(
      "moment-timezone",
      "builds/moment-timezone-with-data-1970-2030.js"
    ),
    "moment-timezone-with-data-1970-2030.min.js": libraryFile(
      "moment-timezone",
      "builds/moment-timezone-with-data-1970-2030.min.js"
    ),
    "moment-timezone-with-data-10-year-range.js": libraryFile(
      "moment-timezone",
      "builds/moment-timezone-with-data-10-year-range.js"
    ),
    "moment-timezone-with-data-10-year-range.min.js": libraryFile(
      "moment-timezone",
      "builds/moment-timezone-with-data-10-year-range.min.js"
    ),
  };

  for (const [name, source] of Object.entries(downloads)) {
    copy(source, path.join("build/downloads", name));
  }

  copy(
    libraryFile("moment-timezone", "data/meta/latest.json"),
    "build/data/moment-timezone-meta.json"
  );
};
