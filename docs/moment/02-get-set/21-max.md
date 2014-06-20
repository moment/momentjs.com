---
title: Maximum
version: 2.7.0
signature: |
  moment.max(Moment[,Moment...]);
---

Returns the maximum (most distant future) of the given moment instances.

For example:
```javascript
var a = moment().subtract(1, 'day');
var b = moment().add(1, 'day');
moment.max(a, b);  // b
```

With no arguments the function returns a moment instance with the current time.
