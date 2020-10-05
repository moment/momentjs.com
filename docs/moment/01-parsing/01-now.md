---
title: Now
version: 1.0.0
signature: |
  moment();
  moment(undefined);
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

**Note:** Function parameters default to `undefined` when not passed in. Moment treats `moment(undefined)` as `moment()`.

**Note:** Moments are created at evaluation time, so `moment().diff(moment())` may not always return 0. See [this GitHub issue](https://github.com/moment/moment/issues/5195) for more details.
