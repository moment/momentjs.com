---
title: Add/Subtract
---
```
moment().add(period, number) is deprecated. Please use moment().add(number, period)
moment().subtract(period, number) is deprecated. Please use moment().subtract(number, period)
```

Moment deprecated ordering the parameters of add and subtract as (period, number). Invert your parameters.

Bad:
```js
moment().add('hours', 3);
```

Good:
```js
moment().add(3, 'hours');
```
