`moment.fn.unix`simply outputs a Unix timestamp (the of seconds since the Unix Epoch).


```javascript
moment(1318874398806).unix(); // 1318874398
```


<span class="label label-info">Note:</span> This value is rounded to the nearest second, and does not include a 
  milliseconds component.