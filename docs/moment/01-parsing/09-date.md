---
title: Date
version: 1.0.0
signature: |
  moment(Date);
---


You can create a `Moment` with a pre-existing native Javascript `Date` object.

```javascript
var day = new Date(2011, 9, 16);
var dayWrapper = moment(day);
```

This clones the `Date` object; further changes to the `Date` won't affect the `Moment`, and vice-versa.
