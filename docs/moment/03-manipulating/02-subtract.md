---
title: Subtract
version: 1.0.0
signature: |
  moment().subtract(String, Number);
  moment().subtract(Number, String); // 2.0.0
  moment().subtract(String, String); // 2.7.0
  moment().subtract(Duration); // 1.6.0
  moment().subtract(Object);
---


Mutates the original moment by subtracting time.

This is exactly the same as `moment#add`, only instead of adding time, it subtracts time.

```javascript
moment().subtract('days', 7);
```

As of version **2.7.0**, `subtract` supports numeric values (number of seconds, hours, days etc) to be specified in `String` form, for example:

```javascript
moment().subtract('1', 'seconds');
moment().subtract('seconds', '1');
```

**NOTE**: Using `subtract(unit, value)` is discouraged. Prefer `subtract(value, unit)`, as it is easier to read and more consistent with the duration interface.
