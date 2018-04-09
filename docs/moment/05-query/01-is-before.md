---
title: Is Before
version: 2.0.0
signature: |
  moment().isBefore(Moment|String|Number|Date|Array);
  moment().isBefore(Moment|String|Number|Date|Array, String);
---


Check if a moment is before another moment. The first argument will be parsed as a moment, if not already so.

```javascript
moment('2010-10-20').isBefore('2010-10-21'); // true
```

If you want to limit the granularity to a unit other than milliseconds, pass the units as the second parameter.

As the second parameter determines the precision, and not just a single value to check, using day will check for year, month and day.

```javascript
moment('2010-10-20').isBefore('2010-12-31', 'year'); // false
moment('2010-10-20').isBefore('2011-01-01', 'year'); // true
```

Like `moment#isAfter` and `moment#isSame`, any of the units of time that are supported for `moment#startOf` are supported for `moment#isBefore`.

```
year month week day hour minute second
```

If nothing is passed to `moment#isBefore`, it will default to the current time.

*NOTE*: `moment().isBefore()` has undefined behavior and should not be used! If
the code runs fast the initial created moment would be the same as the one
created in isBefore to perform the check, so the result would be `false`. But
if the code runs slower it's possible that the moment created in isBefore is
measurably after the one created in `moment()`, so the call would return
`true`.
