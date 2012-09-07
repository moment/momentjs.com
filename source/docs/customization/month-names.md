 `moment.months` should be an array of the month names.


```javascript
moment.months = [&quot;January&quot;, &quot;February&quot;, &quot;March&quot;, &quot;April&quot;, &quot;May&quot;, &quot;June&quot;, &quot;July&quot;, &quot;August&quot;, &quot;September&quot;, &quot;October&quot;, &quot;November&quot;, &quot;December&quot;];
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
