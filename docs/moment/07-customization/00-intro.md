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

You can remove a previously defined locale by passing `null` as the second argument.
The deleted locale will no longer be available for use.

```javascript
moment.locale('fr'); // 'fr'
moment.locale('en'); // 'en'
moment.locale('fr', null);
moment.locale('fr'); // 'en'
```
