Toggles a flag on the original moment to internally use getUTC* and setUTC* instead of get* and set*.

```javascript
var a = moment([2011, 0, 1, 8]);
a.hours(); // 8 PST
a.utc();
a.hours(); // 16 UTC
```
