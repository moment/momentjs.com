---
title: Webpack Tooling
---

By default, webpack bundles all Moment.js locales. The
[`moment-locales-webpack-plugin`](https://www.npmjs.com/package/moment-locales-webpack-plugin)
can strip unnecessary locales and bundle only the ones that are used, but the
plugin is no longer actively maintained.

<!-- skip-example -->

```javascript
// webpack.config.js
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
    plugins: [
        // To strip all locales except “en”
        new MomentLocalesPlugin(),

        // Or: To strip all locales except “en”, “es-us” and “ru”
        // (“en” is built into Moment and can’t be removed)
        new MomentLocalesPlugin({
            localesToKeep: ['es-us', 'ru'],
        }),
    ],
};
```

The [How to optimize Moment.js with webpack](https://github.com/jmblog/how-to-optimize-momentjs-with-webpack)
guide is also retained as a historical resource, but it is no longer actively
maintained and some examples target older webpack versions.
