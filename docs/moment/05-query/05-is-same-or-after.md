---
title: Is Same or After
version: 2.11.0
signature: |
  moment().isSameOrAfter(Moment|String|Number|Date|Array);
  moment().isSameOrAfter(Moment|String|Number|Date|Array, String);
---


Check if a moment is after or the same as another moment. The first argument will be parsed as a moment, if not already so.

```javascript
moment('2010-10-20').isSameOrAfter('2010-10-19'); // true
moment('2010-10-20').isSameOrAfter('2010-10-20'); // true
moment('2010-10-20').isSameOrAfter('2010-10-21'); // false
```

If you want to limit the granularity to a unit other than milliseconds, pass the units as the second parameter.

As the second parameter determines the precision, and not just a single value to check, using day will check for year, month and day.

```javascript
moment('2010-10-20').isSameOrAfter('2011-12-31', 'year'); // false
moment('2010-10-20').isSameOrAfter('2010-01-01', 'year'); // true
moment('2010-10-20').isSameOrAfter('2009-12-31', 'year'); // true
```

Like `moment#isSame` and `moment#isBefore`, any of the units of time that are supported for `moment#startOf` are supported for `moment#isSameOrAfter`:

```
year month week day hour minute second
```
