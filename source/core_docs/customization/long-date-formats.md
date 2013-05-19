`Language#longDateFormat` should be an object containing a key/value pair for each long date format `L LL LLL LLLL LT`. `LT` should be the time format, and is also used for `moment#calendar`.

```javascript
moment.lang('en', {
    longDateFormat : {
        LT: "h:mm A",
        L: "MM/DD/YYYY",
        l: "M/D/YYYY",
        LL: "MMMM Do YYYY",
        ll: "MMM D YYYY",
        LLL: "MMMM Do YYYY LT",
        lll: "MMM D YYYY LT",
        LLLL: "dddd, MMMM Do YYYY LT",
        llll: "ddd, MMM D YYYY LT"
    }
});
```

You can eliminate the lowercase `l` tokens and they will be created automatically by replacing long tokens with the short token variants.

```javascript
moment.lang('en', {
    longDateFormat : {
        LT: "h:mm A",
        L: "MM/DD/YYYY",
        LL: "MMMM Do YYYY",
        LLL: "MMMM Do YYYY LT",
        LLLL: "dddd, MMMM Do YYYY LT"
    }
});
```
