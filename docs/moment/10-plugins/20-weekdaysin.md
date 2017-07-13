---
title: WeekdaysIn
---

If you need to find certain weekdays in a month, year, or inbetween two dates, you can use the [moment-weekdaysin](https://github.com/kodie/moment-weekdaysin) plugin by [Kodie Grantham](http://kodieg.com).

For example:

```javascript
// All weekends in the summer of 2010
moment('2010-06-20').weekdaysInBetween('2010-09-23', [0, 5, 6]);

// Memorial Day
moment().month('May').weekdaysInMonth('Monday', -1);

// Labor Day
moment().month('September').weekdaysInMonth('Monday', 1);

// Thanksgiving Day
moment().month('November').weekdaysInMonth('Thursday', 4);

// The 10th and 4th to last Sundays and Wednesdays this year
moment().weekdaysInYear(['Sunday', 3], [10, -4]);
```
