---
title: End of Time
version: 1.7.0
signature: |
  moment().endOf(String);
---


Mutates the original moment by setting it to the end of a unit of time.

This is the same as `moment#startOf`, only instead of setting to the start of a unit of time, it sets to the end of a unit of time.

```javascript
moment().endOf("year"); // set the moment to 12-31 23:59:59.999 this year
```

As of version **2.0.0**, `moment#endOf('day')` replaced `moment#eod`.

**Note:** `moment#endOf('week')` was added in version **2.0.0**.

As of version **2.1.0**, `moment#endOf('week')` uses the locale aware week start day.
