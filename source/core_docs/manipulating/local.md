Sets a flag on the original moment to internally use `Date#get*` and `Date#set*` instead of `Date#getUTC*` and `Date#setUTC*`.

```javascript
var a = moment.utc([2011, 0, 1, 8]);
a.hours(); // 8 UTC
a.local();
a.hours(); // 0 PST
```

See [moment.utc()](#/parsing/utc/) for more information on UTC mode.
