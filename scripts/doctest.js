const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const MarkdownIt = require("markdown-it");
const moment = require("moment");
const momentTimezone = require("moment-timezone");

require("moment-timezone/moment-timezone-utils");

const markdown = new MarkdownIt({ html: true });
const skipMarker = "<!-- skip-example -->";
const ignoredDirectory = path.normalize("docs/moment/10-plugins") + path.sep;
const expectedWarnings = {
  "docs/moment-timezone/01-using-timezones/03-converting-to-zone.md:33":
    "Moment Timezone has no data for 2013-11-18 11:55.",
  "docs/moment/07-customization/00-intro.md:18": "Locale fr not found.",
};

moment.suppressDeprecationWarnings = true;

const modules = {
  moment,
  "moment-timezone": momentTimezone,
  "moment/locale/cs": require("moment/locale/cs"),
  "moment/min/locales.min": require("moment/min/locales.min"),
};

// Documentation examples refer to these names without declaring them.
const globals = {
  moment,
  unit: "seconds",
  fetchFriends: function () {
    return [
      { name: "Dan", birthday: "11.12.1977" },
      { name: "Mary", birthday: "11.12.1986" },
      { name: "Stephan", birthday: "11.01.1993" },
    ];
  },
  input: "Jan 1 2001",
  a: moment(),
  b: moment().add(1, "seconds"),
  localeData: moment.localeData(),
  aMoment: moment(),
  longOrShortMonthString: "January",
  minShortOrLongWeekdayString: "Monday",
  dateFormat: "dd-mm-yyyy",
  amPmString: "12:30pm",
  hours: 12,
  minutes: 30,
  isLower: false,
  key: "s",
  withoutSuffix: true,
  isFuture: true,
  number: 1,
  diff: moment(),
  relTime: moment.duration(1, "seconds"),
  str: "a",
  duration: moment.duration(1, "seconds"),
};

function markdownFiles(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap(function (entry) {
      const file = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return markdownFiles(file);
      }

      return /\.(md|markdown)$/i.test(entry.name) ? [file] : [];
    })
    .sort();
}

function snippetsIn(file) {
  const tokens = markdown.parse(fs.readFileSync(file, "utf8"), {});
  const snippets = [];
  let skipNext = false;

  for (const token of tokens) {
    if (token.type === "html_block" && token.content.trim() === skipMarker) {
      skipNext = true;
      continue;
    }

    if (
      token.type !== "fence" ||
      !/^(javascript|js|es6)$/i.test(token.info.trim())
    ) {
      continue;
    }

    snippets.push({
      code: token.content,
      file,
      line: token.map[0] + 2,
      skip: skipNext,
    });
    skipNext = false;
  }

  return snippets;
}

function sandboxRequire(moduleName) {
  if (Object.hasOwn(modules, moduleName)) {
    return modules[moduleName];
  }

  throw new Error(
    'Attempted to require "' +
      moduleName +
      '". Add it to the doctest module map.'
  );
}

function runSnippet(snippet) {
  if (!moment.locales().includes("fr")) {
    const frenchLocale = require.resolve("moment/locale/fr");
    delete require.cache[frenchLocale];
    require(frenchLocale);
  }

  moment.locale("cs");

  const context = vm.createContext({
    require: sandboxRequire,
    console: { log: function () {} },
    ...globals,
  });
  const script = new vm.Script(snippet.code, {
    filename: snippet.file,
    lineOffset: snippet.line - 1,
  });
  const warn = console.warn;
  const error = console.error;
  const expectedWarning = expectedWarnings[snippet.file + ":" + snippet.line];
  const reportUnlessExpected = function (report, message, ...args) {
    if (!expectedWarning || !String(message).startsWith(expectedWarning)) {
      report.call(console, message, ...args);
    }
  };

  console.warn = function (message, ...args) {
    reportUnlessExpected(warn, message, ...args);
  };
  console.error = function (message, ...args) {
    reportUnlessExpected(error, message, ...args);
  };

  try {
    script.runInContext(context, { timeout: 2000 });
  } finally {
    console.warn = warn;
    console.error = error;
  }
}

const files = [
  "README.md",
  ...markdownFiles("docs"),
  ...markdownFiles("guides"),
].filter(function (file) {
  return !path.normalize(file).startsWith(ignoredDirectory);
});

for (const snippet of files.flatMap(snippetsIn)) {
  test(snippet.file + ":" + snippet.line, { skip: snippet.skip }, function () {
    runSnippet(snippet);
  });
}
