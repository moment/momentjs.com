---
title: Calendar Format
version: 2.14.0
signature: |
  moment.calendarFormat = Function
---

This lets you modify the tokens used by [calendar](#/customization/calendar/).

```javascript
moment.calendarFormat = function (myMoment, now) {
	var diff = myMoment.diff(now, 'days', true);
	var nextMonth = now.clone().add(1, 'month');

	var retVal =  diff < -6 ? 'sameElse' :
		diff < -1 ? 'lastWeek' :
		diff < 0 ? 'lastDay' :
		diff < 1 ? 'sameDay' :
		diff < 2 ? 'nextDay' :
		diff < 7 ? 'nextWeek' :
		// introduce thisMonth and nextMonth
		(myMoment.month() === now.month() && myMoment.year() === now.year()) ? 'thisMonth' :
		(nextMonth.month() === myMoment.month() && nextMonth.year() === myMoment.year()) ? 'nextMonth' : 'sameElse';
	return retVal;
};
```
