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

Before version **2.8.0**, the `moment#subtract(String, Number)` syntax was also supported. It has been deprecated in favor of `moment#subtract(Number, String)`.

```javascript
moment().subtract('seconds', 1); // Deprecated in 2.8.0
moment().subtract(1, 'seconds');
```

As of **2.12.0** when decimal values are passed for days and months, they are rounded to the nearest integer.
Weeks, quarters, and years are converted to days or months, and then rounded to the nearest integer.

```javascript
moment().subtract(1.5, 'months') == moment().subtract(2, 'months')
moment().subtract(.7, 'years') == moment().subtract(8, 'months') //.7*12 = 8.4, rounded to 8
```

Note that in order to make the operations ``moment.add(-.5, 'days')`` and ``moment.subtract(.5, 'days')`` equivalent, -.5, -1.5, -2.5, etc are rounded down.
