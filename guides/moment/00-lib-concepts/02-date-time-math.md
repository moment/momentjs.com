---
title: Date Math vs Time Math
---

There is a logical difference between time math and date math.

In Moment.js time math assumes a linear time scale, just incrementing or decrementing the UTC-based timestamp by the amount of the time units provided.

Date math does not use a linear time scale, but rather increments or decrements the dates on the calendar. This is because the amount of time in a day, month, or year is variable. 
For example, due to daylight saving time transition, a day may be anywhere between 23 and 25 hours long. 
Months of course vary in number of days, and due to leap year, years vary in length as well. Date math can cause some interesting scenarios.

Due to daylight saving time, one day may not equal 24 hours:

```js
//date math
moment('2016-03-12 13:00:00').add(1, 'day').format('LLL')
"March 13, 2016 1:00 PM"
//time math
moment('2016-03-12 13:00:00').add(24, 'hours').format('LLL')
"March 13, 2016 2:00 PM"
```
Due to leap years, one year may not equal 365 days:

```js
moment('2016-01-01').add(1, 'year').format('LL')
"January 1, 2017"
moment('2016-01-01').add(365, 'day').format('LL')
"December 31, 2016"
```

Because of the variability of duration in day math, Moment's API does not officially support adding or subtracting decimal values for days and larger. 
Moment.js will accept decimal values and do its best to handle them by rounding to the nearest whole number.

As of **2.12.0** decimal day and month values use absolute value/round to convert to integers. This means that 1.5 rounds to 2, and -1.5 rounds to -2.

```js
moment().add(1.5, 'days') == moment().add(2, 'days')
moment().add(-1.5, 'days') == moment().add(-2, 'days') == moment().subtract(1.5, 'days') == moment().subtract(2, 'days')
moment().add(2.3, 'months') == moment().add(2, 'months')
moment().add(-2.3, 'months') == moment().add(-2, 'months') == moment().subtract(2.3, 'months') == moment().subtract(2, 'months')
```

Quarters and years are converted to months, and then absolute value/rounded.

```js
moment().add(1.5, 'years') == moment().add(18, 'months')
moment().add(.8, 'years') == moment().add(9.6, 'months') == moment().add(10, 'months')
moment().add(1.5, 'quarters') == moment().add(4.5, 'months') == moment().add(5, 'months')
```
