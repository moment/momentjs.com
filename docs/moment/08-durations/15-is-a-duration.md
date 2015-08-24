---
title: Is a Duration
version: 1.6.0
signature: |
  moment.isDuration(obj);
---


To check if a variable is a moment duration object, use `moment.isDuration()`.

```javascript
moment.isDuration() // false
moment.isDuration(new Date()) // false
moment.isDuration(moment()) // false
moment.isDuration(moment.duration()) // true
moment.isDuration(moment.duration(2, 'minutes')) // true
```
