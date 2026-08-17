const fs = require("fs");
const path = require("path");
const sass = require("sass");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");

function filesBelow(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap(function (entry) {
      const file = path.join(directory, entry.name);
      return entry.isDirectory() ? filesBelow(file) : [file];
    })
    .sort();
}

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

function checkLibraryVersion(name) {
  const libraryPackage = path.join("libs", name, "package.json");

  if (!fs.existsSync(libraryPackage)) {
    throw new Error(
      "Missing " + name + " submodule. Run `git submodule update --init`."
    );
  }

  const expected = require(name + "/package.json").version;
  const actual = require(path.resolve(libraryPackage)).version;

  if (actual !== expected) {
    throw new Error(
      name +
        " submodule is " +
        actual +
        ", but the installed npm package is " +
        expected +
        "."
    );
  }
}

module.exports = async function () {
  checkLibraryVersion("moment");
  checkLibraryVersion("moment-timezone");

  fs.mkdirSync("build", { recursive: true });
  fs.cpSync("assets/img", "build/static/img", { recursive: true });
  copy("CNAME", "build/CNAME");
  fs.writeFileSync("build/.nojekyll", "");

  const scripts = {
    "core-home.js": ["assets/js/core-home.js"],
    "docs.js": ["assets/js/docs.js"],
    "timezone-home.js": ["assets/js/timezone-home.js"],
    "global.js": [
      "libs/moment/moment.js",
      "libs/moment/min/locales.js",
      "libs/moment-timezone/builds/moment-timezone-with-data.js",
      "assets/js/global.js",
    ],
    "core-test.js": [
      "node_modules/qunit/qunit/qunit.js",
      "assets/js/test-begin.js",
      "libs/moment/min/moment-with-locales.js",
      "libs/moment/min/tests.js",
      "assets/js/test-end.js",
    ],
  };

  for (const [name, sources] of Object.entries(scripts)) {
    concatenate(sources, path.join("build/static/js", name));
  }

  const timezoneTests = [
    "libs/moment-timezone/moment-timezone-utils.js",
    "assets/js/timezone-test-start.js",
    "libs/nodeunit/nodeunit.js",
    ...filesBelow("libs/moment-timezone/tests/helpers").filter((file) =>
      file.endsWith(".js")
    ),
    ...filesBelow("libs/moment-timezone/tests/zones").filter((file) =>
      file.endsWith(".js")
    ),
    ...filesBelow("libs/moment-timezone/tests/moment-timezone").filter((file) =>
      file.endsWith(".js")
    ),
    "assets/js/test-nodeunit.js",
    "assets/js/timezone-test-end.js",
  ];

  concatenate(
    timezoneTests,
    "build/static/js/timezone-test.js",
    function (source, filename) {
      if (filename.includes("libs/moment-timezone/tests")) {
        return "\n(function(){\n\n" + source + "\n\n}());\n";
      }
      return source;
    }
  );

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
    "moment.js": "libs/moment/moment.js",
    "moment.min.js": "libs/moment/min/moment.min.js",
    "moment-with-locales.js": "libs/moment/min/moment-with-locales.js",
    "moment-with-locales.min.js": "libs/moment/min/moment-with-locales.min.js",
    "moment-timezone.js": "libs/moment-timezone/moment-timezone.js",
    "moment-timezone.min.js":
      "libs/moment-timezone/builds/moment-timezone.min.js",
    "moment-timezone-with-data.js":
      "libs/moment-timezone/builds/moment-timezone-with-data.js",
    "moment-timezone-with-data.min.js":
      "libs/moment-timezone/builds/moment-timezone-with-data.min.js",
    "moment-timezone-with-data-1970-2030.js":
      "libs/moment-timezone/builds/moment-timezone-with-data-1970-2030.js",
    "moment-timezone-with-data-1970-2030.min.js":
      "libs/moment-timezone/builds/moment-timezone-with-data-1970-2030.min.js",
    "moment-timezone-with-data-10-year-range.js":
      "libs/moment-timezone/builds/moment-timezone-with-data-10-year-range.js",
    "moment-timezone-with-data-10-year-range.min.js":
      "libs/moment-timezone/builds/moment-timezone-with-data-10-year-range.min.js",
  };

  for (const [name, source] of Object.entries(downloads)) {
    copy(source, path.join("build/downloads", name));
  }

  copy(
    "libs/moment-timezone/data/unpacked/latest.json",
    "build/data/moment-timezone-unpacked.json"
  );
  copy(
    "libs/moment-timezone/data/meta/latest.json",
    "build/data/moment-timezone-meta.json"
  );
};
