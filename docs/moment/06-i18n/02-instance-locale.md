---
title: Changing locales locally
version: 1.7.0
signature: |
  // From version 2.8.1 onward
  moment().locale(String|String[]|Boolean);

  // Deprecated version 2.8.1
  moment().lang(String|String[]|Boolean);
---


A global locale configuration can be problematic when passing around moments that may need to be formatted into different locale.

```javascript
moment.locale('en'); // default the locale to English
var localLocale = moment();

localLocale.locale('fr'); // set this instance to use French
localLocale.format('LLLL'); // dimanche 15 juillet 2012 11:01
moment().format('LLLL'); // Sunday, July 15 2012 11:01 AM

moment.locale('es'); // change the global locale to Spanish
localLocale.format('LLLL'); // dimanche 15 juillet 2012 11:01
moment().format('LLLL'); // Domingo 15 Julio 2012 11:01

localLocale.locale(['tq', 'fr']); // set this instance to the first localization found
localLocale.format('LLLL'); // dimanche 15 juillet 2012 11:01
moment().format('LLLL'); // Sunday, July 15 2012 11:01 AM

localLocale.locale(false); // reset the instance locale
localLocale.format('LLLL'); // Domingo 15 Julio 2012 11:01
moment().format('LLLL'); // Domingo 15 Julio 2012 11:01
```

If you call `moment#locale` with no parameters, you get back the locale configuration that would be used for that moment.

```javascript
var fr = moment().locale('fr');
fr.localeData().months(moment([2012, 0])) // "janvier"
fr.locale('en');
fr.localeData().months(moment([2012, 0])) // "January"
```

If you need to access the locale data for a moment, this is the preferred way to do so.

As of **2.3.0**, you can also specify an array of locale identifiers. It works the same way it does in the [global locale configuration](#/i18n/changing-locale/).
