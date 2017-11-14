---
title: Month
version: 1.0.0
signature: |
  moment().month(Number|String);
  moment().month(); // Number
  moment().months(Number|String);
  moment().months(); // Number
---


Gets or sets the month.

Accepts numbers from 0 to 11. If the range is exceeded, it will bubble up to the year.

**Note:** Months are zero indexed, so January is month 0.

As of **2.1.0**, a month name is also supported. This is parsed in the moment's current locale.

```javascript
moment().month("January");
moment().month("Feb");
```

Before version **2.1.0**, if a moment changed months and the new month did not have enough days to keep the current day of month, it would overflow to the next month.

As of version **2.1.0**, this was changed to be clamped to the end of the target month.

```javascript
// before 2.1.0
moment([2012, 0, 31]).month(1).format("YYYY-MM-DD"); // 2012-03-02
// after 2.1.0
moment([2012, 0, 31]).month(1).format("YYYY-MM-DD"); // 2012-02-29
```

**2.16.0** deprecated using ``moment().months()``. Use ``moment().month()`` instead.
