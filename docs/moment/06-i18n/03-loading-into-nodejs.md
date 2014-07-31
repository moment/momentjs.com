---
title: Loading locales in NodeJS
version: 1.0.0
signature: |
  moment.locale(String);
---


Loading locales in NodeJS is super easy. If there is a locale file in `moment-root/locale/` named after that key, the first call to `moment.locale` will load it.

```javascript
var moment = require('moment');
moment.locale('fr');
moment(1316116057189).fromNow(); // il y a une heure
```

If you want your locale supported, create a pull request to the `develop` branch with the [required locale and unit test files](#/i18n/adding-locale/).
