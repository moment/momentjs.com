---
title: Loading locales in the browser
version: 1.0.0
signature: |
  // From 2.8.1 onward
  moment.locale(String, Object);

  // Deprecated in 2.8.1
  moment.lang(String, Object);
---


Loading locales in the browser just requires you to include the locale files.

```html
<script src="moment.js"></script>
<script src="locale/fr.js"></script>
<script src="locale/pt.js"></script>
<script>
  moment.locale('fr');  // Set the default/global locale
  // ...
</script>
```

There are minified versions of all locales together:

```html
<script src="moment.js"></script>
<script src="min/locales.js"></script>
```

To minimize http requests, use our Grunt task to compile [Moment](https://github.com/moment/moment/) with a custom list of locales:

```bash
grunt transpile:fr,it
```

```html
<script src="min/moment-with-locales.custom.js"></script>
```

**Note:** Locale files are defined in [UMD](https://github.com/umdjs/umd) style, so they should work seamlessly in all environments.
