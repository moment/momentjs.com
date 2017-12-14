---
title: As ISO 8601 String
version: 2.1.0
signature: |
  moment().toISOString();
  moment().toISOString(keepOffset); // from 2.20.0
---

Formats a string to the ISO8601 standard.

```javascript
moment().toISOString() // 2013-02-04T22:44:30.652Z
```

Note that ``.toISOString()`` returns a timestamp in UTC, even if the moment in question is in local mode. This is done to provide consistency with the specification for native JavaScript Date ``.toISOString()``, as outlined in 
[ the ES2015 specification](https://www.ecma-international.org/ecma-262/6.0/#sec-date.prototype.toisostring). From version **2.20.0**, you may call `.toISOString(true)` to prevent UTC conversion. 

From version **2.8.4** the native `Date.prototype.toISOString` is used if
available, for performance reasons.
