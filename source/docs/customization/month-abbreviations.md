`moment.monthsShort` should be an array of the month abbreviations.

```javascript
moment.monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
```

Like `moment.months`, `moment.monthsShort` can be a callback function as well.

```javascript
config.monthsShort = function (momentToFormat, format) {
    if (/^MMMM/.test(format)) {
        return nominative[momentToFormat.month()];
    } else {
        return subjective[momentToFormat.month()];
    }
}
```
