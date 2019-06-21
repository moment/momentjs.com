---
title: Webpack
signature: |
  npm install moment-timezone
---

```javascript
var moment = require('moment-timezone');
moment().tz("America/Los_Angeles").format();
```

**Note:** By default, webpack bundles _all_ moment-timezone data (in moment-timezone 0.5.25, that’s over 900 KBs minified). To strip out unwanted data and bundle only the zone and date range data you need, add the [`moment-timezone-data-webpack-plugin`](https://www.npmjs.com/package/moment-timezone-data-webpack-plugin) package:

<!-- skip-example -->

```javascript
// webpack.config.js
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');
const currentYear = new Date().getFullYear();

module.exports = {
    plugins: [
        // To include only specific zones, use the matchZones option
        new MomentTimezoneDataPlugin({
            matchZones: /^America/
        }),

        // To keep all zones but limit data to specific years, use the year range options
        new MomentTimezoneDataPlugin({
            startYear: currentYear - 5,
            endYear: currentYear + 5,
        }),
    ],
};
```

Also see the primary [Moment.js Webpack documentation](https://momentjs.com/docs/#/use-it/webpack/) for an example of how to reduce Moment’s bundled locale data.
Together these techniques can significantly reduce the final bundle size (by over 1 MB minified, or 85 KB minified + gzipped).
