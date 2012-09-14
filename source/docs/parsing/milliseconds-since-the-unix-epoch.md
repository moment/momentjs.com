Similar to `new Date(Number)`, you can create a moment by passing an integer value representing the
number of milliseconds since the Unix Epoch (1 January 1970 00:00:00 UTC).

```javascript
var day = moment(1318781876406);
```

**Note:**To create a `moment()`from a Unix timetamp (the number of seconds since the Epoch), use `moment.unix(Number)`.
