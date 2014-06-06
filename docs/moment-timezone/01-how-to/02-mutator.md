---
title: Mutator
signature: |
  moment(...).tz(String);
---


The `.tz` mutator will set the timezone to the provided time zone identifier and 
update the offset.

```javascript
moment("2013-11-18").tz("America/Toronto").zone(); // 300
moment("2013-11-18").tz("Europe/Berlin").zone(); // -60
```

This information is used consistently in other operations, like calculating the 
start of the day.

```javascript
var m = moment("2013-11-18 11:55");
m.tz("America/Toronto").format(); // "2013-11-18T11:55:00-05:00"
m.startOf("day").format(); // "2013-11-18T00:00:00-05:00"
m.tz("Europe/Berlin").format(); // "2013-11-18T06:00:00+01:00"
```
