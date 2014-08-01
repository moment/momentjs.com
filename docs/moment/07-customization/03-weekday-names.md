---
title: Weekday Names
version: 1.0.0
signature: |
  // From version 2.8.1 onward
  moment.locale('en', {
      weekdays : String[]
  });
  moment.locale('en', {
      weekdays : Function
  });

  // Deprecated version 2.8.1
  moment.lang('en', {
      weekdays : String[]
  });
  moment.lang('en', {
      weekdays : Function
  });

---


`Locale#weekdays` should be an array of the weekdays names.

```javascript
moment.locale('en', {
    weekdays : [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ]
});
```

`Locale#weekdays` can be a callback function as well.

```javascript
moment.locale('en', {
    weekdays : function (momentToFormat, format) {
        return weekdays[momentToFormat.day()];
    }
});
```
