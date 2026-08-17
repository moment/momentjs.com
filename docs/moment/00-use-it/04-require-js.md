---
title: RequireJS
signature: |
  npm install moment
---

Moment can be loaded as an AMD module with RequireJS. Configure Moment as a
package so that its core, locales, and bundled builds resolve from the same
directory. The `location` is relative to your `baseUrl` and should point to the
installed Moment package.

<!-- skip-example -->

```javascript
requirejs.config({
  packages: [
    {
      name: 'moment',
      location: 'node_modules/moment',
      main: 'moment',
    },
  ],
});
```

Use one of the following approaches in an application module. Each `define()`
example belongs in a separate source file.

<!-- skip-example -->

```javascript
define(['moment'], function (moment) {
  return moment().format();
});
```

To load an individual locale, include it as a dependency before selecting it:

<!-- skip-example -->

```javascript
define(['moment', 'moment/locale/de'], function (moment) {
  moment.locale('de');
  return moment().format('LLLL');
});
```

Alternatively, load the self-contained build containing all locales. Do not
load this module together with `moment`; they create separate Moment instances.

<!-- skip-example -->

```javascript
define(['moment/min/moment-with-locales'], function (moment) {
  moment.locale('de');
  return moment().format('LLLL');
});
```

A locale can also be loaded later. It is registered before the RequireJS
callback runs.

<!-- skip-example -->

```javascript
define(['require', 'moment'], function (require, moment) {
  require(['moment/locale/de'], function () {
    moment.locale('de');
    // Use Moment here, after the locale has loaded.
  });
});
```

See the RequireJS documentation for more information about
[package configuration](https://requirejs.org/docs/api.html#packages).
