---
title: Accessing locale specific functionality
version: 2.8.0
signature: |
  localeData = moment.localeData()
  localeData.months(Moment)
  localeData.months()
  localeData.monthsShort(Moment)
  localeData.monthsShort()
  localeData.monthsParse(String)
  localeData.weekdays(Moment)
  localeData.weekdays()
  localeData.weekdaysShort(Moment)
  localeData.weekdaysShort()
  localeData.weekdaysMin(Moment)
  localeData.weekdaysMin()
  localeData.weekdaysParse(String)
  localeData.longDateFormat(String)
  localeData.isPM(String)
  localeData.meridiem(Number, Number, Boolean)
  localeData.calendar(String, Moment)
  localeData.relativeTime(Number, Boolean, String, Boolean)
  localeData.pastFuture(Number, String)
  localeData.ordinal(Number)
  localeData.preparse(String)
  localeData.postformat(String)
  localeData.week(Moment)
  localeData.invalidDate()
  localeData.firstDayOfWeek()
  localeData.firstDayOfYear()
---


You can access the properties of the currently loaded locale through the
`moment.localeData(key)` function. It returns the current locale or a locale
with the given key:

```javascript
// get current locale
var currentLocaleData = moment.localeData();
var frLocaleData = moment.localeData('fr');
```

The returned object has the following methods:

```javascript
localeData.months(aMoment);  // full month name of aMoment
localeData.monthsShort(aMoment);  // short month name of aMoment
localeData.monthsParse(longOrShortMonthString);  // returns month id (0 to 11) of input
localeData.weekdays(aMoment);  // full weekday name of aMoment
localeData.weekdaysShort(aMoment);  // short weekday name of aMoment
localeData.weekdaysMin(aMoment);  // min weekday name of aMoment
localeData.weekdaysParse(minShortOrLongWeekdayString);  // returns weekday id (0 to 6) of input
localeData.longDateFormat(dateFormat);  // returns the full format of abbreviated date-time formats LT, L, LL and so on
localeData.isPM(amPmString);  // returns true iff amPmString represents PM
localeData.meridiem(hours, minutes, isLower);  // returns am/pm string for particular time-of-day in upper/lower case
localeData.calendar(key, aMoment);  // returns a format that would be used for calendar representation. Key is one of 'sameDay', 'nextDay', 'lastDay', 'nextWeek', 'prevWeek', 'sameElse'
localeData.relativeTime(number, withoutSuffix, key, isFuture);  // returns relative time string, key is on of 's', 'm', 'mm', 'h', 'hh', 'd', 'dd', 'M', 'MM', 'y', 'yy'. Single letter when number is 1.
localeData.pastFuture(diff, relTime);  // convert relTime string to past or future string depending on diff
localeData.ordinal(number);  // convert number to ordinal string 1 -> 1st
localeData.preparse(str);  // called before parsing on every input string
localeData.postformat(str);  // called after formatting on every string
localeData.week(aMoment);  // returns week-of-year of aMoment
localeData.invalidDate();  // returns a translation of 'Invalid date'
localeData.firstDayOfWeek();  // 0-6 (Sunday to Saturday)
localeData.firstDayOfYear();  // 0-15 this and the first day of week are used
                              // to determine which is the first week of the
                              // year. dow == 1 and doy == 4 means week starts
                              // Monday and first week that has Thursday is the
                              // first week of the year (but doy is NOT simply
                              // Thursday).
```
