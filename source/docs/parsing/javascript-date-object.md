You can create a moment with a pre-existing native Javascript Date object.


```javascript
var day = new Date(2011, 9, 16);\n
var dayWrapper = moment(day); 
```


```javascript
var otherDay = moment(new Date(2020, 3, 7));
```


This is the fastest way to get a Moment.js wrapper.