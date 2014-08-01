---
title: Calendar
version: 1.3.0
signature: |
  // From 2.8.1 onward
  moment.locale('en', {
      calendar : Object
  });

  // Deprecated in 2.8.1
  moment.lang('en', {
      calendar : Object
  });
---


`Locale#calendar` should have the following formatting strings.

```javascript
moment.locale('en', {
    calendar : {
        lastDay : '[Yesterday at] LT',
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        lastWeek : '[last] dddd [at] LT',
        nextWeek : 'dddd [at] LT',
        sameElse : 'L'
    }
});
```

Each of the `Locale#calendar` keys can also be a callback function with the scope of the current moment. It should return a formatting string.

```javascript
function () {
    return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
},
```
