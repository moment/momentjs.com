Mutates the original duration by subtracting time.

```javascript
var a = moment.duration(3, 'd');
var b = moment.duration(2, 'd');
a.subtract(b).days(); // 3
```
