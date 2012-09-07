`moment.weekdaysShort` should be an array of the weekdays abbreviations.

```javascript
moment.weekdaysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
```

`moment.weekdaysShort` can be a callback function as well.

```javascript
config.weekdaysShort = function (momentToFormat, format) {
    return weekdaysShort[momentToFormat.day()];
}
```
