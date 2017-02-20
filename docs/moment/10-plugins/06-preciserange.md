---
title: Precise Range
signature: |
  npm install moment-precise-range-plugin
---

The [Precise Range](https://codebox.org.uk/pages/moment-date-range-plugin) plugin, written by [Rob Dawson](https://github.com/codebox), can be used to display exact, human-readable representations of date/time ranges:

```javascript
moment("2014-01-01 12:00:00").preciseDiff("2015-03-04 16:05:06");
 // 1 year 2 months 3 days 4 hours 5 minutes 6 seconds
```

```javascript
moment.preciseDiff("2014-01-01 12:00:00", "2014-04-20 12:00:00");
// 3 months 19 days
```

To obtain the raw numeric values rather than a string, pass the value `true` as the third argument to the method:

```javascript
moment.preciseDiff(m1, m2, true); 
// {years : 0, months : 1, days : 2, hours : 3, minutes : 4, seconds : 5, firstDateWasLater : false}
```
