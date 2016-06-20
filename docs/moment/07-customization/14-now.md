---
title: Changing Time Source
version: 2.10.7
signature: |
  moment.now = function () { return +new Date(); }
---

If you want to change the time that moment sees, you can specify a method that
returns number of milliseconds after unix epoc (1st Jan 1970).

The default is:

```javascript
moment.now = function () {
    return +new Date();
}
```

Its used for `moment()`, and current date used when tokens are omitted from
format. In general any method that needs the current time uses that at the
lowest level.
