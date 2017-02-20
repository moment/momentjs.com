---
title: ISO Calendar
signature: |
  npm install moment-isocalendar
---


If you are looking for a Python-like isocalendar method, you can use Rocky Meza's plugin

`moment-isocalendar`

Calling the isocalendar method on a moment will return an array like the following:

`[year, week_of_year, day_of_week, minutes_since_midnight]`


```javascript
moment().isocalendar(); // [2012, 8, 5, 870]
```

You can also reconstruct a moment from a isocalendar array.

```javascript
moment.fromIsocalendar([2011, 51, 5, 870]).format('LLLL');
// "Friday, December 23 2011 2:30 PM"
```

The repository is located at [github.com/fusionbox/moment-isocalendar](https://github.com/fusionbox/moment-isocalendar).
