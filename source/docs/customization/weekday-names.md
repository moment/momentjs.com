`moment.weekdays` should be an array of the weekdays names.

```javascript
moment.weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
```

`moment.weekdays` can be a callback function as well.

```javascript
config.weekdays = function (momentToFormat, format) {
    return weekdays[momentToFormat.day()];
}
```
