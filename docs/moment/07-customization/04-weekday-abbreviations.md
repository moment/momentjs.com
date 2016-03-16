---
title: Weekday Abbreviations
version: 1.0.0
signature: |
  // From 2.12.0 onward
  moment.updateLocale('en', {
      weekdaysShort : String[]
  });
  moment.updateLocale('en', {
      weekdaysShort : Function
  });
  // From 2.8.1 to 2.11.2
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
moment.updateLocale('en', {
    weekdaysShort : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
});
```

`Locale#weekdaysShort` can be a callback function as well.

```javascript
moment.updateLocale('en', {
    weekdaysShort : function (momentToFormat, format) {
        return weekdaysShort[momentToFormat.day()];
    }
});
```
