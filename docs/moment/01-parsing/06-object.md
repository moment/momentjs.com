---
title: Object
version: 2.2.1
signature: |
  moment({unit: value, ...});
---


```javascript
moment({ hour:15, minute:10 });
moment({ y    :2010, M     :3, d   :5, h    :15, m      :10, s      :3, ms          :123});
moment({ year :2010, month :3, day :5, hour :15, minute :10, second :3, millisecond :123});
moment({ years:2010, months:3, days:5, hours:15, minutes:10, seconds:3, milliseconds:123});
moment({ years:2010, months:3, date:5, hours:15, minutes:10, seconds:3, milliseconds:123});
moment({ years:'2010', months:'3', date:'5', hours:'15', minutes:'10', seconds:'3', milliseconds:'123'});  // from 2.11.0
```

You can create a moment by specifying some of the units in an object.

Omitted units default to 0 or the current date, month, and year.

`day` and `date` key both mean day-of-the-month.

`date` was added in **2.8.4**.

String values (as shown on the last line) are supported from version
**2.11.0**.

Note that like `moment(Array)` and `new Date(year, month, date)`, months are 0 indexed.
