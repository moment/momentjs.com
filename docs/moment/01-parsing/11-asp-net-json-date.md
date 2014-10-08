---
title: ASP.NET JSON Date
version: 1.3.0
signature: |
  moment(String);
---


ASP.NET returns dates in JSON as `/Date(1198908717056)/` or `/Date(1198908717056-0700)/`

If a string that matches this format is passed in, it will be parsed correctly.

```javascript
moment("/Date(1198908717056-0700)/"); // Sat Dec 29 2007 06:11:57 GMT+0000
```
