Toggles a flag on the original moment to internally use `Date#getUTC*` and `Date#setUTC*` instead of `Date#get*` and `Date#set*`.

```javascript
var a = moment([2011, 0, 1, 8]);
a.hours(); // 8 PST
a.utc();
a.hours(); // 16 UTC
```

See [moment.utc()](#/parsing/utc/) for more information on UTC mode.
