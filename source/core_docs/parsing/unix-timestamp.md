To create a moment from a Unix timestamp (*seconds* since the Unix Epoch), use `moment.unix(Number)`.

```javascript
var day = moment.unix(1318781876);
```

This is implemented as `moment(timestamp * 1000)`, so partial seconds in the input timestamp are included.

```javascript
var day = moment.unix(1318781876.721);
```
