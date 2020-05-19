---
title: Is Same
version: 2.0.0
signature: |
  moment().isSame(Moment|String|Number|Date|Array);
  moment().isSame(Moment|String|Number|Date|Array, String);
---


Check if a moment is the same as another moment. The first argument will be parsed as a moment, if not already so.

```javascript
moment('2010-10-20').isSame('2010-10-20'); // true
```

If you want to limit the granularity to a unit other than milliseconds, pass it as the second parameter.

```javascript
moment('2010-10-20').isSame('2009-12-31', 'year');  // false
moment('2010-10-20').isSame('2010-01-01', 'year');  // true
moment('2010-10-20').isSame('2010-12-31', 'year');  // true
moment('2010-10-20').isSame('2011-01-01', 'year');  // false
```

When including a second parameter, it will match all units equal or larger. Passing in `month` will check `month` and `year`. Passing in `day` will check `day`, `month`, and `year`.

```javascript
moment('2010-01-01').isSame('2011-01-01', 'month'); // false, different year
moment('2010-01-01').isSame('2010-02-01', 'day');   // false, different month
```

Like `moment#isAfter` and `moment#isBefore`, any of the units of time that are supported for `moment#startOf` are supported for `moment#isSame`.

```
year month week isoWeek day hour minute second
```

If the two moments have different timezones, the timezone of the first moment will be used for the comparison.

```javascript
// Note: Australia/Sydney is UTC+11:00 on these dates
moment.tz("2018-11-09T10:00:00", "Australia/Sydney").isSame(moment.tz("2018-11-08T12:00:00", "UTC"), "day"); // false
moment.tz("2018-11-08T12:00:00", "UTC").isSame(moment.tz("2018-11-09T10:00:00", "Australia/Sydney"), "day"); // true
```

*NOTE*: `moment().isSame()` has undefined behavior and should not be used! If
the code runs fast the initial created moment would be the same as the one
created in isSame to perform the check, so the result would be `true`. But
if the code runs slower it's possible that the moment created in isSame is
measurably after the one created in `moment()`, so the call would return
`false`.
