---
title: Milliseconds
version: 1.6.0
signature: |
  moment.duration().milliseconds();
  moment.duration().asMilliseconds();
---


To get the number of milliseconds in a duration, use `moment.duration().milliseconds()`.

It will return a number between 0 and 999.

```javascript
moment.duration(500).milliseconds(); // 500
moment.duration(1500).milliseconds(); // 500
moment.duration(15000).milliseconds(); // 0
```

If you want the length of the duration in milliseconds, use `moment.duration().asMilliseconds()` instead.

```javascript
moment.duration(500).asMilliseconds(); // 500
moment.duration(1500).asMilliseconds(); // 1500
moment.duration(15000).asMilliseconds(); // 15000
```
