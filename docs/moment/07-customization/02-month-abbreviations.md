---
title: Month Abbreviations
version: 1.0.0
signature: |
  moment.lang('en', {
      monthsShort : String[]
  });
  moment.lang('en', {
      monthsShort : Function
  });
---


`Language#monthsShort` should be an array of the month abbreviations.

```javascript
moment.lang('en', {
    monthsShort : [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]
});
```

Like `Language#months`, `Language#monthsShort` can be a callback function as well.

```javascript
moment.lang('en', {
    monthsShort : function (momentToFormat, format) {
        if (/^MMMM/.test(format)) {
            return nominative[momentToFormat.month()];
        } else {
            return subjective[momentToFormat.month()];
        }
    }
});
```
