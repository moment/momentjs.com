---
title: Checking Zone Existence
signature: |
  moment.tz.zone(name); // Zone or null
---

To check if a zone exists, use `moment.tz.zone`. It will return the Zone if it
was loaded and `null` if it was not loaded.

```js
moment.tz.zone("UnloadedZone"); // null
moment.tz.add("UnloadedZone|UZ|0|0|");
moment.tz.zone("UnloadedZone"); // Zone { name : "UnloadedZone", ...}
```