---
title: Difference
version: 1.0.0
signature: |
  moment().diff(Moment|String|Number|Date|Array);
  moment().diff(Moment|String|Number|Date|Array, String);
  moment().diff(Moment|String|Number|Date|Array, String, Boolean);
---


To get the difference in milliseconds, use `moment#diff` like you would use `moment#from`.

```javascript
var a = moment([2007, 0, 29]);
var b = moment([2007, 0, 28]);
a.diff(b) // 86400000
```

To get the difference in another unit of measurement, pass that measurement as the second argument.

```javascript
var a = moment([2007, 0, 29]);
var b = moment([2007, 0, 28]);
a.diff(b, 'days') // 1
```

To get the duration of a difference between two moments, you can pass `diff` as an argument into `moment#duration`. See the docs on [moment#duration](#/durations/diffing/) for more info.

The supported measurements are `years`, `months`, `weeks`, `days`, `hours`, `minutes`, and `seconds`. For ease of development, the singular forms are supported as of **2.0.0**. Units of measurement other than milliseconds are available in version **1.1.1**.

By default, `moment#diff` will truncate the result to zero decimal places, returning an integer. If you want a floating point number, pass `true` as the third argument. Before **2.0.0**, `moment#diff` returned a number rounded to the nearest integer, not a truncated number.

```javascript
var a = moment([2008, 9]);
var b = moment([2007, 0]);
a.diff(b, 'years');       // 1
a.diff(b, 'years', true); // 1.75
```

If the moment is earlier than the moment you are passing to `moment.fn.diff`, the return value will be negative.

```javascript
var a = moment();
var b = moment().add(1, 'seconds');
a.diff(b) // -1000
b.diff(a) // 1000
```

An easy way to think of this is by replacing `.diff(` with a minus operator.

```javascript
          // a < b
a.diff(b) // a - b < 0
b.diff(a) // b - a > 0
```

#### Month and year diffs

`moment#diff` has some special handling for month and year diffs. It is optimized to ensure that two months with the same date are always a whole number apart.

So Jan 15 to Feb 15 should be exactly 1 month.

Feb 28 to Mar 28 should be exactly 1 month.

Feb 28 2011 to Feb 28 2012 should be exactly 1 year.

[See more discussion on the month and year diffs here](https://github.com/moment/moment/pull/571)

This change to month and year diffs was made in **2.0.0**.
As of version **2.9.0** diff also support quarter unit.
