---
title: Relative Time Rounding
version: 2.14.0
signature: |
  moment.relativeTimeRounding();  // getter
  moment.relativeTimeRounding(fn);  // setter
---

`duration.humanize` rounds a possibly double value before supplying it to the relativeTime format string specified in the locale. To control the rounding you can use `moment.relativeTimeRounding`.

```javascript
var roundingDefault = moment.relativeTimeRounding();

// Round relative time evaluation down
moment.relativeTimeRounding(Math.floor);

moment.relativeTimeThreshold('s', 60);
moment.relativeTimeThreshold('m', 60);
moment.relativeTimeThreshold('h', 24);
moment.relativeTimeThreshold('d', 7);
moment.relativeTimeThreshold('w', 4);
moment.relativeTimeThreshold('M', 12);

var a = moment();
a.subtract({hours: 23, minutes: 59, seconds: 59});
a.toNow();  // == 'in 23 hours'  'Round down towards the nearest hour'

// back to default
moment.relativeTimeRounding(roundingDefault);
```

You can even choose to do no rounding at all:

```javascript
var retainValue = function (value) {
    return value;
};
moment.relativeTimeRounding(retainValue);

var a = moment();
a.subtract({hours: 39});
a.toNow(); // == 'in 1.625 days', 'Round down towards the nearest year'
```
