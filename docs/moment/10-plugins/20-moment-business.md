---
title: Business
signature: |
  npm install moment-business
---

This is a Moment.js library that allows Moment operations for Western work weeks: 7 day weeks where Saturday and Sunday
are non-work days.

For example,

```js
import business from 'moment-business';

// true if the moment is Mon-Fri, false otherwise
business.isWeekDay(someMoment);

// Adds five work days to the Moment
business.addWeekDays(someMoment, 5);
```

The repository is located at [github.com/jmeas/moment-business](https://github.com/jmeas/moment-business).
