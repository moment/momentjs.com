`moment.fn.valueOf` simply outputs the number of milliseconds since the Unix Epoch, just like
  JavaScript's native `Date.valueOf()`.

```javascript
moment(1318874398806).valueOf(); // 1318874398806
```

**Note:** To get a Unix timestamp (the number of seconds since the Epoch) from a `moment()`, use `moment.fn.unix()`.
