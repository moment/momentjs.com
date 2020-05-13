---
title: Using Time zones
---

There are two interfaces for using time zones with Moment.js.

`moment.tz(..., String)` does _parsing in given time zone_

It takes all the same arguments as the `moment` constructor, but uses the last argument as a time zone identifier:

```js
var a = moment.tz("2013-11-18 11:55", "Asia/Taipei");
var b = moment.tz("2013-11-18 11:55", "America/Toronto");

a.format(); // 2013-11-18T11:55:00+08:00
b.format(); // 2013-11-18T11:55:00-05:00

a.utc().format(); // 2013-11-18T03:55Z
b.utc().format(); // 2013-11-18T16:55Z
```
Note that created moments have different UTC time because these moments were created in different time zones.


`moment().tz(String)` does _converting to provided time zone_


```js
var a = moment.utc("2013-11-18 11:55").tz("Asia/Taipei");
var b = moment.utc("2013-11-18 11:55").tz("America/Toronto");

a.format(); // 2013-11-18T19:55:00+08:00
b.format(); // 2013-11-18T06:55:00-05:00

a.utc().format(); // 2013-11-18T11:55Z
b.utc().format(); // 2013-11-18T11:55Z
```

In this example, you first create `moment.utc("2013-11-18 11:55")` object in UTC, and then change its timezone to specified. This also works if you create the object in your default timezone: `moment("2013-11-18 11:55")`.

Note that created moments have equal UTC time because these moments were created in a [default timezone](#/using-timezones/default-timezone/).
