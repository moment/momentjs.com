`moment.weekdays` should be an array of the weekdays names.


```javascript
moment.weekdays = [&quot;Sunday&quot;, &quot;Monday&quot;, &quot;Tuesday&quot;, &quot;Wednesday&quot;, &quot;Thursday&quot;, &quot;Friday&quot;, &quot;Saturday&quot;];
```


 `moment.weekdays` can be a callback function as well.


```javascript
config.weekdays = function (momentToFormat, format) {
    return weekdays[momentToFormat.day()];
}
```
