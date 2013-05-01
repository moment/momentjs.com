Gets or sets the month.

Accepts numbers from 0 to 11. If the range is exceeded, it will bubble up to the year.

**Note**: Months are zero indexed, so January is month 0.

**Important**: moment().month(Number) returns the month with the current day set, and the days might 
overflow into the next month, changing the month which is returned.


```javascript
// for example, because februari is shorter
moment("2013-4-30").month(1).format("MMMM"); // returns March 

// to prevent this from happening use:
moment().date(1).month(Number) 
moment("2013-4-30").date(1).month(1).format("MMMM"); // returns Februari 
```

