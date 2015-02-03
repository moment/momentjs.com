---
title: Set
version: 2.2.1
signature: |
  moment().set(String, Int);
  moment().set(Object(String, Int));
---


Generic setter, accepting unit as first argument, and value as second:

```javascript
moment().set('year', 2013);
moment().set('month', 3);  // April
moment().set('date', 1);
moment().set('hour', 13);
moment().set('minute', 20);
moment().set('second', 30);
moment().set('millisecond', 123);

moment().set({'year': 2013, 'month': 3});
```

Units are case insensitive, and support plural and short forms: year (years,
y), month (months, M), date (dates, D), hour (hours, h), minute (minutes, m),
second (seconds, s), millisecond (milliseconds, ms).

Object parsing was added in **2.9.0**
