---
title: Now
version: 1.0.0
signature: |
  moment();
  // From 2.14.0 onward, also supported
  moment([]);
  moment({});
---


To get the current date and time, just call `moment()` with no parameters.

```javascript
var now = moment();
```

This is essentially the same as calling `moment(new Date())`.

**Note:** From version **2.14.0**, `moment([])` and `moment({})` also return
now. They used to default to start-of-today before 2.14.0, but that was
arbitrary so it was changed.
