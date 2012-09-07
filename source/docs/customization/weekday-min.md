`moment.weekdaysMin` should be an array of two letter weekday abbreviations. The purpose of these is for things like calendar pickers, thus they should be as small as possible.


```javascript
moment.weekdaysMin = [&quot;Su&quot;, &quot;Mo&quot;, &quot;Tu&quot;, &quot;We&quot;, &quot;Th&quot;, &quot;Fr&quot;, &quot;Sa&quot;];
```


 `moment.weekdaysMin` can be a callback function as well.


```javascript
config.weekdaysMin = function (momentToFormat, format) {
    return weekdaysMin[momentToFormat.day()];
}
```
