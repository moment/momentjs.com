---
title: Pack Base 60
signature: |
  moment.tz.packBase60(Number); // Base60String
---

Convert a base 10 number to a base 60 string.

```js
moment.tz.packBase60(9);    // 9
moment.tz.packBase60(10);   // a
moment.tz.packBase60(59);   // X
moment.tz.packBase60(1337); // mh
```

Much like `Number.prototype.toFixed`, `moment.tz.packBase60` accepts a second argument
for the number of digits of precision.

```js
moment.tz.packBase60(1.1667,   1); // 1.a
moment.tz.packBase60(20.12345, 3); // k.7op
moment.tz.packBase60(59,       1); // X
```

A solitary `0` before the decimal point is dropped.

```js
moment.tz.packBase60(1.1667, 1); // 1.a
moment.tz.packBase60(0.1667, 1); // .a
```

Trailing zeroes after the decimal point are dropped.

```js
moment.tz.packBase60(1/6, 1); // .a
moment.tz.packBase60(1/6, 5); // .a
moment.tz.packBase60(59, 5);  // X
```