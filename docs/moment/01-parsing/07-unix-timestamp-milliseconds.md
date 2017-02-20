---
title: Unix Timestamp (milliseconds)
version: 1.0.0
signature: |
  moment(Number);
---


Similar to `new Date(Number)`, you can create a moment by passing an integer value representing the number of *milliseconds* since the Unix Epoch (Jan 1 1970 12AM UTC).

```javascript
var day = moment(1318781876406);
```

<a href="https://www.ecma-international.org/ecma-262/6.0/#sec-time-values-and-time-range" target="_blank" > Note: ECMAScript calls this a "Time Value" </a>