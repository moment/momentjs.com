---
title: Weekday Abbreviations
version: 1.0.0
signature: |
  // From 2.8.1 onward
  moment.locale('en', {
      weekdaysShort : String[]
  });
  moment.locale('en', {
      weekdaysShort : Function
  });

  // Deprecated in 2.8.1
  moment.lang('en', {
      weekdaysShort : String[]
  });
  moment.lang('en', {
      weekdaysShort : Function
  });
---


`Locale#weekdaysShort` should be an array of the weekdays abbreviations.

```javascript
moment.locale('en', {
    weekdaysShort : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
});
```

`Locale#weekdaysShort` can be a callback function as well.

```javascript
moment.locale('en', {
    weekdaysShort : function (momentToFormat, format) {
        return weekdaysShort[momentToFormat.day()];
    }
});
```
