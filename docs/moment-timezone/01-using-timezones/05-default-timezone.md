---
title: Default time zone
signature: |
  moment.tz.setDefault(String);
---


By default, `moment` objects are created in the local time zone.
To change the default time zone, use `moment.tz.setDefault` with a valid
time zone.

```js
moment.tz.setDefault("America/New_York");
```

Subsequent calls to `moment.tz.setDefault` will not affect existing `moment`
objects or their clones.
