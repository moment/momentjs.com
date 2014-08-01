---
title: Minimal Weekday Abbreviations
version: 1.7.0
signature: |
  // From 2.8.1 onward
  moment.locale('en', {
      weekdaysMin : String[]
  });
  moment.locale('en', {
      weekdaysMin : Function
  });

  // Deprecated in 2.8.1
  moment.lang('en', {
      weekdaysMin : String[]
  });
  moment.lang('en', {
      weekdaysMin : Function
  });
---


`Locale#weekdaysMin` should be an array of two letter weekday abbreviations. The purpose of these is for things like calendar pickers, thus they should be as small as possible.

```javascript
moment.locale('en', {
    weekdaysMin : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
});
```

`Locale#weekdaysMin` can be a callback function as well.

```javascript
moment.locale('en', {
    weekdaysMin : function (momentToFormat, format) {
        return weekdaysMin[momentToFormat.day()];
    }
});
```
