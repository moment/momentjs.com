---
title: Webpack
---

```bash
npm install moment
```

<!-- skip-example -->

```javascript
import moment from 'moment';

moment().format();
```

CommonJS projects can use `const moment = require('moment')` instead.

Moment uses a dynamic locale lookup, so webpack includes every Moment locale by
default. If locales are not selected dynamically, use webpack's built-in
`IgnorePlugin` to exclude that context:

<!-- skip-example -->

```javascript
// webpack.config.cjs
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ],
};
```

Import each locale the application uses explicitly:

<!-- skip-example -->

```javascript
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');
moment().format('LL');
```

For a runtime-selected locale allowlist, use webpack's
[`ContextReplacementPlugin`](https://webpack.js.org/plugins/context-replacement-plugin/).
Moment does not tree-shake effectively, so check the resulting bundle size.
