---
title: Array
version: 1.0.0
signature: |
  moment(Number[]);
---


You can create a moment with an array of numbers that mirror the parameters passed to [new Date()](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date)

`[year, month, day, hour, minute, second, millisecond]`

```javascript
moment([2010, 1, 14, 15, 25, 50, 125]); // February 14th, 3:25:50.125 PM
```

Any value past the year is optional, and will default to the lowest possible number.

```javascript
moment([2010]);        // January 1st
moment([2010, 6]);     // July 1st
moment([2010, 6, 10]); // July 10th
```

Construction with an array will create a date in the current time zone. To create a date from an array at UTC, use `moment.utc(Number[])`.

```javascript
moment.utc([2010, 1, 14, 15, 25, 50, 125]);
```

**Note:** Because this mirrors the native `Date` parameters, months, hours, minutes, seconds, and milliseconds are all zero indexed. Years and days of the month are 1 indexed.

This is often the cause of frustration, especially with months, so take note!

If the date represented by the array does not exist, `moment#isValid` will return false.

```javascript
moment([2010, 12]).isValid();     // false (not a real month)
moment([2010, 10, 31]).isValid(); // false (not a real day)
moment([2010, 1, 29]).isValid();  // false (not a leap year)
```
