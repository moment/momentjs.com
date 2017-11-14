---
title: Changing Time Source
version: 2.11.0
signature: |
  moment.now = function () { return +new Date(); }
---

If you want to change the time that Moment sees, you can specify a method that
returns the number of milliseconds since the Unix epoch (January 1, 1970).

The default is:

```javascript
moment.now = function () {
    return +new Date();
}
```

This will be used when calling `moment()`, and the current date used when tokens are omitted from
`format()`. In general, any method that needs the current time uses this under the hood.
