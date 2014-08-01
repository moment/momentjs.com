---
title: Changing locales locally
version: 1.7.0
signature: |
  // From version 2.8.1 onward
  moment().locale(String);

  // Deprecated version 2.8.1
  moment().lang(String);
---


A global locale configuration can be problematic when passing around moments that may need to be formatted into different locale.

In **1.7.0** we added instance specific locale configurations.

```javascript
moment.locale('en'); // default the locale to English
var globalLocale = moment();
var localLocale = moment();

localLocale.locale('fr'); // set this instance to use French
localLocale.format('LLLL'); // dimanche 15 juillet 2012 11:01
globalLocale.format('LLLL'); // Sunday, July 15 2012 11:01 AM

moment.locale('es'); // change the global locale to Spanish
localLocale.format('LLLL'); // dimanche 15 juillet 2012 11:01
globalLocale.format('LLLL'); // Domingo 15 Julio 2012 11:03

localLocale.locale(false); // reset the instance locale
localLocale.format('LLLL'); // Domingo 15 Julio 2012 11:03
globalLocale.format('LLLL'); // Domingo 15 Julio 2012 11:03
```

If you call `moment#locale` with no parameters, you get back the locale configuration that would be used for that moment.

```javascript
var fr = moment().locale('fr');
fr.locale().months(moment([2012, 0])) // "janvier"
fr.locale('en');
fr.locale().months(moment([2012, 0])) // "January"
```

If you need to access the locale data for a moment, this is the preferred way to do so.

As of **2.3.0**, you can also specify an array of locale identifiers. It works the same was it does in the [global locale configuration](http://localhost:8000/docs/#/i18n/changing-locale/).
