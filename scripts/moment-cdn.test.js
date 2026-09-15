const assert = require("node:assert/strict");
const test = require("node:test");
const {
  applyMomentCdn,
  createCdnjsAsset,
  createIntegrity,
} = require("../data/moment-cdn");

test("createIntegrity returns a SHA-512 SRI value", function () {
  assert.equal(
    createIntegrity(Buffer.from("hello")),
    "sha512-m3HSJL1i83hdltRq0+o9czGb+8KJDKra4t/3JRlnPKcjI8PZm6XBHXx6zG4UuMXaDEZjR1wuXDre9G9zvN7AQw=="
  );
});

test("createCdnjsAsset uses the latest published metadata", function () {
  const asset = createCdnjsAsset({
    version: "2.30.1",
    filename: "moment.min.js",
    sri: "sha512-hUhvpC5f8cgc04OZb55j0KNGh4eh7dLxd/dPSJ5VyzqDWxsayYbojWyl5Tkcgrmb/RVKCRJI1jNlRbVP4WWC4w==",
  });

  assert.deepEqual(asset, {
    url: "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js",
    integrity:
      "sha512-hUhvpC5f8cgc04OZb55j0KNGh4eh7dLxd/dPSJ5VyzqDWxsayYbojWyl5Tkcgrmb/RVKCRJI1jNlRbVP4WWC4w==",
  });
});

test("createCdnjsAsset rejects invalid metadata", function () {
  assert.throws(function () {
    createCdnjsAsset({
      version: "latest",
      filename: "moment.min.js",
      sri: "sha512-abc123==",
    });
  }, /invalid Moment metadata/);
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
