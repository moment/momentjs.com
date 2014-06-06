---
title: Subtract
version: 1.0.0
signature: |
  moment().subtract(String, Number);
  moment().subtract(Number, String); // 2.0.0
  moment().subtract(Duration); // 1.6.0
  moment().subtract(Object);
---


Mutates the original moment by subtracting time.

This is exactly the same as `moment#add`, only instead of adding time, it subtracts time.

```javascript
moment().subtract('days', 7);
```
