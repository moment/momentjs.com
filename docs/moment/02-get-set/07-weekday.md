---
title: Day of Week (Locale Aware)
version: 2.1.0
signature: |
  moment().weekday(Number);
  moment().weekday(); // Number
---


Gets or sets the day of the week according to the locale.

If the locale assigns Monday as the first day of the week, `moment().weekday(0)` will be Monday.
If Sunday is the first day of the week, `moment().weekday(0)` will be Sunday.

As with `moment#day`, if the range is exceeded, it will bubble up to other weeks.

```javascript
// when Monday is the first day of the week
moment().weekday(-7); // last Monday
moment().weekday(7); // next Monday
// when Sunday is the first day of the week
moment().weekday(-7); // last Sunday
moment().weekday(7); // next Sunday
```
