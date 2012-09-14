By default, moment parses in local time. If you want to parse a moment in UTC, you can use the following methods.

```javascript
moment.utc() // current date/time in UTC mode
moment.utc(Number) // milliseconds since the Unix Epoch in UTC mode
moment.utc([Number, ...]) // parse an array of numbers matching Date.UTC() parameters
moment.utc(String) // parse string into UTC mode
moment.utc(String, String) // parse a string and format into UTC mode
```

This brings us to an interesting feature of moment.js, UTC mode.

While in UTC mode, all display methods will display in UTC time instead of local time.

Any moment created with `moment()` will not be in UTC mode, and any moments created with `moment.utc()` will be in UTC mode.

To switch from UTC to local time, you can use `moment.fn.utc` or `moment.fn.local`.

```javascript
var a = moment.utc([2011, 0, 1, 8]);
a.hours(); // 8 UTC
a.local();
a.hours(); // 0 PST
```
