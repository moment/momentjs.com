var fs = require("fs"),
  path = require("path"),
  matter = require("@11ty/gray-matter");

function markdownFiles(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap(function (entry) {
      var file = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return markdownFiles(file);
      }

      return path.extname(entry.name) === ".md" ? [file] : [];
    })
    .sort();
}

module.exports = function (type, root) {
  var files = markdownFiles(path.join(type, root)),
    groups = [],
    cache = {};

  files.forEach(function (file) {
    var parsed = matter.read(file),
      groupPath = path.basename(path.dirname(file)),
      itemPath = path.basename(file, ".md"),
      groupSlug = groupPath.replace(/^\d\d-/, ""),
      itemSlug = itemPath.replace(/^\d\d-/, ""),
      group = cache[groupSlug],
      item = parsed.data;

    if (!group) {
      group = cache[groupSlug] = {
        slug: groupSlug,
        items: [],
      };
      groups.push(group);
    }

    if (itemPath === "00-intro") {
      group.title = item.title;
    }

    group.items.push(item);

    item.body = parsed.content;
    item.slug = groupSlug + "/" + itemSlug;
    item.edit =
      "https://github.com/moment/momentjs.com/blob/master/" +
      type +
      "/" +
      root +
      "/" +
      groupPath +
      "/" +
      itemPath +
      ".md";
  });

  return groups;
};
