---
title: Changing language locally
version: 1.7.0
signature: |
  moment().lang(String);
---


A global language configuration can be problematic when passing around moments that may need to be formatted into different languages.

In **1.7.0** we added instance specific language configurations.

```javascript
moment.lang('en'); // default the language to English
var globalLang = moment();
var localLang = moment();

localLang.lang('fr'); // set this instance to use French
localLang.format('LLLL'); // dimanche 15 juillet 2012 11:01
globalLang.format('LLLL'); // Sunday, July 15 2012 11:01 AM

moment.lang('es'); // change the global language to Spanish
localLang.format('LLLL'); // dimanche 15 juillet 2012 11:01
globalLang.format('LLLL'); // Domingo 15 Julio 2012 11:03

localLang.lang(false); // reset the instance language
localLang.format('LLLL'); // Domingo 15 Julio 2012 11:03
globalLang.format('LLLL'); // Domingo 15 Julio 2012 11:03
```

If you call `moment#lang` with no parameters, you get back the language configuration that would be used for that moment.

```javascript
var fr = moment().lang('fr');
fr.lang().months(moment([2012, 0])) // "janvier"
fr.lang('en');
fr.lang().months(moment([2012, 0])) // "January"
```

If you need to access the language data for a moment, this is the preferred way to do so.

As of **2.3.0**, you can also specify an array of language identifiers. It works the same was it does in the [global language configuration](http://localhost:8000/docs/#/i18n/changing-language/).
