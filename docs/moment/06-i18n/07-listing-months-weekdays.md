---
title: Listing the months and weekdays of the current Moment.js locale
version: 2.3.0
signature: |
  moment.months()
  moment.monthsShort()
  moment.weekdays()
  moment.weekdaysShort()
  moment.weekdaysMin()
---


It is sometimes useful to get the list of months or weekdays in a locale, for example when populating a dropdown menu.

```javascript
moment.months();
```

Returns the list of months in the current locale.

```javascript
[ 'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December' ]
```

Similarly, `moment.monthsShort` returns abbreviated month names, and `moment.weekdays`, `moment.weekdaysShort`, `moment.weekdaysMin` return lists of weekdays.

You can pass an integer into each of those functions to get a specific month or weekday.

```javascript
moment.weekdays(3); // 'Wednesday'
```

As of **2.13.0** you can pass a bool as the first parameter of the weekday functions. If true, the weekdays will be returned in locale specific order.
For instance, in the Arabic locale, Saturday is the first day of the week, thus:

```javascript
moment.locale('ar');
moment.weekdays(true); // lists weekdays Saturday-Friday in Arabic
moment.weekdays(true, 2); //will result in Monday in Arabic
```


**Note:** Absent the locale specific parameter, weekdays always have Sunday as index 0, regardless of the local first day of the week.

Some locales make special considerations into account when formatting month names. For example, Dutch formats month abbreviations without a trailing period, but only if it's formatting the month between dashes. The `months` method supports passing a format in so that the months will be listed in the proper context.

```javascript
moment.locale('nl');
moment.monthsShort(); // ['jan.', 'feb.', 'mrt.', ...]
moment.monthsShort('-MMM-'); // [ 'jan', 'feb', 'mrt', ...]
```

And finally, you can combine both the format option and the integer option.

```javascript
moment.monthsShort('-MMM-', 3); // 'apr'
```
