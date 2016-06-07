---
title: Recur
signature: |
  npm install moment-recur
---


If you need to work with recurring dates, you can use Casey Trimm's plugin `moment-recur`.

This plugin will allow you to create length-based intervals (days, weeks, etc.) and calendar-based intervals (daysOfMonth, monthsOfYear, etc.). 

It provides a `matches` function to test whether a date recurs according to the rules set, as well as generator functions to get the next and previous dates in a series.

The repository, documentation, and many more examples can be found at [github.com/c-trimm/moment-recur](https://github.com/c-trimm/moment-recur)

```js
var interval = moment( "01/01/2014" ).recur().every(2).days(); // Length Interval
interval.matches( "01/03/2014" ); // true
interval.next( 2, "L" ); // ["01/03/2014", "01/05/2014"]
interval.forget( "days" ); // Remove a rule
interval.dayOfMonth( 10 ); // Calendar Interval
interval.matches( "05/10/2014" ); // true
interval.previous( 2, "L" ); // ["12/10/2013", "11/10/2013"]
```
