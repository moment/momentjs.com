`moment.longDateFormat` should be an object containing a key/value pair for each long date format (L, LL, LLL, LLLL, and LT). `LT` should be the time format, and is also used for `moment.fn.calendar`.

```javascript
moment.longDateFormat = {
    LT: "h:mm A",
    L: "MM/DD/YYYY",
    LL: "MMMM D YYYY",
    LLL: "MMMM D YYYY LT",
    LLLL: "dddd, MMMM D YYYY LT"
};
```
