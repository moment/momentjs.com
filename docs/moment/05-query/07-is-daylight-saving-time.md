---
title: Is Daylight Saving Time
version: 1.2.0
signature: |
  moment().isDST();
---


`moment#isDST` checks if the current moment is in daylight saving time.

```javascript
moment([2011, 2, 12]).isDST(); // false, March 12 2011 is not DST
moment([2011, 2, 14]).isDST(); // true, March 14 2011 is DST
// This example is for "en" locale: https://www.timeanddate.com/time/dst/2011.html
```

