---
title: UTC
version: 1.5.0
signature: |
  moment().utc();
---


Sets a flag on the original moment to use UTC to parse or display a moment instead of local time.

```javascript
var a = moment([2011, 0, 1, 8]);
a.hours(); // 8 PST
a.utc();
a.hours(); // 16 UTC
```

See [moment.utc()](#/parsing/utc/) for more information on UTC mode.
