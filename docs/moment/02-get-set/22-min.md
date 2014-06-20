---
title: Minimum
version: 2.7.0
signature: |
  moment.min(Moment[,Moment...]);
---

Returns the minimum (most distant past) of the given moment instances.

For example:
```javascript
var a = moment().subtract(1, 'day');
var b = moment().add(1, 'day');
moment.min(a, b);  // a
```

With no arguments the function returns a moment instance with the current time.
