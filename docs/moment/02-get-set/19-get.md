---
title: Get
version: 2.2.1
signature: |
  moment().get('year');
  moment().get('month');  // 0 to 11
  moment().get('date');   // 1 to 31
  moment().get('day');    // 0 to 6
  moment().get('hour');
  moment().get('minute');
  moment().get('second');
  moment().get('millisecond');
---

String getter. In general

```javascript
moment().get(unit) === moment()[unit]()
```

Units are case insensitive, and support plural and short forms: year (years,
y), month (months, M), date (dates, D), day (days, d), hour (hours, h), minute
(minutes, m), second (seconds, s), millisecond (milliseconds, ms).
