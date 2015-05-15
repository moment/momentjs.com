---
title: Is Between
version: 2.9.0
signature: |
  moment().isBetween(moment-like, moment-like);
  moment().isBetween(moment-like, moment-like, String);
  // where moment-like is Moment|String|Number|Date|Array
---


Check if a moment is between two other moments, optionally looking at unit
scale (minutes, hours, days, etc).

```javascript
moment('2010-10-20').isBetween('2010-10-19', '2010-10-25'); // true
```

If you want to limit the granularity to a unit other than milliseconds, pass the units as the second parameter.

```javascript
moment('2010-10-20').isBetween('2010-01-01', '2012-01-01', 'year'); // false
moment('2010-10-20').isBetween('2009-12-31', '2012-01-01', 'year'); // true
```

Like `moment#isSame`, `moment#isBefore`, `moment#isAfter` any of the units of
time that are supported for `moment#startOf` are supported for
`moment#isBetween`. Year, month, week, day, hour, minute, and second.
