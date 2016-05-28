---
title: Checking the current Moment.js locale
version: 1.6.0
signature: |
  // From version 2.8.1 onward
  moment.locale();

  // Deprecated in version 2.8.1
  moment.lang();
---


If you are changing locales frequently, you may want to know what locale is currently being used. This is as simple as calling `moment.locale` without any parameters.

```javascript
moment.locale('en'); // set to english
moment.locale(); // returns 'en'
moment.locale('fr'); // set to french
moment.locale(); // returns 'fr'
```

As of version **2.12.0** it is possible to list all locales that have been loaded and are available to use:

```javascript
moment.locales()
```
