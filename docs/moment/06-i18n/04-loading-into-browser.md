---
title: Loading locales in the browser
version: 1.0.0
signature: |
  moment.defineLocale(String, Object);  // From 2.8.0 onward

  moment.lang(String, Object);  // Deprecated in 2.8.0
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

Ideally, you would bundle all the files you need into one file to minimize http requests.

```bash
grunt embedLocales --embedLocales fr,it
```

```html
<script src="min/moment-with-customlocales.js"></script>
```

**Note:** Locale files are defined in [UMD](https://github.com/umdjs/umd) style, so they should work seamlessly in all environments.
