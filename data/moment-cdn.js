const crypto = require("node:crypto");
const fs = require("node:fs");
const UglifyJS = require("uglify-js");

const placeholders = {
  "%%MOMENT_CDNJS_URL%%": ["cdnjs", "url"],
  "%%MOMENT_CDNJS_INTEGRITY%%": ["cdnjs", "integrity"],
  "%%MOMENT_JSDELIVR_URL%%": ["jsdelivr", "url"],
  "%%MOMENT_JSDELIVR_INTEGRITY%%": ["jsdelivr", "integrity"],
};

let cachedMetadata;

function createIntegrity(content) {
  return (
    "sha512-" + crypto.createHash("sha512").update(content).digest("base64")
  );
}

function createIntegrityCandidates(contents) {
  return Array.from(new Set(contents.map(createIntegrity))).join(" ");
}

function minifyForCdnjs(content) {
  // Match cdnjs/tools compress/js.go; the uglify-js dependency is pinned too.
  const result = UglifyJS.minify(content, {
    compress: { if_return: true },
    mangle: true,
  });

  if (result.error) {
    throw result.error;
  }

  return Buffer.from(result.code);
}

function readMomentVersion() {
  const version = require("moment/package.json").version;

  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error("Moment has an invalid package version: " + version);
  }

  return version;
}

async function fetchAsset(provider, url, version, notFoundFallbacks) {
  let response;

  try {
    response = await fetch(url, {
      headers: { "user-agent": "momentjs.com build" },
      signal: AbortSignal.timeout(15000),
    });
  } catch (error) {
    throw new Error(
      "Failed to fetch Moment from " + provider + ": " + error.message
    );
  }

  if (!response.ok) {
    if (response.status === 404 && notFoundFallbacks) {
      return {
        url: url,
        integrity: createIntegrityCandidates(notFoundFallbacks),
      };
    }

    throw new Error(
      provider + " returned HTTP " + response.status + " for " + url
    );
  }

  const contentType = response.headers.get("content-type") || "";
  if (!/(javascript|ecmascript)/i.test(contentType)) {
    throw new Error(
      provider + " returned an unexpected content type: " + contentType
    );
  }

  const content = Buffer.from(await response.arrayBuffer());
  if (content.length === 0 || content.length > 1024 * 1024) {
    throw new Error(
      provider +
        " returned an unexpected asset size: " +
        content.length +
        " bytes"
    );
  }

  const versionPattern = new RegExp(
    "version=[\\\"']" + version.replace(/\./g, "\\.") + "[\\\"']"
  );
  if (!versionPattern.test(content.toString("utf8"))) {
    throw new Error(provider + " did not return Moment " + version);
  }

  return {
    url: url,
    integrity: createIntegrity(content),
  };
}

function fetchMetadata(version) {
  const momentSource = fs.readFileSync(
    require.resolve("moment/moment.js"),
    "utf8"
  );
  // cdnjs processes these two inputs concurrently into the same output path.
  const cdnjsCandidates = [
    fs.readFileSync(require.resolve("moment/min/moment.min.js")),
    minifyForCdnjs(momentSource),
  ];
  const urls = {
    cdnjs:
      "https://cdnjs.cloudflare.com/ajax/libs/moment.js/" +
      version +
      "/moment.min.js",
    jsdelivr:
      "https://cdn.jsdelivr.net/npm/moment@" + version + "/min/moment.min.js",
  };

  return Promise.all([
    fetchAsset("cdnjs", urls.cdnjs, version, cdnjsCandidates),
    fetchAsset("jsDelivr", urls.jsdelivr, version),
  ]).then(function (assets) {
    return {
      version: version,
      cdnjs: assets[0],
      jsdelivr: assets[1],
    };
  });
}

async function loadMomentCdn() {
  const version = readMomentVersion();

  if (!cachedMetadata || cachedMetadata.version !== version) {
    cachedMetadata = {
      version: version,
      promise: fetchMetadata(version),
    };
  }

  try {
    return await cachedMetadata.promise;
  } catch (error) {
    cachedMetadata = undefined;
    throw error;
  }
}

function applyMomentCdn(docs, metadata) {
  const remaining = new Set(Object.keys(placeholders));

  docs.forEach(function (group) {
    group.items.forEach(function (item) {
      Object.entries(placeholders).forEach(function ([placeholder, location]) {
        const value = metadata[location[0]][location[1]];

        if (item.body.includes(placeholder)) {
          item.body = item.body.split(placeholder).join(value);
          remaining.delete(placeholder);
        } else if (item.body.includes(value)) {
          remaining.delete(placeholder);
        }
      });
    });
  });

  if (remaining.size > 0) {
    throw new Error(
      "Missing Moment CDN placeholders: " + Array.from(remaining).join(", ")
    );
  }

  return docs;
}

module.exports = {
  applyMomentCdn,
  createIntegrity,
  createIntegrityCandidates,
  loadMomentCdn,
  minifyForCdnjs,
};
