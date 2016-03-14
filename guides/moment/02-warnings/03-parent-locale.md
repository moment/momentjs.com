---
title: Parent Locale Undefined
---
```
specified parentLocale is not defined yet
```

This warning is displayed when a locale is defined with a specified parent locale that does not exist.

Because 'xyz' is not a locale, the following code will result in this warning:

```javascript
moment.defineLocale('fakeLocale', {parentLocale:'xyz'})
```

To fix this, choose a parent locale that is already defined. If you are defining a locale that will be the parent of another locale, make sure that your locales are defined in order.