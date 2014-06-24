---
title: Require.js
signature: |
  require.config({
      paths: {
          "moment": "path/to/moment"
      }
  });
  define(["path/to/moment-timezone-with-data"], function (moment) {
      moment().tz("America/Los_Angeles").format();
  });
---
