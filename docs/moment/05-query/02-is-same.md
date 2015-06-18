---
title: Is Same
version: 2.0.0
signature: |
  moment().isSame(Moment|String|Number|Date|Array);
  moment().isSame(Moment|String|Number|Date|Array, String);
---


Check if a moment is the same as another moment.

```javascript
moment('2010-10-20').isSame('2010-10-20'); // true
```

If you want to limit the granularity to a unit other than milliseconds, pass the units as the second parameter.

As the second parameter determines the precision, and not just a single value to check, using day will check for year, month and day.

```javascript
moment('2010-10-20').isSame('2009-12-31', 'year'); // false
moment('2010-10-20').isSame('2010-01-01', 'year'); // true
moment('2010-10-20').isSame('2010-12-31', 'year'); // true
moment('2010-10-20').isSame('2011-01-01', 'year'); // false
```

Like `moment#isAfter` and `moment#isBefore`, any of the units of time that are supported for `moment#startOf` are supported for `moment#isSame`. Year, month, week, day, hour, minute, and second.
