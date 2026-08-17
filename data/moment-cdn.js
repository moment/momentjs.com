const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

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

function readMomentVersion() {
  const packageFile = path.join(
    __dirname,
    "..",
    "libs",
    "moment",
    "package.json"
  );
  const version = JSON.parse(fs.readFileSync(packageFile, "utf8")).version;

  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error("Moment has an invalid package version: " + version);
  }

  return version;
}

async function fetchAsset(provider, url, version) {
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
  const urls = {
    cdnjs:
      "https://cdnjs.cloudflare.com/ajax/libs/moment.js/" +
      version +
      "/moment.min.js",
    jsdelivr:
      "https://cdn.jsdelivr.net/npm/moment@" + version + "/min/moment.min.js",
  };

  return Promise.all([
    fetchAsset("cdnjs", urls.cdnjs, version),
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
  loadMomentCdn,
};
