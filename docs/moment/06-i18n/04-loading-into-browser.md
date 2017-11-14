---
title: Loading locales in the browser
version: 1.0.0
signature: |
  // From 2.8.1 onward
  moment.locale(String, Object);

  // Deprecated in 2.8.1
  moment.lang(String, Object);
---


Loading locales in the browser just requires you to include the locale files. Be sure to specify the charset to prevent encoding issues.

```html
<script src="moment.js"></script>
<script src="locale/fr.js" charset="UTF-8"></script>
<script src="locale/pt.js" charset="UTF-8"></script>
<script>
  moment.locale('fr');  // Set the default/global locale
  // ...
</script>
```

There are minified versions of all locales together:

```html
<script src="moment.js"></script>
<script src="min/locales.js" charset="UTF-8"></script>
```

To minimize HTTP requests, use our Grunt task to compile [Moment](https://github.com/moment/moment) with a custom list of locales:

```bash
grunt transpile:fr,it
```

```html
<script src="min/moment-with-locales.custom.js" charset="UTF-8"></script>
```

If you are using JSPM as plugin manager, you should add the locale in your lib.

```
import * as moment from 'moment';
import 'moment/locale/fr';
```

**Note:** Locale files are defined in [UMD](https://github.com/umdjs/umd) style, so they should work seamlessly in all environments.
