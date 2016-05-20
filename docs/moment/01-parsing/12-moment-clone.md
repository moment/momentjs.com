---
title: Moment Clone
version: 1.2.0
signature: |
  moment(Moment);
---


All moments are mutable. If you want a clone of a moment, you can do so implicitly or explicitly.

Calling `moment()` on a moment will clone it.

```javascript
var a = moment([2012]);
var b = moment(a);
a.year(2000);
b.year(); // 2012
```

Additionally, you can call `moment#clone` to clone a moment.

```javascript
var a = moment([2012]);
var b = a.clone();
a.year(2000);
b.year(); // 2012
```
