---
title: Clone
version: 2.19.0
signature: |
  moment.duration().clone();
---

Create a clone of a duration. Durations are mutable, just like moment objects,
so this lets you get a snapshot, at some point in time.

```javascript
var d1 = moment.duration();
var d2 = d1.clone();
d1.add(1, 'second');
d1.asMilliseconds() !== d2.asMilliseconds();
```
