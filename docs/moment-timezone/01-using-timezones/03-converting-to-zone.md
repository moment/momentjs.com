---
title: Converting to Zone
signature: |
  moment().tz(String);
  moment().tz(String, Boolean);
---


The `moment#tz` mutator will change the time zone and update the offset.

```javascript
moment("2013-11-18").tz("America/Toronto").format('Z'); // -05:00
moment("2013-11-18").tz("Europe/Berlin").format('Z');   // +01:00
```

This information is used consistently in other operations, like calculating the
start of the day.

```javascript
var m = moment.tz("2013-11-18 11:55", "America/Toronto");
m.format();                     // 2013-11-18T11:55:00-05:00
m.startOf("day").format();      // 2013-11-18T00:00:00-05:00
m.tz("Europe/Berlin").format(); // 2013-11-18T06:00:00+01:00
m.startOf("day").format();      // 2013-11-18T00:00:00+01:00
```

Without any argument, `moment#tz` returns:

* the time zone name assigned to the moment instance or
* `undefined` if a time zone has not been set.

```javascript
var m = moment.tz("2013-11-18 11:55", "America/Toronto");
m.tz();  // America/Toronto
var m = moment.tz("2013-11-18 11:55");
m.tz() === undefined;  // true
```

On passing a second parameter as `true`, only the timezone (and offset) is updated, keeping the local time same. 
Consequently, it will now point to a different point in time if the offset has changed. 

```javascript
var m = moment.tz("2013-11-18 11:55", "America/Toronto");
m.format();                           // 2013-11-18T11:55:00-05:00
m.tz('Europe/Berlin', true).format()  // 2013-11-18T11:55:00+01:00
```


