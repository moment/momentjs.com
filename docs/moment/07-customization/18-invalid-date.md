---
title: Invalid Date
version: 2.3.0
signature: |
  // From 2.12.0 onward
  moment.updateLocale('en', {
      invalidDate : String
  });

  // From 2.8.1 to 2.11.2
  moment.locale('en', {
      invalidDate : String
  });

  // Deprecated in 2.8.1
  moment.lang('en', {
      invalidDate : String
  });
---

`Locale#invalidDate` should be a string.

```javascript
moment.updateLocale("es", {
  invalidDate: "Fecha invalida"
});
```
