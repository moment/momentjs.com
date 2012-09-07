`moment.monthsShort` should be an array of the month abbreviations.


```javascript
moment.monthsShort = [&quot;Jan&quot;, &quot;Feb&quot;, &quot;Mar&quot;, &quot;Apr&quot;, &quot;May&quot;, &quot;Jun&quot;, &quot;Jul&quot;, &quot;Aug&quot;, &quot;Sep&quot;, &quot;Oct&quot;, &quot;Nov&quot;, &quot;Dec&quot;];
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
