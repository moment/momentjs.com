---
title: Is After
version: 2.0.0
signature: |
  moment().isAfter(Moment|String|Number|Date|Array);
  moment().isAfter(Moment|String|Number|Date|Array, String);
---


Check if a moment is after another moment. The first argument will be parsed as a moment, if not already so.

```javascript
moment('2010-10-20').isAfter('2010-10-19'); // true
```

If you want to limit the granularity to a unit other than milliseconds, pass the units as the second parameter.

As the second parameter determines the precision, and not just a single value to check, using day will check for year, month and day.

```javascript
moment('2010-10-20').isAfter('2010-01-01', 'year'); // false
moment('2010-10-20').isAfter('2009-12-31', 'year'); // true
```

Like `moment#isSame` and `moment#isBefore`, any of the units of time that are supported for `moment#startOf` are supported for `moment#isAfter`.

```
year month week day hour minute second
```

If nothing is passed to `moment#isAfter`, it will default to the current time.

```javascript
moment().isAfter(); // false
```
