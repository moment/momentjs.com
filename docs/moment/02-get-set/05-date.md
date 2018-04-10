---
title: Date of Month
version: 1.0.0
signature: |
  moment().date(Number);
  moment().date(); // Number
  moment().dates(Number);
  moment().dates(); // Number
---


Gets or sets the day of the month.

Accepts numbers from 1 to 31. If the range is exceeded, it will bubble up to the months.

**Note:** `Moment#date` is for the date of the month, and `Moment#day` is for the day of the week.

**Note:** if you chain multiple actions to construct a date, you should start from a year, then a month, then a day etc. Otherwise you may get unexpected results, like when `day=31` and current month has only 30 days (the same applies to native JavaScript `Date` manipulation), the returned date will be the 30th of the current month (see [month](http://momentjs.com/docs/#/get-set/month/) for more details).

Bad: `moment().date(day).month(month).year(year)`

Good: `moment().year(year).month(month).date(day)`

**2.16.0** deprecated using ``moment().dates()``. Use ``moment().date()`` instead.
