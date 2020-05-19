---
title: Require.js
---

We strongly recommend reading
[this](https://github.com/requirejs/requirejs/issues/1554#issuecomment-226269905)
if you plan to use moment with Require.js. Also upgrade to **2.14.0** or above
for best experience.

As a start, you might have acquired moment through bower or node_modules or
anything else that places moment.js together with a locales directory in a base
folder. Then you should use a tool like
[adapt-pkg-main](https://github.com/jrburke/adapt-pkg-main), or manually --
using [packages config](http://requirejs.org/docs/api.html#packages).

<!-- skip-example -->

```javascript
requirejs.config({
  packages: [{
    name: 'moment',
    // This location is relative to baseUrl. Choose bower_components
    // or node_modules, depending on how moment was installed.
    location: '[bower_components|node_modules]/moment',
    main: 'moment'
  }]
});
```

With the above setup, you can require the core with `moment` and `de` locale
with `moment/locale/de`.

<!-- skip-example -->

```javascript
// only needing core
define(['moment'], function (moment) {
	console.log(moment().format('LLLL'));  // 'Friday, June 24, 2016 1:42 AM'
});

// core with single locale
define(['moment', 'moment/locale/de'], function (moment) {
	moment.locale('de');
	console.log(moment().format('LLLL')); // 'Freitag, 24. Juni 2016 01:42'
});

// core with all locales
define(['moment/min/moment-with-locales'], function (moment) {
	moment.locale('de');
	console.log(moment().format('LLLL')); // 'Freitag, 24. Juni 2016 01:42'
});

// async load locale
define(['require', 'moment'], function(require, moment) {
  // Inside some module after the locale is detected. This is the
  // case where the locale is not known before module load time.
  require(['moment/locale/de'], function(localeModule) {
    // here the locale is loaded, but not yet in use
    console.log(moment().format('LLLL'));  // 'Friday, June 24, 2016 1:42 AM'

    moment.locale('de');
    // Use moment now that the locale has been properly set.
    console.log(moment().format('LLLL')); // 'Freitag, 24. Juni 2016 01:42'
  })
});
```

For more complicated use cases please read [excellent explanation by @jrburke](https://github.com/requirejs/requirejs/issues/1554#issuecomment-226269905).

Moment will still create a `moment` global, which is useful to plugins and other third-party code. If you wish to squash that global, use the `noGlobal` option on the module config.

<!-- skip-example -->

```javascript
require.config({
    config: {
        moment: {
            noGlobal: true
        }
    }
});
```

If you don't specify `noGlobal` then the globally exported moment will print
a deprecation warning. From next major release you'll have to export it
yourself if you want that behavior.

For version **2.5.x**, in case you use other plugins that rely on Moment but are
not AMD-compatible you may need to add [`wrapShim:
true`](https://github.com/jrburke/r.js/blob/b8a6982d2923ae8389355edaa50d2b7f8065a01a/build/example.build.js#L68-L78)
to your r.js config.

__Note:__ To allow moment.js plugins to be loaded in requirejs environments, moment is created as a named module. Because of this, moment __must__ be loaded exactly as as `"moment"`, using `paths` to determine the directory. Requiring moment with a path like `"vendor\moment"` will return `undefined`.

__Note:__ From version **2.9.0** moment exports itself as an anonymous module,
so if you're using only the core (no locales / plugins), then you don't need
config if you put it on a non-standard location.
