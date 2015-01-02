---
title: Is a Date
version: 2.9.0
signature: |
  moment.isDate(obj);
---


To check if a variable is a native js Date object, use `moment.isDate()`.

```javascript
moment.isDate(); // false
moment.isDate(new Date()); // true
moment.isDate(moment()); // false
```
