---
title: Subtract
version: 1.0.0
signature: |
  moment().subtract(Number, String);
  moment().subtract(Duration);
  moment().subtract(Object);
---


Mutates the original moment by subtracting time.

This is exactly the same as `moment#add`, only instead of adding time, it subtracts time.

```javascript
moment().subtract(7, 'days');
```

Before version `2.8.0`, the `subtract(String, Number)` syntax was also supported. It has been deprecated in favor of `subtract(Number, String)`.

```javascript
moment().subtract('seconds', 1); // Deprecated in 2.8.0
moment().subtract(1, 'seconds');
```
