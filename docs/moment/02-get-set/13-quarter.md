---
title: Quarter
version: 2.6.0
signature: |
  moment().quarter(); // Number
  moment().quarter(Number);
  moment().quarters(); // Number
  moment().quarters(Number);
---


Gets the quarter (1 to 4).

```javascript
moment('2013-01-01T00:00:00.000').quarter() // 1
moment('2013-04-01T00:00:00.000').subtract(1, 'ms').quarter() // 1
moment('2013-04-01T00:00:00.000').quarter() // 2
moment('2013-07-01T00:00:00.000').subtract(1, 'ms').quarter() // 2
moment('2013-07-01T00:00:00.000').quarter() // 3
moment('2013-10-01T00:00:00.000').subtract(1, 'ms').quarter() // 3
moment('2013-10-01T00:00:00.000').quarter() // 4
moment('2014-01-01T00:00:00.000').subtract(1, 'ms').quarter() // 4
```

Sets the quarter (1 to 4).
```javascript
moment('2013-01-01T00:00:00.000').quarter(2) // '2013-04-01T00:00:00.000'
moment('2013-02-05T05:06:07.000').quarter(2).format() // '2013-05-05T05:06:07-07:00'
```
