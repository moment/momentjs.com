---
title: Browser
signature: |
  <script src="moment.js"></script>
  <script src="moment-timezone-with-data.js"></script>
---

When using Moment Timezone in the browser, you will need to load the data as well as the library.

You can either use the prebuilt library and data files linked on [the homepage](/timezone/) or build a subset of the data yourself and [load it](#/data-loading/).

```js
moment().tz("America/Los_Angeles").format();
```
