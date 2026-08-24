---
title: Changing locale globally
version: 1.0.0
signature: |
  // From 2.8.1 onward
  moment.locale(String);
  moment.locale(String[]);

  // Deprecated in 2.12.0
  // Use moment.defineLocale to create a custom locale or
  // moment.updateLocale to modify an existing locale.
  moment.locale(String, Object);

  // Deprecated in 2.8.1
  // Use moment.locale instead.
  moment.lang(String);
  moment.lang(String[]);

  // Deprecated in 2.8.1
  // Use moment.defineLocale to create a custom locale or
  // moment.updateLocale to modify an existing locale.
  moment.lang(String, Object);
---

By default, Moment.js comes with English (United States) locale strings. If you need other locales, you can load them into Moment.js for later use. See the sections on loading locales in [Node.js](#/i18n/loading-into-nodejs/) and the [browser](#/i18n/loading-into-browser/).

To modify an existing locale definition, see the [customization](#/customization/) section. To create a custom locale, see [Creating a Custom Locale](#/customization/creating-a-custom-locale/).

Once you load a locale, it becomes the active locale. To change active locales, simply call `moment.locale` with the key of a loaded locale.

```javascript
moment.locale('fr');
moment(1316116057189).fromNow(); // il y a une heure
moment.locale('en');
moment(1316116057189).fromNow(); // an hour ago
```

As of **2.21.0**, Moment will `console.warn` if the locale is unavailable.

As of **2.8.0**, changing the global locale doesn't affect existing instances.

```javascript
moment.locale('fr');
var m = moment(1316116057189);
m.fromNow(); // il y a une heure

moment.locale('en');
m.fromNow(); // il y a une heure
moment(1316116057189).fromNow(); // an hour ago
```

`moment.locale` returns the locale used. This is useful because Moment won't change locales if it doesn't know the one you specify.

```javascript
moment.locale('fr'); // 'fr'
moment.locale('tq'); // 'fr'
```

You may also specify a list of locales, and Moment will use the first one it has localizations for.

```javascript
moment.locale(['tq', 'fr']); // 'fr'
```

Moment will also try locale specifier substrings from most-specific to least-specific until it finds a locale it knows. This is useful when supplying Moment with a locale string pulled from the user's environment, such as `window.navigator.language`.

```javascript
moment.locale('en-nz'); // 'en'
```

Finally, Moment will search intelligently through an array of locales and their substrings.

```javascript
moment.locale(['en-nz', 'en-au']); // 'en-au', not 'en'
```

The logic works as follows -- the next locale is picked and tried as-is.
If that fails, the code normally tries to chop the last bit (normally
the country designation) and try again. However, if the next array
element has the same or longer prefix as the one to be tried, the
iteration continues. So for example if the array has the sequence

```text
"AA-BB", "AA-CC", "XX-YY"
```

then first "AA-BB" is tried, then a naive solution would try "AA", but
this one instead checks to see that "AA-CC" is actually more concrete
than "AA", so it tries "AA-CC" next, and only after it fails (if it
fails) it tries "AA", because "XX-YY" does not have "AA" as prefix. So
in the end the following locales are tried in this order (assuming all
fail so the next one is tried):

```text
"AA-BB", "AA-CC", "AA", "XX-YY", "XX"
```
