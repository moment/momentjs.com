`moment.weekdaysShort` should be an array of the weekdays abbreviations.


```javascript
moment.weekdaysShort = [&quot;Sun&quot;, &quot;Mon&quot;, &quot;Tue&quot;, &quot;Wed&quot;, &quot;Thu&quot;, &quot;Fri&quot;, &quot;Sat&quot;];
```


 `moment.weekdaysShort` can be a callback function as well.


```javascript
config.weekdaysShort = function (momentToFormat, format) {
    return weekdaysShort[momentToFormat.day()];
}
```
