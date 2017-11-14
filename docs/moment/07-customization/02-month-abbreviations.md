---
title: Month Abbreviations
version: 1.0.0
signature: |
  // From 2.12.0 onward
  moment.updateLocale('en', {
      monthsShort : String[]
  });
  moment.updateLocale('en', {
      monthsShort : Function
  });
  moment.updateLocale('en', {
      monthsShort : {
          format: String[],
          standalone : String[]
      }
  });
  // From 2.11.0
  moment.locale('en', {
      monthsShort : {
          format: String[],
          standalone : String[]
      }
  });
  // From 2.8.1 to 2.11.2
  moment.locale('en', {
      monthsShort : String[]
  });
  moment.locale('en', {
      monthsShort : Function
  });

  // Deprecated in 2.8.1
  moment.lang('en', {
      monthsShort : String[]
  });
  moment.lang('en', {
      monthsShort : Function
  });
---


`Locale#monthsShort` should be an array of the month abbreviations.

```javascript
moment.updateLocale('en', {
    monthsShort : [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]
});
```

Like `Locale#months`, `Locale#monthsShort` can be a callback function as well.

```javascript
moment.updateLocale('en', {
    monthsShort : function (momentToFormat, format) {
        if (/^MMMM/.test(format)) {
            return nominative[momentToFormat.month()];
        } else {
            return subjective[momentToFormat.month()];
        }
    }
});
```

**Note:** From version **2.11.0**, like `Locale#months`, `Locale#monthsShort` can be an object with `standalone` and `format` cases.

```javascript
moment.updateLocale('en', {
    monthsShort : {
        format: 'янв_фев_мар_апр_мая_июня_июля_авг_сен_окт_ноя_дек'.split('_'),
        standalone: 'янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек'.split('_')
    }
});
```
