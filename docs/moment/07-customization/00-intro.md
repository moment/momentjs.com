---
title: Customize
---


Moment.js is very easy to customize. In general, you should create a locale setting with your customizations.

```javascript
moment.locale('en-my-settings', {
    // customizations.
});
```

However, you can also overwrite an existing locale that has been loaded as well.

```javascript
moment.locale('en', {
    // customizations
});
```

Any settings that are not defined are inherited from the default english settings.
