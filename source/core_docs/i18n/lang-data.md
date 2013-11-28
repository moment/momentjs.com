You can access the properties of the currently loaded language through the
`moment.langData(key)` function. It returns the current language or a language
with the given key:

```javascript
// get current Language
var currentLangData = moment.langData();
var frLangData = moment.langData('fr');
```

The returned object has the following methods:

```javascript
langData.months(aMoment);  // full month name of aMoment
langData.monthsShort(aMoment);  // short month name of aMoment
langData.monthsParse(longOrShortMonthString);  // returns month id (0 to 11) of input
langData.weekdays(aMoment);  // full weekday name of aMoment
langData.weekdaysShort(aMoment);  // short weekday name of aMoment
langData.weekdaysMin(aMoment);  // min weekday name of aMoment
langData.weekdaysParse(minShortOrLongWeekdayString);  // returns weekday id (0 to 6) of input
langData.longDateFormat(dateFormat);  // returns the full format of abbreviated date-time formats LT, L, LL and so on
langData.isPM(amPmString);  // returns true iff amPmString represents PM
langData.meridiem(hours, minutes, isLower);  // returns am/pm string for particular time-of-day in upper/lower case
langData.calendar(key, aMoment);  // returns a format that would be used for calendar representation. Key is one of 'sameDay', 'nextDay', 'lastDay', 'nextWeek', 'prevWeek', 'sameElse'
langData.relativeTime(number, withoutSuffix, key, isFuture);  // returns relative time string, key is on of 's', 'm', 'mm', 'h', 'hh', 'd', 'dd', 'M', 'MM', 'y', 'yy'. Single letter when number is 1.
langData.pastFuture(diff, relTime);  // convert relTime string to past or future string depending on diff
langData.ordinal(number);  // convert number to ordinal string 1 -> 1st
langData.preparse(str);  // called before parsing on every input string
langData.postformat(str);  // called after formatting on every string
langData.week(aMoment);  // returns week-of-year of aMoment
langData.invalidDate();  // returns a translation of 'Invalid date'
```
