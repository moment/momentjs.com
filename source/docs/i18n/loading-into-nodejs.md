Loading languages in NodeJS is super easy. If there is a language file in `moment/lang/` named after that key, the first call to `moment.lang` will load it.

```javascript
var moment = require('moment');
moment.lang('fr');
moment(1316116057189).fromNow(); // il y a une heure
```

If you want your language supported, create a pull request to the `develop` branch with the [required language and unit test files](#/i18n/adding-language/).
