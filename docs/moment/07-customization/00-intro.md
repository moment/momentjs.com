---
title: Customize
---


Moment.js is very easy to customize. In general, you should create a locale setting with your customizations.

```javascript
moment.locale('en-my-settings', {
    // customizations.
});
```

You can remove a previously defined locale by passing `null` as the second argument.
The deleted locale will no longer be available for use.

```javascript
moment.locale('fr'); // 'fr'
moment.locale('en'); // 'en'
moment.locale('fr', null);
moment.locale('fr'); // 'en'
```

As of **2.12.0** it is possible to create a locale that inherits from a parent locale.

```javascript
moment.defineLocale('en-foo', {
  parentLocale: 'en',
  /* */
});
```
Properties that are not specified in the locale will be inherited from the parent locale.

As of **2.12.0** it is also possible to update a locale's properties.

```javascript
moment.updateLocale('en', {
  /**/
});
```

Any properties specified will be updated, while others will remain the same. This function does not affect moments that already exist.

To revert an update use:
```javascript
moment.updateLocale('en', null);
```

**2.12.0** deprecated using ``moment.locale()`` to change an existing locale. Use ``moment.updateLocale()`` instead.
