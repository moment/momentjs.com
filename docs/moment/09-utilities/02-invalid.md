---
title: Invalid
version: 2.3.0
signature: |
  moment.invalid(Object);
---


You can create your own invalid Moment objects, which is useful in making your own parser.

```javascript
var m = moment.invalid();
m.isValid();                      // false
m.format();                       // 'Invalid date'
m.parsingFlags().userInvalidated; // true
```

`invalid` also accepts an object which specifies which parsing flags to set. This will *not* set the `userInvalidated` parsing flag unless it's one of the properties specified.

```javascript
var m = moment.invalid({invalidMonth: 'Actober'});
m.parsingFlags().invalidMonth; // 'Actober'
```

You need not specify parsing flags recognized by Moment; the Moment will be invalid nonetheless, and the parsing flags will be returned by `parsingFlags()`.
