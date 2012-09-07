`moment.longDateFormat` should be an object containing a key/value pair for each long date format (L, LL, LLL, LLLL, and LT). `LT` should be the time format, and is also used for `moment.fn.calendar`.


```javascript
moment.longDateFormat = { \n
    LT: &quot;h:mm A&quot;,
    L: &quot;MM/DD/YYYY&quot;,
    LL: &quot;MMMM D YYYY&quot;,
    LLL: &quot;MMMM D YYYY LT&quot;,
    LLLL: &quot;dddd, MMMM D YYYY LT&quot;
};
```
