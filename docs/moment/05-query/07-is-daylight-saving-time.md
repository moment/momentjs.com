---
title: Is Daylight Saving Time
version: 1.2.0
signature: |
  moment().isDST();
---


`moment#isDST` checks if the current moment is in daylight saving time.

```javascript
moment([2011, 3, 26]).isDST(); // false, March 26 2011 is not DST
moment([2011, 3, 28]).isDST(); // true, March 28 2011 is DST
```
