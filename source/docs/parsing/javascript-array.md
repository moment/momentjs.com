You can also create a moment by passing in an array of the parameters that mirror the parameters passed to [new Date()](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date)

```javascript
[year, month = 0, date = 1, hours = 0, minutes = 0, seconds = 0, milliseconds = 0]
var day = moment([2010, 1, 14, 15, 25, 50, 125]); // February 14th, 3:25:50.125 PM
```

Any value past the year is optional, and will default to the lowest possible number.

```javascript
var day = moment([2010]); // January 1st
var day = moment([2010, 6]); // July 1st
var day = moment([2010, 6, 10]); // July 10th
```

Construction with an array will create a date in the current timezone. To create a date from an array at UTC, you can use the following.

```javascript
var array = [2010, 1, 14, 15, 25, 50, 125];
var day = moment(Date.UTC.apply({}, array));
```

**Note:** Because this mirrors the native Date parameters, the following parameters are all zero indexed: months, hours, minutes, seconds, and milliseconds. Years and days of the month are 1 indexed.

This is often the cause of frustration, especially with months, so take note!
