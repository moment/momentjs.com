---
title: Locale
version: 2.17.1
signature: |
  moment.duration().locale();
  moment.duration().locale(String);
---

You can get or set the locale of a duration using `locale(...)`. The locale will affect the duration's string methods, like `humanize()`. See the [intl](#/i18n/) section for more information on internationalization generally.

```javascript
moment.duration(1, "minutes").locale("en").humanize(); // a minute
moment.duration(1, "minutes").locale("fr").humanize(); // une minute
moment.duration(1, "minutes").locale("es").humanize(); // un minuto
```

Suffixes in `humanize()` are also internationalized:

```javascript
moment.duration(1, "minutes").locale("en").humanize(true); // in a minute
moment.duration(1, "minutes").locale("fr").humanize(true); // dans une minute
moment.duration(1, "minutes").locale("es").humanize(true); // en un minuto

moment.duration(-1, "minutes").locale("en").humanize(true); // a minute ago
moment.duration(-1, "minutes").locale("fr").humanize(true); // il y a une minute
moment.duration(-1, "minutes").locale("es").humanize(true); // hace un minuto
```
