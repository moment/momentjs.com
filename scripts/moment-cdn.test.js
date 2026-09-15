const assert = require("node:assert/strict");
const test = require("node:test");
const {
  applyMomentCdn,
  createIntegrity,
  createIntegrityCandidates,
  minifyForCdnjs,
} = require("../data/moment-cdn");

test("createIntegrity returns a SHA-512 SRI value", function () {
  assert.equal(
    createIntegrity(Buffer.from("hello")),
    "sha512-m3HSJL1i83hdltRq0+o9czGb+8KJDKra4t/3JRlnPKcjI8PZm6XBHXx6zG4UuMXaDEZjR1wuXDre9G9zvN7AQw=="
  );
});

test("createIntegrityCandidates returns unique SRI alternatives", function () {
  assert.equal(
    createIntegrityCandidates([
      Buffer.from("hello"),
      Buffer.from("goodbye"),
      Buffer.from("hello"),
    ]),
    "sha512-m3HSJL1i83hdltRq0+o9czGb+8KJDKra4t/3JRlnPKcjI8PZm6XBHXx6zG4UuMXaDEZjR1wuXDre9G9zvN7AQw== " +
      "sha512-3iwDIM3/NycQSd+oy4Nf/VQgAhYlOh37rXWhrlG9MLtJnhTjf+mTui6le4Y/xWME3pQHPYgMnBjrCkac3iEdAg=="
  );
});

test("minifyForCdnjs reproduces the cdnjs minifier settings", function () {
  const source =
    "function example(value) { " +
    "if (value) { return true; } else { return false; } }";

  assert.equal(
    minifyForCdnjs(source).toString(),
    "function example(e){return!!e}"
  );
});

test("applyMomentCdn replaces every CDN placeholder", function () {
  const docs = [
    {
      items: [
        {
          body: [
            "%%MOMENT_CDNJS_URL%%",
            "%%MOMENT_CDNJS_INTEGRITY%%",
            "%%MOMENT_JSDELIVR_URL%%",
            "%%MOMENT_JSDELIVR_INTEGRITY%%",
          ].join(" "),
        },
      ],
    },
  ];
  const metadata = {
    cdnjs: { url: "https://cdnjs.example/moment.js", integrity: "cdnjs-sri" },
    jsdelivr: {
      url: "https://jsdelivr.example/moment.js",
      integrity: "jsdelivr-sri",
    },
  };

  applyMomentCdn(docs, metadata);

  assert.equal(
    docs[0].items[0].body,
    "https://cdnjs.example/moment.js cdnjs-sri " +
      "https://jsdelivr.example/moment.js jsdelivr-sri"
  );

  assert.doesNotThrow(function () {
    applyMomentCdn(docs, metadata);
  });
});

test("applyMomentCdn rejects incomplete documentation placeholders", function () {
  assert.throws(function () {
    applyMomentCdn([{ items: [{ body: "%%MOMENT_CDNJS_URL%%" }] }], {
      cdnjs: { url: "https://cdnjs.example/moment.js", integrity: "cdnjs-sri" },
      jsdelivr: {
        url: "https://jsdelivr.example/moment.js",
        integrity: "jsdelivr-sri",
      },
    });
  }, /Missing Moment CDN placeholders/);
});
