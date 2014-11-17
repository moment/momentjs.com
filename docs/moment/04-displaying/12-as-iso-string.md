---
title: As ISO 8601 String
version: 2.1.0
signature: |
  moment().toISOString();
---

Formats a string to the ISO8601 standard.

```javascript
moment().toISOString() // 2013-02-04T22:44:30.652Z
```

From version **2.8.4** the native `Date.prototype.toISOString` is used if
available, for performance reasons.
