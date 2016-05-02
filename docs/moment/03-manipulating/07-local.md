---
title: Local
version: 1.5.0
signature: |
  moment().local();
---


Sets a flag on the original moment to use local time to  parse or display a moment instead of UTC.

```javascript
var a = moment.utc([2011, 0, 1, 8]);
a.hours(); // 8 UTC
a.local();
a.hours(); // 0 PST
```

See [moment.utc()](#/parsing/utc/) for more information on UTC mode.
