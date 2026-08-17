var fs = require("fs"),
  path = require("path"),
  matter = require("@11ty/gray-matter");

module.exports = function (type, root) {
  var directory = path.join(type, root),
    slugs = {};

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter(function (entry) {
      return entry.isFile() && path.extname(entry.name) === ".md";
    })
    .map(function (entry) {
      var file = path.join(directory, entry.name),
        parsed = matter.read(file),
        post = parsed.data,
        slug = path.basename(entry.name, ".md");

      ["title", "date", "published"].forEach(function (field) {
        if (!post[field]) {
          throw new Error(file + " is missing required " + field + " metadata");
        }
      });

      if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) {
        throw new Error(file + " has an invalid date; expected YYYY-MM-DD");
      }

      if (slugs[slug]) {
        throw new Error("Duplicate news slug: " + slug);
      }
      slugs[slug] = true;

      post.body = parsed.content.replace(
        "<!-- Signoff -->",
        '<div class="news-signoff-marker"></div>'
      );
      post.slug = slug;

      return post;
    })
    .sort(function (left, right) {
      return left.date < right.date ? 1 : left.date > right.date ? -1 : 0;
    });
};
