---
title: Minimal Weekday Abbreviations
version: 1.7.0
signature: |
  // From 2.12.0 onward
  moment.updateLocale('en', {
      weekdaysMin : String[]
  });
  moment.updateLocale('en', {
      weekdaysMin : Function
  });

  // From 2.8.1 to 2.11.2
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
moment.updateLocale('en', {
    weekdaysMin : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
});
```

`Locale#weekdaysMin` can be a callback function as well.

```javascript
moment.updateLocale('en', {
    weekdaysMin : function (momentToFormat, format) {
        return weekdaysMin[momentToFormat.day()];
    }
});
```
