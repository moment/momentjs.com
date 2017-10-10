---
title: Add Time
version: 2.1.0
signature: |
  moment.duration().add(Number, String);
  moment.duration().add(Number);
  moment.duration().add(Duration);
  moment.duration().add(Object);
---


Mutates the original duration by adding time.

The same keys and shorthands used to create durations can be used here as the second argument.


```javascript
var a = moment.duration(1, 'd');
var b = moment.duration(2, 'd');
a.add(b).days(); // 3
```

Note that adding an invalid duration to any other duration results in an invalid
duration.
