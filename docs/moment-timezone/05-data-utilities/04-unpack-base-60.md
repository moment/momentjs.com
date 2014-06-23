---
title: Unpack Base 60
signature: |
  moment.tz.unpackBase60(Base60String); // Number
---

Convert a base 60 string to a base 10 number.

```js
moment.tz.unpackBase60('9');     // 9
moment.tz.unpackBase60('a');     // 10
moment.tz.unpackBase60('X');     // 59
moment.tz.unpackBase60('mh');    // 1337
moment.tz.unpackBase60('1.9');   // 1.15
moment.tz.unpackBase60('k.7op'); // 20.123449074074074
```
