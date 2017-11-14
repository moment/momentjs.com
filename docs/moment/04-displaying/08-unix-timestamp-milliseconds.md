---
title: Unix Timestamp (milliseconds)
version: 1.0.0
signature: |
  moment().valueOf();
  +moment();
---


`moment#valueOf` simply outputs the number of milliseconds since the Unix Epoch, just like `Date#valueOf`.

```javascript
moment(1318874398806).valueOf(); // 1318874398806
+moment(1318874398806); // 1318874398806
```

To get a Unix timestamp (the number of seconds since the epoch) from a `Moment`, use `moment#unix`.

<a href="https://www.ecma-international.org/ecma-262/6.0/#sec-time-values-and-time-range" target="_blank" > Note: ECMAScript calls this a "Time Value" </a>
