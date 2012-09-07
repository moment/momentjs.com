`moment.months` should be an array of the month names.

```javascript
moment.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
```

If you need more processing to calculate the name of the month, (for example, if there is different grammar for different formats), `moment.months` can be a function with the following signature. It should always return a month name.

```javascript
config.months = function (momentToFormat, format) {
    // momentToFormat is the moment currently being formatted
    // format is the formatting string
    if (/^MMMM/.test(format)) { // if the format starts with 'MMMM'
        return nominative[momentToFormat.month()];
    } else {
        return subjective[momentToFormat.month()];
    }
}
```
