It is sometimes useful to get the list of months or weekdays in a language, for example when populating a dropdown menu.

```javascript
moment.months();
```

Returns the list of months in the current language.

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

Similarly, `moment.monthsShort` returns abbreviated month names, and `moment.weekdays `moment.weekdaysShort`, `moment.weekdaysMin` return lists of weekdays.

You can pass an integer into each of those functions to get a specific month or weekday.

```javascript
moment.weekday(3); // 'Wednesday'
```

**Note:** Currently, weekdays always have Sunday as index 0, regardless of the local first day of the week.

Some languages make special considerations into account when formatting month names. For example, Dutch formats month abbreviations without a trailing period, but only if it's formatting the month between dashes. The `months` method supports passing a format in so that the months will be listed in the proper context.

```javascript
moment.lang('nl');
moment.monthsShort(); // ['jan.', 'feb.', 'mrt.', ...]
moment.monthsShort('-MMM-'); // [ 'jan', 'feb', 'mrt', ...]
```

And finally, you can combine both the format option and the integer option.

```javascript
moment.monthsShort('-MMM-', 3); // 'apr'
```
