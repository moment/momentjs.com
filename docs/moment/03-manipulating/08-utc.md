---
title: UTC
version: 1.5.0
signature: |
  moment().utc();
---


Sets a flag on the original moment to internally use `Date#getUTC*` and `Date#setUTC*` instead of `Date#get*` and `Date#set*`.

```javascript
var a = moment([2011, 0, 1, 8]);
a.hours(); // 8 PST
a.utc();
a.hours(); // 16 UTC
```
