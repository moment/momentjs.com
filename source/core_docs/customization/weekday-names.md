`Language#weekdays` should be an array of the weekdays names.

```javascript
moment.lang('en', {
    weekdays : [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ]
});
```

`Language#weekdays` can be a callback function as well.

```javascript
moment.lang('en', {
    weekdays : function (momentToFormat, format) {
        return weekdays[momentToFormat.day()];
    }
});
```
