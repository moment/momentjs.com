---
title: UTC Offset
version: 2.9.0+
signature: |
  moment().utcOffset();
  moment().utcOffset(Number|String);
---

Get the utc offset in minutes.

**NOTE**: Unlike [`moment.fn.zone`](/docs/#/manipulating/timezone-offset/) this
function returns the real offset from UTC, not the reverse offset (as returned
by `Date.prototype.getTimezoneOffset`).

Getting the utcOffset of the current object:

```javascript
moment().utcOffset(); // (-240, -120, -60, 0, 60, 120, 240, etc.)
```

Setting the utc offset by supplying minutes. Note that once you set an offset,
its fixed and won't change on its own (i.e there are no DST rules). If you want
an actual timezone -- time in a particular location, like
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

It is also possible to set the utc offset from a string.

```javascript
// these are equivalent
moment().utcOffset("+08:00");
moment().utcOffset(8);
moment().utcOffset(480);
```

`moment#utcOffset` will search the string for the first match of `+00:00 +0000
-00:00 -0000`, so you can even pass an ISO8601 formatted string and the moment
will be changed to that utc offset.

Note that the string is required to start with the `+` or `-` character.  Passing a string that
does not start with `+` or `-` will be interpreted as if it were `"+00:00"`.

```javascript
moment().utcOffset("2013-03-07T07:00:00+08:00");
```
