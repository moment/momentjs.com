---
title: Locale
version: 2.17.1
signature: |
  moment.duration().locale().humanize();
---



Do you want to be able to return the length of time in any language? Well now you can! By chaining `locale(locale).humanize())` to a `moment#locale|duration#locale` instance,
you can bring back appropriate messages about time in all our supported languages. Some simple suffixless examples in English, French and Spanish are below.

```javascript
moment.duration(1, "minutes").locale("en").humanize(); // a minute
moment.duration(1, "minutes").locale("fr").humanize(); // une minute
moment.duration(1, "minutes").locale("es").humanize(); // un minuto
```

For an appropriate suffix in each language, pass in a true boolean into the humanize method as below.

```javascript
moment.duration(1, "minutes").locale("en").humanize(true); // in a minute
moment.duration(1, "minutes").locale("fr").humanize(true); // dans une minute
moment.duration(1, "minutes").locale("es").humanize(true); // en un minuto
```

If you pass in a negative number, you will get an appropriate message to express that the event has already passed in that language.

```javascript
moment.duration(-1, "minutes").locale("en").humanize(true); // a minute ago
moment.duration(-1, "minutes").locale("fr").humanize(true); // il y a une minute
moment.duration(-1, "minutes").locale("es").humanize(true); // hace un minuto
```
