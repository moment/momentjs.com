In addition to all shorthand methods for getting and setting the date you may specify the unit in a string:

```javascript
var m = moment();
m.date() === m.get('date');
m.clone().date(5) === m.clone().set('date', 5);
```

All supported units: year (years, y), month (months, M), date (dates, d), hour
(hours, h), minute (minutes, m), second (seconds, s), millisecond
(milliseconds, ms).

*Note:* Units are case insensitive.
