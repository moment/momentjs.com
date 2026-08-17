const fs = require("fs");
const path = require("path");

module.exports = function () {
  const locales = { en: "English (United States)" };
  const directory = path.join(
    path.dirname(require.resolve("moment/package.json")),
    "locale"
  );

  for (const filename of fs.readdirSync(directory).sort()) {
    const source = fs.readFileSync(path.join(directory, filename), "utf8");
    const description = source.match(/^\/\/! locale\s*:\s*(.+) \[([^\]]+)\]/m);
    const deprecated = /^\/\/! note\s*:\s*DEPRECATED/m.test(source);

    if (!description) {
      throw new Error("Missing locale description in " + filename);
    }

    if (description[2] !== path.basename(filename, path.extname(filename))) {
      throw new Error("Locale name does not match filename: " + filename);
    }

    if (!deprecated) {
      locales[description[2]] = description[1].trim();
    }
  }

  return Object.entries(locales)
    .map(function ([abbr, name]) {
      return { abbr, name };
    })
    .sort(function (left, right) {
      if (left.name < right.name) return -1;
      if (left.name > right.name) return 1;
      return 0;
    });
};
