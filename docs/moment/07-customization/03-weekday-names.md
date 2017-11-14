---
title: Weekday Names
version: 1.0.0
signature: |
  // From version 2.12.0 onward
  moment.updateLocale('en', {
      weekdays : String[]
  });
  moment.updateLocale('en', {
      weekdays : Function
  });
  moment.updateLocale('en', {
      weekdays : {
          standalone : String[],
          format : String[],
          isFormat : RegExp
      }
  });
  // From version 2.11.0
  moment.locale('en', {
      weekdays : {
          standalone : String[],
          format : String[],
          isFormat : Boolean
      }
  });
  // From version 2.8.1 to 2.11.2
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
moment.updateLocale('en', {
    weekdays : [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ]
});
```

`Locale#weekdays` can be a callback function as well.

```javascript
moment.updateLocale('en', {
    weekdays : function (momentToFormat, format) {
        return weekdays[momentToFormat.day()];
    }
});
```

**Note:** From version **2.11.0** format/standalone cases can be passed as well. `isFormat` will be used against the full format string to determine which form to use.

```javascript
moment.updateLocale('en', {
    weekdays : {
        standalone: 'Воскресенье_Понедельник_Вторник_Среда_Четверг_Пятница_Суббота'.split('_'),
        format: 'Воскресенье_Понедельник_Вторник_Среду_Четверг_Пятницу_Субботу'.split('_'),
        isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/
    }
});
```
