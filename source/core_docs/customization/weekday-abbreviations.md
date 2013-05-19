`Language#weekdaysShort` should be an array of the weekdays abbreviations.

```javascript
moment.lang('en', {
    weekdaysShort : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
});
```

`Language#weekdaysShort` can be a callback function as well.

```javascript
moment.lang('en', {
    weekdaysShort : function (momentToFormat, format) {
        return weekdaysShort[momentToFormat.day()];
    }
});
```
