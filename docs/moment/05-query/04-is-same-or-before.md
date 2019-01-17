---
title: Is Same or Before
version: 2.11.0
signature: |
  moment().isSameOrBefore(Moment|String|Number|Date|Array);
  moment().isSameOrBefore(Moment|String|Number|Date|Array, String);
---

Check if a moment is before or the same as another moment. The first argument will be parsed as a moment, if not already so.

```javascript
moment('2010-10-20').isSameOrBefore('2010-10-21');  // true
moment('2010-10-20').isSameOrBefore('2010-10-20');  // true
moment('2010-10-20').isSameOrBefore('2010-10-19');  // false
```

If you want to limit the granularity to a unit other than milliseconds, pass the units as the second parameter.

As the second parameter determines the precision, and not just a single value to check, using day will check for year, month and day.

```javascript
moment('2010-10-20').isSameOrBefore('2009-12-31', 'year'); // false
moment('2010-10-20').isSameOrBefore('2010-12-31', 'year'); // true
moment('2010-10-20').isSameOrBefore('2011-01-01', 'year'); // true
```

Like `moment#isAfter` and `moment#isSame`, any of the units of time that are supported for `moment#startOf` are supported for `moment#isSameOrBefore`:

```
year month week day hour minute second
```
