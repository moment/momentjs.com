---
title: Subtract Time
version: 2.1.0
signature: |
  moment.duration().subtract(Number, String);
  moment.duration().subtract(Number);
  moment.duration().subtract(Duration);
  moment.duration().subtract(Object);
---


Mutates the original duration by subtracting time.

```javascript
var a = moment.duration(3, 'd');
var b = moment.duration(2, 'd');
a.subtract(b).days(); // 1
```
