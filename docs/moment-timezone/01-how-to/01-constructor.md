---
title: Constructor
signature: |
  moment.tz(..., String);
---


The `moment.tz` constructor takes all the same arguments as the `moment`
constructor, but will interpret the last argument as a time zone identifier.

```javascript
moment.tz("2013-11-18 11:55", "America/Toronto").format(); // "2013-11-18T11:55:00-05:00"
moment.tz(new Date(2013, 11, 18), "America/Toronto").format(); // "2013-12-18T00:00:00-05:00"
```
