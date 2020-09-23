---
title: UTC offset
version: 2.9.0+
signature: |
  moment().utcOffset();
  moment().utcOffset(Number|String);
  moment().utcOffset(Number|String, Boolean);
---

Get or set the UTC offset in minutes.

**Note:** Unlike [`moment.fn.zone`](/docs/#/manipulating/timezone-offset/) this
function returns the real offset from UTC, not the reverse offset (as returned
by `Date.prototype.getTimezoneOffset`).

Getting the `utcOffset` of the current object:

```javascript
moment().utcOffset(); // (-240, -120, -60, 0, 60, 120, 240, etc.)
```

Setting the UTC offset by supplying minutes. The offset is set on the moment object
that `utcOffset()` is called on. If you are wanting to set the offset globally, 
try using [moment-timezone](/timezone/). Note that once you set an offset,
it's fixed and won't change on its own (i.e there are no DST rules). If you want
an actual time zone -- time in a particular location, like
`America/Los_Angeles`, consider [moment-timezone](/timezone/).

```javascript
moment().utcOffset(120);
```

If the input is less than `16` and greater than `-16`, it will interpret your input as hours instead.

```javascript
// these are equivalent
moment().utcOffset(8);  // set hours offset
moment().utcOffset(480);  // set minutes offset (8 * 60)
```

It is also possible to set the UTC offset from a string.

```javascript
// these are equivalent
moment().utcOffset("+08:00");
moment().utcOffset(8);
moment().utcOffset(480);
```

`moment#utcOffset` will search the string for the last match of `+00 -00 +00:00 +0000
-00:00 -0000 Z`, so you can even pass an ISO8601 formatted string with offset and the moment
will be changed to that UTC offset.

Note that if the string does not include 'Z', it must include the `+` or `-` character.

```javascript
moment().utcOffset("2013-03-07T07:00:00+08:00");
```

The `utcOffset` function has an optional second parameter which accepts a boolean value
indicating whether to keep the existing time of day.

- Passing `false` (the default) will keep the same instant in Universal Time, but the
  local time will change.

- Passing `true` will keep the same local time, but at the expense of choosing a different
  point in Universal Time.

One use of this feature is if you want to construct a moment with a specific time zone
offset using only numeric input values:

```javascript
moment([2016, 0, 1, 0, 0, 0]).utcOffset(-5, true) // Equivalent to "2016-01-01T00:00:00-05:00"
```
