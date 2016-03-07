---
title: Parsing in Zone
signature: |
  moment.tz(..., String);
---


The `moment.tz` constructor takes all the same arguments as the `moment`
constructor, but uses the last argument as a time zone identifier.

```js
var a = moment.tz("2013-11-18 11:55", "America/Toronto");
var b = moment.tz("May 12th 2014 8PM", "MMM Do YYYY hA", "America/Toronto");
var c = moment.tz(1403454068850, "America/Toronto");
a.format(); // 2013-11-18T11:55:00-05:00
b.format(); // 2014-05-12T20:00:00-04:00
c.format(); // 2014-06-22T12:21:08-04:00
```

This constructor is DST aware, and will use the correct offset when parsing.

```js
moment.tz("2013-12-01", "America/Los_Angeles").format(); // 2013-12-01T00:00:00-08:00
moment.tz("2013-06-01", "America/Los_Angeles").format(); // 2013-06-01T00:00:00-07:00
```

The offset is only taken into consideration when constructing with an array,
string without offset, or object.

```js
var arr = [2013, 5, 1],
    str = "2013-12-01"
    obj = { year : 2013, month : 5, day : 1 };

moment.tz(arr, "America/Los_Angeles").format(); // 2013-06-01T00:00:00-07:00
moment.tz(str, "America/Los_Angeles").format(); // 2013-12-01T00:00:00-08:00
moment.tz(obj, "America/Los_Angeles").format(); // 2013-06-01T00:00:00-07:00

moment.tz(arr, "America/New_York").format();    // 2013-06-01T00:00:00-04:00
moment.tz(str, "America/New_York").format();    // 2013-12-01T00:00:00-05:00
moment.tz(obj, "America/New_York").format();    // 2013-06-01T00:00:00-04:00
```

If the input string contains an offset, it is used instead for parsing. The parsed moment
is then converted to the target zone.

```js
var zone = "America/Los_Angeles";
moment.tz('2013-06-01T00:00:00',       zone).format(); // 2013-06-01T00:00:00-07:00
moment.tz('2013-06-01T00:00:00-04:00', zone).format(); // 2013-05-31T21:00:00-07:00
moment.tz('2013-06-01T00:00:00+00:00', zone).format(); // 2013-05-31T17:00:00-07:00
```

Unix timestamps and `Date` objects refer to specific points in time, thus it doesn't
make sense to use the time zone offset when constructing. Using `moment.tz(Number|Date, zone)`
is functionally equivalent to `moment(Number|Date).tz(zone)`.

```js
var timestamp = 1403454068850,
    date = new Date(timestamp);

moment.tz(timestamp, "America/Los_Angeles").format(); // 2014-06-22T09:21:08-07:00
moment(timestamp).tz("America/Los_Angeles").format(); // 2014-06-22T09:21:08-07:00

moment.tz(date, "America/Los_Angeles").format();      // 2014-06-22T09:21:08-07:00
moment(date).tz("America/Los_Angeles").format();      // 2014-06-22T09:21:08-07:00
```
