---
title: AM/PM Parsing
version: 2.1.0
signature: |
  // From 2.8.1 onward
  moment.locale('en', {
      meridiemParse : RegExp
      isPM : Function
  });

  // Deprecated in 2.8.1
  moment.lang('en', {
      meridiemParse : RegExp
      isPM : Function
  });
---


`Locale#isPM` should return true if the input string is past 12 noon. This is used in parsing the `a A` tokens.

```javascript
moment.locale('en', {
    isPM : function (input) {
        return ((input + '').toLowerCase()[0] === 'p');
    }
});
```

To configure what strings should be parsed as input, set the `meridiemParse` property.

```javascript
moment.locale('en', {
    meridiemParse : /[ap]\.?m?\.?/i
});
```
