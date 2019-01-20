---
title: Day of Week
version: 1.3.0
signature: |
  moment().day(Number|String);
  moment().day(); // Number
  moment().days(Number|String);
  moment().days(); // Number
---


Gets or sets the day of the week.

This method can be used to set the day of the week, with Sunday as 0 and Saturday as 6.

If the value given is from 0 to 6, the resulting date will be within the current (Sunday-to-Saturday) week.

If the range is exceeded, it will bubble up to other weeks.

```javascript
moment().day(-7); // last Sunday (0 - 7)
moment().day(0); // this Sunday (0)
moment().day(7); // next Sunday (0 + 7)
moment().day(10); // next Wednesday (3 + 7)
moment().day(24); // 3 Wednesdays from now (3 + 7 + 7 + 7)
```

**Note:** `Moment#date` is for the date of the month, and `Moment#day` is for the day of the week.

As of **2.1.0**, a day name is also supported. This is parsed in the moment's current locale.

```javascript
moment().day("Sunday");
moment().day("Monday");
```
