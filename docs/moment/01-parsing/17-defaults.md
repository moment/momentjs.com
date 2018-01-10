---
title: Defaults
version: 2.2.1
signature: |
  moment("15", "hh")
---


You can create a moment object specifying only some of the units, and the rest
will be defaulted to the current day, month or year, or 0 for hours, minutes,
seconds and milliseconds.

Defaulting to now, when nothing is passed:
```javascript
moment();  // current date and time
```

Defaulting to today, when only hours, minutes, seconds and milliseconds are passed:
```javascript
moment(5, "HH");  // today, 5:00:00.000
moment({hour: 5});  // today, 5:00:00.000
moment({hour: 5, minute: 10});  // today, 5:10.00.000
moment({hour: 5, minute: 10, seconds: 20});  // today, 5:10.20.000
moment({hour: 5, minute: 10, seconds: 20, milliseconds: 300});  // today, 5:10.20.300
```

Defaulting to this month and year, when only days and smaller units are passed:
```javascript
moment(5, "DD");  // this month, 5th day-of-month
moment("4 05:06:07", "DD hh:mm:ss");  // this month, 4th day-of-month, 05:06:07.000
```

Defaulting to this year, if year is not specified:
```javascript
moment(3, "MM");  // this year, 3rd month (March)
moment("Apr 4 05:06:07", "MMM DD hh:mm:ss");  // this year, 4th April, 05:06:07.000
```
