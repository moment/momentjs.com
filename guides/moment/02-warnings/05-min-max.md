---
title: Min/Max
---
```
moment().min is deprecated, use moment.max
moment().max is deprecated, use moment.min
```

This warning is not a typo, but it is confusing.

Previous to version 2.7.0, moment supported moment().min and moment().max functions. These functions were unintuitive.

Min would return the greater of the two moments in question, and max would return the lesser.

Due to this inverted behavior, the suggestion provided in the deprecation warning is correct.

```js
moment('2016-01-01').min('2016-02-01').format()
"2016-02-01T00:00:00-06:00"
//is equivalent to
moment.max(moment('2016-01-01'), moment('2016-02-01')).format()
"2016-02-01T00:00:00-06:00"
```

```js
moment('2016-01-01').max('2016-02-01').format()
"2016-01-01T00:00:00-06:00"
//is equivalent to
moment.min(moment('2016-01-01'), moment('2016-02-01')).format()
"2016-01-01T00:00:00-06:00"
```

<a href="https://github.com/moment/moment/issues/1548" target="_blank">See original GitHub issue.</a>