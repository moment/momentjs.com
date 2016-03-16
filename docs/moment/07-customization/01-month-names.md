---
title: Month Names
version: 1.0.0
signature: |
  // From 2.12.0 onward
  moment.updateLocale('en', {
      months : String[]
  });
  moment.updateLocale('en', {
      months : Function
  });
  // From 2.8.1 to 2.11.2
  moment.locale('en', {
      months : String[]
  });
  moment.locale('en', {
      months : Function
  });

  // Deprecated in 2.8.1
  moment.lang('en', {
      months : String[]
  });
  moment.lang('en', {
      months : Function
  });
---


`Locale#months` should be an array of the month names.

```javascript
moment.updateLocale('en', {
    months : [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ]
});
```

If you need more processing to calculate the name of the month, (for example, if there is different grammar for different formats), `Locale#months` can be a function with the following signature. It should always return a month name.

```javascript
moment.updateLocale('en', {
    months : function (momentToFormat, format) {
        // momentToFormat is the moment currently being formatted
        // format is the formatting string
        if (/^MMMM/.test(format)) { // if the format starts with 'MMMM'
            return nominative[momentToFormat.month()];
        } else {
            return subjective[momentToFormat.month()];
        }
    }
});
```
