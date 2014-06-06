---
title: Require.js
---


```javascript
require.config({
    paths: {
        "moment": "path/to/moment",
        "moment-timezone": "path/to/moment-timezone",
        "moment-timezone-data": "path/to/moment-timezone-data"
    }
});
define(["moment-timezone", "moment-timezone-data"], function (moment) {
	moment().tz("America/Los_Angeles").format();
});
```
