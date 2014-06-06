---
title: Weekday Names
version: 1.0.0
signature: |
  moment.lang('en', {
      weekdays : String[]
  });
  moment.lang('en', {
      weekdays : Function
  });
---


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
