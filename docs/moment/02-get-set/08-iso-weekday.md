---
title: ISO Day of Week
version: 2.1.0
signature: |
  moment().isoWeekday(Number);
  moment().isoWeekday(); // Number
---


Gets or sets the [ISO day of the week](https://en.wikipedia.org/wiki/ISO_week_date) with `1` being Monday and `7` being Sunday.

As with `moment#day`, if the range is exceeded, it will bubble up to other weeks.

```javascript
moment().isoWeekday(1); // Monday
moment().isoWeekday(7); // Sunday
```

A day name is also supported. This is parsed in the moment's current locale.

```javascript
moment().isoWeekday("Sunday");
moment().isoWeekday("Monday");
```
