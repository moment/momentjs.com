---
title: Ordinal
version: 1.0.0
signature: |
  // From 2.8.1 onward
  moment.locale('en', {
      ordinal : Function
  });

  // Deprecated in 2.8.1
  moment.lang('en', {
      ordinal : Function
  });
---


`Locale#ordinal` should be a function that returns the ordinal for a given number.

```javascript
moment.locale('en', {
    ordinal : function (number, token) {
        var b = number % 10;
        var output = (~~ (number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    }
});
```

As of **2.0.0**, the ordinal function should return both the number and the ordinal. Previously, only the ordinal was returned.

As of **2.1.0**, the token parameter was added. It is a string of the token that is being ordinalized, for example: `M` or `d`.

For more information on ordinal numbers, see [wikipedia](http://en.wikipedia.org/wiki/Ordinal_number_%28linguistics%29)
