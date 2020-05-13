---
title: Loading locales in NodeJS
version: 1.0.0
signature: |
  moment.locale(String);
---


Loading locales in NodeJS is super easy. If there is a locale file in `moment/locale/` named after that key, import it first, then call `moment.locale` to load it.

<!-- skip-example -->

```javascript
var moment = require('moment');
//or
// import moment from 'moment';

// import locale file(s)
import 'moment/locale/fr';

moment.locale('fr');
moment(1316116057189).fromNow(); // il y a 6 ans
```

To save the step of loading individual locales (i.e. just load them all), import the `moment/min/moment-with-locales` module instead.

<!-- skip-example -->

```javascript
import moment from 'moment/min/moment-with-locales';

moment.locale('de');
moment(1316116057189).fromNow(); // vor 6 Jahren
```

If you want your locale supported, create a pull request to the `develop` branch with the [required locale and unit test files](#/i18n/adding-locale/).
