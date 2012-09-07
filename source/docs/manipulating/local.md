Toggles a flag on the original moment to internally use get* and set* instead of getUTC* and setUTC*.

```javascript
var a = moment.utc([2011, 0, 1, 8]);
a.hours(); // 8 UTC
a.local();
a.hours(); // 0 PST
```
