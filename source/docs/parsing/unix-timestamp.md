You can create a moment from a Unix timestamp (seconds since the Unix Epoch)
using `moment.unix(Number)`.

```javascript
var day = moment.unix(1318781876);
```

**Note:** This functions is implemented with (approximately) `return moment(timestamp * 1000)`, so milliseconds in the input timestamp will be included in the moment.
