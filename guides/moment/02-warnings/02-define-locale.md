---
title: Define Locale Override
---
```
Use moment.updateLocale(localeName, config) to change an existing locale. 
moment.defineLocale(localeName, config) should only be used for creating a new locale
```

This deprecation warning is thrown when you attempt to change an existing locale using the defineLocale function. 
Doing this will result in unexpected behavior related to property inheritance. moment.updateLocale will properly replace properties on an existing locale.

<a href="https://github.com/moment/moment/pull/2774" target="_blank">View original pull request</a>