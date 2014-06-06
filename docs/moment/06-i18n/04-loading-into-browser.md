---
title: Loading languages in the browser
version: 1.0.0
signature: |
  moment.lang(String, Object);
---


Loading languages in the browser just requires you to include the language files.

```html
<script src="moment.min.js"></script>
<script src="min/lang/fr.js"></script>
<script src="min/lang/pt.js"></script>
```

There are minified versions of each of these languages. There is also a minified version of all of the languages bundled together.

```html
<script src="moment.min.js"></script>
<script src="lang/all.min.js"></script>
```

Ideally, you would bundle all the files you need into one file to minimize http requests.

```html
<script src="moment-fr-it.min.js"></script>
```

**Note:** the files in the `/lang/` folder are optimized for use in Node.js. If you want to use language files in the browser, use the minified version that are included in `/min/lang/`.
