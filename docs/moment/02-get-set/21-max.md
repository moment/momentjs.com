---
title: Maximum
version: 2.7.0
signature: |
  moment.max(Moment[,Moment...]);
  moment.max(Moment[]);
---

Returns the maximum (most distant future) of the given moment instances.

For example:
```javascript
var a = moment().subtract(1, 'day');
var b = moment().add(1, 'day');
moment.max(a, b);  // b
moment.max([a, b]);  // b
```

With no arguments the function returns a moment instance with the current time.

From version `2.10.5`, if an invalid moment is one of the arguments, the result
is an invalid moment.

```javascript
moment.max(moment(), moment.invalid()).isValid() === false
moment.max(moment.invalid(), moment()).isValid() === false
moment.max([moment(), moment.invalid()]).isValid() === false
moment.max([moment.invalid(), moment()]).isValid() === false
```
