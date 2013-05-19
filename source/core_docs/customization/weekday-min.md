`Language#weekdaysMin` should be an array of two letter weekday abbreviations. The purpose of these is for things like calendar pickers, thus they should be as small as possible.

```javascript
moment.lang('en', {
    weekdaysMin : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
});
```

`Language#weekdaysMin` can be a callback function as well.

```javascript
moment.lang('en', {
    weekdaysMin : function (momentToFormat, format) {
        return weekdaysMin[momentToFormat.day()];
    }
});
```
