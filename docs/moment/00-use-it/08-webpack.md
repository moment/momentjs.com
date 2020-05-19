---
title: Webpack
---

```
npm install moment
```

```javascript
var moment = require('moment');
moment().format();
```

**Note:** By default, webpack bundles _all_ Moment.js locales (in Moment.js 2.18.1, that’s 160 minified KBs). To strip unnecessary locales and bundle only the used ones, add [`moment-locales-webpack-plugin`](https://www.npmjs.com/package/moment-locales-webpack-plugin):

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

There are other resources to optimize Moment.js with webpack, [for example this one](https://github.com/jmblog/how-to-optimize-momentjs-with-webpack).
